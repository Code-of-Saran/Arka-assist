"""
Train Random Forest Crop Recommendation Model
Trains on realistic agronomic parameters for 22 staple and commercial crops.
Saves model and metadata to backend/models/
"""

import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

# 22 Crops with their realistic agronomic centroid and standard deviations
# [N, P, K, Temperature (°C), Humidity (%), Soil pH, Rainfall (mm)]
CROP_PROFILES = {
    "rice": {
        "mean": [80, 48, 40, 24.0, 82.0, 6.4, 235.0],
        "std": [12, 8, 5, 2.5, 4.0, 0.4, 30.0],
        "category": "Cereal / Grain"
    },
    "maize": {
        "mean": [78, 48, 20, 22.5, 65.0, 6.2, 85.0],
        "std": [14, 10, 4, 3.0, 6.0, 0.4, 15.0],
        "category": "Cereal / Grain"
    },
    "chickpea": {
        "mean": [40, 68, 80, 19.0, 17.0, 7.3, 80.0],
        "std": [8, 8, 5, 2.0, 2.5, 0.3, 10.0],
        "category": "Pulses / Legume"
    },
    "kidneybeans": {
        "mean": [21, 68, 20, 20.0, 22.0, 5.7, 105.0],
        "std": [5, 6, 3, 2.0, 3.0, 0.3, 15.0],
        "category": "Pulses / Legume"
    },
    "pigeonpeas": {
        "mean": [21, 68, 20, 27.5, 48.0, 5.8, 150.0],
        "std": [6, 8, 3, 3.0, 5.0, 0.5, 20.0],
        "category": "Pulses / Legume"
    },
    "mothbeans": {
        "mean": [21, 48, 20, 28.0, 53.0, 7.0, 51.0],
        "std": [5, 7, 3, 3.0, 6.0, 0.4, 10.0],
        "category": "Pulses / Legume"
    },
    "mungbean": {
        "mean": [21, 48, 20, 28.5, 85.0, 6.7, 48.0],
        "std": [5, 6, 3, 2.5, 4.0, 0.4, 8.0],
        "category": "Pulses / Legume"
    },
    "blackgram": {
        "mean": [40, 68, 20, 30.0, 65.0, 7.1, 68.0],
        "std": [8, 8, 3, 2.5, 5.0, 0.3, 10.0],
        "category": "Pulses / Legume"
    },
    "lentil": {
        "mean": [19, 68, 19, 24.5, 65.0, 6.9, 45.0],
        "std": [4, 6, 3, 2.0, 5.0, 0.4, 8.0],
        "category": "Pulses / Legume"
    },
    "pomegranate": {
        "mean": [19, 19, 40, 22.0, 90.0, 6.4, 108.0],
        "std": [5, 4, 5, 2.5, 3.0, 0.3, 12.0],
        "category": "Fruit / Horticulture"
    },
    "banana": {
        "mean": [100, 75, 50, 27.5, 80.0, 6.0, 105.0],
        "std": [15, 8, 6, 2.0, 4.0, 0.4, 15.0],
        "category": "Fruit / Horticulture"
    },
    "mango": {
        "mean": [20, 27, 30, 31.0, 50.0, 5.8, 95.0],
        "std": [5, 5, 4, 3.0, 6.0, 0.5, 12.0],
        "category": "Fruit / Horticulture"
    },
    "grapes": {
        "mean": [23, 133, 201, 24.0, 82.0, 6.0, 69.0],
        "std": [5, 10, 8, 3.0, 3.0, 0.3, 10.0],
        "category": "Fruit / Horticulture"
    },
    "watermelon": {
        "mean": [99, 18, 50, 25.5, 85.0, 6.5, 51.0],
        "std": [12, 4, 5, 2.5, 3.0, 0.3, 8.0],
        "category": "Fruit / Horticulture"
    },
    "muskmelon": {
        "mean": [100, 18, 50, 28.5, 92.0, 6.4, 25.0],
        "std": [12, 4, 5, 2.0, 3.0, 0.3, 5.0],
        "category": "Fruit / Horticulture"
    },
    "apple": {
        "mean": [21, 134, 200, 22.5, 92.0, 5.9, 112.0],
        "std": [5, 10, 8, 2.5, 3.0, 0.3, 15.0],
        "category": "Fruit / Horticulture"
    },
    "orange": {
        "mean": [20, 16, 10, 23.0, 92.0, 7.0, 110.0],
        "std": [5, 3, 2, 3.0, 3.0, 0.4, 12.0],
        "category": "Fruit / Horticulture"
    },
    "papaya": {
        "mean": [50, 59, 50, 33.5, 92.0, 6.7, 142.0],
        "std": [8, 6, 5, 2.5, 3.0, 0.3, 18.0],
        "category": "Fruit / Horticulture"
    },
    "coconut": {
        "mean": [22, 17, 30, 27.0, 95.0, 6.0, 175.0],
        "std": [5, 4, 4, 2.0, 2.0, 0.4, 20.0],
        "category": "Plantation / Cash Crop"
    },
    "cotton": {
        "mean": [118, 46, 19, 24.0, 80.0, 6.9, 80.0],
        "std": [12, 6, 3, 2.5, 4.0, 0.4, 10.0],
        "category": "Commercial / Fiber"
    },
    "jute": {
        "mean": [78, 46, 40, 25.0, 80.0, 6.7, 175.0],
        "std": [10, 6, 4, 2.0, 4.0, 0.4, 15.0],
        "category": "Commercial / Fiber"
    },
    "coffee": {
        "mean": [101, 29, 30, 25.5, 59.0, 6.8, 160.0],
        "std": [12, 5, 4, 2.5, 5.0, 0.4, 18.0],
        "category": "Plantation / Beverage"
    }
}

def generate_dataset(samples_per_crop=150, random_state=42):
    np.random.seed(random_state)
    X = []
    y = []

    for crop, data in CROP_PROFILES.items():
        mean = np.array(data["mean"])
        std = np.array(data["std"])
        # Generate samples with normal distribution
        samples = np.random.normal(loc=mean, scale=std, size=(samples_per_crop, len(mean)))
        
        # Ensure positive physical values
        samples[:, 0] = np.clip(samples[:, 0], 0, 160)  # N
        samples[:, 1] = np.clip(samples[:, 1], 0, 160)  # P
        samples[:, 2] = np.clip(samples[:, 2], 0, 220)  # K
        samples[:, 3] = np.clip(samples[:, 3], 8, 48)   # Temp
        samples[:, 4] = np.clip(samples[:, 4], 10, 100) # Humidity
        samples[:, 5] = np.clip(samples[:, 5], 3.5, 9.5)# pH
        samples[:, 6] = np.clip(samples[:, 6], 10, 350) # Rainfall
        
        X.append(samples)
        y.extend([crop] * samples_per_crop)

    X = np.vstack(X)
    y = np.array(y)
    return X, y

import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def main():
    print("[ARKA-ASSIST] Generating Agronomic Training Dataset for 22 Crops...")
    X, y = generate_dataset(samples_per_crop=200, random_state=42)
    
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    feature_names = ['n', 'p', 'k', 'temperature', 'humidity', 'ph', 'rainfall']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    print(f"Training dataset size: {X_train.shape[0]} samples, Testing size: {X_test.shape[0]} samples")
    print("[ARKA-ASSIST] Fitting Random Forest Classifier directly on real-world agronomic features...")
    
    clf = RandomForestClassifier(
        n_estimators=120,
        max_depth=16,
        min_samples_split=2,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[SUCCESS] Model Accuracy: {acc * 100:.2f}%")
    
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "crop_model.joblib")
    features_path = os.path.join(models_dir, "crop_features.joblib")
    encoder_path = os.path.join(models_dir, "label_encoder.joblib")
    
    joblib.dump(clf, model_path)
    joblib.dump(feature_names, features_path)
    joblib.dump(le, encoder_path)
    
    print(f"[SAVED] Model saved to: {model_path}")
    print(f"[SAVED] Feature names saved to: {features_path}")
    print(f"[SAVED] Label Encoder saved to: {encoder_path}")
    print("[ARKA-ASSIST] Training Complete successfully!")

if __name__ == "__main__":
    main()
