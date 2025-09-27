"""
Model utilities for SLM treatment recommendation system.
Handles model loading, inference, and prompt construction.
"""

import torch
import json
from typing import Dict, List, Any, Optional
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import logging

logger = logging.getLogger(__name__)

class SLMTreatmentModel:
    """SLM model wrapper for treatment recommendations."""
    
    def __init__(self, model_path: str = "./slm_model", device: str = "cpu"):
        """
        Initialize the SLM model.
        
        Args:
            model_path: Path to the trained model
            device: Device to load model on ("auto", "cuda", "cpu")
        """
        self.model_path = model_path
        self.device = device
        self.model = None
        self.tokenizer = None
        
    def load_model(self):
        """Load the trained model and tokenizer."""
        try:
            logger.info(f"Loading model from {self.model_path}")
            
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Load base model - using smaller model for faster loading
            base_model = AutoModelForCausalLM.from_pretrained(
                "microsoft/DialoGPT-medium",
                torch_dtype=torch.float32,
                device_map=self.device
            )
            
            # Load LoRA adapter
            self.model = PeftModel.from_pretrained(base_model, self.model_path)
            self.model.eval()
            
            logger.info("Model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise
    
    def create_prompt(self, patient_data: Dict[str, Any], tumor_data: Dict[str, Any]) -> str:
        """
        Create treatment recommendation prompt from patient and tumor data.
        
        Args:
            patient_data: Patient information from clinical notes
            tumor_data: Tumor classification from MRI
            
        Returns:
            Formatted prompt string
        """
        prompt = f"""You are a medical specialist. Based on patient information, provide treatment recommendations.

PATIENT: {patient_data.get('age', 'Unknown')} year old {patient_data.get('sex', 'Unknown')}, diagnosed with {tumor_data.get('type', 'Unknown tumor')}
TUMOR DETAILS: {tumor_data.get('grade', 'Unknown grade')}, located in {tumor_data.get('location', 'Unknown location')}, size {tumor_data.get('size', 'Unknown size')}
SYMPTOMS: {patient_data.get('symptoms', 'None reported')}
MEDICAL HISTORY: {patient_data.get('medical_history', 'None')}
ALLERGIES: {patient_data.get('allergies', 'None')}

Provide evidence-based treatment recommendations with standard protocols."""
        
        return prompt
    
    def generate_recommendations(
        self, 
        patient_data: Dict[str, Any], 
        tumor_data: Dict[str, Any],
        temperature: float = 0.3,
        max_tokens: int = 512
    ) -> str:
        """
        Generate treatment recommendations.
        
        Args:
            patient_data: Patient information from clinical notes
            tumor_data: Tumor classification from MRI
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            Treatment recommendations text
        """
        if self.model is None or self.tokenizer is None:
            raise ValueError("Model not loaded. Call load_model() first.")
        
        # Create prompt
        prompt = self.create_prompt(patient_data, tumor_data)
        
        # Tokenize input
        inputs = self.tokenizer(
            prompt, 
            return_tensors="pt", 
            truncation=True, 
            max_length=1024
        )
        
        # Move to same device as model
        if torch.cuda.is_available():
            inputs = {k: v.cuda() for k, v in inputs.items()}
        
        # Generate response
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_tokens,
                temperature=temperature,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
                repetition_penalty=1.1
            )
        
        # Decode response
        full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract only the generated part (remove input prompt)
        response = full_response[len(prompt):].strip()
        
        return response
    
    def batch_generate(
        self, 
        batch_data: List[Dict[str, Any]], 
        temperature: float = 0.3,
        max_tokens: int = 512
    ) -> List[str]:
        """
        Generate recommendations for a batch of patients.
        
        Args:
            batch_data: List of patient/tumor data dictionaries
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            List of treatment recommendations
        """
        recommendations = []
        
        for data in batch_data:
            try:
                patient_data = data.get("patient_data", {})
                tumor_data = data.get("tumor_data", {})
                
                recommendation = self.generate_recommendations(
                    patient_data, tumor_data, temperature, max_tokens
                )
                recommendations.append(recommendation)
                
            except Exception as e:
                logger.error(f"Error generating recommendation: {e}")
                recommendations.append("Error generating recommendation")
        
        return recommendations


def load_patient_data_from_file(file_path: str) -> List[Dict[str, Any]]:
    """
    Load patient data from JSON file.
    
    Args:
        file_path: Path to JSON file containing patient data
        
    Returns:
        List of patient data dictionaries
    """
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        if isinstance(data, list):
            return data
        elif isinstance(data, dict):
            return [data]
        else:
            raise ValueError("Invalid data format")
            
    except Exception as e:
        logger.error(f"Failed to load patient data: {e}")
        return []


def create_sample_patient_data() -> Dict[str, Any]:
    """Create sample patient data for testing."""
    return {
        "patient_data": {
            "age": "45",
            "sex": "Male",
            "symptoms": "Headaches and vision problems",
            "medical_history": {"diabetes": "None", "hypertension": "None"},
            "allergies": "None"
        },
        "tumor_data": {
            "type": "Glioma",
            "grade": "Grade III",
            "location": "frontal lobe",
            "size": "3.2 cm",
            "characteristics": ["irregular borders", "enhancement", "edema"],
            "malignancy_risk": "High"
        }
    }


def validate_input_data(patient_data: Dict[str, Any], tumor_data: Dict[str, Any]) -> bool:
    """
    Validate input data for required fields.
    
    Args:
        patient_data: Patient information
        tumor_data: Tumor classification
        
    Returns:
        True if data is valid, False otherwise
    """
    required_patient_fields = ["age", "sex", "symptoms"]
    required_tumor_fields = ["type", "grade", "location", "size"]
    
    # Check patient data
    for field in required_patient_fields:
        if field not in patient_data or not patient_data[field]:
            logger.warning(f"Missing required patient field: {field}")
            return False
    
    # Check tumor data
    for field in required_tumor_fields:
        if field not in tumor_data or not tumor_data[field]:
            logger.warning(f"Missing required tumor field: {field}")
            return False
    
    return True


if __name__ == "__main__":
    # Test the model utilities
    print("Testing SLM model utilities...")
    
    # Create sample data
    sample_data = create_sample_patient_data()
    
    # Validate data
    is_valid = validate_input_data(
        sample_data["patient_data"], 
        sample_data["tumor_data"]
    )
    
    print(f"Sample data validation: {'PASSED' if is_valid else 'FAILED'}")
    
    # Test prompt creation
    model = SLMTreatmentModel()
    prompt = model.create_prompt(
        sample_data["patient_data"], 
        sample_data["tumor_data"]
    )
    
    print(f"Sample prompt created: {len(prompt)} characters")
    print("Model utilities test completed successfully!")
