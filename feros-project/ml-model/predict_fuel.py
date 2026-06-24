import pickle
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load trained model and feature columns
with open('fuel_consumption_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('feature_columns.pkl', 'rb') as f:
    feature_columns = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract features for prediction
        features = []
        for col in feature_columns:
            if col in data:
                features.append(float(data[col]))
            else:
                return jsonify({'error': f'Missing feature: {col}'}), 400
        
        # Make prediction
        features_array = np.array(features).reshape(1, -1)
        prediction = model.predict(features_array)[0]
        
        return jsonify({
            'fuel_consumption': float(prediction),
            'features_used': feature_columns
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    try:
        data = request.json
        routes = data.get('routes', [])
        
        predictions = []
        for route in routes:
            features = []
            for col in feature_columns:
                if col in route:
                    features.append(float(route[col]))
            
            if len(features) == len(feature_columns):
                features_array = np.array(features).reshape(1, -1)
                prediction = model.predict(features_array)[0]
                predictions.append({
                    'route_id': route.get('id'),
                    'fuel_consumption': float(prediction)
                })
        
        return jsonify({'predictions': predictions})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print(f"Model loaded with features: {feature_columns}")
    app.run(debug=False, port=5001)
