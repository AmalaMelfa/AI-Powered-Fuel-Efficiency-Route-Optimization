import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fuelPredictionRoutes from './routes/fuelPrediction.js';
import mapsRoutes from './routes/mapsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/routes', fuelPredictionRoutes);
app.use('/api/maps', mapsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Feros backend is running' });
});

app.listen(PORT, () => {
  console.log(`Feros backend running on http://localhost:${PORT}`);
});
