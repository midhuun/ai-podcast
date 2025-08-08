import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'button' | 'card' | 'audio-player';
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'text', className = '' }) => {
  const baseClasses = 'animate-pulse bg-gray-700 rounded';
  
  switch (type) {
    case 'text':
      return (
        <div className={`${baseClasses} h-4 ${className}`}></div>
      );
    
    case 'button':
      return (
        <div className={`${baseClasses} h-12 w-full ${className}`}></div>
      );
    
    case 'card':
      return (
        <div className={`${baseClasses} h-64 w-full ${className}`}></div>
      );
    
    case 'audio-player':
      return (
        <div className={`${baseClasses} p-6 rounded-2xl ${className}`}>
          {/* Track info skeleton */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-600 rounded-lg animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
          </div>
          
          {/* Progress bar skeleton */}
          <div className="mb-4">
            <div className="w-full h-1 bg-gray-600 rounded-full mb-2"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-600 rounded w-8"></div>
              <div className="h-3 bg-gray-600 rounded w-8"></div>
            </div>
          </div>
          
          {/* Controls skeleton */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
            ))}
          </div>
          
          {/* Bottom controls skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <div className="w-20 h-1 bg-gray-600 rounded"></div>
            </div>
            <div className="w-24 h-8 bg-gray-600 rounded-lg"></div>
          </div>
        </div>
      );
    
    default:
      return <div className={`${baseClasses} h-4 ${className}`}></div>;
  }
};

export default SkeletonLoader; 