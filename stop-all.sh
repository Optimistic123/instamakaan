#!/bin/bash
echo "Stopping InstaMakaan services..."

# Kill processes on ports 8001 and 3000
if command -v lsof &> /dev/null; then
    lsof -ti:8001 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
else
    # Alternative for systems without lsof
    fuser -k 8001/tcp 2>/dev/null || true
    fuser -k 3000/tcp 2>/dev/null || true
fi

echo "Services stopped."
