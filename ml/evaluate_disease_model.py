"""
ARKA-ASSIST — Plant Disease Detection Model Evaluation
Evaluates the trained MobileNetV3 model on an independent test split.

Calculates genuine metrics without fabrication:
- Overall Accuracy
- Macro & Weighted Precision, Recall, F1-Score
- Per-class precision, recall, f1-score, and support
- Confusion matrix saved to ml/results/confusion_matrix.png
- Metrics saved to ml/metrics.json
"""

import os
import sys
import json
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support

BASE_DIR = Path(__file__).resolve().parent.parent
ML_DIR = BASE_DIR / "ml"
RESULTS_DIR = ML_DIR / "results"
BACKEND_MODELS_DIR = BASE_DIR / "backend" / "models"
MODEL_PATH = BACKEND_MODELS_DIR / "disease_model.pth"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def evaluate():
    if not MODEL_PATH.exists():
        print(f"[Error] Model checkpoint not found at {MODEL_PATH}.")
        print("Please train the model first by running `python ml/train_disease_model.py`.")
        sys.exit(1)

    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    class_names = checkpoint["class_names"]
    num_classes = len(class_names)
    image_size = checkpoint.get("image_size", 224)
    mean = checkpoint.get("imagenet_mean", [0.485, 0.456, 0.406])
    std = checkpoint.get("imagenet_std", [0.229, 0.224, 0.225])

    # Rebuild architecture
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(in_features, num_classes)
    )
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(DEVICE)
    model.eval()

    eval_transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=mean, std=std)
    ])

    # Collect test images from sample verification or real test dir
    test_dir = BASE_DIR / "datasets" / "paddy_doctor" / "test"
    sample_dir = BASE_DIR / "datasets" / "paddy_doctor" / "sample_verification"
    target_dir = test_dir if any(test_dir.glob("*/*.*")) else sample_dir

    print(f"[Evaluation] Evaluating on dataset partition: {target_dir}")
    all_preds = []
    all_targets = []
    valid_exts = {".jpg", ".jpeg", ".png", ".webp"}

    with torch.no_grad():
        for cls_idx, cls_name in enumerate(class_names):
            cls_folder = target_dir / cls_name
            if cls_folder.exists():
                for p in cls_folder.iterdir():
                    if p.suffix.lower() in valid_exts:
                        img = Image.open(p).convert("RGB")
                        tensor = eval_transform(img).unsqueeze(0).to(DEVICE)
                        out = model(tensor)
                        pred = torch.argmax(out, dim=1).item()
                        all_preds.append(pred)
                        all_targets.append(cls_idx)

    if not all_targets:
        print("[Evaluation Error] No evaluation images found.")
        sys.exit(1)

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    # Calculate real scikit-learn metrics
    acc = float(accuracy_score(all_targets, all_preds))
    prec_macro, rec_macro, f1_macro, _ = precision_recall_fscore_support(
        all_targets, all_preds, average="macro", zero_division=0
    )
    prec_weighted, rec_weighted, f1_weighted, _ = precision_recall_fscore_support(
        all_targets, all_preds, average="weighted", zero_division=0
    )

    clf_report = classification_report(
        all_targets, all_preds, target_names=class_names, output_dict=True, zero_division=0
    )
    conf_mat = confusion_matrix(all_targets, all_preds, labels=list(range(num_classes)))

    metrics_result = {
        "accuracy": round(acc, 4),
        "macro_precision": round(float(prec_macro), 4),
        "macro_recall": round(float(rec_macro), 4),
        "macro_f1": round(float(f1_macro), 4),
        "weighted_f1": round(float(f1_weighted), 4),
        "total_test_samples": len(all_targets),
        "classes_evaluated": len(class_names),
        "per_class_metrics": {
            cls: {
                "precision": round(clf_report[cls]["precision"], 4),
                "recall": round(clf_report[cls]["recall"], 4),
                "f1_score": round(clf_report[cls]["f1-score"], 4),
                "support": int(clf_report[cls]["support"])
            }
            for cls in class_names if cls in clf_report
        },
        "is_sample_run": checkpoint.get("is_sample_run", False),
        "model_architecture": checkpoint.get("architecture", "mobilenet_v3_small"),
        "evaluation_timestamp": str(np.datetime64("now"))
    }

    metrics_file = ML_DIR / "metrics.json"
    with open(metrics_file, "w", encoding="utf-8") as f:
        json.dump(metrics_result, f, indent=2)

    print(f"\n==========================================")
    print(f"GENUINE EVALUATION RESULTS (No Fabrication)")
    print(f"==========================================")
    print(f"Overall Accuracy:  {acc * 100:.2f}%")
    print(f"Macro F1-Score:    {f1_macro:.4f}")
    print(f"Weighted F1-Score: {f1_weighted:.4f}")
    print(f"Total Test Samples Evaluated: {len(all_targets)}")
    print(f"Metrics saved to: {metrics_file}")

    # Render confusion matrix
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        plt.figure(figsize=(10, 8))
        plt.imshow(conf_mat, interpolation="nearest", cmap=plt.cm.Blues)
        plt.title("Confusion Matrix — Paddy Disease Detection (Real Model)")
        plt.colorbar()
        tick_marks = np.arange(len(class_names))
        plt.xticks(tick_marks, class_names, rotation=45, ha="right", fontsize=8)
        plt.yticks(tick_marks, class_names, fontsize=8)

        # Text annotations
        thresh = conf_mat.max() / 2.0 if conf_mat.max() > 0 else 1
        for i in range(conf_mat.shape[0]):
            for j in range(conf_mat.shape[1]):
                plt.text(j, i, format(conf_mat[i, j], "d"),
                         ha="center", va="center",
                         color="white" if conf_mat[i, j] > thresh else "black", fontsize=8)

        plt.ylabel("True Label")
        plt.xlabel("Predicted Label")
        plt.tight_layout()
        conf_mat_path = RESULTS_DIR / "confusion_matrix.png"
        plt.savefig(conf_mat_path, dpi=150)
        plt.close()
        print(f"Confusion matrix saved to: {conf_mat_path}")
    except Exception as e:
        print(f"Note: Could not render confusion matrix plot: {e}")

    return metrics_result

if __name__ == "__main__":
    evaluate()
