import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms
import torch.nn.functional as F

class BrainTumorClassifier(nn.Module):
    """EfficientNet-based brain tumor MRI classifier"""
    
    def __init__(self, num_classes=3, pretrained=True):
        super(BrainTumorClassifier, self).__init__()
        
        # Load pre-trained EfficientNet-B3
        self.backbone = models.efficientnet_b3(pretrained=pretrained)
        
        # Get the number of input features for the classifier
        num_features = self.backbone.classifier[1].in_features
        
        # Replace the classifier with our custom one
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(512, num_classes)
        )
        
        # Class names
        self.class_names = ['brain_glioma', 'brain_menin', 'brain_tumor']
        
    def forward(self, x):
        return self.backbone(x)
    
    def predict(self, x):
        """Make prediction with confidence scores"""
        with torch.no_grad():
            logits = self.forward(x)
            probabilities = F.softmax(logits, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1)
            
        return predicted_class, probabilities

class CustomCNN(nn.Module):
    """Custom CNN architecture for brain tumor classification"""
    
    def __init__(self, num_classes=3):
        super(CustomCNN, self).__init__()
        
        # Convolutional layers
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, padding=1)
        
        # Batch normalization
        self.bn1 = nn.BatchNorm2d(32)
        self.bn2 = nn.BatchNorm2d(64)
        self.bn3 = nn.BatchNorm2d(128)
        self.bn4 = nn.BatchNorm2d(256)
        
        # Pooling
        self.pool = nn.MaxPool2d(2, 2)
        
        # Dropout
        self.dropout = nn.Dropout(0.5)
        
        # Fully connected layers
        self.fc1 = nn.Linear(256 * 32 * 32, 512)
        self.fc2 = nn.Linear(512, 256)
        self.fc3 = nn.Linear(256, num_classes)
        
        self.class_names = ['brain_glioma', 'brain_menin', 'brain_tumor']
        
    def forward(self, x):
        # Conv block 1
        x = self.pool(F.relu(self.bn1(self.conv1(x))))
        
        # Conv block 2
        x = self.pool(F.relu(self.bn2(self.conv2(x))))
        
        # Conv block 3
        x = self.pool(F.relu(self.bn3(self.conv3(x))))
        
        # Conv block 4
        x = self.pool(F.relu(self.bn4(self.conv4(x))))
        
        # Flatten
        x = x.view(x.size(0), -1)
        
        # Fully connected layers
        x = self.dropout(F.relu(self.fc1(x)))
        x = self.dropout(F.relu(self.fc2(x)))
        x = self.fc3(x)
        
        return x
    
    def predict(self, x):
        """Make prediction with confidence scores"""
        with torch.no_grad():
            logits = self.forward(x)
            probabilities = F.softmax(logits, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1)
            
        return predicted_class, probabilities

def get_model(model_type='efficientnet', num_classes=3, pretrained=True):
    """Get model based on type"""
    if model_type == 'efficientnet':
        return BrainTumorClassifier(num_classes=num_classes, pretrained=pretrained)
    elif model_type == 'custom':
        return CustomCNN(num_classes=num_classes)
    else:
        raise ValueError(f"Unknown model type: {model_type}")

def get_transforms():
    """Get image transforms for training and inference"""
    
    # Training transforms with augmentation
    train_transforms = transforms.Compose([
        transforms.Resize((512, 512)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                           std=[0.229, 0.224, 0.225])
    ])
    
    # Validation/Inference transforms
    val_transforms = transforms.Compose([
        transforms.Resize((512, 512)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                           std=[0.229, 0.224, 0.225])
    ])
    
    return train_transforms, val_transforms
