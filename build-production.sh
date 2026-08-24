#!/bin/bash

# Production Build Script for Server
# This script ensures .env is set correctly before building

echo "🚀 Building for Production..."
echo "================================"

# Check if we're on the server
if [ ! -d "/home/supuncompanies" ]; then
    echo "⚠️  Warning: This script is meant to run on the production server"
    echo "Current directory: $(pwd)"
fi

# Set production environment variables
echo "📝 Setting environment variables..."

# Create .env file
cat > .env << 'EOF'
# Production Environment Variables
PORT=3001
NODE_ENV=production

# IMPORTANT: Frontend API URL - Change to your actual domain!
VITE_API_URL=https://supuncompanies.com/api

# JWT Secret - Should be a secure random string
JWT_SECRET=your-secure-random-secret-key-change-this

# Database
DATABASE_PATH=/home/supuncompanies/htdocs/server/database.sqlite

# Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/home/supuncompanies/htdocs/server/uploads
EOF

echo "✅ .env file created"

# Display what we set
echo ""
echo "📋 Environment variables:"
cat .env | grep VITE_API_URL
echo ""

# Remove old build
echo "🗑️  Removing old dist folder..."
rm -rf dist/

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Verify the build
echo ""
echo "🔍 Verifying build..."
if [ -d "dist" ]; then
    echo "✅ dist/ folder created"
    
    # Check if it contains the correct API URL
    if grep -r "supuncompanies.com" dist/assets/*.js > /dev/null 2>&1; then
        echo "✅ Frontend configured with: https://supuncompanies.com/api"
    else
        echo "⚠️  WARNING: dist/ folder doesn't contain supuncompanies.com"
        echo "Checking for localhost..."
        if grep -r "localhost:3001" dist/assets/*.js > /dev/null 2>&1; then
            echo "❌ ERROR: Still using localhost:3001"
            echo "The .env file may not be loaded correctly"
        fi
    fi
else
    echo "❌ ERROR: dist/ folder not created"
    exit 1
fi

echo ""
echo "🎉 Build complete!"
echo ""
echo "Next steps:"
echo "1. Make sure PM2 is running: pm2 status"
echo "2. Restart nginx: systemctl restart nginx"
echo "3. Clear browser cache and test"
echo ""
