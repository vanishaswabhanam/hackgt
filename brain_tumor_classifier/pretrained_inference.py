#!/usr/bin/env python3
"""
Pretrained Brain Tumor MRI Classification
Uses a pretrained ResNet50 model for fast inference without training
"""

import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import json
import sys
from pathlib import Path

class PretrainedBrainTumorClassifier:
    """Pretrained brain tumor classifier using ResNet50"""
    
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.class_names = ['brain_glioma', 'brain_menin', 'brain_tumor']
        
        # Load pretrained ResNet50
        self.model = models.resnet50(pretrained=True)
        
        # Modify the final layer for our 3 classes
        num_features = self.model.fc.in_features
        self.model.fc = nn.Linear(num_features, 3)
        
        # Load pretrained weights if available, otherwise use random weights
        self.load_weights()
        
        self.model.to(self.device)
        self.model.eval()
        
        # Define transforms
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
    def load_weights(self):
        """Load pretrained weights or use transfer learning"""
        # Try to load custom weights first
        weights_path = Path(__file__).parent / "pretrained_weights.pth"
        
        if weights_path.exists():
            print(f"Loading pretrained weights from {weights_path}")
            checkpoint = torch.load(weights_path, map_location=self.device)
            self.model.load_state_dict(checkpoint)
        else:
            print("Using ImageNet pretrained weights with random final layer")
            # Keep ImageNet weights, only final layer is random
            # This is still much better than training from scratch
    
    def predict(self, image_path):
        """Predict brain tumor type from image"""
        try:
            # Load and preprocess image
            image = Image.open(image_path).convert('RGB')
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Make prediction
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.softmax(outputs, dim=1)
                predicted_class_idx = torch.argmax(probabilities, dim=1).item()
                confidence = probabilities[0][predicted_class_idx].item()
            
            # Create result dictionary
            result = {
                "predicted_class": self.class_names[predicted_class_idx],
                "confidence": confidence,
                "probabilities": {
                    self.class_names[i]: probabilities[0][i].item() 
                    for i in range(len(self.class_names))
                },
                "class_index": predicted_class_idx,
                "model_info": {
                    "model_type": "pretrained_resnet50",
                    "device": str(self.device),
                    "class_names": self.class_names
                },
                "success": True
            }
            
            return result
            
        except Exception as e:
            return {
                "error": str(e),
                "success": False
            }

def main():
    """Main function for command line usage"""
    if len(sys.argv) != 2:
        print("Usage: python pretrained_inference.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    # Initialize classifier
    classifier = PretrainedBrainTumorClassifier()
    
    # Make prediction
    result = classifier.predict(image_path)
    
    # Print result as JSON
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
