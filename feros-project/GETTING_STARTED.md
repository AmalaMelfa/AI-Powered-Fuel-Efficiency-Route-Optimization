# Getting Started with Feros

## Quick Start Guide

### Prerequisites
- Node.js 18 or higher
- Python 3.8 or higher
- Google Maps API Key (get from [Google Cloud Console](https://console.cloud.google.com/))

### Installation Steps

#### 1. Clone and Install Dependencies
```bash
cd feros-project

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Install Python dependencies for ML
cd ml-model
pip install -r requirements.txt
cd ..
```

#### 2. Configure Environment
```bash
# Create .env file in backend directory
cd backend
cp .env.example .env
# Edit .env and add your Google Maps API key
nano .env
cd ..
```

### Running the Application

#### Option 1: Run All Services Separately (Recommended for Development)

**Terminal 1 - Frontend (Vite Dev Server)**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Backend (Express Server)**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 3 - ML Model (Flask API)**
```bash
cd ml-model
python predict_fuel.py
# Runs on http://localhost:5001
```

#### Option 2: Run Everything with One Command
```bash
npm run dev
```

### Train the ML Model

Before running the ML prediction API for the first time, train the model:

```bash
cd ml-model
python train_model.py
```

This will:
- Load the fuel consumption dataset
- Preprocess and encode features
- Train a Random Forest model
- Save the model as `fuel_consumption_model.pkl`
- Display model performance metrics

### Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **ML API:** http://localhost:5001

## Project Workflow

### 1. Vehicle Setup (First Page)
- Select your vehicle model (Swift, i20, Creta, Nexon)
- Enter current fuel in tank
- Auto-calculated maximum range = Fuel × Mileage
- Data stored in localStorage

### 2. Route Selection (Second Page)
- Enter start location and destination
- System fetches multiple routes from Google Maps
- ML model predicts fuel consumption for each route
- Choose your preferred route (fastest, most efficient, shortest)

### 3. Navigation (Dashboard)
- Real-time fuel and distance tracking
- Current maximum driving range calculation
- When fuel < 2L, nearby petrol stations are shown
- Stations are sorted by reachability

### 4. Trip Summary (End Page)
- Distance travelled
- Fuel consumed
- Time taken
- Fuel saved compared to fastest route

## API Reference

### Frontend to Backend Communication

**Request Routes**
```javascript
POST /api/routes/predict
{
  start: "Delhi",
  destination: "Agra",
  mileage: 20
}
```

**Response**
```json
{
  "routes": [
    {
      "id": 0,
      "distance": "233.5",
      "duration": 245,
      "fuelConsumption": "11.68",
      "avgSpeed": "57.1",
      "summary": "NH 44"
    }
  ]
}
```

**Get Petrol Stations**
```javascript
GET /api/maps/nearby-petrol-stations?lat=28.6139&lng=77.2090&radius=5000
```

### ML Model Prediction

**Single Route Prediction**
```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "distance": 10,
    "average_speed": 40,
    "traffic_level": 2,
    "road_type_encoded": 0,
    "vehicle_mileage": 20
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### Google Maps API Issues
- Ensure API key is valid
- Enable Directions API and Places API in Google Cloud Console
- Check API quotas and billing

### Python Module Not Found
```bash
# Reinstall dependencies
cd ml-model
pip install --upgrade scikit-learn pandas numpy flask
```

## Customization

### Add New Vehicle Models
Edit [frontend/src/pages/VehicleSetup.jsx](frontend/src/pages/VehicleSetup.jsx):
```javascript
const mileageMap = {
  Swift: 22,
  i20: 20,
  Creta: 17,
  Nexon: 21,
  // Add new model here
  NewModel: 25,
};
```

### Modify ML Model Features
Edit [ml-model/train_model.py](ml-model/train_model.py) to add/remove features in the `feature_columns` list.

### Customize Fuel Thresholds
Edit [frontend/src/pages/FuelDashboard.jsx](frontend/src/pages/FuelDashboard.jsx):
```javascript
if (vehicleInfo && fuelLeft < 2) {  // Change 2 to different threshold
```

## Performance Tips

1. **Cache Routes:** Store successful route queries
2. **Batch Predictions:** Use batch-predict endpoint for multiple routes
3. **Reduce API Calls:** Cache petrol station results
4. **Database:** Add MongoDB for user history and preferences

## Next Steps

- [ ] Implement real Google Maps integration
- [ ] Add user authentication
- [ ] Create mobile app version
- [ ] Add more training data for ML model
- [ ] Implement real-time GPS tracking
- [ ] Add fuel price comparison
- [ ] Create admin dashboard

## Support & Documentation

- Full README: [README.md](README.md)
- API Documentation: See API Reference section above
- ML Model Details: Check [ml-model/train_model.py](ml-model/train_model.py)

## License

MIT License - See LICENSE file for details
