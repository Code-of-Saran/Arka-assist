"""
ARKA-ASSIST — Disease Model Inference Module
Accepts image inputs (file path, PIL Image, or bytes), runs MobileNetV3 inference,
evaluates class probabilities, and handles low-confidence situations cleanly.
"""

import os
import sys
import json
import io
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
ML_DIR = BASE_DIR / "ml"
BACKEND_MODELS_DIR = BASE_DIR / "backend" / "models"
MODEL_PATH = BACKEND_MODELS_DIR / "disease_model.pth"

DEFAULT_CONFIDENCE_THRESHOLD = 0.60
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class DiseasePredictor:
    def __init__(self, model_path=None, confidence_threshold=DEFAULT_CONFIDENCE_THRESHOLD):
        self.model_path = Path(model_path) if model_path else MODEL_PATH
        self.confidence_threshold = confidence_threshold
        self.model = None
        self.class_names = []
        self.transform = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        if not self.model_path.exists():
            print(f"[Warning] Trained weights not found at {self.model_path}. Inference service running in uninitialized mode.")
            return

        try:
            checkpoint = torch.load(self.model_path, map_location=DEVICE)
            self.class_names = checkpoint["class_names"]
            num_classes = len(self.class_names)
            image_size = checkpoint.get("image_size", 224)
            mean = checkpoint.get("imagenet_mean", [0.485, 0.456, 0.406])
            std = checkpoint.get("imagenet_std", [0.229, 0.224, 0.225])

            model = models.mobilenet_v3_small(weights=None)
            in_features = model.classifier[3].in_features
            model.classifier[3] = nn.Sequential(
                nn.Dropout(p=0.2),
                nn.Linear(in_features, num_classes)
            )
            model.load_state_dict(checkpoint["model_state_dict"])
            model.to(DEVICE)
            model.eval()

            self.model = model
            self.transform = transforms.Compose([
                transforms.Resize((image_size, image_size)),
                transforms.ToTensor(),
                transforms.Normalize(mean=mean, std=std)
            ])
            self.is_loaded = True
            print(f"[DiseasePredictor] Model loaded successfully ({num_classes} classes). Threshold: {self.confidence_threshold}")
        except Exception as e:
            print(f"[DiseasePredictor Error] Failed to load model weights: {e}")
            self.is_loaded = False

    def predict(self, image_input):
        """
        Accepts:
        - str/Path: filepath to image
        - bytes/BytesIO: raw image bytes
        - PIL.Image: Image object

        Returns:
        dict with predicted class, confidence, low_confidence flag, and probability distribution.
        """
        if not self.is_loaded:
            return {
                "success": False,
                "error": "Trained disease model is not loaded. Please ensure backend/models/disease_model.pth exists.",
                "status_type": "PROTOTYPE"
            }

        # 1. Open and convert image
        try:
            if isinstance(image_input, (str, Path)):
                img = Image.open(image_input).convert("RGB")
            elif isinstance(image_input, bytes):
                img = Image.open(io.BytesIO(image_input)).convert("RGB")
            elif hasattr(image_input, "read"):
                img = Image.open(image_input).convert("RGB")
            elif isinstance(image_input, Image.Image):
                img = image_input.convert("RGB")
            else:
                return {"success": False, "error": "Unsupported image input format."}
        except Exception as e:
            return {"success": False, "error": f"Invalid or unreadable image file: {str(e)}"}

        # 2. Preprocess & Tensor forward pass
        tensor = self.transform(img).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            logits = self.model(tensor)
            probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()

        top_idx = int(probs.argmax())
        top_confidence = float(probs[top_idx])
        top_class = self.class_names[top_idx]

        # Top 3 candidate classes
        top3_indices = np.argsort(probs)[::-1][:3]
        candidates = [
            {"class": self.class_names[i], "probability": round(float(probs[i]), 4)}
            for i in top3_indices
        ]

        # 3. Check Confidence Threshold
        is_low_confidence = top_confidence < self.confidence_threshold

        return {
            "success": True,
            "status_type": "REAL_MODEL",
            "model_architecture": "MobileNetV3-Small",
            "predicted_class": top_class,
            "confidence": round(top_confidence, 4),
            "confidence_percentage": round(top_confidence * 100, 1),
            "confidence_threshold": self.confidence_threshold,
            "is_low_confidence": is_low_confidence,
            "warning": "Prediction confidence is low. Please upload a closer, clearer photo in good lighting for reliable diagnosis." if is_low_confidence else None,
            "candidates": candidates
        }

if __name__ == "__main__":
    predictor = DiseasePredictor()
    if len(sys.argv) > 1:
        res = predictor.predict(sys.argv[1])
        print(json.dumps(res, indent=2))
    else:
        print("Usage: python ml/predict_disease.py <image_path>")
