import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Check, Zap, ArrowLeft, Code2, Rocket, Star, Plus, Clock } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';

// Import JSON data
import pricingTiers from '@/data/pricingTiers.json';
import miniServices from '@/data/miniServices.json';
import specialOffers from '@/data/specialOffers.json';
import frontendStacks from '@/data/techStacks.json';
import backendStacks from '@/data/techStacks.json';
import uiTemplates from '@/data/uiTemplates.json';

const Pricing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useProject();
  const { navigateToWorkflow, navigateFromPricing } = useSmartNavigation();
  
  const [isStudent, setIsStudent] = useState(state.projectConfig.is_student || false);

  const calculatePrice = (basePrice) => {
    if (!basePrice) return "Custom";
    return isStudent ? Math.round(basePrice * 0.85) : basePrice;
  };

  // Sync student state with project config
  useEffect(() => {
    if (isStudent !== state.projectConfig.is_student) {
      dispatch({ 
        type: 'UPDATE_PROJECT_CONFIG', 
        payload: { is_student: isStudent } 
      });
    }
  }, [isStudent, dispatch]);

  const handleGetStarted = (tier) => {
    // Update tier in project config
    dispatch({ 
      type: 'UPDATE_PROJECT_CONFIG', 
      payload: { tier: tier.id } 
    });
    
    // Navigate based on whether user has a project configured
    if (state.projectConfig.name) {
      // User has project config, proceed to checkout
      navigate('/checkout');
    } else {
      // User is browsing pricing, start new project
      navigateToWorkflow('new-project', { reset: true });
    }
  };

  const handleEnhanceProject = () => {
    navigateToWorkflow('new-project', { reset: true });
  };

  const handleBackToProject = () => {
    navigateToWorkflow('new-project');
  };

  // Check if user has an active project configuration
  const hasActiveProject = state.projectConfig.name && state.projectConfig.category;

  // Get display names for tech stacks
  const getFrontendName = (id) => {
    const stack = frontendStacks.frontend.find(s => s.id === id);
    return stack ? stack.name : id;
  };

  const getBackendName = (id) => {
    const stack = backendStacks.backend.find(s => s.id === id);
    return stack ? stack.name : id;
  };

  const getTemplateName = (id) => {
    const template = uiTemplates.templates.find(t => t.id === id);
    return template ? template.name : id;
  };

  const ProjectSummary = () => {
    if (!hasActiveProject) return null;

    return (
      <div className="mb-8 p-6 border border-[#3B82F6] rounded-lg bg-[#3B82F6]/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#3B82F6]">
            Your Project Configuration
          </h3>
          <Button
            onClick={handleBackToProject}
            variant="outline"
            size="sm"
            className="border-[#3B82F6] text-[#3B82F6]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Project
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-[#94A3B8]">Project:</span>
            <p className="font-medium">{state.projectConfig.name}</p>
          </div>
          <div>
            <span className="text-[#94A3B8]">Category:</span>
            <p className="font-medium">{state.projectConfig.category}</p>
          </div>
          <div>
            <span className="text-[#94A3B8]">Frontend:</span>
            <p className="font-medium">{getFrontendName(state.projectConfig.frontend)}</p>
          </div>
          <div>
            <span className="text-[#94A3B8]">Backend:</span>
            <p className="font-medium">{getBackendName(state.projectConfig.backend)}</p>
          </div>
        </div>
        {state.projectConfig.features && state.projectConfig.features.length > 0 && (
          <div className="mt-3">
            <span className="text-[#94A3B8]">Features:</span>
            <p className="font-medium text-sm">
              {state.projectConfig.features.length} selected
            </p>
          </div>
        )}
        {state.pricing && state.pricing.total > 0 && (
          <div className="mt-4 p-3 bg-[#0A0A0F] rounded border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-[#94A3B8]">Estimated Cost:</span>
              <span className="text-2xl font-bold gradient-text">
                ₹{state.pricing.total.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    );
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
            {hasActiveProject 
              ? "Review pricing for your project configuration" 
              : "Choose the plan that fits your needs. All plans include full code ownership."
            }
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

      {/* Project Summary */}
      <ProjectSummary />

      {/* Context-aware CTA */}
      {hasActiveProject && (
        <section className="pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card border-2 border-[#22D3EE]">
              <Rocket className="w-12 h-12 text-[#22D3EE] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Project?</h3>
              <p className="text-[#94A3B8] mb-6">
                Your project is configured and ready to go! Proceed to checkout to start building.
              </p>
              <Button
                onClick={() => navigate('/checkout')}
                className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-lg px-8 py-6"
                size="lg"
              >
                <Code2 className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Tiers */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="heading-font text-3xl font-bold mb-8 text-center">
            {hasActiveProject ? "Alternative Plans" : "Choose Your Plan"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingTiers.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`card ${
                  tier.highlighted
                    ? 'border-2 border-[#3B82F6] relative'
                    : ''
                }`}
                data-testid={`pricing-tier-${tier.id}`}
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
                  {isStudent && tier.price && (
                    <p className="text-sm text-[#94A3B8] mt-1">
                      <s>₹{tier.price.toLocaleString()}</s> with student discount
                    </p>
                  )}
                  {tier.deliveryTime && (
                    <p className="text-sm text-[#22D3EE] mt-2">
                      ⏱️ {tier.deliveryTime}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-[#22D3EE] flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleGetStarted(tier)}
                  className={`w-full ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]'
                      : 'border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white'
                  }`}
                  variant={tier.highlighted ? 'default' : 'outline'}
                  data-testid={`cta-${tier.id}`}
                >
                  {hasActiveProject ? 'Switch to This Plan' : tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Services */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="heading-font text-3xl font-bold mb-2">
                Mini Services
              </h2>
              <p className="text-[#94A3B8]">
                Individual services you can order separately
              </p>
            </div>
            <div className="text-sm text-[#94A3B8]">
              {miniServices.miniServices.length} services available
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {miniServices.miniServices.map((service) => (
              <div 
                key={service.id} 
                className={`card relative cursor-pointer transition-all duration-200 hover:border-[#3B82F6] hover:scale-105 ${
                  service.popular ? 'border-2 border-[#22D3EE]' : 'border-white/10'
                }`}
                onClick={() => navigate(`/mini-service/${service.id}`)}
                data-testid={`mini-service-${service.id}`}
              >
                {service.popular && (
                  <div className="absolute -top-2 -right-2">
                    <Star className="w-5 h-5 text-[#22D3EE] fill-[#22D3EE]" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{service.name}</h3>
                  <span className="text-[#22D3EE] font-semibold">
                    ₹{service.price.toLocaleString()}
                    {service.recurring ? '/mo' : ''}
                  </span>
                </div>
                <p className="text-sm text-[#94A3B8] mb-2">{service.description}</p>
                <div className="flex justify-between items-center mt-3">
                  {service.category && (
                    <span className="inline-block bg-white/10 text-xs px-2 py-1 rounded text-[#94A3B8]">
                      {service.category}
                    </span>
                  )}
                  <div className="flex items-center text-xs text-[#22D3EE]">
                    <Clock className="w-3 h-3 mr-1" />
                    {service.deliveryTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer - Enhance Existing Project */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card border-2 border-[#22D3EE]">
            <div className="flex items-start gap-4">
              <Zap className="w-12 h-12 text-[#22D3EE] flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  {specialOffers.enhancementOffer.name} - ₹{specialOffers.enhancementOffer.basePrice}
                </h3>
                <p className="text-[#94A3B8] mb-4">
                  {specialOffers.enhancementOffer.description}
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-[#22D3EE]">What We Do:</h4>
                    <ul className="space-y-2">
                      {specialOffers.enhancementOffer.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-[#22D3EE]" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-[#22D3EE]">Benefits:</h4>
                    <ul className="space-y-2">
                      {specialOffers.enhancementOffer.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-[#22D3EE]" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-[#94A3B8] mb-4">
                  <strong className="text-[#22D3EE]">Important:</strong> By connecting your repo, you grant us temporary read access to analyze your code. We respect all existing licenses and intellectual property rights. Your code ownership remains unchanged.
                </p>
                <Button
                  onClick={handleEnhanceProject}
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

      {/* Discounts & Special Offers */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-font text-3xl font-bold mb-8 text-center">
            Special Offers & Discounts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialOffers.offers.map((offer) => (
              <div key={offer.id} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{offer.icon}</span>
                  <h3 className="font-bold">{offer.name}</h3>
                </div>
                <p className="text-[#94A3B8] text-sm mb-3">
                  {offer.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#22D3EE] font-semibold">
                    {offer.discount}{typeof offer.discount === 'number' ? '% off' : ''}
                  </span>
                  {offer.limited && (
                    <span className="text-xs bg-[#FFD700] text-black px-2 py-1 rounded">
                      Limited
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;