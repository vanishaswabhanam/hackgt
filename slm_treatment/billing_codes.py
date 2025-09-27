"""
Billing codes lookup and cost estimation for treatment recommendations.
Maps treatment procedures to CPT/ICD-10 codes and provides cost estimates.
"""

from typing import Dict, List, Any, Tuple
import re


# CPT Code Database for Brain Tumor Treatments
CPT_CODES = {
    # Surgical Procedures
    "craniotomy": {
        "code": "61510",
        "description": "Craniotomy for tumor resection",
        "cost_range": (15000, 25000),
        "insurance_coverage": 0.85
    },
    "stereotactic_biopsy": {
        "code": "61750",
        "description": "Stereotactic biopsy of brain lesion",
        "cost_range": (8000, 12000),
        "insurance_coverage": 0.90
    },
    "endoscopic_resection": {
        "code": "62160",
        "description": "Endoscopic resection of pituitary tumor",
        "cost_range": (12000, 18000),
        "insurance_coverage": 0.88
    },
    "awake_craniotomy": {
        "code": "61510",
        "description": "Awake craniotomy for eloquent area tumors",
        "cost_range": (20000, 30000),
        "insurance_coverage": 0.80
    },
    
    # Radiation Therapy
    "radiation_therapy": {
        "code": "77385",
        "description": "Intensity-modulated radiation therapy (IMRT)",
        "cost_range": (15000, 25000),
        "insurance_coverage": 0.92
    },
    "stereotactic_radiosurgery": {
        "code": "77371",
        "description": "Stereotactic radiosurgery (Gamma Knife)",
        "cost_range": (12000, 20000),
        "insurance_coverage": 0.90
    },
    "proton_therapy": {
        "code": "77520",
        "description": "Proton beam radiation therapy",
        "cost_range": (30000, 50000),
        "insurance_coverage": 0.75
    },
    
    # Chemotherapy
    "temozolomide": {
        "code": "J9328",
        "description": "Temozolomide chemotherapy",
        "cost_range": (5000, 8000),
        "insurance_coverage": 0.95
    },
    "bevacizumab": {
        "code": "J9035",
        "description": "Bevacizumab (Avastin) infusion",
        "cost_range": (8000, 12000),
        "insurance_coverage": 0.88
    },
    "carmustine": {
        "code": "J9050",
        "description": "Carmustine (BCNU) chemotherapy",
        "cost_range": (3000, 5000),
        "insurance_coverage": 0.92
    },
    
    # Imaging and Monitoring
    "mri_brain": {
        "code": "70551",
        "description": "MRI brain with and without contrast",
        "cost_range": (2000, 4000),
        "insurance_coverage": 0.95
    },
    "pet_scan": {
        "code": "78815",
        "description": "PET scan brain",
        "cost_range": (3000, 5000),
        "insurance_coverage": 0.90
    },
    
    # Supportive Care
    "dexamethasone": {
        "code": "J1100",
        "description": "Dexamethasone injection",
        "cost_range": (50, 150),
        "insurance_coverage": 0.98
    },
    "anticonvulsant": {
        "code": "J2001",
        "description": "Levetiracetam injection",
        "cost_range": (100, 300),
        "insurance_coverage": 0.95
    }
}

# ICD-10 Codes for Brain Tumors
ICD10_CODES = {
    "glioma": {
        "primary": "C71.9",
        "description": "Malignant neoplasm of brain, unspecified",
        "subtypes": {
            "glioblastoma": "C71.0",
            "astrocytoma": "C71.1",
            "oligodendroglioma": "C71.2"
        }
    },
    "meningioma": {
        "primary": "D32.9",
        "description": "Benign neoplasm of meninges, unspecified",
        "subtypes": {
            "convexity": "D32.0",
            "parasagittal": "D32.1",
            "sphenoid": "D32.2"
        }
    },
    "pituitary": {
        "primary": "D35.2",
        "description": "Benign neoplasm of pituitary gland",
        "subtypes": {
            "prolactinoma": "D35.2",
            "acromegaly": "D35.2",
            "cushing": "D35.2"
        }
    }
}


def extract_treatments_from_text(text: str) -> List[str]:
    """
    Extract treatment procedures mentioned in the SLM output text.
    
    Args:
        text: Treatment recommendation text from SLM
        
    Returns:
        List of identified treatment procedures
    """
    treatments = []
    text_lower = text.lower()
    
    # Define treatment keywords and their mappings
    treatment_keywords = {
        "craniotomy": ["craniotomy", "surgical resection", "tumor removal", "surgery"],
        "stereotactic_biopsy": ["biopsy", "stereotactic biopsy", "tissue sampling"],
        "endoscopic_resection": ["endoscopic", "transsphenoidal", "pituitary surgery"],
        "awake_craniotomy": ["awake surgery", "awake craniotomy", "eloquent area"],
        "radiation_therapy": ["radiation", "imrt", "radiotherapy", "external beam"],
        "stereotactic_radiosurgery": ["gamma knife", "stereotactic radiosurgery", "srs"],
        "proton_therapy": ["proton therapy", "proton beam"],
        "temozolomide": ["temozolomide", "temodar", "tmz"],
        "bevacizumab": ["bevacizumab", "avastin"],
        "carmustine": ["carmustine", "bcnu"],
        "mri_brain": ["mri", "magnetic resonance", "follow-up imaging"],
        "pet_scan": ["pet scan", "pet imaging"],
        "dexamethasone": ["dexamethasone", "steroid", "decadron"],
        "anticonvulsant": ["anticonvulsant", "seizure medication", "levetiracetam"]
    }
    
    # Check for each treatment type
    for treatment, keywords in treatment_keywords.items():
        for keyword in keywords:
            if keyword in text_lower:
                treatments.append(treatment)
                break
    
    return list(set(treatments))  # Remove duplicates


def lookup_billing_codes(treatments: List[str]) -> List[Dict[str, Any]]:
    """
    Look up billing codes for identified treatments.
    
    Args:
        treatments: List of treatment procedures
        
    Returns:
        List of billing code information
    """
    billing_info = []
    
    for treatment in treatments:
        if treatment in CPT_CODES:
            code_info = CPT_CODES[treatment].copy()
            code_info["treatment"] = treatment
            billing_info.append(code_info)
    
    return billing_info


def estimate_costs(billing_info: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Estimate costs for treatment procedures.
    
    Args:
        billing_info: List of billing code information
        
    Returns:
        Cost estimation summary
    """
    total_min_cost = 0
    total_max_cost = 0
    total_coverage = 0
    
    for info in billing_info:
        cost_range = info["cost_range"]
        coverage = info["insurance_coverage"]
        
        total_min_cost += cost_range[0]
        total_max_cost += cost_range[1]
        total_coverage += coverage
    
    avg_coverage = total_coverage / len(billing_info) if billing_info else 0
    
    # Calculate patient responsibility
    patient_min_cost = total_min_cost * (1 - avg_coverage)
    patient_max_cost = total_max_cost * (1 - avg_coverage)
    
    return {
        "total_cost_range": (total_min_cost, total_max_cost),
        "patient_cost_range": (patient_min_cost, patient_max_cost),
        "average_insurance_coverage": avg_coverage,
        "estimated_insurance_payment": (total_min_cost * avg_coverage, total_max_cost * avg_coverage)
    }


def get_icd10_code(tumor_type: str, subtype: str = None) -> Dict[str, str]:
    """
    Get ICD-10 code for tumor type.
    
    Args:
        tumor_type: Type of tumor (glioma, meningioma, pituitary)
        subtype: Specific subtype if available
        
    Returns:
        ICD-10 code information
    """
    if tumor_type.lower() in ICD10_CODES:
        tumor_info = ICD10_CODES[tumor_type.lower()]
        
        if subtype and subtype.lower() in tumor_info["subtypes"]:
            code = tumor_info["subtypes"][subtype.lower()]
        else:
            code = tumor_info["primary"]
        
        return {
            "code": code,
            "description": tumor_info["description"],
            "tumor_type": tumor_type,
            "subtype": subtype
        }
    
    return {
        "code": "C71.9",
        "description": "Malignant neoplasm of brain, unspecified",
        "tumor_type": tumor_type,
        "subtype": subtype
    }


def process_treatment_recommendations(slm_output: str, tumor_type: str = None) -> Dict[str, Any]:
    """
    Process SLM treatment recommendations and extract billing information.
    
    Args:
        slm_output: Raw treatment recommendations from SLM
        tumor_type: Type of tumor for ICD-10 coding
        
    Returns:
        Complete billing and cost information
    """
    # Extract treatments from text
    treatments = extract_treatments_from_text(slm_output)
    
    # Look up billing codes
    billing_codes = lookup_billing_codes(treatments)
    
    # Estimate costs
    cost_estimate = estimate_costs(billing_codes)
    
    # Get ICD-10 code
    icd10_info = get_icd10_code(tumor_type) if tumor_type else None
    
    return {
        "recommendations_text": slm_output,
        "identified_treatments": treatments,
        "billing_codes": billing_codes,
        "cost_estimates": cost_estimate,
        "icd10_code": icd10_info,
        "summary": {
            "total_procedures": len(treatments),
            "estimated_total_cost": f"${cost_estimate['total_cost_range'][0]:,.0f} - ${cost_estimate['total_cost_range'][1]:,.0f}",
            "estimated_patient_cost": f"${cost_estimate['patient_cost_range'][0]:,.0f} - ${cost_estimate['patient_cost_range'][1]:,.0f}",
            "insurance_coverage": f"{cost_estimate['average_insurance_coverage']*100:.1f}%"
        }
    }


if __name__ == "__main__":
    # Test the billing codes system
    print("Testing billing codes system...")
    
    # Sample SLM output
    sample_output = """
    Based on the patient's glioma diagnosis, I recommend the following treatment plan:
    
    1. Surgical resection via craniotomy for tumor removal
    2. Post-operative radiation therapy (IMRT) 
    3. Adjuvant chemotherapy with temozolomide
    4. Follow-up MRI imaging every 3 months
    5. Dexamethasone for edema management
    """
    
    # Process the recommendations
    result = process_treatment_recommendations(sample_output, "glioma")
    
    print(f"Identified treatments: {result['identified_treatments']}")
    print(f"Billing codes: {len(result['billing_codes'])} procedures")
    print(f"Cost summary: {result['summary']}")
    
    print("Billing codes system test completed successfully!")
