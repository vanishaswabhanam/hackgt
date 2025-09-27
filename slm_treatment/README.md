# SLM Treatment Recommendation System

This directory contains the Small Language Model (SLM) implementation for treatment recommendations in the NeuroAssist platform.

## Architecture

**Input:** JSON object containing:
- Patient data from clinical notes (processed by AGBonnet/augmented-clinical-notes model)
- Tumor classification from MRI CNN (glioma, meningioma, pituitary)

**Output:** Treatment recommendations with billing codes

## Components

1. **Training Script** (`train_slm.py`): Downloads MedQA-USMLE dataset, fine-tunes BioMistral-7B with LoRA
2. **Inference API** (`api.py`): FastAPI endpoint for treatment recommendations
3. **Data Processing** (`data_utils.py`): Handles dataset preparation and patient data extraction
4. **Billing Codes** (`billing_codes.py`): CPT/ICD-10 code lookup and cost estimation
5. **Model Utils** (`model_utils.py`): Model loading and inference utilities
6. **Test Suite** (`test_api.py`): Comprehensive API testing

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train the Model
```bash
python train_slm.py
```
**Expected training time:** ~60 minutes on CPU (optimized for faster training)

### 3. Start the API Server
```bash
python api.py
```
The API will be available at `http://localhost:8000`

### 4. Test the System
```bash
python test_api.py
```

## Detailed Setup Instructions

### Prerequisites
- Python 3.8+
- CUDA-compatible GPU (recommended)
- 16GB+ RAM
- 20GB+ free disk space

### Step-by-Step Installation

1. **Clone and navigate to the project:**
```bash
cd slm_treatment
```

2. **Create virtual environment (recommended):**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Verify GPU availability:**
```bash
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

### Training the Model

The training script will:
- Download MedQA-USMLE dataset (200 samples - optimized for speed)
- Download AGBonnet clinical notes dataset (5 samples)
- Fine-tune BioMistral-7B with LoRA (1 epoch, CPU-optimized)
- Save the trained model to `./slm_model/`

```bash
python train_slm.py
```

**Training Configuration (CPU-Optimized):**
- Base Model: BioMistral/BioMistral-7B
- Fine-tuning: LoRA (rank=16, alpha=32, dropout=0.05)
- Training: learning_rate=5e-4, batch_size=1, epochs=1
- Dataset: 200 MedQA samples + 5 clinical notes samples
- Precision: FP32 (CPU-compatible)

### Running the API

Start the FastAPI server:
```bash
python api.py
```

**API Endpoints:**
- `GET /health` - Health check
- `GET /sample-data` - Get sample patient/tumor data
- `GET /tumor-types` - Get available tumor types
- `POST /recommendations` - Get treatment recommendations
- `POST /recommendations/batch` - Batch recommendations

### Testing the System

Run the comprehensive test suite:
```bash
python test_api.py
```

The test suite includes:
- Health endpoint validation
- Sample data generation
- Treatment recommendations
- Batch processing
- Different tumor types
- Performance testing

## API Usage Examples

### Single Recommendation Request
```python
import requests

# Get sample data
response = requests.get("http://localhost:8000/sample-data")
sample_data = response.json()

# Make recommendation request
recommendation = requests.post(
    "http://localhost:8000/recommendations",
    json=sample_data["sample_request"]
)

result = recommendation.json()
print(f"Recommendations: {result['recommendations_text']}")
print(f"Billing codes: {result['billing_codes']}")
print(f"Cost estimate: {result['summary']['estimated_total_cost']}")
```

### Custom Tumor Type Request
```python
custom_request = {
    "patient_data": {
        "age": "45",
        "sex": "Male",
        "symptoms": "Headaches and vision problems",
        "medical_history": {"diabetes": "None"},
        "allergies": "None"
    },
    "tumor_data": {
        "type": "glioma",
        "grade": "Grade III",
        "location": "frontal lobe",
        "size": "3.2 cm",
        "characteristics": ["enhancement", "edema"],
        "malignancy_risk": "High"
    },
    "temperature": 0.3,
    "max_tokens": 512
}

response = requests.post(
    "http://localhost:8000/recommendations",
    json=custom_request
)
```

## Model Specifications

- **Base Model:** BioMistral/BioMistral-7B
- **Fine-tuning Method:** LoRA (Low-Rank Adaptation)
- **LoRA Config:** rank=16, alpha=32, dropout=0.05
- **Training Parameters:** learning_rate=2e-4, batch_size=4, epochs=3
- **Inference Parameters:** temperature=0.3, max_tokens=512

## Supported Tumor Types

1. **Glioma** (Grades I-IV)
   - Locations: frontal lobe, temporal lobe, parietal lobe, occipital lobe, brainstem
   - ICD-10: C71.9

2. **Meningioma** (Grades I-III)
   - Locations: convexity, parasagittal, sphenoid wing, olfactory groove, tentorium
   - ICD-10: D32.9

3. **Pituitary Adenoma** (Microadenoma/Macroadenoma)
   - Location: pituitary gland
   - ICD-10: D35.2

## Billing Codes and Cost Estimation

The system automatically extracts treatment procedures and maps them to:
- **CPT Codes:** Surgical procedures, radiation therapy, chemotherapy
- **ICD-10 Codes:** Tumor classification codes
- **Cost Estimates:** Range estimates with insurance coverage percentages

**Example CPT Codes:**
- Craniotomy: CPT 61510 ($15,000-$25,000)
- Radiation Therapy: CPT 77385 ($15,000-$25,000)
- Temozolomide: J9328 ($5,000-$8,000)

## Troubleshooting

### Common Issues

1. **CUDA Out of Memory:**
   - Reduce batch size in `train_slm.py`
   - Use gradient checkpointing (already enabled)
   - Consider using CPU training for testing

2. **Model Loading Errors:**
   - Ensure model files are in `./slm_model/`
   - Check Hugging Face model access
   - Verify internet connection for model downloads

3. **API Connection Issues:**
   - Check if API is running on port 8000
   - Verify firewall settings
   - Check logs for error messages

### Performance Optimization

- **GPU Memory:** Use FP16 precision (enabled by default)
- **Batch Processing:** Use batch endpoint for multiple requests
- **Model Caching:** Model is loaded once on startup
- **Response Caching:** Consider implementing Redis for production

## Production Deployment

For production deployment:

1. **Use a production ASGI server:**
```bash
pip install gunicorn
gunicorn api:app -w 4 -k uvicorn.workers.UvicornWorker
```

2. **Add authentication and rate limiting**
3. **Implement logging and monitoring**
4. **Use a reverse proxy (nginx)**
5. **Set up health checks and auto-restart**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `python test_api.py`
5. Submit a pull request

## License

This project is part of the NeuroAssist platform for medical AI applications.
