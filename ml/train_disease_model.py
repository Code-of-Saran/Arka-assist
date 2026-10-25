"""
ARKA-ASSIST — Plant Disease Detection Transfer Learning Pipeline
Architecture: MobileNetV3-Small (Transfer Learning from ImageNet)
Dataset: Paddy Doctor Agricultural Pathology Benchmark

Features:
- Image augmentation & ImageNet normalization
- Reproducible random seed & deterministic split
- Class-weighted Cross-Entropy loss for handling imbalanced classes
- CosineAnnealingLR scheduling & Early Stopping
- Saves weights, training curves, and configuration
"""

import os
import sys
import json
import time
import random
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset, random_split
from torchvision import transforms, models
from PIL import Image

# Ensure results and model destination directories exist
BASE_DIR = Path(__file__).resolve().parent.parent
ML_DIR = BASE_DIR / "ml"
RESULTS_DIR = ML_DIR / "results"
BACKEND_MODELS_DIR = BASE_DIR / "backend" / "models"
DATASET_DIR = BASE_DIR / "datasets" / "paddy_doctor"

RESULTS_DIR.mkdir(parents=True, exist_ok=True)
BACKEND_MODELS_DIR.mkdir(parents=True, exist_ok=True)

# 1. Reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(SEED)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load Canonical Classes
with open(ML_DIR / "class_names.json", "r", encoding="utf-8") as f:
    CLASS_NAMES = json.load(f)
NUM_CLASSES = len(CLASS_NAMES)
CLASS_TO_IDX = {cls: idx for idx, cls in enumerate(CLASS_NAMES)}

# Transforms
IMAGE_SIZE = 224
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

train_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=15),
    transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
])

eval_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
])

class PaddyDataset(Dataset):
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        path = self.image_paths[idx]
        image = Image.open(path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        label = self.labels[idx]
        return image, label

def collect_images_from_directory(base_path):
    """Gathers all image paths and corresponding class labels."""
    image_paths = []
    labels = []
    valid_exts = {".jpg", ".jpeg", ".png", ".webp"}

    for cls in CLASS_NAMES:
        cls_folder = base_path / cls
        if cls_folder.exists():
            for p in cls_folder.iterdir():
                if p.suffix.lower() in valid_exts:
                    image_paths.append(p)
                    labels.append(CLASS_TO_IDX[cls])
    return image_paths, labels

def create_sample_verification_dataset():
    """
    Creates a minimal reference dataset for pipeline validation and offline test runs
    if the external multi-gigabyte Paddy Doctor dataset is not yet downloaded.
    Clearly marks records as benchmark verification images.
    """
    print("[Pipeline] Generating sample benchmark dataset for pipeline validation...")
    sample_dir = DATASET_DIR / "sample_verification"
    image_paths, labels = [], []
    
    # 5 samples per class for quick architecture verification
    for idx, cls in enumerate(CLASS_NAMES):
        cls_dir = sample_dir / cls
        cls_dir.mkdir(parents=True, exist_ok=True)
        for i in range(5):
            img_path = cls_dir / f"{cls}_sample_{i+1}.png"
            if not img_path.exists():
                # Create a synthetic agricultural leaf pattern with class-specific variations
                arr = np.zeros((IMAGE_SIZE, IMAGE_SIZE, 3), dtype=np.uint8)
                # Base green leaf tint
                arr[:, :, 1] = np.random.randint(120, 180, (IMAGE_SIZE, IMAGE_SIZE))
                arr[:, :, 0] = np.random.randint(40, 90, (IMAGE_SIZE, IMAGE_SIZE))
                arr[:, :, 2] = np.random.randint(20, 60, (IMAGE_SIZE, IMAGE_SIZE))
                # Add distinctive lesion / texture signature per class
                if "blight" in cls or "blast" in cls:
                    arr[60:160, 60:160, 0] = 140 # brown necrotic spots
                    arr[60:160, 60:160, 1] = 80
                elif "hispa" in cls or "streak" in cls:
                    arr[:, 100:124, :] = 200 # white streaks
                img = Image.fromarray(arr)
                img.save(img_path)
            image_paths.append(img_path)
            labels.append(idx)
    return image_paths, labels

def build_model(num_classes=NUM_CLASSES):
    """Instantiates MobileNetV3-Small with pretrained ImageNet weights."""
    print(f"[Model] Initializing MobileNetV3-Small for {num_classes} classes...")
    try:
        model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    except Exception as e:
        print(f"[Model] Pretrained weights fallback: {e}")
        model = models.mobilenet_v3_small(weights=None)
    
    # Replace the final classification head
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(in_features, num_classes)
    )
    return model

def train_model(epochs=10, batch_size=8, learning_rate=1e-3):
    start_time = time.time()
    
    # 1. Check for real training data
    train_dir = DATASET_DIR / "train"
    image_paths, labels = collect_images_from_directory(train_dir)
    is_sample_run = False

    if len(image_paths) < NUM_CLASSES * 2:
        print(f"[Dataset Warning] Fewer than {NUM_CLASSES*2} images in datasets/paddy_doctor/train.")
        print("[Dataset] Utilizing benchmark verification samples to test the pipeline architecture.")
        image_paths, labels = create_sample_verification_dataset()
        is_sample_run = True

    print(f"[Dataset] Total images loaded: {len(image_paths)} across {NUM_CLASSES} classes.")

    # 2. Train / Val / Test Split (70% train, 15% val, 15% test)
    total_samples = len(image_paths)
    indices = list(range(total_samples))
    random.shuffle(indices)

    train_end = int(0.70 * total_samples)
    val_end = int(0.85 * total_samples)

    train_idx = indices[:train_end]
    val_idx = indices[train_end:val_end]
    test_idx = indices[val_end:]

    train_paths = [image_paths[i] for i in train_idx]
    train_lbls = [labels[i] for i in train_idx]
    val_paths = [image_paths[i] for i in val_idx]
    val_lbls = [labels[i] for i in val_idx]
    test_paths = [image_paths[i] for i in test_idx]
    test_lbls = [labels[i] for i in test_idx]

    train_ds = PaddyDataset(train_paths, train_lbls, transform=train_transform)
    val_ds = PaddyDataset(val_paths, val_lbls, transform=eval_transform)
    test_ds = PaddyDataset(test_paths, test_lbls, transform=eval_transform)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False)

    # 3. Model, Loss, Optimizer, Scheduler
    model = build_model(NUM_CLASSES).to(DEVICE)
    
    # Compute class weights for imbalanced distributions
    class_counts = np.bincount(train_lbls, minlength=NUM_CLASSES)
    total_train = len(train_lbls)
    class_weights = [total_train / (NUM_CLASSES * max(c, 1)) for c in class_counts]
    weights_tensor = torch.tensor(class_weights, dtype=torch.float32).to(DEVICE)
    
    criterion = nn.CrossEntropyLoss(weight=weights_tensor)
    optimizer = optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-6)

    # 4. Training Loop
    history = {"train_loss": [], "val_loss": [], "train_acc": [], "val_acc": []}
    best_val_loss = float("inf")
    best_weights_path = BACKEND_MODELS_DIR / "disease_model.pth"

    print(f"\n[Training] Commencing transfer learning on {DEVICE} for {epochs} epochs...")
    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, targets in train_loader:
            images, targets = images.to(DEVICE), targets.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == targets).sum().item()
            total += targets.size(0)

        scheduler.step()
        epoch_train_loss = running_loss / max(total, 1)
        epoch_train_acc = correct / max(total, 1)

        # Validation phase
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        with torch.no_grad():
            for images, targets in val_loader:
                images, targets = images.to(DEVICE), targets.to(DEVICE)
                outputs = model(images)
                loss = criterion(outputs, targets)
                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += (preds == targets).sum().item()
                val_total += targets.size(0)

        epoch_val_loss = val_loss / max(val_total, 1)
        epoch_val_acc = val_correct / max(val_total, 1)

        history["train_loss"].append(round(epoch_train_loss, 4))
        history["val_loss"].append(round(epoch_val_loss, 4))
        history["train_acc"].append(round(epoch_train_acc, 4))
        history["val_acc"].append(round(epoch_val_acc, 4))

        print(f"Epoch [{epoch:02d}/{epochs:02d}] - "
              f"Train Loss: {epoch_train_loss:.4f}, Acc: {epoch_train_acc*100:.1f}% | "
              f"Val Loss: {epoch_val_loss:.4f}, Acc: {epoch_val_acc*100:.1f}%")

        if epoch_val_loss < best_val_loss:
            best_val_loss = epoch_val_loss
            # Save checkpoint
            torch.save({
                "model_state_dict": model.state_dict(),
                "class_names": CLASS_NAMES,
                "architecture": "mobilenet_v3_small",
                "image_size": IMAGE_SIZE,
                "imagenet_mean": IMAGENET_MEAN,
                "imagenet_std": IMAGENET_STD,
                "epoch": epoch,
                "val_acc": epoch_val_acc,
                "val_loss": epoch_val_loss,
                "is_sample_run": is_sample_run
            }, best_weights_path)

    # Save training configuration metadata
    training_config = {
        "model_architecture": "MobileNetV3-Small",
        "dataset": "Paddy Doctor (Kaggle/GitHub Benchmark)",
        "num_classes": NUM_CLASSES,
        "classes": CLASS_NAMES,
        "epochs": epochs,
        "batch_size": batch_size,
        "initial_learning_rate": learning_rate,
        "device": str(DEVICE),
        "random_seed": SEED,
        "training_time_seconds": round(time.time() - start_time, 2),
        "is_sample_run": is_sample_run,
        "sample_notice": "Trained on benchmark verification samples because full multi-gigabyte dataset was not pre-placed locally." if is_sample_run else "Trained on local dataset partition."
    }
    with open(ML_DIR / "training_config.json", "w", encoding="utf-8") as f:
        json.dump(training_config, f, indent=2)

    # Plot training curves without GUI dependency
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        plt.figure(figsize=(10, 4))
        plt.subplot(1, 2, 1)
        plt.plot(range(1, epochs + 1), history["train_loss"], label="Train Loss")
        plt.plot(range(1, epochs + 1), history["val_loss"], label="Val Loss")
        plt.xlabel("Epoch")
        plt.ylabel("Loss")
        plt.title("Cross-Entropy Loss")
        plt.legend()

        plt.subplot(1, 2, 2)
        plt.plot(range(1, epochs + 1), history["train_acc"], label="Train Acc")
        plt.plot(range(1, epochs + 1), history["val_acc"], label="Val Acc")
        plt.xlabel("Epoch")
        plt.ylabel("Accuracy")
        plt.title("Classification Accuracy")
        plt.legend()

        plt.tight_layout()
        plt.savefig(RESULTS_DIR / "training_curves.png", dpi=150)
        plt.close()
        print(f"[Results] Training curves saved to {RESULTS_DIR / 'training_curves.png'}")
    except Exception as e:
        print(f"[Results] Note: Could not render training curves plot: {e}")

    print(f"\n[Training Complete] Model saved to {best_weights_path}")
    return test_loader

if __name__ == "__main__":
    train_model(epochs=6, batch_size=8, learning_rate=1e-3)
