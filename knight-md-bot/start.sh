#!/bin/bash

# Knight-MD Bot Starter Script

echo "═══════════════════════════════════════════════════"
echo "    🇦🇱  K͓̽ N͓̽ I͓̽ G͓̽ H͓̽ T͓̽   - M͓̽D͓̽  𓊉  🇦🇱"
echo "═══════════════════════════════════════════════════"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Error: Node.js version 20 or higher required"
    echo "Current version: $(node -v)"
    echo "Please upgrade Node.js"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start bot
echo "🚀 Starting Knight-MD Bot..."
echo ""
node index.js
