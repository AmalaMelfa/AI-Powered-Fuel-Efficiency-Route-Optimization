import express from 'express';
import axios from 'axios';

const router = express.Router();
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';

// Get nearby petrol stations
router.get('/nearby-petrol-stations', async (req, res) => {
  try {
    const { lat = 28.6139, lng = 77.2090, radius = 5000 } = req.query; // Default to Delhi

    // Check if API key is set
    if (GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY' || GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
      // Return mock data for testing
      const mockStations = [
        { name: 'Mock Petrol Station 1', distance: 1.2, lat: parseFloat(lat) + 0.01, lng: parseFloat(lng) + 0.01, isOpen: true },
        { name: 'Mock Petrol Station 2', distance: 2.5, lat: parseFloat(lat) - 0.01, lng: parseFloat(lng) - 0.01, isOpen: false },
        { name: 'Mock Petrol Station 3', distance: 3.1, lat: parseFloat(lat) + 0.02, lng: parseFloat(lng) - 0.01, isOpen: true }
      ];
      return res.json({ stations: mockStations });
    }

    const placesResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lng}`,
          radius: radius,
          type: 'gas_station',
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    // Function to calculate Haversine distance
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

    const stations = placesResponse.data.results.map(place => ({
      name: place.name,
      distance: calculateDistance(parseFloat(lat), parseFloat(lng), place.geometry.location.lat, place.geometry.location.lng),
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      isOpen: place.opening_hours?.open_now
    }));

    res.json({ stations });
  } catch (error) {
    console.error('Error fetching petrol stations:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
