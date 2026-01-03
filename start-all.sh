#!/bin/bash

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}Starting InstaMakaan Application...${NC}"
echo ""

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if MongoDB is running
if ! nc -z localhost 27017 2>/dev/null; then
    echo "MongoDB is not running. Attempting to start..."
    
    # Try Docker
    if command -v docker &> /dev/null; then
        docker start instamakaan-mongo 2>/dev/null || \
        docker run -d --name instamakaan-mongo -p 27017:27017 mongo:7.0
    fi
    
    sleep 2
fi

# Start Backend in background
echo "Starting Backend..."
cd "$SCRIPT_DIR/backend"
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
sleep 3

# Start Frontend
echo "Starting Frontend..."
cd "$SCRIPT_DIR/frontend"
yarn start &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  InstaMakaan is now running!                                   ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Frontend:    http://localhost:3000                            ║${NC}"
echo -e "${GREEN}║  Admin Panel: http://localhost:3000/admin                      ║${NC}"
echo -e "${GREEN}║  Backend API: http://localhost:8001/api                        ║${NC}"
echo -e "${GREEN}║  API Docs:    http://localhost:8001/docs                       ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Press Ctrl+C to stop all services                             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
