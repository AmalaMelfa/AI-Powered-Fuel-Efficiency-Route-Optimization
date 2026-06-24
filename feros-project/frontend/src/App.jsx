import { useState, useEffect } from 'react';
import VehicleSetup  from './pages/VehicleSetup.jsx';
import MapNavigation from './pages/MapNavigation.jsx';
import FuelDashboard from './pages/FuelDashboard.jsx';
import TripSummary   from './pages/TripSummary.jsx';

const steps = [
  { id: 'setup',     title: 'Vehicle Setup',  icon: '🚗' },
  { id: 'map',       title: 'Route Planning', icon: '🗺️' },
  { id: 'dashboard', title: 'Navigation',     icon: '📍' },
  { id: 'summary',   title: 'Trip Summary',   icon: '🎉' },
];

function App() {
  const [currentPage, setCurrentPage] = useState('setup');

  // Clear data on every real page refresh; keep it during in-app navigation
  useEffect(() => {
    const fresh = !sessionStorage.getItem('appInit');
    if (fresh) {
      localStorage.removeItem('vehicleInfo');
      localStorage.removeItem('selectedRoute');
      sessionStorage.setItem('appInit', '1');
    }
    const clear = () => sessionStorage.removeItem('appInit');
    window.addEventListener('beforeunload', clear);
    return () => window.removeEventListener('beforeunload', clear);
  }, []);

  const currentIndex = steps.findIndex(s => s.id === currentPage);

  const ProgressBar = () => (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
      <div className="progress-steps">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`progress-step ${i <= currentIndex ? 'completed' : ''} ${i === currentIndex ? 'active' : ''}`}
          >
            <div className="step-icon">{step.icon}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">Feros</h1>
        <p className="app-subtitle">Fuel Efficient Route Navigation System</p>
      </div>

      <ProgressBar />

      <div className="page-container">
        {currentPage === 'setup'     && <VehicleSetup  onNext={()    => setCurrentPage('map')} />}
        {currentPage === 'map'       && <MapNavigation onNext={()    => setCurrentPage('dashboard')} />}
        {currentPage === 'dashboard' && <FuelDashboard onComplete={() => setCurrentPage('summary')} />}
        {currentPage === 'summary'   && <TripSummary   onRestart={()  => setCurrentPage('map')} />}
      </div>
    </div>
  );
}

export default App;
