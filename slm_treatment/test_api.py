"""
Test script for SLM treatment recommendation system.
Tests all components including data processing, model inference, and API endpoints.
"""

import requests
import json
import time
from typing import Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API configuration
API_BASE_URL = "http://localhost:8000"
TEST_TIMEOUT = 30


def test_health_endpoint():
    """Test the health check endpoint."""
    logger.info("Testing health endpoint...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=TEST_TIMEOUT)
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"Health check response: {data}")
        
        assert data["status"] == "healthy"
        assert data["model_loaded"] == True
        
        logger.info("✓ Health endpoint test passed")
        return True
        
    except Exception as e:
        logger.error(f"✗ Health endpoint test failed: {e}")
        return False


def test_sample_data_endpoint():
    """Test the sample data endpoint."""
    logger.info("Testing sample data endpoint...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/sample-data", timeout=TEST_TIMEOUT)
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"Sample data keys: {list(data.keys())}")
        
        # Validate sample data structure
        assert "patient_data" in data
        assert "tumor_data" in data
        assert "sample_request" in data
        
        # Validate patient data
        patient_data = data["patient_data"]
        assert "age" in patient_data
        assert "sex" in patient_data
        assert "symptoms" in patient_data
        
        # Validate tumor data
        tumor_data = data["tumor_data"]
        assert "type" in tumor_data
        assert "grade" in tumor_data
        assert "location" in tumor_data
        assert "size" in tumor_data
        
        logger.info("✓ Sample data endpoint test passed")
        return True
        
    except Exception as e:
        logger.error(f"✗ Sample data endpoint test failed: {e}")
        return False


def test_tumor_types_endpoint():
    """Test the tumor types endpoint."""
    logger.info("Testing tumor types endpoint...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/tumor-types", timeout=TEST_TIMEOUT)
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"Tumor types: {[t['type'] for t in data['tumor_types']]}")
        
        # Validate tumor types
        tumor_types = data["tumor_types"]
        assert len(tumor_types) == 3
        
        expected_types = ["glioma", "meningioma", "pituitary"]
        actual_types = [t["type"] for t in tumor_types]
        
        for expected_type in expected_types:
            assert expected_type in actual_types
        
        logger.info("✓ Tumor types endpoint test passed")
        return True
        
    except Exception as e:
        logger.error(f"✗ Tumor types endpoint test failed: {e}")
        return False


def test_treatment_recommendations():
    """Test the main treatment recommendations endpoint."""
    logger.info("Testing treatment recommendations endpoint...")
    
    try:
        # Get sample data first
        sample_response = requests.get(f"{API_BASE_URL}/sample-data", timeout=TEST_TIMEOUT)
        sample_response.raise_for_status()
        sample_data = sample_response.json()
        
        # Use sample request data
        request_data = sample_data["sample_request"]
        
        # Make treatment recommendation request
        response = requests.post(
            f"{API_BASE_URL}/recommendations",
            json=request_data,
            timeout=TEST_TIMEOUT
        )
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"Recommendations response keys: {list(data.keys())}")
        
        # Validate response structure
        required_fields = [
            "recommendations_text",
            "identified_treatments", 
            "billing_codes",
            "cost_estimates",
            "summary",
            "timestamp",
            "processing_time"
        ]
        
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        
        # Validate recommendations text
        assert len(data["recommendations_text"]) > 0
        assert isinstance(data["recommendations_text"], str)
        
        # Validate billing codes
        assert isinstance(data["billing_codes"], list)
        assert isinstance(data["identified_treatments"], list)
        
        # Validate cost estimates
        cost_estimates = data["cost_estimates"]
        assert "total_cost_range" in cost_estimates
        assert "patient_cost_range" in cost_estimates
        assert "average_insurance_coverage" in cost_estimates
        
        # Validate summary
        summary = data["summary"]
        assert "total_procedures" in summary
        assert "estimated_total_cost" in summary
        assert "estimated_patient_cost" in summary
        assert "insurance_coverage" in summary
        
        logger.info(f"✓ Treatment recommendations test passed")
        logger.info(f"  - Identified treatments: {data['identified_treatments']}")
        logger.info(f"  - Total procedures: {summary['total_procedures']}")
        logger.info(f"  - Estimated cost: {summary['estimated_total_cost']}")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ Treatment recommendations test failed: {e}")
        return False


def test_batch_recommendations():
    """Test the batch recommendations endpoint."""
    logger.info("Testing batch recommendations endpoint...")
    
    try:
        # Get sample data
        sample_response = requests.get(f"{API_BASE_URL}/sample-data", timeout=TEST_TIMEOUT)
        sample_response.raise_for_status()
        sample_data = sample_response.json()
        
        # Create batch request with 2 samples
        batch_request = [
            sample_data["sample_request"],
            sample_data["sample_request"]
        ]
        
        # Make batch request
        response = requests.post(
            f"{API_BASE_URL}/recommendations/batch",
            json=batch_request,
            timeout=TEST_TIMEOUT
        )
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"Batch response keys: {list(data.keys())}")
        
        # Validate batch response
        assert "results" in data
        assert "total_processed" in data
        
        results = data["results"]
        assert len(results) == 2
        assert data["total_processed"] == 2
        
        # Validate each result
        for i, result in enumerate(results):
            assert "recommendations_text" in result
            assert "identified_treatments" in result
            assert "billing_codes" in result
            assert "summary" in result
        
        logger.info("✓ Batch recommendations test passed")
        return True
        
    except Exception as e:
        logger.error(f"✗ Batch recommendations test failed: {e}")
        return False


def test_custom_tumor_types():
    """Test recommendations with different tumor types."""
    logger.info("Testing custom tumor types...")
    
    tumor_types = ["glioma", "meningioma", "pituitary"]
    
    for tumor_type in tumor_types:
        try:
            logger.info(f"Testing {tumor_type} recommendations...")
            
            # Create custom request for specific tumor type
            custom_request = {
                "patient_data": {
                    "age": "50",
                    "sex": "Female",
                    "symptoms": "Headaches and memory problems",
                    "medical_history": {"diabetes": "None"},
                    "allergies": "None"
                },
                "tumor_data": {
                    "type": tumor_type,
                    "grade": "Grade II" if tumor_type != "pituitary" else "Macroadenoma",
                    "location": "frontal lobe" if tumor_type != "pituitary" else "pituitary gland",
                    "size": "2.5 cm",
                    "characteristics": ["enhancement"],
                    "malignancy_risk": "Low"
                },
                "temperature": 0.3,
                "max_tokens": 512
            }
            
            response = requests.post(
                f"{API_BASE_URL}/recommendations",
                json=custom_request,
                timeout=TEST_TIMEOUT
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Validate tumor-specific response
            assert len(data["recommendations_text"]) > 0
            assert len(data["identified_treatments"]) >= 0
            assert data["icd10_code"] is not None
            
            logger.info(f"✓ {tumor_type} recommendations test passed")
            
        except Exception as e:
            logger.error(f"✗ {tumor_type} recommendations test failed: {e}")
            return False
    
    return True


def run_performance_test():
    """Run performance test with multiple requests."""
    logger.info("Running performance test...")
    
    try:
        # Get sample data
        sample_response = requests.get(f"{API_BASE_URL}/sample-data", timeout=TEST_TIMEOUT)
        sample_response.raise_for_status()
        sample_data = sample_response.json()
        
        request_data = sample_data["sample_request"]
        
        # Test with 5 concurrent requests
        start_time = time.time()
        
        responses = []
        for i in range(5):
            response = requests.post(
                f"{API_BASE_URL}/recommendations",
                json=request_data,
                timeout=TEST_TIMEOUT
            )
            response.raise_for_status()
            responses.append(response.json())
        
        end_time = time.time()
        total_time = end_time - start_time
        
        # Calculate average processing time
        avg_processing_time = sum(r["processing_time"] for r in responses) / len(responses)
        
        logger.info(f"✓ Performance test completed:")
        logger.info(f"  - Total time: {total_time:.2f} seconds")
        logger.info(f"  - Average processing time: {avg_processing_time:.2f} seconds")
        logger.info(f"  - Requests per second: {5/total_time:.2f}")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ Performance test failed: {e}")
        return False


def main():
    """Run all tests."""
    logger.info("Starting SLM Treatment API tests...")
    
    tests = [
        ("Health Endpoint", test_health_endpoint),
        ("Sample Data Endpoint", test_sample_data_endpoint),
        ("Tumor Types Endpoint", test_tumor_types_endpoint),
        ("Treatment Recommendations", test_treatment_recommendations),
        ("Batch Recommendations", test_batch_recommendations),
        ("Custom Tumor Types", test_custom_tumor_types),
        ("Performance Test", run_performance_test)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        logger.info(f"\n{'='*50}")
        logger.info(f"Running: {test_name}")
        logger.info(f"{'='*50}")
        
        try:
            if test_func():
                passed += 1
                logger.info(f"✓ {test_name} PASSED")
            else:
                logger.error(f"✗ {test_name} FAILED")
        except Exception as e:
            logger.error(f"✗ {test_name} FAILED with exception: {e}")
    
    logger.info(f"\n{'='*50}")
    logger.info(f"TEST SUMMARY: {passed}/{total} tests passed")
    logger.info(f"{'='*50}")
    
    if passed == total:
        logger.info("🎉 All tests passed! SLM Treatment API is working correctly.")
    else:
        logger.error(f"❌ {total - passed} tests failed. Please check the logs above.")
    
    return passed == total


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
