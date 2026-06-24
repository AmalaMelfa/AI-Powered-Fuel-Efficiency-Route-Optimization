# Feros – Quick Reference Guide

## 🚀 Project Setup (5 minutes)

### Windows
```bash
cd c:\Users\kisho\OneDrive\Desktop\AI-PROJECT\feros-project
setup.bat
```

### Mac/Linux
```bash
cd ~/Desktop/AI-PROJECT/feros-project
chmod +x setup.sh
./setup.sh
```

## 📦 Start Development (3 terminals)

### Terminal 1 - Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

### Terminal 2 - Backend (Port 5000)
```bash
cd backend
cp .env.example .env
# Edit .env and add Google Maps API key
npm run dev
```

### Terminal 3 - ML Model (Port 5001)
```bash
cd ml-model
python train_model.py  # First time only
python predict_fuel.py
```

## 🌐 Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **ML API:** http://localhost:5001

## 📋 Project Structure

```
feros-project/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── pages/        # VehicleSetup, MapNav, etc.
│   │   ├── components/   # MapComponent, FuelMeter, etc.
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/               # Express.js
│   ├── routes/
│   │   ├── fuelPrediction.js
│   │   └── mapsRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── ml-model/              # Python ML
│   ├── train_model.py
│   ├── predict_fuel.py
│   └── requirements.txt
│
├── dataset/
│   └── fuel_consumption_dataset.csv
│
└── Documentation
    ├── README.md
    ├── GETTING_STARTED.md
    ├── ARCHITECTURE.md
    └── This file
```

## 🔑 Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable APIs:
   - Maps Directions API
   - Places API
4. Create API Key (Credentials)
5. Add to `backend/.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_key_here
   PORT=5000
   ```

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Complete project overview |
| **GETTING_STARTED.md** | Detailed setup & usage guide |
| **ARCHITECTURE.md** | System design & data flow |
| **This file** | Quick reference |

## 🎯 Key Features

✅ Vehicle setup with mileage lookup
✅ Google Maps integration for routes
✅ AI/ML fuel consumption prediction
✅ Real-time navigation dashboard
✅ Smart petrol station detection
✅ Trip summary and statistics
✅ localStorage persistence
✅ Responsive design
✅ Docker ready
✅ Production builds

## 🔧 Common Commands

### Build Frontend
```bash
cd frontend
npm run build
```

### Production Preview
```bash
cd frontend
npm run preview
```

### Train ML Model
```bash
cd ml-model
python train_model.py
```

### Run with Docker
```bash
docker-compose up
```

## 🎨 UI Theme

- **Primary Color:** #007BFF (Blue)
- **Success:** #28a745 (Green)
- **Warning:** #ffc107 (Yellow)
- **Danger:** #dc3545 (Red)
- **Modern responsive design**
- **Mobile-friendly**

## 📊 Vehicle Models

| Model | Mileage |
|-------|---------|
| Swift | 22 km/L |
| i20 | 20 km/L |
| Creta | 17 km/L |
| Nexon | 21 km/L |

Add more in `VehicleSetup.jsx`

## 🤖 ML Model Details

- **Algorithm:** Random Forest Regression
- **Features:** distance, speed, traffic, road type, mileage
- **Output:** Fuel consumption (liters)
- **Dataset:** CSV in `dataset/`

## 🔌 API Endpoints

### Routes
```
POST /api/routes/predict
Body: { start, destination, mileage }
```

### Petrol Stations  
```
GET /api/maps/nearby-petrol-stations
Params: lat, lng, radius
```

### ML Prediction
```
POST http://localhost:5001/predict
Body: { distance, average_speed, traffic_level, road_type_encoded, vehicle_mileage }
```

## 🚨 Troubleshooting

**Port already in use?**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

**NPM issues?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Python issues?**
```bash
pip install --upgrade scikit-learn pandas numpy
```

## 💾 Git Commands

```bash
cd feros-project
git init
git add .
git commit -m "Initial Feros project setup"
git remote add origin <your-repo>
git push -u origin main
```

## 📱 Future Enhancements

- [ ] Real-time GPS integration
- [ ] Traffic prediction
- [ ] User authentication
- [ ] Database persistence
- [ ] Mobile app
- [ ] Advanced ML models
- [ ] Fuel price comparison

## 🎓 Learning Resources

The project demonstrates:
- React hooks and state management
- Vite module bundling
- Express.js REST APIs
- Python ML/scikit-learn
- Google Maps API integration
- Docker containerization
- Component-based architecture

## ⚡ Performance Tips

1. **Frontend:** Uses Vite for fast development
2. **Backend:** Implements API caching
3. **ML:** Model loaded in memory
4. **Storage:** localStorage for persistence

## 📞 Support

For issues:
1. Check GETTING_STARTED.md
2. Review ARCHITECTURE.md
3. Check console logs
4. Verify Google Maps API

## 🎉 You're All Set!

The project is ready to use. Start with the **Start Development** section above.

```
Happy Coding! 🚗⛽🚀
```
