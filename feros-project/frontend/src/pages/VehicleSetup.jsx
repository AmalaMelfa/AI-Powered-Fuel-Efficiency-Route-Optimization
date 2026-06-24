import { useState, useEffect } from 'react';

const VehicleSetup = ({ onNext }) => {
  const [vehicleModel, setVehicleModel] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelAmount, setFuelAmount] = useState('');
  const [maxRange, setMaxRange] = useState(0);

  // Don't load from localStorage - always start fresh

  const handleMileageChange = (e) => {
    const value = e.target.value;
    setMileage(value);
    if (value && fuelAmount) {
      setMaxRange(parseFloat(value) * parseFloat(fuelAmount));
    }
  };

  const handleFuelChange = (e) => {
    const value = e.target.value;
    setFuelAmount(value);
    if (mileage && value) {
      setMaxRange(parseFloat(mileage) * parseFloat(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleModel || !mileage || !fuelAmount) {
      alert('Please fill in all vehicle details');
      return;
    }

    const mileageNum = parseFloat(mileage);
    const fuelNum = parseFloat(fuelAmount);

    if (mileageNum <= 0 || fuelNum <= 0) {
      alert('Please enter valid positive values');
      return;
    }

    localStorage.setItem('vehicleInfo', JSON.stringify({
      model: vehicleModel,
      mileage: mileageNum,
      fuel: fuelNum,
      maxRange: mileageNum * fuelNum
    }));
    onNext();
  };

  return (
    <div className="vehicle-setup card">
      <div className="page-header">
        <h1 className="page-title">Feros</h1>
        <p className="page-subtitle">Fuel Efficient Route Navigation</p>
      </div>

      <form className="vehicle-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="vehicle-model">Vehicle Model</label>
          <input
            id="vehicle-model"
            type="text"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            className="input"
            placeholder="e.g., Toyota Camry, Honda Civic"
            required
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="mileage">Mileage (km/L)</label>
          <div className="fuel-input-container">
            <input
              id="mileage"
              type="number"
              step="0.1"
              min="1"
              max="50"
              value={mileage}
              onChange={handleMileageChange}
              className="input fuel-input"
              placeholder="Enter mileage"
              required
            />
            <span className="fuel-unit">km/L</span>
          </div>
        </div>

        <div className="form-group">
          <label className="label" htmlFor="fuel">Fuel in Tank (Liters)</label>
          <div className="fuel-input-container">
            <input
              id="fuel"
              type="number"
              step="0.1"
              min="0"
              value={fuelAmount}
              onChange={handleFuelChange}
              className="input fuel-input"
              placeholder="Enter fuel amount"
              required
            />
            <span className="fuel-unit">L</span>
          </div>
        </div>

        {maxRange > 0 && (
          <div className="range-display">
            <div className="range-value">{maxRange.toFixed(1)} km</div>
            <div className="range-label">Maximum Travel Distance</div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: 'var(--space-4)' }}
        >
          Continue to Navigation →
        </button>
      </form>
    </div>
  );
};

export default VehicleSetup;
