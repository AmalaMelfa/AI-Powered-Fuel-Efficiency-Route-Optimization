import React from 'react';

const PetrolStations = ({ stations, maxRange }) => {
  const reachableStations = stations?.filter(station => station.distance <= maxRange) || [];
  const nearest = reachableStations.length > 0 ? reachableStations[0] : null;

  return (
    <div className="petrol-stations">
      <h3>⛽ Nearby Petrol Stations</h3>
      
      {nearest && (
        <div className="nearest-station">
          <h4>Nearest Reachable Station</h4>
          <p className="station-name">{nearest.name}</p>
          <p className="station-distance">{nearest.distance.toFixed(2)} km away</p>
          <p className="station-status">{nearest.isOpen ? '🟢 Open' : '🔴 Closed'}</p>
        </div>
      )}

      <div className="stations-list">
        {reachableStations.map((station, idx) => (
          <div key={idx} className={`station-item ${station === nearest ? 'highlighted' : ''}`}>
            <span className="station-name">{station.name}</span>
            <span className="station-distance">{station.distance.toFixed(2)} km</span>
          </div>
        ))}
      </div>

      {reachableStations.length === 0 && (
        <p className="no-stations">No petrol stations within current range</p>
      )}
    </div>
  );
};

export default PetrolStations;
