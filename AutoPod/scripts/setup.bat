@echo off
REM TopicScriptor Setup Script for Windows

echo 🚀 Setting up TopicScriptor...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo 💡 Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Setup environment file
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ✅ .env file created
    echo ⚠️  IMPORTANT: Please edit .env and add your OpenAI API key!
) else (
    echo ⚠️  .env file already exists
)

REM Build the project
echo 🔨 Building the project...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Project built successfully

REM Display next steps
echo.
echo 🎉 TopicScriptor setup completed!
echo.
echo 📋 Next steps:
echo 1. Edit .env file and add your OpenAI API key:
echo    OPENAI_API_KEY=your_actual_api_key_here
echo.
echo 2. Start the development server:
echo    npm run start:dev
echo.
echo 3. Test the API:
echo    curl -X POST http://localhost:3000/generate-script ^
echo      -H "Content-Type: application/json" ^
echo      -d "{\"topic\": \"Your topic here\"}"
echo.
echo 4. Run the example client:
echo    node examples/sample-request.js
echo.
echo 📚 For more information, see README.md
pause