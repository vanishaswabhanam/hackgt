"""
Data processing utilities for SLM treatment recommendation system.
Handles MedQA-USMLE dataset preparation and AGBonnet clinical notes extraction.
"""

import json
import random
from typing import Dict, List, Any, Tuple
from datasets import load_dataset
import pandas as pd
import numpy as np


def download_medqa_dataset(sample_size: int = 200) -> List[Dict[str, str]]:
    """
    Download MedQA-USMLE dataset and sample specified number of examples.
    
    Args:
        sample_size: Number of examples to sample from training set
        
    Returns:
        List of formatted training examples
    """
    print(f"Downloading MedQA-USMLE dataset...")
    
    # Load the dataset
    dataset = load_dataset("GBaker/MedQA-USMLE-4-options")
    train_data = dataset["train"]
    
    print(f"Total training examples: {len(train_data)}")
    
    # Randomly sample examples
    if len(train_data) > sample_size:
        sampled_indices = random.sample(range(len(train_data)), sample_size)
        sampled_data = [train_data[i] for i in sampled_indices]
    else:
        sampled_data = train_data
    
    print(f"Sampled {len(sampled_data)} examples for training")
    
    # Format for instruction following
    formatted_examples = []
    for example in sampled_data:
        formatted_example = {
            "instruction": f"You are a medical specialist. Answer the following medical question:\n\n{example['question']}",
            "input": "",
            "output": f"Answer: {example['answer']}\n\nExplanation: {example['explanation']}"
        }
        formatted_examples.append(formatted_example)
    
    return formatted_examples


def download_clinical_notes_dataset(num_samples: int = 5) -> List[Dict[str, Any]]:
    """
    Download AGBonnet clinical notes dataset and extract summary fields.
    
    Args:
        num_samples: Number of samples to extract
        
    Returns:
        List of patient data from clinical notes
    """
    print(f"Downloading AGBonnet clinical notes dataset...")
    
    try:
        # Load the dataset
        dataset = load_dataset("AGBonnet/augmented-clinical-notes")
        train_data = dataset["train"]
        
        print(f"Total clinical notes: {len(train_data)}")
        
        # Extract first few samples
        samples = []
        for i in range(min(num_samples, len(train_data))):
            sample = train_data[i]
            
            # Parse the summary field
            summary = sample.get("summary", "{}")
            if isinstance(summary, str):
                try:
                    summary_data = json.loads(summary)
                except json.JSONDecodeError:
                    summary_data = {}
            else:
                summary_data = summary
            
            # Extract patient information
            patient_info = summary_data.get("patient information", {})
            visit_motivation = summary_data.get("visit motivation", "")
            
            formatted_patient = {
                "age": patient_info.get("age", "Unknown"),
                "sex": patient_info.get("sex", "Unknown"),
                "ethnicity": patient_info.get("ethnicity", "Unknown"),
                "weight": patient_info.get("weight", "Unknown"),
                "height": patient_info.get("height", "Unknown"),
                "family_medical_history": patient_info.get("family medical history", "None"),
                "symptoms": visit_motivation,
                "medical_history": summary_data.get("patient medical history", {}),
                "allergies": summary_data.get("allergies", "None"),
                "medications": summary_data.get("medications", "None"),
                "raw_note": sample.get("note", ""),
                "conversation": sample.get("conversation", "")
            }
            
            samples.append(formatted_patient)
        
        print(f"Extracted {len(samples)} patient samples")
        return samples
        
    except Exception as e:
        print(f"Error downloading clinical notes dataset: {e}")
        # Return mock data if download fails
        return generate_mock_patient_data(num_samples)


def generate_mock_patient_data(num_samples: int = 10) -> List[Dict[str, Any]]:
    """
    Generate mock patient data for testing when real dataset is unavailable.
    
    Args:
        num_samples: Number of mock patients to generate
        
    Returns:
        List of mock patient data
    """
    mock_patients = []
    
    ages = ["45", "62", "38", "71", "29", "55", "67", "41", "58", "33"]
    sexes = ["Male", "Female"]
    symptoms_list = [
        "Headaches and vision problems",
        "Memory loss and confusion",
        "Seizures and weakness",
        "Nausea and vomiting",
        "Speech difficulties",
        "Balance problems",
        "Personality changes",
        "Fatigue and drowsiness"
    ]
    
    for i in range(num_samples):
        patient = {
            "age": random.choice(ages),
            "sex": random.choice(sexes),
            "ethnicity": "Unknown",
            "weight": f"{random.randint(120, 200)} lbs",
            "height": f"{random.randint(5, 6)}'{random.randint(0, 11)}\"",
            "family_medical_history": "None",
            "symptoms": random.choice(symptoms_list),
            "medical_history": {"diabetes": "None", "hypertension": "None"},
            "allergies": "None",
            "medications": "None",
            "raw_note": f"Patient presents with {random.choice(symptoms_list)}. Physical examination shows normal vital signs.",
            "conversation": "Patient: I've been experiencing symptoms. Doctor: Can you describe them?"
        }
        mock_patients.append(patient)
    
    return mock_patients


def generate_tumor_classification(tumor_type: str = None) -> Dict[str, Any]:
    """
    Generate tumor classification data for the three supported types.
    
    Args:
        tumor_type: Specific tumor type (glioma, meningioma, pituitary) or random
        
    Returns:
        Tumor classification data
    """
    tumor_types = ["glioma", "meningioma", "pituitary"]
    
    if tumor_type is None:
        tumor_type = random.choice(tumor_types)
    
    tumor_data = {
        "glioma": {
            "type": "Glioma",
            "grade": random.choice(["Grade I", "Grade II", "Grade III", "Grade IV"]),
            "location": random.choice(["frontal lobe", "temporal lobe", "parietal lobe", "occipital lobe", "brainstem"]),
            "size": f"{random.uniform(1.0, 5.0):.1f} cm",
            "characteristics": ["irregular borders", "enhancement", "edema"],
            "malignancy_risk": "High" if "Grade III" in tumor_type or "Grade IV" in tumor_type else "Moderate"
        },
        "meningioma": {
            "type": "Meningioma",
            "grade": random.choice(["Grade I", "Grade II", "Grade III"]),
            "location": random.choice(["convexity", "parasagittal", "sphenoid wing", "olfactory groove", "tentorium"]),
            "size": f"{random.uniform(2.0, 6.0):.1f} cm",
            "characteristics": ["well-circumscribed", "dural attachment", "homogeneous enhancement"],
            "malignancy_risk": "Low" if "Grade I" in tumor_type else "Moderate"
        },
        "pituitary": {
            "type": "Pituitary Adenoma",
            "grade": random.choice(["Microadenoma", "Macroadenoma"]),
            "location": "pituitary gland",
            "size": f"{random.uniform(0.5, 3.0):.1f} cm",
            "characteristics": ["hormone-secreting", "compression of optic chiasm"],
            "malignancy_risk": "Low"
        }
    }
    
    return tumor_data[tumor_type]


def create_training_prompt(patient_data: Dict[str, Any], tumor_data: Dict[str, Any]) -> str:
    """
    Create training prompt combining patient data and tumor classification.
    
    Args:
        patient_data: Patient information from clinical notes
        tumor_data: Tumor classification from MRI
        
    Returns:
        Formatted prompt for training
    """
    prompt = f"""You are a medical specialist. Based on patient information, provide treatment recommendations.

PATIENT: {patient_data['age']} year old {patient_data['sex']}, diagnosed with {tumor_data['type']}
TUMOR DETAILS: {tumor_data['grade']}, located in {tumor_data['location']}, size {tumor_data['size']}
SYMPTOMS: {patient_data['symptoms']}
MEDICAL HISTORY: {patient_data.get('medical_history', 'None')}
ALLERGIES: {patient_data.get('allergies', 'None')}

Provide evidence-based treatment recommendations with standard protocols."""
    
    return prompt


def save_training_data(medqa_data: List[Dict], output_path: str = "training_data.json"):
    """
    Save formatted training data to JSON file.
    
    Args:
        medqa_data: Formatted MedQA training examples
        output_path: Output file path
    """
    with open(output_path, 'w') as f:
        json.dump(medqa_data, f, indent=2)
    
    print(f"Saved {len(medqa_data)} training examples to {output_path}")


if __name__ == "__main__":
    # Test the data processing functions
    print("Testing data processing functions...")
    
    # Download MedQA dataset
    medqa_data = download_medqa_dataset(100)  # Small sample for testing
    print(f"Downloaded {len(medqa_data)} MedQA examples")
    
    # Download clinical notes
    clinical_data = download_clinical_notes_dataset(5)
    print(f"Downloaded {len(clinical_data)} clinical note samples")
    
    # Generate tumor classification
    tumor_data = generate_tumor_classification("glioma")
    print(f"Generated tumor data: {tumor_data}")
    
    # Create training prompt
    if clinical_data:
        prompt = create_training_prompt(clinical_data[0], tumor_data)
        print(f"Sample training prompt:\n{prompt}")
    
    print("Data processing test completed successfully!")
