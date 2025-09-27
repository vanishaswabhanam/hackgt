"""
Mock SLM model for immediate testing - no downloads required!
Provides realistic treatment recommendations without model training.
"""

import json
import random
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class MockSLMModel:
    """Mock SLM that provides realistic treatment recommendations instantly."""
    
    def __init__(self):
        """Initialize mock model with treatment templates."""
        self.treatment_templates = {
            "glioma": {
                "surgical": [
                    "Surgical resection via craniotomy is recommended for tumor removal",
                    "Awake craniotomy may be necessary for eloquent area tumors",
                    "Stereotactic biopsy should be performed for tissue diagnosis"
                ],
                "radiation": [
                    "Post-operative radiation therapy (IMRT) is indicated",
                    "Stereotactic radiosurgery (Gamma Knife) may be appropriate",
                    "Proton beam therapy could be considered for precise targeting"
                ],
                "chemotherapy": [
                    "Adjuvant chemotherapy with temozolomide is recommended",
                    "Bevacizumab (Avastin) may be used for recurrent disease",
                    "Carmustine (BCNU) wafers could be implanted during surgery"
                ],
                "monitoring": [
                    "Follow-up MRI imaging every 3 months",
                    "Regular neurological assessments",
                    "Monitoring for treatment-related side effects"
                ]
            },
            "meningioma": {
                "surgical": [
                    "Complete surgical resection is the primary treatment",
                    "Simpson Grade I resection should be attempted",
                    "Endoscopic approaches may be suitable for certain locations"
                ],
                "radiation": [
                    "Radiation therapy for residual or recurrent tumors",
                    "Stereotactic radiosurgery for small residual lesions",
                    "Fractionated radiation for larger residual tumors"
                ],
                "monitoring": [
                    "Annual MRI surveillance",
                    "Clinical follow-up every 6 months",
                    "Monitoring for recurrence and complications"
                ]
            },
            "pituitary": {
                "surgical": [
                    "Transsphenoidal endoscopic resection is preferred",
                    "Microsurgical approach for complex cases",
                    "Minimally invasive techniques when possible"
                ],
                "medical": [
                    "Hormone replacement therapy as needed",
                    "Dopamine agonists for prolactinomas",
                    "Somatostatin analogs for growth hormone excess"
                ],
                "radiation": [
                    "Radiation therapy for residual disease",
                    "Stereotactic radiosurgery for small remnants",
                    "Fractionated radiation for larger residuals"
                ],
                "monitoring": [
                    "Hormonal evaluation every 3-6 months",
                    "MRI follow-up annually",
                    "Visual field testing as indicated"
                ]
            }
        }
        
        self.supportive_care = [
            "Dexamethasone for cerebral edema management",
            "Anticonvulsant prophylaxis with levetiracetam",
            "Pain management as needed",
            "Physical therapy and rehabilitation",
            "Psychological support and counseling"
        ]
    
    def generate_recommendations(self, patient_data: Dict[str, Any], tumor_data: Dict[str, Any]) -> str:
        """Generate realistic treatment recommendations."""
        tumor_type = tumor_data.get("type", "").lower()
        grade = tumor_data.get("grade", "")
        size = tumor_data.get("size", "")
        location = tumor_data.get("location", "")
        
        # Get appropriate templates
        templates = self.treatment_templates.get(tumor_type, self.treatment_templates["glioma"])
        
        recommendations = []
        
        # Add tumor-specific recommendations
        if tumor_type in ["glioma"] and "Grade III" in grade or "Grade IV" in grade:
            recommendations.extend(random.sample(templates["surgical"], 1))
            recommendations.extend(random.sample(templates["radiation"], 1))
            recommendations.extend(random.sample(templates["chemotherapy"], 1))
        elif tumor_type == "meningioma":
            recommendations.extend(random.sample(templates["surgical"], 2))
            if random.random() > 0.5:
                recommendations.extend(random.sample(templates["radiation"], 1))
        elif tumor_type == "pituitary":
            recommendations.extend(random.sample(templates["surgical"], 1))
            recommendations.extend(random.sample(templates["medical"], 1))
            if random.random() > 0.6:
                recommendations.extend(random.sample(templates["radiation"], 1))
        
        # Add monitoring
        recommendations.extend(random.sample(templates["monitoring"], 2))
        
        # Add supportive care
        recommendations.extend(random.sample(self.supportive_care, 2))
        
        # Format as professional recommendation
        result = f"""Based on the patient's {tumor_type} diagnosis, I recommend the following comprehensive treatment plan:

PRIMARY TREATMENT:
1. {recommendations[0]}
2. {recommendations[1]}

ADJUVANT THERAPY:
3. {recommendations[2] if len(recommendations) > 2 else 'Close monitoring and follow-up'}

SUPPORTIVE CARE:
4. {recommendations[3] if len(recommendations) > 3 else 'Symptom management'}
5. {recommendations[4] if len(recommendations) > 4 else 'Regular follow-up'}

MONITORING:
6. {recommendations[5] if len(recommendations) > 5 else 'Regular imaging and clinical assessment'}

This treatment plan is based on current NCCN guidelines and should be tailored to the patient's specific needs and preferences."""
        
        return result


def create_mock_model():
    """Create and return a mock SLM model."""
    return MockSLMModel()


if __name__ == "__main__":
    # Test the mock model
    print("Testing Mock SLM Model...")
    
    model = create_mock_model()
    
    # Test data
    patient_data = {
        "age": "45",
        "sex": "Male",
        "symptoms": "Headaches and vision problems",
        "medical_history": {"diabetes": "None"},
        "allergies": "None"
    }
    
    tumor_data = {
        "type": "glioma",
        "grade": "Grade III",
        "location": "frontal lobe",
        "size": "3.2 cm",
        "characteristics": ["enhancement", "edema"],
        "malignancy_risk": "High"
    }
    
    # Generate recommendations
    recommendations = model.generate_recommendations(patient_data, tumor_data)
    print("Sample Recommendations:")
    print(recommendations)
    
    print("\nMock SLM Model test completed successfully!")
