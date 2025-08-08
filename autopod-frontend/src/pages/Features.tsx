import React from 'react';
import { 
  MicIcon, 
  ZapIcon, 
  GlobeIcon, 
  SettingsIcon, 
  BrainIcon, 
  ClockIcon, 
  UsersIcon, 
  HeadphonesIcon, 
  DownloadIcon, 
  ShareIcon, 
  BarChartIcon,
  SecurityIcon 
} from '../components/CustomIcons';

function Features() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Content Generation",
      description: "Our advanced AI creates engaging, natural-sounding podcast content from just a topic or brief description.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "100+ Professional Voices",
      description: "Choose from a diverse library of natural-sounding voices in multiple languages and accents.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Dynamic Processing",
      description: "Advanced chunking algorithm automatically optimizes processing based on content length and duration for faster, higher-quality generation.",
      gradient: "from-pink-500 to-red-500"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Advanced Customization",
      description: "Fine-tune voice speed, tone, background music, and add custom intros and outros.",
      gradient: "from-green-500 to-blue-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Platform Distribution",
      description: "Publish directly to Spotify, Apple Podcasts, Google Podcasts, and 15+ other platforms.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <SecurityIcon className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and security measures to protect your content and data.",
      gradient: "from-gray-600 to-gray-800"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Scheduled Publishing",
      description: "Schedule your podcasts to be published automatically at optimal times for your audience.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Work with your team to create, review, and publish podcasts with role-based permissions.",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Audio Enhancement",
      description: "Automatic noise reduction, volume normalization, and professional audio mastering.",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Multiple Export Formats",
      description: "Download in MP3, WAV, or other formats with customizable quality settings.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Social Media Integration",
      description: "Create audiograms and shareable clips for social media promotion automatically.",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Track performance, listener engagement, and growth with detailed analytics dashboard.",
      gradient: "from-blue-600 to-indigo-600"
    }
  ];

  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-5xl font-bold">
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Modern Podcasting</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to create, customize, and distribute professional podcasts powered by cutting-edge AI technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all group hover:transform hover:scale-105">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-12 text-center border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Podcasting?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of creators who are already using ZappPodcast to create amazing content.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-gray-800">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;