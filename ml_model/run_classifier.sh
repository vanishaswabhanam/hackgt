#!/bin/bash
# Wrapper script to suppress PyTorch warnings
cd /Users/shreyaakula/Documents/GitHub/hackgt/ml_model
python3 pytorch_brain_tumor.py "$1" 2>/dev/null
