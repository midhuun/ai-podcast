import { useEffect, useRef, useState } from 'react';
import CustomAudioPlayer from '../components/CustomAudioPlayer';
import GeneratingAnimation from '../components/GeneratingAnimation';
import MagneticButton from '../components/MagneticButton';
import { gsap } from '../lib/gsap';

const API_URL = import.meta.env.VITE_API_URL || 'https://autopod-be.vercel.app';

type LengthPreset = 'short' | 'medium' | 'long';

interface GeneratePodcastProps {
  compact?: boolean;
}

function GeneratePodcast({ compact = false }: GeneratePodcastProps) {
  const [topic, setTopic] = useState('');
  const [preset, setPreset] = useState<LengthPreset>('short');
  const minutes = preset === 'short' ? 4 : preset === 'medium' ? 10 : 20;
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  // Backend decides mood and music. Keep minimal controls off the UI.

  const suggestions = [
    'The rise of electric vehicles in 2025',
    'How AI will transform healthcare',
    'A brief history of quantum computing',
    'The future of space tourism',
  ];

  useEffect(() => {
    if (!rootRef.current) return;
    const nodes = rootRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(nodes, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06 });
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    setAudioUrl(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const res = await fetch(`${API_URL}/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          minutes,
          backgroundMusic: true,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div
      id={compact ? 'generate-section' : undefined}
      ref={rootRef}
      className={`${compact ? 'py-10 md:py-14' : 'min-h-screen flex items-center'} flex flex-col items-center px-4 space-y-8 md:space-y-10`}
    >
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center" data-reveal>
          <div className="inline-block px-4 py-1 rounded-full bg-accent-weak border border-white/10 text-xs tracking-widest uppercase mb-4">Create Podcast</div>
          <h1 className={`font-extrabold mb-3 ${compact ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'}`}>Your Topic. <span className="text-accent">Studio Output.</span></h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">Enter a topic, pick duration, and AutoPod will write, voice, and package your episode with beautiful audio.</p>
        </div>
        
        <div className="glass-effect glass-border p-6 md:p-7 rounded-3xl space-y-5" data-reveal>
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">Podcast Topic</label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
              placeholder="e.g. The future of renewable energy"
              className="w-full p-3 md:p-4 rounded-xl bg-black/40 border border-white/10 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] text-white resize-none text-sm md:text-base"
              disabled={loading}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => setTopic(s)} disabled={loading} className="px-3 py-1.5 text-xs rounded-lg bg-accent-weak border border-white/10 hover:border-[var(--accent)] transition-colors">{s}</button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Length</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'short', label: 'Short', desc: '≈ 4 min' },
                { key: 'medium', label: 'Medium', desc: '≈ 10 min' },
                { key: 'long', label: 'Long', desc: '≈ 20 min' },
              ] as { key: LengthPreset; label: string; desc: string }[]).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  disabled={loading}
                  onClick={() => setPreset(opt.key)}
                  className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                    preset === opt.key
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 hover:border-purple-500/60'
                  }`}
                >
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="text-xs text-gray-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Music is auto-selected by backend based on mood; no UI here. */}
        </div>
        
        {error && (
          <div className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <MagneticButton
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full px-6 md:px-8 py-3 md:py-4 btn-accent rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>Generate Podcast</span>
            </>
          )}
        </MagneticButton>
        
        {/* Dynamic Chunking Info */}
        {(preset === 'medium' || preset === 'long') && (
          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-purple-300 text-sm font-medium">Smart Processing Enabled</p>
                <p className="text-purple-200/80 text-xs mt-1">
                  For {minutes}-minute podcasts, AutoPod uses dynamic chunking to optimize audio generation. 
                  Your content will be intelligently split and processed in parallel for better quality and faster generation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Animation */}
      <GeneratingAnimation isVisible={loading} progress={progress} minutes={minutes} />

      {/* Audio Player */}
      {audioUrl && (
        <div className="glass-effect glass-border p-4 md:p-6 rounded-3xl animate-slide-up animation-delay-400 max-w-3xl w-full">
          <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center">Your Podcast is Ready!</h2>
          <CustomAudioPlayer src={audioUrl} />
        </div>
      )}

      {/* Skeleton loader when no audio yet */}
      {!audioUrl && !loading && (
        <div className="glass-effect glass-border p-6 md:p-8 rounded-3xl max-w-3xl w-full text-center" data-reveal>
          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-accent-weak border border-white/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v15m-4-4h8"/></svg>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Ready when you are</h2>
          <p className="text-sm text-gray-300 mb-4">Enter a topic and tap Generate to create your studio‑quality episode.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs text-gray-300">
            <div className="bg-black/30 border border-white/10 rounded-xl p-3">• Be specific: “How EVs changed in 2025”</div>
            <div className="bg-black/30 border border-white/10 rounded-xl p-3">• Choose duration with the slider</div>
            <div className="bg-black/30 border border-white/10 rounded-xl p-3">• You’ll get a crisp audio with a proper ending</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratePodcast; 