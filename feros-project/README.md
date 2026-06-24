# Feros – Fuel Efficient Route Navigation System

A web application that helps users choose routes based on fuel efficiency rather than only distance or time. The system integrates GPS data to recommend routes and shows the nearest petrol stations based on vehicle fuel efficiency.

## Project Structure

```
feros-project/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── VehicleSetup.jsx
│   │   │   ├── MapNavigation.jsx
│   │   │   ├── FuelDashboard.jsx
│   │   │   └── TripSummary.jsx
│   │   ├── components/          # Reusable components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/                     # Node.js + Express backend
│   ├── routes/
│   │   ├── fuelPrediction.js
│   │   └── mapsRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── ml-model/                    # Python ML model
│   ├── train_model.py
│   ├── predict_fuel.py
│   └── fuel_consumption_model.pkl (generated after training)
├── dataset/
│   └── fuel_consumption_dataset.csv
└── README.md
```

## Tech Stack

- **Frontend:** React 18, Vite, Axios
- **Backend:** Node.js, Express
- **Machine Learning:** Python, scikit-learn
- **APIs:** Google Maps Platform (Directions API + Places API)
- **Database:** MongoDB (optional)

## Setup Instructions

### Prerequisites

## Quick Start

### 1. Install Dependencies
```bash
# Install all dependencies (root, frontend, and backend)
npm run install-all
```

### 2. Start Development Servers
```bash
# From the project root directory (feros-project/)
npm run dev
```

This will start both the frontend (React) and backend (Node.js) servers simultaneously.

- **Frontend:** `http://localhost:5173` (or next available port)
- **Backend:** `http://localhost:5000`

### Alternative: Windows-specific command
If the above doesn't work on Windows, try:
```bash
npm run dev:win
```

## Manual Setup (Alternative)

If you prefer to run services separately:

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features

### 1. Vehicle Setup (First Time Use)
- Select vehicle model from predefined list with mileage values
- Enter current fuel level in tank
- Calculate maximum travel distance
- Store vehicle info in browser localStorage

### 2. Map Navigation
- Input start location and destination
- Fetch multiple routes using Google Maps Directions API
- Get AI-predicted fuel consumption for each route
- Choose between fastest, least fuel consumption, or shortest distance routes

### 3. Navigation Dashboard
- Display real-time fuel remaining
- Show distance remaining to destination
- Calculate and display maximum remaining range
- Update dynamically during navigation

### 4. Smart Petrol Station Detection
- Automatically detect when fuel is low
- Find nearby petrol stations using Google Places API
- Calculate shortest reachable petrol station
- Show petrol stations within maximum range based on remaining fuel

### 5. Trip Summary
- Display distance travelled
- Show fuel consumed
- Record time taken
- Compare fuel saved vs fastest route

## API Endpoints

### Backend APIs

**Get Routes & Predict Fuel**
```
POST /api/routes/predict
Body: { start, destination, mileage }
Response: { routes: [{ distance, duration, fuelConsumption, avgSpeed }] }
```

**Get Nearby Petrol Stations**
```
GET /api/maps/nearby-petrol-stations?lat=28.6139&lng=77.2090&radius=5000
Response: { stations: [{ name, distance, lat, lng, isOpen }] }
```

### ML Model API

**Single Prediction**
```
POST http://localhost:5001/predict
Body: { distance, average_speed, traffic_level, road_type_encoded, vehicle_mileage }
Response: { fuel_consumption, features_used }
```

**Batch Prediction**
```
POST http://localhost:5001/batch-predict
Body: { routes: [{ id, distance, average_speed, traffic_level, road_type_encoded, vehicle_mileage }] }
Response: { predictions: [{ route_id, fuel_consumption }] }
```

## Vehicle Models & Mileage

| Model | Mileage |
|-------|---------|
| Swift | 22 km/L |
| i20   | 20 km/L |
| Creta | 17 km/L |
| Nexon | 21 km/L |

## ML Model Details

**Problem Type:** Regression

**Input Features:**
- distance (km)
- average_speed (km/h)
- traffic_level (0-3)
- road_type (city/highway - encoded)
- vehicle_mileage (km/L)

**Output:**
- Predicted fuel consumption (liters)

**Algorithm:** Random Forest Regressor

**Model Evaluation Metrics:**
- MAE (Mean Absolute Error)
- RMSE (Root Mean Squared Error)
- R² Score

## Environment Variables

### Backend (.env)
```
GOOGLE_MAPS_API_KEY=your_api_key_here
PORT=5000
```

## How It Works

1. **Vehicle Setup:** User enters vehicle details and current fuel
2. **Route Selection:** System fetches multiple routes and predicts fuel consumption for each
3. **Navigation:** Real-time tracking of fuel consumption and distance remaining
4. **Petrol Station Detection:** When fuel is low, nearby stations are shown
5. **Trip Summary:** After reaching destination, trip statistics are displayed

## Future Enhancements

- Real-time GPS integration
- Traffic data integration for better fuel predictions
- User authentication and history tracking
- Mobile app version
- Real-time fuel price comparison
- Advanced ML models with more training data
- Database integration for user preferences

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.
