import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import ReduceLROnPlateau
import numpy as np
from pathlib import Path
import json
import time
from datetime import datetime
from tqdm import tqdm

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from models.brain_tumor_model import get_model, get_transforms
from data.dataset import create_data_loaders, get_class_distribution
from utils.metrics import calculate_metrics, plot_training_history

class BrainTumorTrainer:
    """Trainer class for brain tumor classification model"""
    
    def __init__(self, config):
        self.config = config
        # Set device
        if config.get('device') == 'mps' and torch.backends.mps.is_available():
            self.device = torch.device('mps')
            print("Using MPS (Metal Performance Shaders) for acceleration")
        elif torch.cuda.is_available():
            self.device = torch.device('cuda')
            print("Using CUDA for acceleration")
        else:
            self.device = torch.device('cpu')
            print("Using CPU (no GPU acceleration available)")
        self.model = None
        self.optimizer = None
        self.scheduler = None
        self.criterion = None
        
        # Training history
        self.train_losses = []
        self.val_losses = []
        self.train_accuracies = []
        self.val_accuracies = []
        
    def setup_model(self):
        """Setup model, optimizer, and loss function"""
        
        # Get model
        self.model = get_model(
            model_type=self.config['model_type'],
            num_classes=self.config['num_classes'],
            pretrained=self.config['pretrained']
        )
        
        # Move to device
        self.model = self.model.to(self.device)
        
        # Setup optimizer
        if self.config['optimizer'] == 'adam':
            self.optimizer = optim.Adam(
                self.model.parameters(),
                lr=self.config['learning_rate'],
                weight_decay=self.config['weight_decay']
            )
        elif self.config['optimizer'] == 'sgd':
            self.optimizer = optim.SGD(
                self.model.parameters(),
                lr=self.config['learning_rate'],
                momentum=0.9,
                weight_decay=self.config['weight_decay']
            )
        
        # Setup scheduler
        self.scheduler = ReduceLROnPlateau(
            self.optimizer,
            mode='min',
            factor=0.5,
            patience=5
        )
        
        # Setup loss function
        self.criterion = nn.CrossEntropyLoss()
        
        print(f"Model setup complete. Using device: {self.device}")
        print(f"Model parameters: {sum(p.numel() for p in self.model.parameters()):,}")
        
    def train_epoch(self, train_loader):
        """Train for one epoch"""
        
        self.model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        # Create progress bar for training batches
        pbar = tqdm(train_loader, desc="Training", leave=False)
        
        for batch_idx, (data, target) in enumerate(pbar):
            data, target = data.to(self.device), target.to(self.device)
            
            # Zero gradients
            self.optimizer.zero_grad()
            
            # Forward pass
            output = self.model(data)
            loss = self.criterion(output, target)
            
            # Backward pass
            loss.backward()
            self.optimizer.step()
            
            # Statistics
            running_loss += loss.item()
            _, predicted = torch.max(output.data, 1)
            total += target.size(0)
            correct += (predicted == target).sum().item()
            
            # Update progress bar with current metrics
            pbar.set_postfix({
                'Loss': f'{loss.item():.4f}',
                'Acc': f'{100.*correct/total:.2f}%'
            })
        
        epoch_loss = running_loss / len(train_loader)
        epoch_acc = 100. * correct / total
        
        return epoch_loss, epoch_acc
    
    def validate_epoch(self, val_loader):
        """Validate for one epoch"""
        
        self.model.eval()
        running_loss = 0.0
        correct = 0
        total = 0
        
        with torch.no_grad():
            # Create progress bar for validation batches
            pbar = tqdm(val_loader, desc="Validation", leave=False)
            
            for data, target in pbar:
                data, target = data.to(self.device), target.to(self.device)
                
                # Forward pass
                output = self.model(data)
                loss = self.criterion(output, target)
                
                # Statistics
                running_loss += loss.item()
                _, predicted = torch.max(output.data, 1)
                total += target.size(0)
                correct += (predicted == target).sum().item()
                
                # Update progress bar with current metrics
                pbar.set_postfix({
                    'Loss': f'{loss.item():.4f}',
                    'Acc': f'{100.*correct/total:.2f}%'
                })
        
        epoch_loss = running_loss / len(val_loader)
        epoch_acc = 100. * correct / total
        
        return epoch_loss, epoch_acc
    
    def train(self, train_loader, val_loader, class_names):
        """Main training loop"""
        
        print("Starting training...")
        print(f"Training samples: {len(train_loader.dataset)}")
        print(f"Validation samples: {len(val_loader.dataset)}")
        
        best_val_acc = 0.0
        best_model_state = None
        
        # Create main progress bar for epochs
        epoch_pbar = tqdm(range(self.config['epochs']), desc="Training Progress", position=0)
        
        for epoch in epoch_pbar:
            epoch_pbar.set_description(f"Epoch {epoch+1}/{self.config['epochs']}")
            
            # Train
            train_loss, train_acc = self.train_epoch(train_loader)
            
            # Validate
            val_loss, val_acc = self.validate_epoch(val_loader)
            
            # Update scheduler
            self.scheduler.step(val_loss)
            
            # Store history
            self.train_losses.append(train_loss)
            self.val_losses.append(val_loss)
            self.train_accuracies.append(train_acc)
            self.val_accuracies.append(val_acc)
            
            # Update epoch progress bar with metrics
            epoch_pbar.set_postfix({
                'Train Acc': f'{train_acc:.1f}%',
                'Val Acc': f'{val_acc:.1f}%',
                'Best': f'{best_val_acc:.1f}%'
            })
            
            # Save best model
            if val_acc > best_val_acc:
                best_val_acc = val_acc
                best_model_state = self.model.state_dict().copy()
                print(f"New best validation accuracy: {best_val_acc:.2f}%")
                
                # Save model
                self.save_model(f"best_model_epoch_{epoch+1}.pth")
        
        # Load best model
        if best_model_state is not None:
            self.model.load_state_dict(best_model_state)
            print(f"\nTraining completed. Best validation accuracy: {best_val_acc:.2f}%")
        
        return best_val_acc
    
    def save_model(self, filename):
        """Save model checkpoint"""
        
        checkpoint = {
            'model_state_dict': self.model.state_dict(),
            'optimizer_state_dict': self.optimizer.state_dict(),
            'config': self.config,
            'train_losses': self.train_losses,
            'val_losses': self.val_losses,
            'train_accuracies': self.train_accuracies,
            'val_accuracies': self.val_accuracies,
            'timestamp': datetime.now().isoformat()
        }
        
        model_path = Path("trained_models") / filename
        model_path.parent.mkdir(exist_ok=True)
        
        torch.save(checkpoint, model_path)
        print(f"Model saved to {model_path}")
    
    def load_model(self, checkpoint_path):
        """Load model checkpoint"""
        
        checkpoint = torch.load(checkpoint_path, map_location=self.device)
        
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        
        self.train_losses = checkpoint.get('train_losses', [])
        self.val_losses = checkpoint.get('val_losses', [])
        self.train_accuracies = checkpoint.get('train_accuracies', [])
        self.val_accuracies = checkpoint.get('val_accuracies', [])
        
        print(f"Model loaded from {checkpoint_path}")

def main():
    """Main training function"""
    
    # Configuration - SUPER FAST SETUP
    config = {
        'model_type': 'efficientnet',  # or 'custom'
        'num_classes': 3,
        'pretrained': True,
        'epochs': 5,  # Only 5 epochs!
        'batch_size': 16,  # Larger batch for speed
        'learning_rate': 0.01,  # Higher learning rate for faster convergence
        'weight_decay': 1e-4,
        'optimizer': 'adam',
        'device': 'cpu',
        'data_dir': 'data/Brain_Cancer',
        'num_workers': 2
    }
    
    # Create trainer
    trainer = BrainTumorTrainer(config)
    
    # Setup model
    trainer.setup_model()
    
    # Create data loaders
    train_loader, val_loader, class_names = create_data_loaders(
        config['data_dir'],
        batch_size=config['batch_size'],
        num_workers=config['num_workers'],
        sample_ratio=0.1  # Use only 10% of the dataset - SUPER FAST!
    )
    
    # Print class distribution
    train_labels = [train_loader.dataset.labels[i] for i in range(len(train_loader.dataset))]
    val_labels = [val_loader.dataset.labels[i] for i in range(len(val_loader.dataset))]
    
    train_dist = get_class_distribution(train_labels, class_names)
    val_dist = get_class_distribution(val_labels, class_names)
    
    print("\nClass Distribution:")
    print("Training set:", train_dist)
    print("Validation set:", val_dist)
    
    # Train model
    best_acc = trainer.train(train_loader, val_loader, class_names)
    
    # Save final model
    trainer.save_model("final_model.pth")
    
    # Save training history
    history = {
        'train_losses': trainer.train_losses,
        'val_losses': trainer.val_losses,
        'train_accuracies': trainer.train_accuracies,
        'val_accuracies': trainer.val_accuracies,
        'best_val_accuracy': best_acc,
        'config': config,
        'class_names': class_names
    }
    
    with open('training_history.json', 'w') as f:
        json.dump(history, f, indent=2)
    
    print(f"\nTraining completed successfully!")
    print(f"Best validation accuracy: {best_acc:.2f}%")

if __name__ == "__main__":
    main()
