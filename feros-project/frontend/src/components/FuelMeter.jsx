import React from 'react';

const FuelMeter = ({ fuelLeft, maxFuel, maxRange }) => {
  const percentage = (fuelLeft / maxFuel) * 100;
  
  return (
    <div className="fuel-meter">
      <h3>Fuel Level</h3>
      <div className="meter-bar">
        <div 
          className={`fuel-level ${percentage < 20 ? 'low' : percentage < 50 ? 'medium' : 'high'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p>{fuelLeft.toFixed(2)}L / {maxFuel}L</p>
      <p className="range-info">Range: {maxRange.toFixed(2)} km</p>
    </div>
  );
};

export default FuelMeter;
