import { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';

const FuelDashboard = ({ onComplete }) => {
  console.log('FuelDashboard rendered, onComplete:', typeof onComplete);
  
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [fuelLeft, setFuelLeft] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState(0);
  const [initialDistance, setInitialDistance] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [isNavigating, setIsNavigating] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [petrolStations, setPetrolStations] = useState([]);
  const [showLowFuelAlert, setShowLowFuelAlert] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    console.log('FuelDashboard useEffect running');
    try {
      const vehicle = localStorage.getItem('vehicleInfo');
      const route = localStorage.getItem('selectedRoute');

      console.log('Raw vehicleInfo:', vehicle);
      console.log('Raw selectedRoute:', route);

      if (vehicle) {
        const vehicleData = JSON.parse(vehicle);
        console.log('Parsed vehicleData:', vehicleData);
        setVehicleInfo(vehicleData);
        setFuelLeft(parseFloat(vehicleData.fuel));
      } else {
        console.error('No vehicle info in localStorage');
      }

      if (route) {
        const routeData = JSON.parse(route);
        console.log('Parsed routeData:', routeData);
        setSelectedRoute(routeData);
        const distance = parseFloat(routeData.distance);
        setInitialDistance(distance);
        setDistanceRemaining(distance);
        
        // Calculate initial estimated time based on average speed
        const avgSpeed = routeData.avgSpeed ? parseFloat(routeData.avgSpeed) : 40;
        const timeInMinutes = (distance / avgSpeed) * 60;
        setEstimatedTime(Math.ceil(timeInMinutes));
      } else {
        console.error('No route info in localStorage');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Get user's real-time location
  useEffect(() => {
    if (!isNavigating || !selectedRoute) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setCurrentLocation(newLocation);
        console.log('Current location:', latitude, longitude);

        // Calculate distance remaining to destination
        if (selectedRoute.destCoords) {
          const remaining = calculateDistance(
            latitude, longitude,
            selectedRoute.destCoords.lat, selectedRoute.destCoords.lng
          );
          setDistanceRemaining(remaining);

          // Calculate distance traveled since last update
          if (lastLocation) {
            const traveled = calculateDistance(
              lastLocation.lat, lastLocation.lng,
              latitude, longitude
            );
            setDistanceTraveled(prev => prev + traveled);

            // Update fuel consumption based on actual distance traveled
            setFuelLeft(currentFuel => Math.max(0, currentFuel - traveled / vehicleInfo.mileage));
          }

          setLastLocation(newLocation);

          // Update estimated time
          const avgSpeed = selectedRoute.avgSpeed ? parseFloat(selectedRoute.avgSpeed) : 40;
          const timeInMinutes = (remaining / avgSpeed) * 60;
          setEstimatedTime(Math.ceil(timeInMinutes));

          // Check if arrived (within 0.5km of destination)
          if (remaining <= 0.5) {
            setIsNavigating(false);
            setTimeout(() => {
              console.log('Trip completed based on GPS');
              if (onComplete) onComplete();
            }, 1500);
          }
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to simulated location for demo
        if (!currentLocation) {
          setCurrentLocation({ lat: 28.6139, lng: 77.2090 });
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 2000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isNavigating, selectedRoute, lastLocation, vehicleInfo, onComplete]);

  // Fetch nearby petrol stations when fuel is low
  useEffect(() => {
    if (currentLocation && vehicleInfo && fuelLeft < vehicleInfo.fuel * 0.3) {
      setShowLowFuelAlert(true);
      fetchNearbyPetrolStations();
    }
  }, [currentLocation, fuelLeft, vehicleInfo]);

  const fetchNearbyPetrolStations = async () => {
    if (!currentLocation) return;
    
    try {
      const response = await fetch(
        `/api/maps/nearby-petrol-stations?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=5000`
      );
      const data = await response.json();
      setPetrolStations(data.stations || []);
    } catch (error) {
      console.error('Error fetching petrol stations:', error);
    }
  };

  console.log('Render state:', { vehicleInfo, selectedRoute });

  if (!vehicleInfo || !selectedRoute) {
    return (
      <div className="fuel-dashboard card centered-card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading navigation data...</p>
        </div>
      </div>
    );
  }

  const currentMaxRange = fuelLeft * vehicleInfo.mileage;
  const fuelPercentage = (fuelLeft / vehicleInfo.fuel) * 100;
  const progressPercentage = initialDistance > 0 ? (distanceTraveled / initialDistance) * 100 : 0;

  return (
    <div className="fuel-dashboard card centered-card">
      <div className="page-header">
        <h1 className="page-title">🚗 Live Navigation</h1>
        <p className="page-subtitle">Real-time fuel monitoring & route guidance</p>
      </div>

      {/* Map Section */}
      {currentLocation && (
        <div className="map-section">
          <MapComponent 
            currentLocation={currentLocation}
            petrolStations={petrolStations}
            showStations={showLowFuelAlert}
          />
        </div>
      )}

      {/* Low Fuel Alert */}
      {showLowFuelAlert && petrolStations.length > 0 && (
        <div className="low-fuel-alert">
          <div className="alert-header">
            <span className="alert-icon">⚠️</span>
            <span className="alert-title">Low Fuel Alert</span>
          </div>
          <p className="alert-message">
            {petrolStations.length} petrol station{petrolStations.length > 1 ? 's' : ''} nearby
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="trip-progress">
        <div className="progress-info">
          <span className="progress-label">Trip Progress</span>
          <span className="progress-percentage">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-details">
          <span>📏 Traveled: {distanceTraveled.toFixed(1)} km</span>
          <span>📍 Remaining: {distanceRemaining.toFixed(1)} km</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📍</div>
          <div className="metric-content">
            <div className="metric-value">{distanceRemaining.toFixed(1)} km</div>
            <div className="metric-label">Distance Left</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⛽</div>
          <div className="metric-content">
            <div className="metric-value">{fuelLeft.toFixed(1)} L</div>
            <div className="metric-label">Fuel Remaining</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">{estimatedTime} min</div>
            <div className="metric-label">Est. Time</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{currentMaxRange.toFixed(0)} km</div>
            <div className="metric-label">Max Range</div>
          </div>
        </div>
      </div>

      {/* Fuel Gauge */}
      <div className="fuel-gauge-section">
        <h3 className="section-title">Fuel Level</h3>
        <div className="fuel-gauge">
          <div className="gauge-bar">
            <div 
              className={`gauge-fill ${fuelPercentage > 50 ? 'high' : fuelPercentage > 25 ? 'medium' : 'low'}`}
              style={{ width: `${fuelPercentage}%` }}
            >
              <span className="gauge-text">{fuelPercentage.toFixed(0)}%</span>
            </div>
          </div>
          <div className="gauge-labels">
            <span>Empty</span>
            <span>Full</span>
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="route-info-card">
        <div className="route-info-header">
          <span className="route-badge">Active Route</span>
        </div>
        <div className="route-info-details">
          <div className="route-detail">
            <span className="detail-label">Total Distance:</span>
            <span className="detail-value">{selectedRoute.distance} km</span>
          </div>
          <div className="route-detail">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{selectedRoute.duration} min</span>
          </div>
          <div className="route-detail">
            <span className="detail-label">Avg Speed:</span>
            <span className="detail-value">{selectedRoute.avgSpeed || 'N/A'} km/h</span>
          </div>
        </div>
      </div>

      {/* Petrol Stations List */}
      {showLowFuelAlert && petrolStations.length > 0 && (
        <div className="petrol-stations-list">
          <h3 className="section-title">Nearby Petrol Stations</h3>
          <div className="stations-grid">
            {petrolStations.slice(0, 3).map((station, idx) => (
              <div key={idx} className="station-card">
                <div className="station-icon">⛽</div>
                <div className="station-info">
                  <div className="station-name">{station.name}</div>
                  <div className="station-distance">{station.distance.toFixed(1)} km away</div>
                </div>
                <div className={`station-status ${station.isOpen ? 'open' : 'closed'}`}>
                  {station.isOpen ? '🟢 Open' : '🔴 Closed'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => {
          console.log('End Navigation clicked, calling onComplete');
          setIsNavigating(false);
          if (onComplete) {
            onComplete();
          }
        }}
        className="btn btn-primary"
        style={{ width: '100%', marginTop: 'var(--space-6)' }}
      >
        {distanceRemaining <= 0 ? '🎉 Trip Completed!' : '⏹️ End Navigation'}
      </button>
    </div>
  );
};

export default FuelDashboard;
