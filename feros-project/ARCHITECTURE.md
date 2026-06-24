# Feros System Architecture

## Overview

Feros is a fuel-efficient route navigation system built with a modern three-tier architecture:
- **Frontend Tier:** React + Vite (SPA)
- **Backend Tier:** Node.js + Express (REST API)
- **ML Tier:** Python + scikit-learn (Prediction Engine)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React 18 Application (Vite)                             │  │
│  │  - VehicleSetup Component                                │  │
│  │  - MapNavigation Component                               │  │
│  │  - FuelDashboard Component                               │  │
│  │  - TripSummary Component                                 │  │
│  └────────────┬──────────────────────────────────┬──────────┘  │
└───────────────┼──────────────────────────────────┼──────────────┘
                │                                  │
              HTTP/REST                        localStorage
                │                                  │
┌───────────────▼──────────────────────────────────┼──────────────┐
│                   Backend Layer                   │              │
│  ┌──────────────────────────────────────────┐    │              │
│  │  Express.js Server (Port: 5000)          │────┘              │
│  │  ┌────────────────────────────────────┐  │                   │
│  │  │ Route Prediction API                │  │                   │
│  │  │ POST /api/routes/predict            │  │                   │
│  │  │ - Calls Google Maps Directions API  │  │                   │
│  │  │ - Forwards data to ML service       │  │                   │
│  │  │ - Returns routes with predictions   │  │                   │
│  │  └────────────────────────────────────┘  │                   │
│  │  ┌────────────────────────────────────┐  │                   │
│  │  │ Maps API Handler                    │  │                   │
│  │  │ GET /api/maps/nearby-petrol-stations│  │                   │
│  │  │ - Calls Google Places API           │  │                   │
│  │  │ - Returns nearby petrol stations    │  │                   │
│  │  └────────────────────────────────────┘  │                   │
│  └──────────────────────────────────────────┘  │                   │
│                                                  │                   │
└──────────────────────┬──────────────────────────┴───────────────┘
                       │
             ┌─────────┴─────────┐
             │                   │
    ┌────────▼────────┐  ┌───────▼──────────┐
    │ Google Maps API │  │ Google Places API │
    │ Directions      │  │ Geocoding        │
    │ Directions      │  │ Nearby Search    │
    └────────────────┘  └──────────────────┘
             │                   │
             └─────────┬─────────┘
              (External Services)

                       │
         ┌─────────────▼──────────────┐
         │   ML Prediction Layer       │
         │  ┌──────────────────────┐  │
         │  │  Python Flask API     │  │
         │  │  (Port: 5001)        │  │
         │  │                       │  │
         │  │ POST /predict         │  │
         │  │ - Random Forest Model │  │
         │  │ - Features:           │  │
         │  │  * distance           │  │
         │  │  * average_speed      │  │
         │  │  * traffic_level      │  │
         │  │  * road_type_encoded  │  │
         │  │  * vehicle_mileage    │  │
         │  │                        │  │
         │  │ Returns:              │  │
         │  │ - Predicted fuel      │  │
         │  │   consumption (L)     │  │
         │  └──────────────────────┘  │
         │                            │
         │  ┌──────────────────────┐  │
         │  │  Trained Model       │  │
         │  │  (pkl file)          │  │
         │  │                       │  │
         │  │ fuel_consumption_    │  │
         │  │ model.pkl            │  │
         │  └──────────────────────┘  │
         │                            │
         └────────────────────────────┘
```

## Component Details

### Frontend Components

#### 1. VehicleSetup.jsx
- **Purpose:** Initial vehicle configuration
- **Features:**
  - Vehicle model selection
  - Fuel input
  - Max range calculation
  - localStorage persistence

#### 2. MapNavigation.jsx
- **Purpose:** Route selection and comparison
- **API Integration:**
  - Calls backend `/api/routes/predict`
  - Receives route options with predictions
- **User Actions:**
  - Input start/destination
  - View multiple routes
  - Select preferred route

#### 3. FuelDashboard.jsx
- **Purpose:** Real-time navigation monitoring
- **Features:**
  - Real-time fuel tracking
  - Distance remaining
  - Maximum range calculation
  - Low fuel detection
  - Petrol station fetching

#### 4. TripSummary.jsx
- **Purpose:** Journey completion summary
- **Displays:**
  - Total distance
  - Fuel consumed
  - Time taken
  - Fuel savings

### Backend APIs

#### Route Prediction Endpoint
```
POST /api/routes/predict
Request: { start, destination, mileage }
Response: 
{
  routes: [
    {
      id: 0,
      distance: "233.5 km",
      duration: 245,
      fuelConsumption: "11.68 L",
      avgSpeed: "57.1 km/h",
      summary: "NH 44"
    }
  ]
}
```

#### Petrol Stations Endpoint
```
GET /api/maps/nearby-petrol-stations?lat=28.6139&lng=77.2090&radius=5000
Response:
{
  stations: [
    {
      name: "Shell Petrol Pump",
      distance: 1.2,
      lat: 28.6150,
      lng: 77.2100,
      isOpen: true
    }
  ]
}
```

### ML Model

#### Model Type
**Random Forest Regression**

#### Features
1. **distance** (km): Route distance
2. **average_speed** (km/h): Average speed on route
3. **traffic_level** (0-3): Traffic congestion
4. **road_type_encoded** (0/1): City (0) or Highway (1)
5. **vehicle_mileage** (km/L): Vehicle fuel efficiency

#### Target
**fuel_consumption** (liters)

#### Performance Metrics
- MAE: Mean Absolute Error
- RMSE: Root Mean Squared Error
- R² Score: Coefficient of determination

## Data Flow

### 1. Vehicle Setup Flow
```
User Input
    ↓
VehicleSetup Component
    ↓
Calculate Max Range (Fuel × Mileage)
    ↓
Save to localStorage
    ↓
Proceed to MapNavigation
```

### 2. Route Selection Flow
```
User Inputs Start & Destination
    ↓
MapNavigation Component
    ↓
POST /api/routes/predict
    ↓
Backend fetches from Google Maps API
    ↓
Backend calls ML service for predictions
    ↓
ML returns fuel consumption for each route
    ↓
Return combined data to frontend
    ↓
Display routes with predictions
    ↓
User selects route
```

### 3. Navigation Flow
```
FuelDashboard Initializes
    ↓
Load vehicle & route info from localStorage
    ↓
Simulate GPS updates (every 2 seconds)
    ↓
Update fuel consumption
    ↓
Update distance remaining
    ↓
Check if fuel < 2L
    ↓
If low fuel → Fetch nearby petrol stations
    ↓
Display petrol stations within range
    ↓
When distance = 0 → Complete navigation
```

### 4. Trip Summary Flow
```
Navigation Complete
    ↓
TripSummary loads localStorage data
    ↓
Calculate metrics
    ↓
Display summary
```

## External API Integration

### Google Maps Platform

**APIs Used:**
1. **Directions API**
   - Purpose: Get multiple routes between locations
   - Request: origin, destination, alternatives=true
   - Response: Routes with distance and duration

2. **Places API (Nearby Search)**
   - Purpose: Find nearby petrol stations
   - Request: location, radius, type=gas_station
   - Response: Place results with names and locations

**Authentication:** API Key in environment variable

## Database Considerations (Optional)

For production deployment with user management:
```
MongoDB Collections:
- users: User profiles and preferences
- vehicles: User vehicle configurations
- trips: Historical trip data
- predictions: ML model prediction logs
```

## Deployment Architecture

### Development
- All services run locally
- Vite dev server for hot reload
- nodemon for backend auto-restart

### Production (Docker)
```
Docker Compose Services:
1. frontend: Build and serve React app
2. backend: Express API server
3. ml-service: Python Flask prediction API
```

## Security Considerations

1. **API Keys**
   - Store in .env files
   - Never commit to repository
   - Use environment variables in production

2. **CORS**
   - Configure backend to accept frontend origin
   - Restrict API access

3. **Input Validation**
   - Validate coordinates
   - Validate vehicle data
   - Sanitize user inputs

4. **Rate Limiting**
   - Implement on backend APIs
   - Prevent abuse of ML endpoints

## Performance Optimization

1. **Frontend**
   - Code splitting with Vite
   - Lazy loading components
   - localStorage caching

2. **Backend**
   - Cache Google Maps responses
   - Cache ML model in memory
   - Connection pooling for APIs

3. **ML Model**
   - In-memory model loading
   - Batch prediction support
   - Async prediction processing

## Scalability

1. **Horizontal Scaling**
   - Load balancer for multiple backend instances
   - Separate ML service for predictions
   - CDN for static frontend assets

2. **Vertical Scaling**
   - Increase server resources
   - Database indexing
   - Query optimization

## Monitoring & Logging

Recommended tools:
- PM2 for Node.js process management
- Winston for logging
- Prometheus for metrics
- Grafana for visualization

## Future Enhancements

1. Real-time GPS integration
2. Traffic prediction
3. Advanced ML models
4. User authentication
5. Database persistence
6. Mobile app
7. Real-time collaboration
