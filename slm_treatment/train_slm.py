"""
Training script for SLM treatment recommendation system.
Fine-tunes BioMistral-7B using LoRA on MedQA-USMLE dataset.
"""

import os
import json
import torch
from typing import Dict, List, Any
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    TrainingArguments, 
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, TaskType
from datasets import Dataset
from data_utils import download_medqa_dataset, save_training_data
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Model configuration - Using smaller model for faster download and training
MODEL_NAME = "microsoft/DialoGPT-medium"
DATASET_NAME = "GBaker/MedQA-USMLE-4-options"
OUTPUT_DIR = "./slm_model"
TRAINING_DATA_PATH = "./training_data.json"

# LoRA configuration
LORA_CONFIG = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,  # rank
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]
)

# Training configuration - Optimized for CPU and faster training
TRAINING_ARGS = TrainingArguments(
    output_dir=OUTPUT_DIR,
    num_train_epochs=1,  # Reduced from 3 to 1
    per_device_train_batch_size=1,  # Reduced from 4 to 1 for CPU
    per_device_eval_batch_size=1,   # Reduced from 4 to 1 for CPU
    warmup_steps=10,  # Reduced from 100 to 10
    learning_rate=5e-4,  # Increased from 2e-4 for faster convergence
    logging_steps=5,  # More frequent logging
    save_steps=50,   # Save more frequently
    eval_steps=50,   # Evaluate more frequently
    save_total_limit=2,
    remove_unused_columns=False,
    push_to_hub=False,
    report_to=None,  # Disable wandb/tensorboard
    dataloader_pin_memory=False,
    gradient_checkpointing=True,
    fp16=False,  # Disabled for CPU compatibility
)


def load_model_and_tokenizer():
    """Load BioMistral model and tokenizer."""
    logger.info(f"Loading model: {MODEL_NAME}")
    
    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"
    
    # Load model - CPU optimized with smaller model
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float32,  # Use float32 for CPU
        device_map="cpu",  # Force CPU usage
        low_cpu_mem_usage=True  # Optimize for CPU memory
    )
    
    # Resize token embeddings if needed
    model.resize_token_embeddings(len(tokenizer))
    
    logger.info("Model and tokenizer loaded successfully")
    return model, tokenizer


def prepare_training_data(tokenizer, sample_size: int = 200):
    """Prepare training data from MedQA dataset."""
    logger.info(f"Preparing training data with {sample_size} samples...")
    
    # Download and format MedQA dataset
    training_examples = download_medqa_dataset(sample_size)
    
    # Save training data
    save_training_data(training_examples, TRAINING_DATA_PATH)
    
    # Convert to dataset format
    dataset = Dataset.from_list(training_examples)
    
    def format_prompt(example):
        """Format example for instruction following."""
        prompt = f"### Instruction:\n{example['instruction']}\n\n### Response:\n{example['output']}"
        return {"text": prompt}
    
    # Format dataset
    formatted_dataset = dataset.map(format_prompt)
    
    def tokenize_function(examples):
        """Tokenize the examples."""
        return tokenizer(
            examples["text"],
            truncation=True,
            padding=True,
            max_length=512,
            return_tensors="pt"
        )
    
    # Tokenize dataset
    tokenized_dataset = formatted_dataset.map(
        tokenize_function,
        batched=True,
        remove_columns=formatted_dataset.column_names
    )
    
    logger.info(f"Prepared {len(tokenized_dataset)} training examples")
    return tokenized_dataset


def setup_lora_model(model):
    """Set up LoRA configuration for the model."""
    logger.info("Setting up LoRA configuration...")
    
    # Apply LoRA to the model
    model = get_peft_model(model, LORA_CONFIG)
    
    # Print trainable parameters
    model.print_trainable_parameters()
    
    logger.info("LoRA configuration applied successfully")
    return model


def create_data_collator(tokenizer):
    """Create data collator for training."""
    return DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False,  # We're doing causal LM, not masked LM
    )


def train_model():
    """Main training function."""
    logger.info("Starting SLM training process...")
    
    # Check for GPU availability
    if torch.cuda.is_available():
        logger.info(f"Using GPU: {torch.cuda.get_device_name()}")
        logger.info(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    else:
        logger.warning("No GPU detected. Training will be slow on CPU.")
    
    # Load model and tokenizer
    model, tokenizer = load_model_and_tokenizer()
    
    # Prepare training data
    train_dataset = prepare_training_data(tokenizer)
    
    # Set up LoRA
    model = setup_lora_model(model)
    
    # Create data collator
    data_collator = create_data_collator(tokenizer)
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=TRAINING_ARGS,
        train_dataset=train_dataset,
        data_collator=data_collator,
        tokenizer=tokenizer,
    )
    
    # Start training
    logger.info("Starting training...")
    trainer.train()
    
    # Save the model
    logger.info(f"Saving model to {OUTPUT_DIR}")
    trainer.save_model()
    tokenizer.save_pretrained(OUTPUT_DIR)
    
    # Save LoRA adapter
    model.save_pretrained(OUTPUT_DIR)
    
    logger.info("Training completed successfully!")
    
    return model, tokenizer


def test_model_inference(model, tokenizer):
    """Test the trained model with sample inference."""
    logger.info("Testing model inference...")
    
    # Sample prompt
    test_prompt = """You are a medical specialist. Based on patient information, provide treatment recommendations.

PATIENT: 45 year old Male, diagnosed with Glioma
TUMOR DETAILS: Grade III, located in frontal lobe, size 3.2 cm
SYMPTOMS: Headaches and vision problems
MEDICAL HISTORY: None
ALLERGIES: None

Provide evidence-based treatment recommendations with standard protocols."""
    
    # Tokenize input
    inputs = tokenizer(test_prompt, return_tensors="pt")
    
    # Generate response
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=512,
            temperature=0.3,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
    
    # Decode response
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    logger.info("Sample inference completed:")
    logger.info(f"Response: {response}")
    
    return response


if __name__ == "__main__":
    try:
        # Create output directory
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # Train the model
        model, tokenizer = train_model()
        
        # Test inference
        test_model_inference(model, tokenizer)
        
        logger.info("SLM training pipeline completed successfully!")
        
    except Exception as e:
        logger.error(f"Training failed with error: {e}")
        raise
