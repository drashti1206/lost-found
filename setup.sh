#!/bin/bash

# Install root dependencies
npm install

# Setup frontend
cd frontend
npm install

# Setup backend
cd ../backend
if command -v python3 &>/dev/null; then
    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt
else
    echo "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

cd ..

echo "Setup completed successfully!" 