#!/bin/bash

# Navigate to the directory containing the virtual environment
cd "$(dirname "$0")"

# Activate the virtual environment
source venv/bin/activate

# Navigate to the backend directory and start the FastAPI backend using Uvicorn
cd backend
uvicorn app.main:app --reload &
BACKEND_PID=$!

# Navigate to the frontend directory
cd ../frontend

# Check if the build directory exists
if [ ! -d "build" ]; then
  echo "Build directory not found. Building the React app..."
  npm install
  npm run build
else
  echo "Build directory found. Skipping build step."
fi

# Start the React frontend
npm start &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
  echo "Stopping services..."
  kill $FRONTEND_PID
  kill $BACKEND_PID
  deactivate
  exit 0
}

# Trap script termination (e.g., CTRL+C) and execute cleanup
trap cleanup SIGINT SIGTERM

# Wait for both services to exit
wait $FRONTEND_PID
wait $BACKEND_PID
