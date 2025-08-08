import React from 'react';
import { Star, Quote, Play, Users, TrendingUp, Award } from 'lucide-react';

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Tech Entrepreneur",
      company: "StartupFlow",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "ZappPodcast transformed how I create content for my startup. What used to take me hours of recording and editing now takes just minutes. The AI-generated content is incredibly natural and engaging.",
      rating: 5,
      podcastTitle: "The Startup Journey"
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      company: "GrowthLabs",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Our podcast listenership grew 300% after switching to ZappPodcast. The quality is indistinguishable from professionally recorded content, and we can now publish daily episodes effortlessly.",
      rating: 5,
      podcastTitle: "Marketing Mastery"
    },
    {
      name: "Dr. Emily Watson",
      role: "Educational Content Creator",
      company: "LearnSmart Academy",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "As an educator, I needed a way to create engaging audio content for my students. ZappPodcast's multiple voice options and customization features make learning materials come alive.",
      rating: 5,
      podcastTitle: "Science Simplified"
    },
    {
      name: "James Thompson",
      role: "Independent Creator",
      company: "Creative Minds Podcast",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "I was skeptical about AI-generated podcasts, but ZappPodcast exceeded all my expectations. The content is thoughtful, well-structured, and my audience can't tell the difference.",
      rating: 5,
      podcastTitle: "Creative Conversations"
    },
    {
      name: "Lisa Park",
      role: "Business Coach",
      company: "Success Strategies",
      image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "ZappPodcast helped me scale my coaching business by allowing me to create consistent, high-quality content without the time investment. It's been a game-changer for my brand.",
      rating: 5,
      podcastTitle: "Business Breakthrough"
    },
    {
      name: "Alex Kumar",
      role: "Tech Reviewer",
      company: "TechTalk Daily",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "The speed and quality of ZappPodcast is unmatched. I can cover breaking tech news within hours of it happening. The AI understands context and creates compelling narratives every time.",
      rating: 5,
      podcastTitle: "Tech Today"
    }
  ];

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "50K+", label: "Active Creators" },
    { icon: <Play className="w-8 h-8" />, value: "2M+", label: "Podcasts Generated" },
    { icon: <TrendingUp className="w-8 h-8" />, value: "95%", label: "Customer Satisfaction" },
    { icon: <Award className="w-8 h-8" />, value: "4.9/5", label: "Average Rating" }
  ];

  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-5xl font-bold">
            Loved by
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Creators Worldwide</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of content creators, educators, and businesses who trust ZappPodcast to bring their ideas to life.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all relative">
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-purple-400 opacity-50" />
              </div>
              
              <div className="space-y-6">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed italic">"{testimonial.content}"</p>

                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-purple-400">{testimonial.company}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Play className="w-4 h-4" />
                    <span>Podcast: {testimonial.podcastTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Success Story */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-12 border border-purple-500/20 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <h2 className="text-3xl font-bold">Success Story Spotlight</h2>
              <blockquote className="text-xl text-gray-300 italic leading-relaxed">
                "ZappPodcast helped me go from zero to 100K monthly listeners in just 6 months. The AI-generated content is so good that major brands are now sponsoring my show. It's completely transformed my business."
              </blockquote>
              <div className="flex items-center space-x-4">
                <img 
                  src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                  alt="Featured Creator"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold">Rachel Martinez</h4>
                  <p className="text-purple-400">Host of "Future Trends Podcast"</p>
                  <p className="text-gray-400">100K+ Monthly Listeners</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Growth Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly Listeners</span>
                  <span className="text-2xl font-bold text-green-400">100K+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Episodes Published</span>
                  <span className="text-2xl font-bold text-blue-400">180+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Time Saved</span>
                  <span className="text-2xl font-bold text-purple-400">500+ hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Revenue Growth</span>
                  <span className="text-2xl font-bold text-pink-400">+400%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Success Stories?</h2>
          <p className="text-xl text-gray-400 mb-8">Start creating professional podcasts today and see why creators love ZappPodcast.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-gray-800">
              View More Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;