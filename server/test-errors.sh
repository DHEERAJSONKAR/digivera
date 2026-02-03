#!/bin/bash

echo "🧪 Testing Error Handling System"
echo "=================================="
echo ""

# Start server in background
echo "Starting server..."
cd /Users/apple/Documents/digivera/server
node server.js > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "✅ Server started (PID: $SERVER_PID)"
echo ""

# Test 1: 404 Route
echo "Test 1: 404 Route Not Found"
echo "----------------------------"
curl -s http://localhost:5000/api/invalid-route | python3 -m json.tool
echo ""

# Test 2: Unauthorized (no token)
echo "Test 2: Unauthorized Access (no token)"
echo "---------------------------------------"
curl -s http://localhost:5000/api/me | python3 -m json.tool
echo ""

# Test 3: Invalid token
echo "Test 3: Invalid JWT Token"
echo "-------------------------"
curl -s -H "Authorization: Bearer invalid_token" http://localhost:5000/api/me | python3 -m json.tool
echo ""

# Test 4: Valid root route
echo "Test 4: Valid Root Route (Success)"
echo "-----------------------------------"
curl -s http://localhost:5000/ | python3 -m json.tool
echo ""

# Cleanup
echo "Stopping server..."
kill $SERVER_PID
wait $SERVER_PID 2>/dev/null

echo ""
echo "✅ All tests completed!"
