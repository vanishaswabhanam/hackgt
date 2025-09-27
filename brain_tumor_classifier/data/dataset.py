import os
import torch
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import numpy as np
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent))
from models.brain_tumor_model import get_transforms

class BrainTumorDataset(Dataset):
    """Custom dataset for brain tumor MRI images"""
    
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform
        
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        # Load image
        image_path = self.image_paths[idx]
        image = Image.open(image_path).convert('RGB')
        
        # Apply transforms
        if self.transform:
            image = self.transform(image)
        
        # Get label
        label = self.labels[idx]
        
        return image, label

def load_dataset(data_dir, test_size=0.2, random_state=42, sample_ratio=0.2):
    """Load and split the brain tumor dataset with sampling"""
    
    data_dir = Path(data_dir)
    
    # Class names and their corresponding directories
    class_mapping = {
        'brain_glioma': 0,
        'brain_menin': 1,
        'brain_tumor': 2
    }
    
    image_paths = []
    labels = []
    
    # Load images from each class directory
    for class_name, class_label in class_mapping.items():
        class_dir = data_dir / class_name
        
        if class_dir.exists():
            # Get all image files
            image_files = []
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.tiff']:
                image_files.extend(class_dir.glob(ext))
            
            # Sample only a portion of the data
            if sample_ratio < 1.0:
                import random
                random.seed(random_state)
                sample_size = int(len(image_files) * sample_ratio)
                image_files = random.sample(image_files, sample_size)
            
            # Add to lists
            image_paths.extend(image_files)
            labels.extend([class_label] * len(image_files))
            
            print(f"Loaded {len(image_files)} images from {class_name} (sampled {sample_ratio*100:.0f}%)")
        else:
            print(f"Warning: Directory {class_dir} not found")
    
    print(f"Total images loaded: {len(image_paths)}")
    
    # Split dataset
    train_paths, val_paths, train_labels, val_labels = train_test_split(
        image_paths, labels, 
        test_size=test_size, 
        random_state=random_state,
        stratify=labels
    )
    
    return {
        'train_paths': train_paths,
        'val_paths': val_paths,
        'train_labels': train_labels,
        'val_labels': val_labels,
        'class_names': list(class_mapping.keys())
    }

def create_data_loaders(data_dir, batch_size=32, num_workers=4, sample_ratio=0.2):
    """Create data loaders for training and validation"""
    
    # Get transforms
    train_transforms, val_transforms = get_transforms()
    
    # Load dataset with sampling
    dataset_info = load_dataset(data_dir, sample_ratio=sample_ratio)
    
    # Create datasets
    train_dataset = BrainTumorDataset(
        dataset_info['train_paths'],
        dataset_info['train_labels'],
        transform=train_transforms
    )
    
    val_dataset = BrainTumorDataset(
        dataset_info['val_paths'],
        dataset_info['val_labels'],
        transform=val_transforms
    )
    
    # Create data loaders
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True
    )
    
    return train_loader, val_loader, dataset_info['class_names']

def preprocess_image(image_path, transform=None):
    """Preprocess a single image for inference"""
    
    if transform is None:
        _, val_transforms = get_transforms()
        transform = val_transforms
    
    # Load image
    image = Image.open(image_path).convert('RGB')
    
    # Apply transforms
    image_tensor = transform(image)
    
    # Add batch dimension
    image_tensor = image_tensor.unsqueeze(0)
    
    return image_tensor

def get_class_distribution(labels, class_names):
    """Get class distribution for analysis"""
    
    unique, counts = np.unique(labels, return_counts=True)
    
    distribution = {}
    for i, class_name in enumerate(class_names):
        if i in unique:
            idx = np.where(unique == i)[0][0]
            distribution[class_name] = counts[idx]
        else:
            distribution[class_name] = 0
    
    return distribution
