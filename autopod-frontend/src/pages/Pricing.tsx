import React from 'react';
import { Check, X, Star, Zap } from 'lucide-react';

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for trying out ZappPodcast",
      features: [
        "3 podcasts per month",
        "Up to 10 minutes per podcast",
        "5 voice options",
        "Basic audio quality",
        "Community support",
        "ZappPodcast watermark"
      ],
      limitations: [
        "No custom voices",
        "No team collaboration",
        "No analytics",
        "No priority support"
      ],
      buttonText: "Get Started Free",
      popular: false,
      gradient: "from-gray-600 to-gray-700"
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For serious content creators",
      features: [
        "50 podcasts per month",
        "Up to 60 minutes per podcast",
        "50+ voice options",
        "High-quality audio",
        "Priority support",
        "No watermark",
        "Custom intros/outros",
        "Social media clips",
        "Basic analytics"
      ],
      limitations: [
        "No team collaboration",
        "No custom voices",
        "No white-label"
      ],
      buttonText: "Start Pro Trial",
      popular: true,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      name: "Business",
      price: "$49",
      period: "per month",
      description: "For teams and businesses",
      features: [
        "Unlimited podcasts",
        "Unlimited duration",
        "100+ voice options",
        "Premium audio quality",
        "24/7 priority support",
        "Team collaboration (5 users)",
        "Advanced analytics",
        "Custom voice cloning",
        "White-label options",
        "API access",
        "Bulk operations",
        "Custom integrations"
      ],
      limitations: [],
      buttonText: "Start Business Trial",
      popular: false,
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-5xl font-bold">
            Simple, Transparent
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your podcasting needs. All plans include our core AI-powered features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-gray-800 rounded-2xl p-8 border ${plan.popular ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-gray-700'} hover:border-purple-500/50 transition-all`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  <p className="text-gray-400 mt-2">{plan.description}</p>
                </div>

                <button className={`w-full py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : 'border border-gray-600 hover:border-gray-500 hover:bg-gray-700'}`}>
                  {plan.buttonText}
                </button>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-gray-700">
                      <h4 className="font-semibold text-lg mb-3 text-gray-400">Not included:</h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start space-x-3">
                            <X className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800/50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Can I change plans anytime?</h3>
                <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">What happens to my podcasts if I cancel?</h3>
                <p className="text-gray-400">You'll retain access to all your created podcasts and can download them. However, you won't be able to create new ones after your subscription ends.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Do you offer refunds?</h3>
                <p className="text-gray-400">We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Is there a free trial?</h3>
                <p className="text-gray-400">Yes! All paid plans come with a 14-day free trial. No credit card required to start, and you can cancel anytime during the trial.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Can I use my own voice?</h3>
                <p className="text-gray-400">Custom voice cloning is available on Business plans. You can train the AI with your voice samples to create personalized podcast content.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Do you offer enterprise plans?</h3>
                <p className="text-gray-400">Yes, we offer custom enterprise solutions with advanced features, dedicated support, and flexible pricing. Contact our sales team for details.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of creators who trust ZappPodcast for their content needs.</p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Start Your Free Trial</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;