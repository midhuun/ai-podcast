import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DemoAudioPlayer from '../components/DemoAudioPlayer';
import MagneticButton from '../components/MagneticButton';
import AnimatedHeadline from '../components/AnimatedHeadline';
import TiltCard from '../components/TiltCard';
import { MicIcon, ZapIcon, DownloadIcon } from '../components/CustomIcons';
import Marquee from '../components/Marquee';
import { gsap, ScrollTrigger } from '../lib/gsap';
import GeneratePodcast from './GeneratePodcast';

function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const howRef = useRef<HTMLDivElement | null>(null);
  const distRef = useRef<HTMLDivElement | null>(null);

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Hero entrance
    if (heroRef.current) {
      const items = heroRef.current.querySelectorAll('[data-hero]');
      gsap.fromTo(items, { y: 30, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      });
    }

    // Scroll-triggered cards
    const sections = [featuresRef.current, howRef.current, distRef.current].filter(Boolean) as HTMLElement[];
    sections.forEach((section) => {
      const cards = section.querySelectorAll('[data-card]');
      gsap.fromTo(cards, { y: 40, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });
    });

    // Floating aurora subtle motion
    const glow = document.querySelector('.hero-aurora');
    if (glow) {
      gsap.to(glow, { xPercent: 10, yPercent: -5, duration: 12, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
  }, []);

  return (
    <div className="min-h-screen py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
      {/* Subtle background layers */}
      <div className="pointer-events-none absolute inset-0 hero-aurora opacity-30"></div>
      <div className="pointer-events-none absolute inset-0 noise-overlay opacity-20"></div>
      {/* Hero Section */}
      <section ref={heroRef} className="max-w-6xl mx-auto text-center mb-20 md:mb-28 relative">
        <div className="mb-8 md:mb-10">
          <div data-hero className="inline-block px-4 py-1 rounded-full bg-accent-weak border border-white/10 text-xs md:text-sm tracking-widest uppercase mb-5">
            AI Podcast Studio
          </div>
          <AnimatedHeadline
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-5 md:mb-6 leading-[1.1]"
            lines={[
              <>Create Great <span className="text-accent">Podcasts</span></>,
              <>Fast, with <span className="text-accent">AI</span></>,
            ]}
          />
          <p data-hero className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 md:mb-10 max-w-3xl mx-auto px-4">
            Turn any idea into a studio‑quality episode with cinematic voices and a Spotify‑grade player.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-12 md:mb-16 px-4">
          <Link
            to="/generate"
            className="w-full sm:w-auto btn-accent px-6 md:px-8 py-3 md:py-4 duration-500 transition-all rounded-xl font-semibold text-base md:text-lg transition-colors duration-200 text-center"
            onMouseEnter={() => setTimeout(() => setIsHovered(true), 200)}
            onMouseLeave={() => setTimeout(() => setIsHovered(false), 200)}
          >
            {isHovered ? '🚀 Start Creating Now!' : 'Get Started for Free'}
          </Link>
          <MagneticButton
            onClick={handlePlayDemo}
            className="w-full sm:w-auto border border-white/10 text-white hover:bg-white/10 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Watch Demo</span>
          </MagneticButton>
        </div>

        {/* Preview Player */}
        <TiltCard className="glass-effect glass-border p-4 md:p-6 rounded-3xl max-w-2xl mx-auto mx-4 transition-all duration-300">
          <div className="flex items-center space-x-3 md:space-x-4 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse-slow">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm md:text-base">AutoPod Demo</h3>
              <p className="text-gray-400 text-xs md:text-sm">Sample AI-Generated Podcast</p>
            </div>
          </div>
          
          {/* Demo Audio Player */}
          <DemoAudioPlayer 
            src="/autopod-demo.wav"
            isPlaying={isPlaying}
            onPlayPause={handlePlayDemo}
          />
          
          <div className="flex items-center justify-between text-xs md:text-sm mt-4">
            <span className="text-purple-400">Generated in 2 minutes</span>
            <span className="text-pink-400">Professional voice</span>
          </div>
        </TiltCard>
      </section>

      {/* Inline Generate Section */}
      <section className="max-w-6xl mx-auto mb-20 md:mb-28 px-4">
        <GeneratePodcast compact />
      </section>

      {/* Feature Highlights */}
      <section ref={featuresRef} className="max-w-6xl mx-auto mb-16 md:mb-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <TiltCard data-card className="glass-effect glass-border p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <ZapIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Production</h3>
            <p className="text-gray-300">From topic to polished episode in one click. No studio, no edits.</p>
          </TiltCard>
          <TiltCard data-card className="glass-effect glass-border p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
              <MicIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cinematic Voices</h3>
            <p className="text-gray-300">Natural, engaging TTS that sounds broadcast‑ready.</p>
          </TiltCard>
          <TiltCard data-card className="glass-effect glass-border p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
              <DownloadIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">One‑Click Publish</h3>
            <p className="text-gray-300">Export and share to every platform with a single tap.</p>
          </TiltCard>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howRef} className="max-w-6xl mx-auto mb-16 md:mb-24 px-4">
        <div className="glass-effect glass-border p-6 md:p-8 rounded-3xl transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
            How <span className="gradient-text">AutoPod</span> Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div data-card className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1"/></svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">1. Enter Your Topic</h3>
              <p className="text-gray-300 text-sm md:text-base">Type anything. We’ll write, voice, and package it perfectly.</p>
            </div>
            <div data-card className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">2. Generate</h3>
              <p className="text-gray-300 text-sm md:text-base">Content, voice, and cover — crafted automatically.</p>
            </div>
            <div data-card className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
</svg>

              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">3. Share Everywhere</h3>
              <p className="text-gray-300 text-sm md:text-base">Publish to Spotify, YouTube, and more in one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Options removed per request */}

      {/* Trusted By / Marquee */}
      <div className="max-w-6xl mx-auto mb-16 md:mb-24 px-4">
        <Marquee
          items={[
            <span className="text-sm md:text-base">Fast generation</span>,
            <span className="text-sm md:text-base">Studio voices</span>,
            <span className="text-sm md:text-base">One-click download</span>,
            <span className="text-sm md:text-base">Mobile-first</span>,
            <span className="text-sm md:text-base">Share everywhere</span>,
          ]}
          speed={35}
        />
      </div>

      {/* Distribution Platforms */}
      <div ref={distRef} className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 animate-slide-in-top animation-delay-1200">
          Share Everywhere
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {/* Spotify */}
          <div data-card className="glass-effect p-3 md:p-4 lg:p-6 rounded-xl text-center hover:scale-[1.03] transition-transform cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4 animate-bounce-gentle">
              <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-9.541-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 3.6-1.08 7.56-.6 10.8 1.32.42.18.479.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xs md:text-sm lg:text-base">Spotify</h3>
          </div>

          {/* Apple Podcasts */}
          <div data-card className="glass-effect p-3 md:p-4 lg:p-6 rounded-xl text-center hover:scale-[1.03] transition-transform cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-gray-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4 animate-bounce-gentle animation-delay-200">
              <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xs md:text-sm lg:text-base">Apple Podcasts</h3>
          </div>

          {/* Google Podcasts */}
          <div data-card className="glass-effect p-3 md:p-4 lg:p-6 rounded-xl text-center hover:scale-[1.03] transition-transform cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4 animate-bounce-gentle animation-delay-400">
              <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xs md:text-sm lg:text-base">Google Podcasts</h3>
          </div>

          {/* YouTube */}
          <div data-card className="glass-effect p-3 md:p-4 lg:p-6 rounded-xl text-center hover:scale-[1.03] transition-transform cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4 animate-bounce-gentle animation-delay-600">
              <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xs md:text-sm lg:text-base">YouTube</h3>
          </div>
        </div>
      </div>
      {/* Final CTA */}
      <section className="max-w-4xl mx-auto my-16 md:my-24 px-4 text-center">
        <div className="glass-effect glass-border rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Create your first episode now</h3>
          <p className="text-gray-300 mb-6">It’s free to try. No credit card required.</p>
          <Link to="/generate" className="inline-block bg-white text-black hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-colors duration-200">Get Started</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;