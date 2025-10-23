@echo off
REM Setup script for English AI Teacher Frontend on Windows

echo.
echo ========================================
echo English AI Teacher - Frontend Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Node.js version:
node --version

echo.
echo [2/3] Installing dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Build check...
npm run build
if errorlevel 1 (
    echo WARNING: Build failed, but dependencies are installed
    echo You can still run the dev server
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the frontend dev server, run:
echo   npm run dev
echo.
echo To build for production, run:
echo   npm run build
echo.
pause

