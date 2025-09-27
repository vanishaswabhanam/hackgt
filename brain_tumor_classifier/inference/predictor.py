import torch
import torch.nn.functional as F
from PIL import Image
import numpy as np
from pathlib import Path
import json
import base64
import io
from typing import Dict, List, Tuple

from models.brain_tumor_model import get_model, get_transforms

class BrainTumorPredictor:
    """Brain tumor MRI classification predictor"""
    
    def __init__(self, model_path: str, model_type: str = 'efficientnet'):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model_type = model_type
        self.class_names = ['brain_glioma', 'brain_menin', 'brain_tumor']
        
        # Load model
        self.model = self._load_model(model_path)
        
        # Get transforms
        _, self.transform = get_transforms()
        
        print(f"BrainTumorPredictor initialized on {self.device}")
        print(f"Model loaded from {model_path}")
    
    def _load_model(self, model_path: str):
        """Load trained model"""
        
        # Get model architecture
        model = get_model(
            model_type=self.model_type,
            num_classes=3,
            pretrained=False
        )
        
        # Load checkpoint
        checkpoint = torch.load(model_path, map_location=self.device)
        
        # Load model state
        if 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
        else:
            model.load_state_dict(checkpoint)
        
        # Set to evaluation mode
        model.eval()
        model = model.to(self.device)
        
        return model
    
    def preprocess_image(self, image_input) -> torch.Tensor:
        """Preprocess image for inference"""
        
        # Handle different input types
        if isinstance(image_input, str):
            # File path
            image = Image.open(image_input).convert('RGB')
        elif isinstance(image_input, bytes):
            # Base64 encoded image
            image = Image.open(io.BytesIO(image_input)).convert('RGB')
        elif isinstance(image_input, Image.Image):
            # PIL Image
            image = image_input.convert('RGB')
        else:
            raise ValueError("Unsupported image input type")
        
        # Apply transforms
        image_tensor = self.transform(image)
        
        # Add batch dimension
        image_tensor = image_tensor.unsqueeze(0)
        
        return image_tensor.to(self.device)
    
    def predict(self, image_input) -> Dict:
        """Make prediction on image"""
        
        # Preprocess image
        image_tensor = self.preprocess_image(image_input)
        
        # Make prediction
        with torch.no_grad():
            logits = self.model(image_tensor)
            probabilities = F.softmax(logits, dim=1)
            predicted_class_idx = torch.argmax(probabilities, dim=1)
        
        # Convert to numpy
        probabilities_np = probabilities.cpu().numpy()[0]
        predicted_class_idx = predicted_class_idx.cpu().numpy()[0]
        
        # Create result
        result = {
            'predicted_class': self.class_names[predicted_class_idx],
            'confidence': float(probabilities_np[predicted_class_idx]),
            'probabilities': {
                class_name: float(prob) 
                for class_name, prob in zip(self.class_names, probabilities_np)
            },
            'class_index': int(predicted_class_idx)
        }
        
        return result
    
    def predict_batch(self, image_inputs: List) -> List[Dict]:
        """Make predictions on multiple images"""
        
        results = []
        for image_input in image_inputs:
            try:
                result = self.predict(image_input)
                results.append(result)
            except Exception as e:
                results.append({
                    'error': str(e),
                    'predicted_class': None,
                    'confidence': 0.0,
                    'probabilities': {}
                })
        
        return results
    
    def get_model_info(self) -> Dict:
        """Get model information"""
        
        total_params = sum(p.numel() for p in self.model.parameters())
        trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        
        return {
            'model_type': self.model_type,
            'device': str(self.device),
            'total_parameters': total_params,
            'trainable_parameters': trainable_params,
            'class_names': self.class_names,
            'num_classes': len(self.class_names)
        }

# API Functions for backend integration
def create_predictor(model_path: str = "trained_models/best_model.pth") -> BrainTumorPredictor:
    """Create predictor instance"""
    
    if not Path(model_path).exists():
        # Create a dummy model for demo purposes
        print(f"Model file {model_path} not found. Creating demo model...")
        return create_demo_predictor()
    
    return BrainTumorPredictor(model_path)

def create_demo_predictor() -> BrainTumorPredictor:
    """Create demo predictor with random predictions"""
    
    class DemoPredictor:
        def __init__(self):
            self.class_names = ['brain_glioma', 'brain_menin', 'brain_tumor']
            self.device = torch.device('cpu')
        
        def predict(self, image_input):
            # Generate random but realistic predictions
            np.random.seed(hash(str(image_input)) % 2**32)
            probabilities = np.random.dirichlet([2, 2, 2])  # Realistic distribution
            predicted_class_idx = np.argmax(probabilities)
            
            return {
                'predicted_class': self.class_names[predicted_class_idx],
                'confidence': float(probabilities[predicted_class_idx]),
                'probabilities': {
                    class_name: float(prob) 
                    for class_name, prob in zip(self.class_names, probabilities)
                },
                'class_index': int(predicted_class_idx)
            }
        
        def get_model_info(self):
            return {
                'model_type': 'demo',
                'device': 'cpu',
                'total_parameters': 0,
                'trainable_parameters': 0,
                'class_names': self.class_names,
                'num_classes': len(self.class_names)
            }
    
    return DemoPredictor()

def predict_brain_tumor(image_data: bytes, model_path: str = "trained_models/best_model.pth") -> Dict:
    """Main prediction function for API"""
    
    try:
        # Create predictor
        predictor = create_predictor(model_path)
        
        # Make prediction
        result = predictor.predict(image_data)
        
        # Add metadata
        result['model_info'] = predictor.get_model_info()
        result['success'] = True
        
        return result
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'predicted_class': None,
            'confidence': 0.0,
            'probabilities': {}
        }

def validate_image(image_data: bytes) -> bool:
    """Validate image format"""
    
    try:
        image = Image.open(io.BytesIO(image_data))
        return image.format.lower() in ['jpeg', 'jpg', 'png', 'bmp', 'tiff']
    except:
        return False
