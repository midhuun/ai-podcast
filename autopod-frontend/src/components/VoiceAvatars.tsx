import React from 'react';

interface VoiceAvatarProps {
  voice: string;
  className?: string;
}

const VoiceAvatars: React.FC<VoiceAvatarProps> = ({ voice, className = "" }) => {
  // AI-generated avatar URLs for each voice
  const avatars = {
    'Draco': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'Thalia': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'Orpheus': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'Hermes': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  };

  const avatarUrl = avatars[voice as keyof typeof avatars] || avatars['Draco'];

  return (
    <div className={`relative ${className}`}>
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
        <img 
          src={avatarUrl} 
          alt={`${voice} AI Voice`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback to a default avatar if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';
          }}
        />
      </div>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm scale-110 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default VoiceAvatars; 