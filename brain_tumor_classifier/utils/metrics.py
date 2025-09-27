import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import torch
from torch.utils.data import DataLoader

def calculate_metrics(y_true, y_pred, class_names):
    """Calculate comprehensive metrics"""
    
    # Convert to numpy if tensors
    if torch.is_tensor(y_true):
        y_true = y_true.cpu().numpy()
    if torch.is_tensor(y_pred):
        y_pred = y_pred.cpu().numpy()
    
    # Calculate metrics
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average='weighted')
    recall = recall_score(y_true, y_pred, average='weighted')
    f1 = f1_score(y_true, y_pred, average='weighted')
    
    # Per-class metrics
    precision_per_class = precision_score(y_true, y_pred, average=None)
    recall_per_class = recall_score(y_true, y_pred, average=None)
    f1_per_class = f1_score(y_true, y_pred, average=None)
    
    # Confusion matrix
    cm = confusion_matrix(y_true, y_pred)
    
    metrics = {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'precision_per_class': precision_per_class,
        'recall_per_class': recall_per_class,
        'f1_per_class': f1_per_class,
        'confusion_matrix': cm,
        'class_names': class_names
    }
    
    return metrics

def plot_confusion_matrix(cm, class_names, title='Confusion Matrix'):
    """Plot confusion matrix"""
    
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=class_names, yticklabels=class_names)
    plt.title(title)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.tight_layout()
    return plt.gcf()

def plot_training_history(history):
    """Plot training history"""
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
    
    # Plot losses
    ax1.plot(history['train_losses'], label='Training Loss')
    ax1.plot(history['val_losses'], label='Validation Loss')
    ax1.set_title('Training and Validation Loss')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Loss')
    ax1.legend()
    ax1.grid(True)
    
    # Plot accuracies
    ax2.plot(history['train_accuracies'], label='Training Accuracy')
    ax2.plot(history['val_accuracies'], label='Validation Accuracy')
    ax2.set_title('Training and Validation Accuracy')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Accuracy (%)')
    ax2.legend()
    ax2.grid(True)
    
    plt.tight_layout()
    return fig

def evaluate_model(model, data_loader, device, class_names):
    """Evaluate model on dataset"""
    
    model.eval()
    all_predictions = []
    all_targets = []
    all_probabilities = []
    
    with torch.no_grad():
        for data, target in data_loader:
            data, target = data.to(device), target.to(device)
            
            # Forward pass
            output = model(data)
            probabilities = torch.softmax(output, dim=1)
            _, predicted = torch.max(output, 1)
            
            # Store results
            all_predictions.extend(predicted.cpu().numpy())
            all_targets.extend(target.cpu().numpy())
            all_probabilities.extend(probabilities.cpu().numpy())
    
    # Calculate metrics
    metrics = calculate_metrics(all_targets, all_predictions, class_names)
    
    return metrics, all_probabilities

def print_classification_report(metrics):
    """Print detailed classification report"""
    
    print("\n" + "="*60)
    print("CLASSIFICATION REPORT")
    print("="*60)
    
    print(f"Overall Accuracy: {metrics['accuracy']:.4f}")
    print(f"Weighted Precision: {metrics['precision']:.4f}")
    print(f"Weighted Recall: {metrics['recall']:.4f}")
    print(f"Weighted F1-Score: {metrics['f1_score']:.4f}")
    
    print("\nPer-Class Metrics:")
    print("-" * 40)
    for i, class_name in enumerate(metrics['class_names']):
        print(f"{class_name}:")
        print(f"  Precision: {metrics['precision_per_class'][i]:.4f}")
        print(f"  Recall: {metrics['recall_per_class'][i]:.4f}")
        print(f"  F1-Score: {metrics['f1_per_class'][i]:.4f}")
        print()

def save_predictions(predictions, targets, probabilities, class_names, filename):
    """Save predictions to file"""
    
    results = []
    for i in range(len(predictions)):
        result = {
            'predicted_class': class_names[predictions[i]],
            'actual_class': class_names[targets[i]],
            'confidence': float(probabilities[i][predictions[i]]),
            'probabilities': {
                class_names[j]: float(probabilities[i][j]) 
                for j in range(len(class_names))
            }
        }
        results.append(result)
    
    import json
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"Predictions saved to {filename}")

def visualize_predictions(model, data_loader, device, class_names, num_samples=9):
    """Visualize model predictions"""
    
    model.eval()
    fig, axes = plt.subplots(3, 3, figsize=(15, 15))
    axes = axes.ravel()
    
    sample_count = 0
    
    with torch.no_grad():
        for data, target in data_loader:
            if sample_count >= num_samples:
                break
                
            data, target = data.to(device), target.to(device)
            
            # Get prediction
            output = model(data)
            probabilities = torch.softmax(output, dim=1)
            _, predicted = torch.max(output, 1)
            
            # Plot first image in batch
            image = data[0].cpu()
            # Denormalize for visualization
            mean = torch.tensor([0.485, 0.456, 0.406])
            std = torch.tensor([0.229, 0.224, 0.225])
            image = image * std.view(3, 1, 1) + mean.view(3, 1, 1)
            image = torch.clamp(image, 0, 1)
            
            # Convert to numpy and transpose
            image_np = image.numpy().transpose(1, 2, 0)
            
            # Plot
            axes[sample_count].imshow(image_np)
            axes[sample_count].set_title(
                f'Pred: {class_names[predicted[0]]}\n'
                f'Actual: {class_names[target[0]]}\n'
                f'Conf: {probabilities[0][predicted[0]]:.3f}'
            )
            axes[sample_count].axis('off')
            
            sample_count += 1
    
    # Hide unused subplots
    for i in range(sample_count, len(axes)):
        axes[i].axis('off')
    
    plt.tight_layout()
    return fig
