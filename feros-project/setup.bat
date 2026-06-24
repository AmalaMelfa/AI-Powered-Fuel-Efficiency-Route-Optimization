@echo off
REM Feros Development Setup Script for Windows
REM This script sets up the entire project for development

echo.
echo Starting Feros Setup...
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo [OK] Python found: %PYTHON_VERSION%

REM Create directories
echo.
echo Creating project structure...
if not exist frontend\src\pages mkdir frontend\src\pages
if not exist frontend\src\components mkdir frontend\src\components
if not exist backend\routes mkdir backend\routes
if not exist ml-model mkdir ml-model
if not exist dataset mkdir dataset
echo [OK] Project structure created

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo [OK] Frontend dependencies installed

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo [OK] Backend dependencies installed

REM Install Python dependencies
echo.
echo Installing ML dependencies...
cd ml-model
pip install -r requirements.txt
cd ..
echo [OK] ML dependencies installed

REM Create .env file
if not exist backend\.env (
    echo.
    echo Creating .env file...
    copy backend\.env.example backend\.env
    echo WARNING: Please edit backend\.env and add your Google Maps API key
)

echo.
echo [SUCCESS] Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env and add your Google Maps API key
echo 2. Run the development servers:
echo    - Terminal 1: cd frontend ^&^& npm run dev
echo    - Terminal 2: cd backend ^&^& npm run dev
echo    - Terminal 3: cd ml-model ^&^& python predict_fuel.py
echo 3. Train the ML model: cd ml-model ^&^& python train_model.py
echo 4. Open http://localhost:5173 in your browser
echo.
pause
