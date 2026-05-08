import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# These are exactly the fields the frontend form sends
FEATURE_COLUMNS = [
    'MinTemp', 'MaxTemp', 'Rainfall', 'Evaporation', 'Sunshine',
    'WindGustSpeed', 'WindSpeed9am', 'WindSpeed3pm',
    'Humidity9am', 'Humidity3pm',
    'Pressure9am', 'Pressure3pm',
    'Cloud9am', 'Cloud3pm',
    'Temp9am', 'Temp3pm',
    'RainYesterday'  # encoded from RainToday: 0=No, 1=Yes
]

TARGET_COLUMN = 'RainTomorrow'


def train_and_save_model():
    print("Starting model training...")

    data_path = os.path.join(os.path.dirname(__file__), '../../data/data final.csv')
    df = pd.read_csv(data_path)

    print(f"Loaded {len(df)} rows, {len(df.columns)} columns")

    # Drop rows where target is missing
    df = df.dropna(subset=[TARGET_COLUMN])

    # Encode RainToday -> RainYesterday (0/1)
    df['RainYesterday'] = df['RainToday'].map({'Yes': 1, 'No': 0})

    # Encode target: RainTomorrow -> 0/1
    df['target'] = df[TARGET_COLUMN].map({'Yes': 1, 'No': 0})

    # Select only the frontend feature columns
    df = df[FEATURE_COLUMNS + ['target']].dropna()

    print(f"After cleaning: {len(df)} rows")

    X = df[FEATURE_COLUMNS]
    y = df['target']

    print(f"Features: {FEATURE_COLUMNS}")
    print(f"Target distribution:\n{y.value_counts()}")

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, stratify=y, random_state=42
    )

    # Train Random Forest
    print("Training Random Forest...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Rain', 'Rain']))

    # Save model, scaler, and feature columns
    base = os.path.dirname(__file__)
    joblib.dump(model,           os.path.join(base, 'rainfall_model.pkl'))
    joblib.dump(scaler,          os.path.join(base, 'scaler.pkl'))
    joblib.dump(FEATURE_COLUMNS, os.path.join(base, 'feature_columns.pkl'))

    print(f"\nSaved: rainfall_model.pkl, scaler.pkl, feature_columns.pkl")
    print("Training complete.")


if __name__ == "__main__":
    train_and_save_model()
