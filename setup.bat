@echo off
REM Twitter/X Video Downloader - Setup Script for Windows
REM This script automates the setup process

echo.
echo ======================================
echo Twitter/X Video Downloader - Setup
echo ======================================
echo.

REM Check Node.js
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

node --version
npm --version
echo [OK] Node.js and npm detected
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend directory not found!
    pause
    exit /b 1
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies!
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

REM Setup backend environment
if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env
    echo [OK] Backend .env created
) else (
    echo [INFO] Backend .env already exists, skipping...
)
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend directory not found!
    pause
    exit /b 1
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies!
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

REM Setup frontend environment
if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env
    echo [OK] Frontend .env created
) else (
    echo [INFO] Frontend .env already exists, skipping...
)
echo.

REM Go back to root
cd ..

echo.
echo ======================================
echo Setup completed successfully!
echo ======================================
echo.
echo Next steps:
echo.
echo 1. Start the application:
echo    npm run dev
echo.
echo 2. Open your browser:
echo    http://localhost:3000
echo.
echo 3. Test with a Twitter/X video URL!
echo.
echo For more information, see:
echo   - README.md (full documentation)
echo   - QUICKSTART.md (quick start guide)
echo   - DEPLOYMENT.md (deployment options)
echo.
echo Happy downloading!
echo.
pause
