import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, Download, SkipBack, SkipForward, Repeat, Heart } from 'lucide-react';

interface Props {
  src: string;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const CustomAudioPlayer: React.FC<Props> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isRepeated, setIsRepeated] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoaded = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Keep audio element in sync with playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = percent * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = 'autopod-generated-podcast.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-gray-900 rounded-2xl p-6 border border-gray-700">
      <audio ref={audioRef} src={src} />
      
      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">🎙️</span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">AutoPod Generated Podcast</h3>
          <p className="text-gray-400 text-sm">AI-Powered Content</p>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div
          className="w-full h-1 bg-gray-700 rounded-full cursor-pointer mb-2"
          onClick={handleProgressClick}
        >
          <div
            className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <Pause className="text-black w-6 h-6" />
          ) : (
            <Play className="text-black w-6 h-6 ml-1" />
          )}
        </button>
        
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <SkipForward className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setIsRepeated(!isRepeated)}
          className={`w-8 h-8 flex items-center justify-center transition-colors ${
            isRepeated ? 'text-green-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <Volume2 className="text-gray-400 w-4 h-4" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        {/* Playback Speed */}
        <div className="flex items-center gap-2 text-xs">
          {[1, 1.25, 1.5, 1.75, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => setPlaybackRate(rate)}
              className={`px-2.5 py-1 rounded-md border transition-colors ${
                playbackRate === rate
                  ? 'border-purple-500 bg-purple-500/10 text-white'
                  : 'border-gray-700 text-gray-300 hover:border-purple-500/60'
              }`}
              aria-label={`Set playback speed to ${rate}x`}
            >
              {rate}x
            </button>
          ))}
        </div>

        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default CustomAudioPlayer; 