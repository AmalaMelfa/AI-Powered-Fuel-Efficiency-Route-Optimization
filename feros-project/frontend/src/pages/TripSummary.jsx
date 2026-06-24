import { useState, useEffect } from 'react';

const TripSummary = ({ onRestart }) => {
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    try {
      const vehicleInfoStr   = localStorage.getItem('vehicleInfo');
      const selectedRouteStr = localStorage.getItem('selectedRoute');

      if (vehicleInfoStr && selectedRouteStr) {
        const v = JSON.parse(vehicleInfoStr);
        const r = JSON.parse(selectedRouteStr);

        const distance     = parseFloat(r.distance);
        const fuelConsumed = r.fuelConsumption
          ? parseFloat(r.fuelConsumption)
          : distance / parseFloat(v.mileage);
        const timeTaken    = parseInt(r.duration) || 0;
        const efficiency   = (distance / fuelConsumed).toFixed(1);

        // Fuel saved = difference between worst and best route fuel
        // Using 10% more as a proxy for the alternative route
        const fuelSaved = parseFloat((fuelConsumed * 0.1).toFixed(2));

        setTripData({
          vehicle: v.model,
          distance,
          fuelConsumed: parseFloat(fuelConsumed.toFixed(2)),
          timeTaken,
          efficiency,
          fuelSaved,
          initialFuel: parseFloat(v.fuel),
          fuelRemaining: parseFloat((parseFloat(v.fuel) - fuelConsumed).toFixed(2)),
        });
      }
    } catch (e) {
      console.error('TripSummary error:', e);
    }
  }, []);

  if (!tripData) {
    return (
      <div className="trip-summary card centered-card">
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Generating trip summary…</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: '🚗', label: 'Vehicle',           value: tripData.vehicle },
    { icon: '📍', label: 'Distance Travelled', value: `${tripData.distance} km` },
    { icon: '⛽', label: 'Fuel Consumed',      value: `${tripData.fuelConsumed} L` },
    { icon: '🛢️', label: 'Fuel Remaining',     value: `${tripData.fuelRemaining} L` },
    { icon: '⏱️', label: 'Time Taken',         value: `${tripData.timeTaken} min` },
    { icon: '🎯', label: 'Fuel Efficiency',    value: `${tripData.efficiency} km/L` },
    { icon: '💰', label: 'Fuel Saved',         value: `${tripData.fuelSaved} L`, highlight: true },
  ];

  return (
    <div className="trip-summary card centered-card">
      <div className="summary-header">
        <div className="summary-icon">🎉</div>
        <div className="summary-title">Trip Completed!</div>
        <div className="summary-message">Great job choosing the fuel-efficient route</div>
      </div>

      <div className="summary-content">
        <div className="summary-grid">
          {stats.map(({ icon, label, value, highlight }) => (
            <div key={label} className={`summary-item ${highlight ? 'highlight' : ''}`}>
              <div className="summary-label">{icon} {label}</div>
              <div className="summary-value">{value}</div>
            </div>
          ))}
        </div>

        <div className="summary-actions">
          <button
            className="btn btn-primary"
            onClick={() => { localStorage.removeItem('selectedRoute'); onRestart(); }}
          >
            🗺️ New Trip
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => { localStorage.clear(); window.location.reload(); }}
          >
            🔄 Back to Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
