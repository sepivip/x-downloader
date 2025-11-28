#!/bin/bash

# Twitter/X Video Downloader - Setup Script
# This script automates the setup process

set -e  # Exit on error

echo "🚀 Twitter/X Video Downloader - Setup Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js version...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed!${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}Node.js version is too old!${NC}"
    echo "Current version: $(node -v)"
    echo "Required version: 18+"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"
echo -e "${GREEN}✓ npm $(npm -v) detected${NC}"
echo ""

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Setup backend environment
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating backend .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Backend .env created${NC}"
else
    echo -e "${YELLOW}Backend .env already exists, skipping...${NC}"
fi
echo ""

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd ../frontend
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Setup frontend environment
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating frontend .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Frontend .env created${NC}"
else
    echo -e "${YELLOW}Frontend .env already exists, skipping...${NC}"
fi
echo ""

# Go back to root
cd ..

echo -e "${GREEN}=============================================="
echo "✅ Setup completed successfully!"
echo "=============================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start the application:"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo "2. Open your browser:"
echo -e "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "3. Test with a Twitter/X video URL!"
echo ""
echo "For more information, see:"
echo "  - README.md (full documentation)"
echo "  - QUICKSTART.md (quick start guide)"
echo "  - DEPLOYMENT.md (deployment options)"
echo ""
echo -e "${GREEN}Happy downloading! 🎉${NC}"
