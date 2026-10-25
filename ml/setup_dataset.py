"""
Paddy Doctor Dataset Setup & Verification Utility
Reference: https://github.com/paddydoc/paddy-doctor-dataset

This utility manages the directory structure for training and evaluating
the MobileNetV3 / ResNet18 disease classification model.
"""

import os
import sys
import json
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "datasets" / "paddy_doctor"

# Official 10 classes from Paddy Doctor Benchmark / Kaggle Competition
OFFICIAL_CLASSES = [
    "bacterial_leaf_blight",
    "bacterial_leaf_streak",
    "bacterial_panicle_blight",
    "blast",
    "brown_spot",
    "dead_heart",
    "downy_mildew",
    "hispa",
    "normal",
    "tungro"
]

def init_dataset_structure():
    """Initializes train, val, and test folder trees for all official classes."""
    print(f"[Paddy Doctor Setup] Target Directory: {DATASET_DIR}")
    for split in ["train", "val", "test"]:
        for cls in OFFICIAL_CLASSES:
            split_cls_dir = DATASET_DIR / split / cls
            split_cls_dir.mkdir(parents=True, exist_ok=True)
    
    guide_path = DATASET_DIR / "README_DATASET.md"
    if not guide_path.exists():
        guide_content = f"""# Paddy Doctor Dataset Setup Guide

To train the Arka-assist Disease Detection Model on the complete Paddy Doctor dataset:

1. Download the Paddy Doctor dataset from:
   - GitHub: https://github.com/paddydoc/paddy-doctor-dataset
   - Kaggle: https://www.kaggle.com/competitions/paddy-disease-classification/data

2. Extract training images into:
   `datasets/paddy_doctor/train/<class_name>/`

3. The official 10 classes are:
{chr(10).join(f"   - {c}" for c in OFFICIAL_CLASSES)}

4. Run `python ml/train_disease_model.py` to initiate transfer learning.
"""
        guide_path.write_text(guide_content, encoding="utf-8")
    
    print("[Paddy Doctor Setup] Directory structure initialized successfully.")

def inspect_dataset():
    """Checks the number of genuine images present per class."""
    counts = {"train": {}, "val": {}, "test": {}}
    total_found = 0
    extensions = {".jpg", ".jpeg", ".png", ".webp"}

    for split in ["train", "val", "test"]:
        for cls in OFFICIAL_CLASSES:
            cls_dir = DATASET_DIR / split / cls
            if cls_dir.exists():
                imgs = [f for f in cls_dir.iterdir() if f.suffix.lower() in extensions]
                counts[split][cls] = len(imgs)
                total_found += len(imgs)
            else:
                counts[split][cls] = 0

    return counts, total_found

if __name__ == "__main__":
    init_dataset_structure()
    counts, total = inspect_dataset()
    print(f"[Paddy Doctor Setup] Total images detected across all splits: {total}")
    if total == 0:
        print("[Paddy Doctor Setup] NOTE: No images currently placed in datasets/paddy_doctor/.")
        print("[Paddy Doctor Setup] Please see datasets/paddy_doctor/README_DATASET.md for instructions.")
