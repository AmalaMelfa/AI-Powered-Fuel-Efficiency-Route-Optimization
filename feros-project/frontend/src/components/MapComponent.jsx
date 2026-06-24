import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const currentLocationIcon = createCustomIcon('#4285F4', '📍');
const petrolStationOpenIcon = createCustomIcon('#10b981', '⛽');
const petrolStationClosedIcon = createCustomIcon('#ef4444', '⛽');

// Component to update map center when location changes
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

const MapComponent = ({ currentLocation, petrolStations = [], showStations = false }) => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  // Default center (Delhi) if no location
  const center = currentLocation || { lat: 28.6139, lng: 77.2090 };

  // Handle routing
  useEffect(() => {
    if (mapRef.current && currentLocation && selectedDestination) {
      const map = mapRef.current;

      // Remove existing routing control
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      // Create new routing control
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(currentLocation.lat, currentLocation.lng),
          L.latLng(selectedDestination.lat, selectedDestination.lng)
        ],
        routeWhileDragging: true,
        createMarker: () => null, // Don't create default markers
        lineOptions: {
          styles: [{ color: '#2563eb', weight: 6, opacity: 0.8 }]
        },
        show: false, // Hide the instruction panel
        addWaypoints: false,
        draggableWaypoints: false
      }).addTo(map);

      routingControlRef.current = routingControl;

      // Listen for route found event
      routingControl.on('routesfound', (e) => {
        const routes = e.routes;
        const route = routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2); // km
        const time = Math.round(route.summary.totalTime / 60); // minutes
        setRouteInfo({ distance, time });
      });
    } else if (routingControlRef.current) {
      // Remove routing if no destination
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
      setRouteInfo(null);
    }
  }, [currentLocation, selectedDestination]);

  // Handle station click
  const handleStationClick = (station) => {
    setSelectedDestination(station);
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        style={{ height: '60vh', width: '100%', borderRadius: '12px', minHeight: '400px' }}
        ref={mapRef}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Update map center when location changes */}
        <MapUpdater center={currentLocation ? [currentLocation.lat, currentLocation.lng] : null} />

        {/* Current Location Marker */}
        {currentLocation && (
          <Marker 
            position={[currentLocation.lat, currentLocation.lng]} 
            icon={currentLocationIcon}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>📍 Your Location</strong>
                <br />
                <small>
                  Lat: {currentLocation.lat.toFixed(4)}
                  <br />
                  Lng: {currentLocation.lng.toFixed(4)}
                </small>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Petrol Station Markers */}
        {showStations && petrolStations.map((station, idx) => (
          <Marker
            key={idx}
            position={[station.lat, station.lng]}
            icon={station.isOpen ? petrolStationOpenIcon : petrolStationClosedIcon}
            eventHandlers={{
              click: () => handleStationClick(station),
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
                  {station.name}
                </h3>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>
                  📏 Distance: {station.distance.toFixed(2)} km
                </p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>
                  {station.isOpen ? '🟢 Open' : '🔴 Closed'}
                </p>
                <button
                  onClick={() => handleStationClick(station)}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginTop: '8px'
                  }}
                >
                  Navigate Here
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Info */}
      <div className="map-info">
        <div className="map-info-item">
          <span className="map-info-icon">📍</span>
          <span className="map-info-text">
            {currentLocation 
              ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
              : 'Getting location...'}
          </span>
        </div>
        {selectedDestination && routeInfo && (
          <div className="map-info-item">
            <span className="map-info-icon">🛣️</span>
            <span className="map-info-text">
              {routeInfo.distance} km • {routeInfo.time} min
            </span>
          </div>
        )}
        {showStations && petrolStations.length > 0 && (
          <div className="map-info-item">
            <span className="map-info-icon">⛽</span>
            <span className="map-info-text">
              {petrolStations.length} station{petrolStations.length > 1 ? 's' : ''} nearby
            </span>
          </div>
        )}
        {selectedDestination && (
          <button
            onClick={() => setSelectedDestination(null)}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear Route
          </button>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
