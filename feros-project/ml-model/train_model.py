import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import os

# Load dataset
dataset_path = '../dataset/fuel_consumption_dataset.csv'
df = pd.read_csv(dataset_path)

print("Dataset shape:", df.shape)
print("Columns:", df.columns.tolist())
print("\nFirst few rows:")
print(df.head())

# Data preprocessing
# Handle missing values
df = df.dropna()

# Feature encoding for categorical columns
le_road_type = LabelEncoder()
if 'road_type' in df.columns:
    df['road_type_encoded'] = le_road_type.fit_transform(df['road_type'])

# Define features and target
feature_columns = [
    'distance',
    'average_speed',
    'traffic_level',
    'road_type_encoded' if 'road_type' in df.columns else None,
    'vehicle_mileage'
]
feature_columns = [col for col in feature_columns if col in df.columns]

X = df[feature_columns]
y = df['fuel_consumption']

print(f"\nFeatures: {feature_columns}")
print(f"Target: fuel_consumption")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\nTraining set size: {len(X_train)}")
print(f"Test set size: {len(X_test)}")

# Train model
print("\nTraining Random Forest Regressor...")
model = RandomForestRegressor(
    n_estimators=100,
    max_depth=15,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"\nModel Performance:")
print(f"MAE: {mae:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"R² Score: {r2:.4f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(feature_importance)

# Save model
model_path = 'fuel_consumption_model.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"\nModel saved to {model_path}")

# Save feature columns for prediction
with open('feature_columns.pkl', 'wb') as f:
    pickle.dump(feature_columns, f)

print("Feature columns saved")
