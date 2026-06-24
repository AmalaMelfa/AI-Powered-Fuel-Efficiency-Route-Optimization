#!/bin/bash

# Feros Development Setup Script
# This script sets up the entire project for development

echo "🚀 Setting up Feros - Fuel Efficient Route Navigation System"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi
echo "✅ Python found: $(python3 --version)"

# Create directories if they don't exist
echo ""
echo "📁 Creating project structure..."
mkdir -p frontend/src/{pages,components}
mkdir -p backend/routes
mkdir -p ml-model
mkdir -p dataset

echo "✅ Project structure created"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..
echo "✅ Backend dependencies installed"

# Install Python dependencies
echo ""
echo "📦 Installing ML dependencies..."
cd ml-model
pip install -r requirements.txt
cd ..
echo "✅ ML dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your Google Maps API key"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your Google Maps API key"
echo "2. Run the development servers:"
echo "   - Terminal 1: cd frontend && npm run dev"
echo "   - Terminal 2: cd backend && npm run dev"
echo "   - Terminal 3: cd ml-model && python predict_fuel.py"
echo "3. Train the ML model: cd ml-model && python train_model.py"
echo "4. Open http://localhost:5173 in your browser"
