import express from 'express';
import axios from 'axios';

const router = express.Router();

// Function to geocode a place using Nominatim
const geocodePlace = async (place) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: place,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'Feros-Fuel-App/1.0'
      }
    });
    if (response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
      };
    }
    throw new Error(`Could not geocode: ${place}`);
  } catch (error) {
    throw new Error(`Geocoding failed for ${place}: ${error.message}`);
  }
};

// Function to get route using OSRM
const getRoute = async (startCoords, destCoords) => {
  try {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${destCoords.lng},${destCoords.lat}`,
      {
        params: {
          overview: 'false',
          steps: 'false'
        }
      }
    );
    const route = response.data.routes[0];
    return {
      distance: route.distance / 1000, // meters to km
      duration: Math.round(route.duration / 60) // seconds to minutes
    };
  } catch (error) {
    throw new Error(`Routing failed: ${error.message}`);
  }
};

// Get routes and predict fuel consumption
router.post('/predict', async (req, res) => {
  try {
    const { start, destination, mileage } = req.body;

    // Geocode start and destination
    const startCoords = await geocodePlace(start);
    const destCoords = await geocodePlace(destination);

    // Get route using OSRM
    const routeData = await getRoute(startCoords, destCoords);

    // Check if distance is reasonable for a car trip (max 2000km)
    if (routeData.distance > 2000) {
      return res.status(400).json({
        error: 'Distance too long for car travel or invalid locations. Please check your start and destination.'
      });
    }

    // Simple fuel consumption prediction
    const fuelConsumption = routeData.distance / mileage;
    const avgSpeed = routeData.distance / (routeData.duration / 60);

    const routes = [{
      id: 0,
      distance: routeData.distance.toFixed(2),
      duration: routeData.duration,
      fuelConsumption: fuelConsumption.toFixed(2),
      avgSpeed: avgSpeed.toFixed(2),
      summary: `Route from ${start} to ${destination}`,
      startCoords: startCoords,
      destCoords: destCoords
    }];

    res.json({ routes });
  } catch (error) {
    console.error('Error predicting fuel:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
