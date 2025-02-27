#!/bin/bash

# Find and kill any process using port 5000
echo "Checking for processes on port 5000..."
PORT_PID=$(lsof -ti:5000)
if [ ! -z "$PORT_PID" ]; then
    echo "Killing process $PORT_PID on port 5000"
    kill -9 $PORT_PID
fi

# Wait a moment for the port to be freed
echo "Waiting for port to be freed..."
sleep 2

# Start the server
echo "Starting server..."
npm run dev