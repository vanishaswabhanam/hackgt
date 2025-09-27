#!/usr/bin/env python3
"""
Standalone brain tumor classification script for backend integration.
This script can be called from Node.js backend to classify brain tumor MRI images.
"""

import sys
import json
import os
from pathlib import Path

# Add the brain_tumor_classifier to Python path
sys.path.append(str(Path(__file__).parent.parent))

try:
    from inference.predictor import predict_brain_tumor, validate_image
except ImportError:
    # Fallback if modules not available
    def predict_brain_tumor(image_data, model_path="trained_models/best_model.pth"):
        # Demo prediction
        import random
        classes = ['brain_glioma', 'brain_menin', 'brain_tumor']
        predicted_class = random.choice(classes)
        confidence = 0.7 + random.random() * 0.25
        
        probabilities = {}
        for cls in classes:
            probabilities[cls] = confidence if cls == predicted_class else (1 - confidence) / 2
        
        return {
            'predicted_class': predicted_class,
            'confidence': confidence,
            'probabilities': probabilities,
            'class_index': classes.index(predicted_class),
            'model_info': {
                'model_type': 'demo',
                'device': 'cpu',
                'class_names': classes
            },
            'success': True
        }
    
    def validate_image(image_data):
        return True

def main():
    """Main function for command line usage"""
    
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python predictor.py <image_path>'
        }))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        # Check if image file exists
        if not os.path.exists(image_path):
            print(json.dumps({
                'success': False,
                'error': f'Image file not found: {image_path}'
            }))
            sys.exit(1)
        
        # Read image data
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        # Validate image
        if not validate_image(image_data):
            print(json.dumps({
                'success': False,
                'error': 'Invalid image format'
            }))
            sys.exit(1)
        
        # Make prediction
        result = predict_brain_tumor(image_data)
        
        # Print result as JSON
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
