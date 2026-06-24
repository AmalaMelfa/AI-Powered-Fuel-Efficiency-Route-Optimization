import { useState, useEffect } from 'react';
import axios from 'axios';

const MapNavigation = ({ onNext }) => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('vehicleInfo');
    if (saved) {
      setVehicleInfo(JSON.parse(saved));
    }
  }, []);

  const handleGetRoutes = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/routes/predict', {
        start,
        destination,
        mileage: vehicleInfo.mileage,
      });
      setRoutes(response.data.routes);
    } catch (error) {
      console.error('Error fetching routes:', error);
      alert('Failed to fetch routes. Please check your input and try again.');
    }
    setLoading(false);
  };

  const handleSelectRoute = (route) => {
    console.log('Selecting route:', route);
    setSelectedRoute(route);
    localStorage.setItem('selectedRoute', JSON.stringify(route));
    console.log('Route saved to localStorage, calling onNext');
    onNext();
  };

  return (
    <div className="map-navigation card">
      <div className="page-header">
        <h1 className="page-title">Route Navigation</h1>
        <p className="page-subtitle">Find the most fuel-efficient route for your journey</p>
      </div>

      <form className="nav-form" onSubmit={handleGetRoutes}>
        <div className="location-inputs">
          <div className="form-group">
            <label className="label" htmlFor="start">Starting Point</label>
            <input
              id="start"
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="input"
              placeholder="Enter start location"
              required
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="destination">Destination</label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input"
              placeholder="Enter destination"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', padding: 'var(--space-4)' }}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Finding Routes...
            </>
          ) : (
            <>
              🔍 Find Routes
            </>
          )}
        </button>
      </form>

      {routes.length > 0 && (
        <div className="routes-section">
          <div className="routes-header">
            <h2 className="routes-title">Available Routes</h2>
            <span className="routes-count">{routes.length} routes found</span>
          </div>

          <div className="routes-list">
            {routes.map((route, idx) => (
              <div
                key={idx}
                className={`route-card ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                onClick={() => handleSelectRoute(route)}
              >
                <div className="route-header">
                  <h3 className="route-title">Route {String.fromCharCode(65 + idx)}</h3>
                  <span className="route-badge">Recommended</span>
                </div>

                <div className="route-metrics">
                  <div className="metric">
                    <span className="metric-value">{route.distance} km</span>
                    <span className="metric-label">Distance</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{route.duration} min</span>
                    <span className="metric-label">Time</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value fuel-highlight">
                      {route.fuelConsumption ? parseFloat(route.fuelConsumption).toFixed(1) : 'N/A'} L
                    </span>
                    <span className="metric-label">Fuel Used</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{route.avgSpeed || 'N/A'} km/h</span>
                    <span className="metric-label">Avg Speed</span>
                  </div>
                </div>

                <button 
                  className="btn btn-success route-select-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRoute(route);
                  }}
                >
                  Select This Route →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapNavigation;
