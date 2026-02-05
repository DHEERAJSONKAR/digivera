#!/bin/bash

# DIGIVERA - Quick Test Script
# This script will verify all components are working

echo "🚀 DIGIVERA - System Check"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Installed${NC} ($NODE_VERSION)"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ Installed${NC} (v$NPM_VERSION)"
else
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi

echo ""
echo "📦 Checking Dependencies"
echo "================================"

# Check server dependencies
echo -n "Backend dependencies... "
if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Not found${NC}"
    echo "Run: cd server && npm install"
fi

# Check client dependencies
echo -n "Frontend dependencies... "
if [ -d "client/node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Not found${NC}"
    echo "Run: cd client && npm install"
fi

# Check Heroicons
echo -n "Heroicons package... "
if [ -d "client/node_modules/@heroicons" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Not found${NC}"
    echo "Run: cd client && npm install @heroicons/react"
fi

echo ""
echo "⚙️  Checking Configuration"
echo "================================"

# Check server .env
echo -n "Server .env file... "
if [ -f "server/.env" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    
    # Check MongoDB URI
    if grep -q "MONGO_URI=" server/.env; then
        echo -e "  ${GREEN}✓${NC} MongoDB URI configured"
    else
        echo -e "  ${RED}✗${NC} MongoDB URI missing"
    fi
    
    # Check JWT Secret
    if grep -q "JWT_SECRET=" server/.env; then
        echo -e "  ${GREEN}✓${NC} JWT Secret configured"
    else
        echo -e "  ${RED}✗${NC} JWT Secret missing"
    fi
    
    # Check Razorpay
    if grep -q "RAZORPAY_KEY_ID=" server/.env; then
        echo -e "  ${GREEN}✓${NC} Razorpay configured"
    else
        echo -e "  ${YELLOW}⚠${NC} Razorpay not configured"
    fi
    
    # Check Stripe
    if grep -q "STRIPE_SECRET_KEY=" server/.env; then
        echo -e "  ${GREEN}✓${NC} Stripe configured"
    else
        echo -e "  ${YELLOW}⚠${NC} Stripe not configured"
    fi
else
    echo -e "${RED}✗ Not found${NC}"
    echo "Create server/.env with required variables"
fi

# Check client .env
echo -n "Client .env file... "
if [ -f "client/.env" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    
    # Check API URL
    if grep -q "VITE_API_URL=" client/.env; then
        echo -e "  ${GREEN}✓${NC} API URL configured"
    else
        echo -e "  ${RED}✗${NC} API URL missing"
    fi
    
    # Check Google Client ID
    if grep -q "VITE_GOOGLE_CLIENT_ID=" client/.env; then
        echo -e "  ${GREEN}✓${NC} Google Client ID configured"
    else
        echo -e "  ${YELLOW}⚠${NC} Google Client ID not configured"
    fi
else
    echo -e "${RED}✗ Not found${NC}"
    echo "Create client/.env with VITE_API_URL"
fi

echo ""
echo "📄 Checking Files"
echo "================================"

# Check key files
FILES=(
    "server/server.js"
    "server/src/app.js"
    "server/src/models/User.js"
    "server/src/models/Scan.js"
    "server/src/models/Alert.js"
    "server/src/models/Subscription.js"
    "client/src/App.jsx"
    "client/src/main.jsx"
    "client/src/pages/Dashboard.jsx"
    "client/src/pages/Scan.jsx"
    "client/src/pages/Alerts.jsx"
    "client/src/pages/History.jsx"
    "client/src/pages/Profile.jsx"
    "client/src/pages/Subscription.jsx"
    "client/src/pages/LandingPage.jsx"
)

MISSING_FILES=0
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file"
        ((MISSING_FILES++))
    fi
done

echo ""
echo "📊 Summary"
echo "================================"

if [ $MISSING_FILES -eq 0 ]; then
    echo -e "${GREEN}✓ All files present${NC}"
else
    echo -e "${RED}✗ $MISSING_FILES files missing${NC}"
fi

echo ""
echo "🚀 Ready to Start!"
echo "================================"
echo ""
echo "Run these commands in separate terminals:"
echo ""
echo -e "${YELLOW}Terminal 1 (Backend):${NC}"
echo "  cd server && npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 (Frontend):${NC}"
echo "  cd client && npm run dev"
echo ""
echo -e "${YELLOW}Then open:${NC}"
echo "  http://localhost:5173"
echo ""
echo "📖 For detailed testing guide, see: TESTING_GUIDE.md"
echo ""
