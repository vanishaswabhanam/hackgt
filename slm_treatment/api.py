"""
FastAPI inference endpoint for SLM treatment recommendation system.
Provides REST API for treatment recommendations with billing codes.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import uvicorn
import logging
import asyncio
from datetime import datetime

from model_utils import SLMTreatmentModel, validate_input_data
from billing_codes import process_treatment_recommendations
from data_utils import generate_tumor_classification, download_clinical_notes_dataset
from real_lightweight_slm import RealLightweightSLM

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SLM Treatment Recommendation API",
    description="AI-powered treatment recommendations for brain tumors",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance - using lightweight SLM
slm_model = None


# Pydantic models for API
class PatientData(BaseModel):
    """Patient data from clinical notes."""
    age: str = Field(..., description="Patient age")
    sex: str = Field(..., description="Patient sex")
    symptoms: str = Field(..., description="Patient symptoms")
    medical_history: Optional[Dict[str, Any]] = Field(default={}, description="Medical history")
    allergies: Optional[str] = Field(default="None", description="Known allergies")
    medications: Optional[str] = Field(default="None", description="Current medications")


class TumorData(BaseModel):
    """Tumor classification from MRI CNN."""
    type: str = Field(..., description="Tumor type (glioma, meningioma, pituitary)")
    grade: str = Field(..., description="Tumor grade")
    location: str = Field(..., description="Tumor location")
    size: str = Field(..., description="Tumor size")
    characteristics: Optional[List[str]] = Field(default=[], description="Tumor characteristics")
    malignancy_risk: Optional[str] = Field(default="Unknown", description="Malignancy risk")


class TreatmentRequest(BaseModel):
    """Request model for treatment recommendations."""
    patient_data: PatientData = Field(..., description="Patient information")
    tumor_data: TumorData = Field(..., description="Tumor classification")
    temperature: Optional[float] = Field(default=0.3, ge=0.0, le=2.0, description="Sampling temperature")
    max_tokens: Optional[int] = Field(default=512, ge=50, le=1024, description="Maximum tokens to generate")


class TreatmentResponse(BaseModel):
    """Response model for treatment recommendations."""
    recommendations_text: str = Field(..., description="Treatment recommendations")
    identified_treatments: List[str] = Field(..., description="Identified treatment procedures")
    billing_codes: List[Dict[str, Any]] = Field(..., description="CPT billing codes")
    cost_estimates: Dict[str, Any] = Field(..., description="Cost estimates")
    icd10_code: Optional[Dict[str, str]] = Field(default=None, description="ICD-10 code")
    summary: Dict[str, str] = Field(..., description="Cost and procedure summary")
    timestamp: str = Field(..., description="Response timestamp")
    processing_time: float = Field(..., description="Processing time in seconds")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    model_loaded: bool
    timestamp: str


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the lightweight SLM model on startup."""
    global slm_model
    try:
        logger.info("Starting Lightweight SLM Treatment API...")
        slm_model = RealLightweightSLM()
        logger.info("✅ Lightweight SLM ready - no downloads needed!")
    except Exception as e:
        logger.error(f"Failed to initialize model: {e}")
        raise


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy" if slm_model is not None else "unhealthy",
        model_loaded=slm_model is not None,
        timestamp=datetime.now().isoformat()
    )


# Main treatment recommendation endpoint
@app.post("/recommendations", response_model=TreatmentResponse)
async def get_treatment_recommendations(request: TreatmentRequest):
    """
    Get treatment recommendations for a patient.
    
    Args:
        request: Treatment request with patient and tumor data
        
    Returns:
        Treatment recommendations with billing codes and cost estimates
    """
    start_time = datetime.now()
    
    try:
        # Validate input data
        patient_dict = request.patient_data.dict()
        tumor_dict = request.tumor_data.dict()
        
        if not validate_input_data(patient_dict, tumor_dict):
            raise HTTPException(
                status_code=400, 
                detail="Invalid input data. Missing required fields."
            )
        
        # Generate treatment recommendations
        if slm_model is None:
            raise HTTPException(
                status_code=503, 
                detail="Model not loaded. Please try again later."
            )
        
        recommendations = slm_model.generate_recommendations(
            patient_dict,
            tumor_dict
        )
        
        # Process recommendations for billing codes
        processed_result = process_treatment_recommendations(
            recommendations, 
            tumor_dict.get("type")
        )
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # Add timestamp and processing time
        processed_result["timestamp"] = datetime.now().isoformat()
        processed_result["processing_time"] = processing_time
        
        logger.info(f"Generated recommendations for {patient_dict['age']} year old {patient_dict['sex']} with {tumor_dict['type']}")
        
        return TreatmentResponse(**processed_result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


# Batch recommendations endpoint
@app.post("/recommendations/batch")
async def get_batch_recommendations(requests: List[TreatmentRequest]):
    """
    Get treatment recommendations for multiple patients.
    
    Args:
        requests: List of treatment requests
        
    Returns:
        List of treatment recommendations
    """
    try:
        if slm_model is None:
            raise HTTPException(
                status_code=503,
                detail="Model not loaded. Please try again later."
            )
        
        results = []
        
        for i, request in enumerate(requests):
            try:
                patient_dict = request.patient_data.dict()
                tumor_dict = request.tumor_data.dict()
                
                if not validate_input_data(patient_dict, tumor_dict):
                    results.append({
                        "error": f"Invalid input data for patient {i+1}",
                        "index": i
                    })
                    continue
                
                recommendations = slm_model.generate_recommendations(
                    patient_dict,
                    tumor_dict,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens
                )
                
                processed_result = process_treatment_recommendations(
                    recommendations,
                    tumor_dict.get("type")
                )
                
                processed_result["index"] = i
                results.append(processed_result)
                
            except Exception as e:
                results.append({
                    "error": f"Error processing patient {i+1}: {str(e)}",
                    "index": i
                })
        
        return {"results": results, "total_processed": len(results)}
        
    except Exception as e:
        logger.error(f"Error in batch processing: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch processing error: {str(e)}"
        )


# Sample data endpoint
@app.get("/sample-data")
async def get_sample_data():
    """Get sample patient and tumor data for testing."""
    try:
        # Generate sample tumor data
        tumor_data = generate_tumor_classification("glioma")
        
        # Get sample patient data from clinical notes
        clinical_samples = download_clinical_notes_dataset(1)
        
        if clinical_samples:
            patient_data = clinical_samples[0]
        else:
            # Fallback to mock data
            patient_data = {
                "age": "45",
                "sex": "Male",
                "symptoms": "Headaches and vision problems",
                "medical_history": {"diabetes": "None", "hypertension": "None"},
                "allergies": "None"
            }
        
        return {
            "patient_data": patient_data,
            "tumor_data": tumor_data,
            "sample_request": {
                "patient_data": patient_data,
                "tumor_data": tumor_data,
                "temperature": 0.3,
                "max_tokens": 512
            }
        }
        
    except Exception as e:
        logger.error(f"Error generating sample data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating sample data: {str(e)}"
        )


# Tumor types endpoint
@app.get("/tumor-types")
async def get_tumor_types():
    """Get available tumor types and their characteristics."""
    return {
        "tumor_types": [
            {
                "type": "glioma",
                "description": "Primary brain tumor arising from glial cells",
                "grades": ["Grade I", "Grade II", "Grade III", "Grade IV"],
                "common_locations": ["frontal lobe", "temporal lobe", "parietal lobe", "occipital lobe", "brainstem"]
            },
            {
                "type": "meningioma",
                "description": "Benign tumor arising from meninges",
                "grades": ["Grade I", "Grade II", "Grade III"],
                "common_locations": ["convexity", "parasagittal", "sphenoid wing", "olfactory groove", "tentorium"]
            },
            {
                "type": "pituitary",
                "description": "Tumor of the pituitary gland",
                "grades": ["Microadenoma", "Macroadenoma"],
                "common_locations": ["pituitary gland"]
            }
        ]
    }


if __name__ == "__main__":
    # Run the API server
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
