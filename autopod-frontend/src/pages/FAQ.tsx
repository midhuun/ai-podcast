import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';

function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How does ZappPodcast work?",
          answer: "ZappPodcast uses advanced AI to generate professional podcast content from your topics. Simply enter your subject, customize the settings (voice, length, style), and our AI creates a complete podcast episode in minutes. The process involves content research, script generation, and natural voice synthesis."
        },
        {
          question: "Do I need any technical skills to use ZappPodcast?",
          answer: "Not at all! ZappPodcast is designed for everyone, regardless of technical background. Our intuitive interface guides you through the process step-by-step. No recording equipment, editing software, or audio engineering knowledge required."
        },
        {
          question: "How long does it take to generate a podcast?",
          answer: "Most podcasts are generated within 2-5 minutes, depending on length and complexity. Short episodes (5-10 minutes) typically take 1-2 minutes, while longer episodes (30-60 minutes) may take 3-5 minutes to process."
        },
        {
          question: "Can I try ZappPodcast for free?",
          answer: "Yes! We offer a free plan that includes 3 podcasts per month, up to 10 minutes each. You can also start a 14-day free trial of our Pro or Business plans with no credit card required."
        }
      ]
    },
    {
      category: "Features & Customization",
      questions: [
        {
          question: "How many voice options are available?",
          answer: "We offer 100+ professional voices across multiple languages, accents, and styles. This includes male and female voices in American, British, Australian, Canadian accents, plus voices in Spanish, French, German, Italian, Portuguese, and more languages."
        },
        {
          question: "Can I customize the podcast content?",
          answer: "Absolutely! You can customize voice style, speaking speed, tone, background music, add custom intros/outros, and even provide specific talking points or sources. Business plan users can also clone their own voice for a personalized touch."
        },
        {
          question: "What audio quality can I expect?",
          answer: "All podcasts are generated in high-quality audio (up to 320kbps MP3 or uncompressed WAV). We use professional-grade voice synthesis and audio processing, including noise reduction and volume normalization."
        },
        {
          question: "Can I edit the generated podcast?",
          answer: "Yes! While our AI creates complete episodes, you can make adjustments by regenerating specific sections, adding custom segments, or downloading the audio for external editing. Pro and Business plans include more advanced editing options."
        }
      ]
    },
    {
      category: "Publishing & Distribution",
      questions: [
        {
          question: "How do I publish my podcast to platforms like Spotify?",
          answer: "ZappPodcast integrates with major podcast platforms. You can publish directly to Spotify, Apple Podcasts, Google Podcasts, and 15+ other platforms with one click. We handle RSS feed creation and submission processes automatically."
        },
        {
          question: "Do you provide podcast hosting?",
          answer: "Yes! All plans include podcast hosting with unlimited bandwidth. We provide RSS feeds, analytics, and ensure your podcasts are optimized for all major platforms. Your content is stored securely and accessible 24/7."
        },
        {
          question: "Can I download my podcasts?",
          answer: "Absolutely! You can download your podcasts in multiple formats (MP3, WAV, M4A) and quality settings. All generated content belongs to you, and you can use it however you like."
        },
        {
          question: "What about podcast analytics?",
          answer: "Pro and Business plans include comprehensive analytics showing downloads, listener demographics, engagement metrics, and growth trends. You can track performance across all platforms from one dashboard."
        }
      ]
    },
    {
      category: "Billing & Plans",
      questions: [
        {
          question: "Can I change my plan anytime?",
          answer: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle. We'll prorate any charges accordingly."
        },
        {
          question: "What happens if I exceed my plan limits?",
          answer: "If you approach your monthly limits, we'll notify you via email. You can either upgrade your plan or wait until the next billing cycle. We never charge overage fees without your explicit consent."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with ZappPodcast, contact our support team within 30 days of your purchase for a full refund."
        },
        {
          question: "Is there a discount for annual billing?",
          answer: "Yes! Annual subscribers save 20% compared to monthly billing. You'll also get priority support and early access to new features. The discount is applied automatically when you choose annual billing."
        }
      ]
    },
    {
      category: "Technical & Security",
      questions: [
        {
          question: "Is my content secure and private?",
          answer: "Absolutely. We use bank-level encryption (AES-256) for all data transmission and storage. Your content is never shared with third parties, and you retain full ownership of all generated podcasts. We're GDPR and CCPA compliant."
        },
        {
          question: "What file formats do you support?",
          answer: "We support all major audio formats including MP3, WAV, M4A, and FLAC. You can also export transcripts in TXT, SRT, and VTT formats. Custom format requests are available for Business plan users."
        },
        {
          question: "Do you have an API?",
          answer: "Yes! Business plan subscribers get access to our REST API, allowing you to integrate ZappPodcast into your existing workflows, applications, or content management systems. Full documentation and SDKs are provided."
        },
        {
          question: "What about copyright and licensing?",
          answer: "All AI-generated content is original and copyright-free. You own full commercial rights to your podcasts. Our voice synthesis technology creates original audio that doesn't infringe on any existing copyrights."
        }
      ]
    }
  ];

  return (
    <div className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-20">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold">
            Frequently Asked
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Questions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about ZappPodcast. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-400 border-b border-gray-700 pb-4">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 10 + faqIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div key={faqIndex} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                      >
                        <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-12 border border-purple-500/20">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Still Have Questions?</h2>
            <p className="text-xl text-gray-300">Our support team is here to help you succeed with ZappPodcast.</p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-400 text-sm mb-4">Get instant help from our support team</p>
                <button className="text-purple-400 hover:text-purple-300 font-medium">Start Chat</button>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-gray-400 text-sm mb-4">We'll respond within 24 hours</p>
                <button className="text-purple-400 hover:text-purple-300 font-medium">Send Email</button>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-400 text-sm mb-4">Available for Business plan users</p>
                <button className="text-purple-400 hover:text-purple-300 font-medium">Schedule Call</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;