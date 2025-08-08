#!/bin/bash

# TopicScriptor Setup Script
echo "🚀 Setting up TopicScriptor..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "💡 Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Setup environment file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  IMPORTANT: Please edit .env and add your OpenAI API key!"
else
    echo "⚠️  .env file already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Project built successfully"

# Display next steps
echo ""
echo "🎉 TopicScriptor setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file and add your OpenAI API key:"
echo "   OPENAI_API_KEY=your_actual_api_key_here"
echo ""
echo "2. Start the development server:"
echo "   npm run start:dev"
echo ""
echo "3. Test the API:"
echo "   curl -X POST http://localhost:3000/generate-script \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"topic\": \"Your topic here\"}'"
echo ""
echo "4. Run the example client:"
echo "   node examples/sample-request.js"
echo ""
echo "📚 For more information, see README.md"