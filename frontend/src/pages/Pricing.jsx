import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Check, Zap } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();
  const [isStudent, setIsStudent] = useState(false);

  const tiers = [
    {
      name: "Idea Spark",
      price: 1499,
      description: "Visualize your concept",
      features: [
        "Project wireframes",
        "Basic tech stack recommendation",
        "Feature roadmap",
        "1 revision"
      ],
      cta: "Visualize My Idea",
      highlighted: false
    },
    {
      name: "Starter",
      price: 3000,
      description: "Build your prototype",
      features: [
        "Basic frontend + backend",
        "1 UI template",
        "User authentication",
        "Basic admin panel",
        "Code export",
        "2 weeks delivery"
      ],
      cta: "Build My Prototype",
      highlighted: false
    },
    {
      name: "MVP Launch",
      price: 6000,
      description: "Launch your startup",
      features: [
        "Everything in Starter",
        "Custom UI design",
        "Payment integration",
        "Email notifications",
        "SEO optimization",
        "GitHub repository",
        "3 weeks delivery"
      ],
      cta: "Launch MVP",
      highlighted: true
    },
    {
      name: "Growth",
      price: 12000,
      description: "Scale your business",
      features: [
        "Everything in MVP Launch",
        "Advanced features",
        "Multi-language support",
        "Analytics dashboard",
        "API integrations",
        "Performance optimization",
        "4 weeks delivery"
      ],
      cta: "Scale My Startup",
      highlighted: false
    },
    {
      name: "AI Pro",
      price: 20000,
      description: "Add AI superpowers",
      features: [
        "Everything in Growth",
        "AI assistant integration",
        "Chatbot with NLP",
        "Personalization engine",
        "Advanced automation",
        "Priority support",
        "5 weeks delivery"
      ],
      cta: "Add AI Magic",
      highlighted: false
    },
    {
      name: "Enterprise",
      price: null,
      description: "Custom solutions",
      features: [
        "Custom requirements",
        "Dedicated team",
        "White-label solutions",
        "Advanced integrations",
        "SLA guarantees",
        "24/7 support"
      ],
      cta: "Let's Discuss",
      highlighted: false
    }
  ];

  const addons = [
    { name: "Custom Domain Setup", price: 499, description: "Connect your domain" },
    { name: "Logo + Branding Pack", price: 799, description: "AI-generated assets" },
    { name: "SEO Optimization", price: 999, description: "Meta tags & sitemap" },
    { name: "AI Assistant Integration", price: 1499, description: "Chatbot integration" },
    { name: "Hosting Extension", price: 199, description: "Per month" },
    { name: "Maintenance Support", price: 999, description: "Per month" },
    { name: "Analytics Dashboard", price: 499, description: "User activity tracking" }
  ];

  const calculatePrice = (basePrice) => {
    if (!basePrice) return "Custom";
    return isStudent ? Math.round(basePrice * 0.85) : basePrice;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E6EEF8]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <Sparkles className="w-8 h-8 text-[#3B82F6]" />
              <span className="heading-font text-2xl font-bold">SeeForge</span>
            </div>
            <div className="flex space-x-6">
              {/* Replaced anchor tags with Link components */}
              <Link to="/templates" className="hover:text-[#22D3EE]">Templates</Link>
              <Link to="/how-it-works" className="hover:text-[#22D3EE]">How It Works</Link>
              <Link to="/dashboard" className="hover:text-[#22D3EE]">Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="heading-font text-5xl font-bold mb-6">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-[#94A3B8] mb-8">
            Choose the plan that fits your needs. All plans include full code ownership.
          </p>
          
          {/* Student Toggle */}
          <div className="inline-flex items-center space-x-3 glass px-6 py-3 rounded-full">
            <span className={!isStudent ? 'text-[#E6EEF8]' : 'text-[#94A3B8]'}>Regular</span>
            <button
              onClick={() => setIsStudent(!isStudent)}
              className={`w-14 h-7 rounded-full transition-colors ${
                isStudent ? 'bg-[#3B82F6]' : 'bg-white/20'
              } relative`}
              data-testid="student-toggle"
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${
                isStudent ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
            <span className={isStudent ? 'text-[#E6EEF8]' : 'text-[#94A3B8]'}>
              Student (15% off)
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`card ${
                  tier.highlighted
                    ? 'border-2 border-[#3B82F6] relative'
                    : ''
                }`}
                data-testid={`pricing-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-[#94A3B8] mb-4">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold gradient-text">
                    {tier.price ? `₹${calculatePrice(tier.price).toLocaleString()}` : 'Custom'}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-[#22D3EE] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => navigate('/new-project')}
                  className={`w-full ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]'
                      : 'border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white'
                  }`}
                  variant={tier.highlighted ? 'default' : 'outline'}
                  data-testid={`cta-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-font text-3xl font-bold mb-8 text-center">
            Add-on Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon, index) => (
              <div key={index} className="card" data-testid={`addon-${index}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{addon.name}</h3>
                  <span className="text-[#22D3EE] font-semibold">
                    ₹${addon.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-[#94A3B8]">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card border-2 border-[#22D3EE]">
            <div className="flex items-start gap-4">
              <Zap className="w-12 h-12 text-[#22D3EE] flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  Enhance My Existing Project - ₹700
                </h3>
                <p className="text-[#94A3B8] mb-4">
                  Already have a GitHub repository? Connect it and we'll analyze and enhance your project based on your specific requirements. Perfect for adding new features or modernizing existing codebases.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-[#22D3EE]" />
                    <span>Code analysis and recommendations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-[#22D3EE]" />
                    <span>Feature additions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-[#22D3EE]" />
                    <span>Performance optimizations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-[#22D3EE]" />
                    <span>Security improvements</span>
                  </li>
                </ul>
                <p className="text-sm text-[#94A3B8] mb-4">
                  <strong className="text-[#22D3EE]">Important:</strong> By connecting your repo, you grant us temporary read access to analyze your code. We respect all existing licenses and intellectual property rights. Your code ownership remains unchanged.
                </p>
                <Button
                  onClick={() => navigate('/new-project')}
                  className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
                  data-testid="enhance-project-btn"
                >
                  Enhance My Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discounts */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-font text-3xl font-bold mb-8 text-center">
            Special Offers
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card">
              <h3 className="font-bold mb-2">🎓 Student Discount</h3>
              <p className="text-[#94A3B8] text-sm">
                15% off with verified .edu email or college ID
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">🤝 Referral Bonus</h3>
              <p className="text-[#94A3B8] text-sm">
                ₹500 off for each friend who signs up
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">⚙️ Early Adopter</h3>
              <p className="text-[#94A3B8] text-sm">
                First 50 customers get lifetime 20% off
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;