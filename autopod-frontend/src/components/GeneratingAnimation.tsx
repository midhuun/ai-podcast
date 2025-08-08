import React from 'react';

interface GeneratingAnimationProps {
  isVisible: boolean;
  progress?: number;
  minutes?: number;
}

const GeneratingAnimation: React.FC<GeneratingAnimationProps> = ({ isVisible, progress = 0, minutes = 2 }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-effect p-8 rounded-3xl max-w-md w-full mx-4 text-center">
        {/* Animated microphone icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">{Math.round(progress)}% Complete</p>
        </div>

        {/* Loading text with animation */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white mb-2">Generating Your Podcast</h3>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-gray-400 text-sm">
            {progress < 30 && "Analyzing your topic..."}
            {progress >= 30 && progress < 60 && "Creating engaging content..."}
            {progress >= 60 && progress < 90 && minutes > 3 ? "Processing with dynamic chunking..." : "Converting to speech..."}
            {progress >= 90 && "Finalizing your podcast..."}
          </p>
          
          {/* Dynamic chunking indicator */}
          {minutes > 3 && progress >= 60 && progress < 90 && (
            <div className="mt-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-purple-300 text-xs">
                🧠 Smart chunking for {minutes}-minute podcast
              </p>
            </div>
          )}
        </div>

        {/* Fun facts */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
          <p className="text-xs text-gray-400">
            {minutes <= 3 
              ? "💡 Did you know? Our AI can generate a professional podcast in under 2 minutes!"
              : "🚀 Using parallel processing and dynamic chunking to optimize your longer podcast!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneratingAnimation; 