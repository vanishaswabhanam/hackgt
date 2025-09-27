#!/bin/bash

# SLM Treatment Recommendation System - Startup Script
# This script helps you get started with the SLM treatment recommendation system

echo "🧠 SLM Treatment Recommendation System"
echo "======================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip first."
    exit 1
fi

echo "✅ pip3 found"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if CUDA is available
echo "🔍 Checking CUDA availability..."
python3 -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"

echo ""
echo "🚀 Setup complete! Next steps:"
echo ""
echo "1. Train the model:"
echo "   python train_slm.py"
echo ""
echo "2. Start the API server:"
echo "   python api.py"
echo ""
echo "3. Test the system:"
echo "   python test_api.py"
echo ""
echo "📚 For detailed instructions, see README.md"
echo ""
echo "⚠️  Note: Training requires ~90 minutes on GPU and ~20GB disk space"
