import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Rocket, Code2, Palette, Shield, ArrowRight } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';

const Landing = () => {
  const navigate = useNavigate();
  const { dispatch } = useProject();
  const { navigateToWorkflow } = useSmartNavigation();

  const handleStartBuilding = () => {
    // Reset any existing project and start fresh
    navigateToWorkflow('templates', { reset: true });
  };

  const handleSeeTemplates = () => {
    navigateToWorkflow('templates');
  };

  const handleSeePricing = () => {
    // Direct navigation to pricing page
    navigate('/pricing');
  };

  const handleHowItWorks = () => {
    navigate('/how-it-works');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E6EEF8]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Sparkles className="w-8 h-8 text-[#3B82F6]" />
              <span className="heading-font text-2xl font-bold">SeeForge</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-[#22D3EE] transition-colors">Features</a>
              <button onClick={handleSeePricing} className="hover:text-[#22D3EE] transition-colors">Pricing</button>
              <button onClick={handleHowItWorks} className="hover:text-[#22D3EE] transition-colors">How It Works</button>
              <button onClick={handleSeeTemplates} className="hover:text-[#22D3EE] transition-colors">Templates</button>
            </div>
            <Button 
              onClick={handleStartBuilding}
              className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] hover:opacity-90 transition-opacity"
              data-testid="start-building-btn"
            >
              Start Building
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#3B82F6] rounded-full filter blur-[120px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#22D3EE] rounded-full filter blur-[140px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            <h1 className="heading-font text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Have an idea?
              <br />
              <span className="gradient-text">Leave the rest to us.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-[#94A3B8] max-w-3xl mx-auto">
              Transform your startup vision into reality in weeks, not months. 
              AI-powered platform for founders who want to move fast.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center space-x-2 glass px-6 py-3 rounded-full">
                <Zap className="w-5 h-5 text-[#22D3EE]" />
                <span>AI Builder</span>
              </div>
              <div className="flex items-center space-x-2 glass px-6 py-3 rounded-full">
                <Rocket className="w-5 h-5 text-[#22D3EE]" />
                <span>Deploy in 2-3 Weeks</span>
              </div>
              <div className="flex items-center space-x-2 glass px-6 py-3 rounded-full">
                <Shield className="w-5 h-5 text-[#22D3EE]" />
                <span>Full Code Ownership</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                onClick={handleStartBuilding}
                className="text-lg px-8 py-6 bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] hover:opacity-90 transition-opacity"
                data-testid="hero-start-building-btn"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleSeeTemplates}
                variant="outline"
                className="text-lg px-8 py-6 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                data-testid="see-templates-btn"
              >
                Browse Templates
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-12 text-center">
              <div className="glass px-6 py-4 rounded-2xl min-w-[140px]">
                <div className="text-2xl font-bold text-[#22D3EE]">2-3</div>
                <div className="text-sm text-[#94A3B8]">Weeks to MVP</div>
              </div>
              <div className="glass px-6 py-4 rounded-2xl min-w-[140px]">
                <div className="text-2xl font-bold text-[#22D3EE]">100%</div>
                <div className="text-sm text-[#94A3B8]">Code Ownership</div>
              </div>
              <div className="glass px-6 py-4 rounded-2xl min-w-[140px]">
                <div className="text-2xl font-bold text-[#22D3EE]">₹1,499+</div>
                <div className="text-sm text-[#94A3B8]">Starting Price</div>
              </div>
              <div className="glass px-6 py-4 rounded-2xl min-w-[140px]">
                <div className="text-2xl font-bold text-[#22D3EE]">24/7</div>
                <div className="text-sm text-[#94A3B8]">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="heading-font text-4xl sm:text-5xl font-bold text-center mb-16">
            Why <span className="gradient-text">SeeForge</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code2 className="w-12 h-12 text-[#3B82F6]" />,
                title: "AI-Powered Generation",
                description: "Our AI understands your requirements and generates production-ready code, saving weeks of development time."
              },
              {
                icon: <Palette className="w-12 h-12 text-[#3B82F6]" />,
                title: "Beautiful UI Templates",
                description: "Choose from professionally designed templates or let AI create a custom design that matches your brand."
              },
              {
                icon: <Rocket className="w-12 h-12 text-[#3B82F6]" />,
                title: "Deploy in Weeks",
                description: "From idea to deployment in 2-3 weeks. We handle the tech so you can focus on your business."
              },
              {
                icon: <Shield className="w-12 h-12 text-[#3B82F6]" />,
                title: "Production Ready",
                description: "Enterprise-grade security, scalability, and best practices built in from day one."
              },
              {
                icon: <Zap className="w-12 h-12 text-[#3B82F6]" />,
                title: "Enhance Existing Projects",
                description: "Already have a GitHub repo? Connect it and we'll enhance your project based on your requirements."
              },
              {
                icon: <Sparkles className="w-12 h-12 text-[#3B82F6]" />,
                title: "Full Ownership",
                description: "Export clean, documented code. It's your project, your codebase, your IP."
              }
            ].map((feature, index) => (
              <div key={index} className="card hover:scale-105 transition-transform duration-300" data-testid={`feature-card-${index}`}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#94A3B8]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card border-2 border-[#3B82F6]">
            <Sparkles className="w-16 h-16 text-[#3B82F6] mx-auto mb-6" />
            <h2 className="heading-font text-4xl font-bold mb-6">
              Ready to Build Your Startup?
            </h2>
            <p className="text-xl text-[#94A3B8] mb-8 max-w-2xl mx-auto">
              Join hundreds of founders who have launched their MVPs with SeeForge. 
              No technical skills required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartBuilding}
                className="text-lg px-8 py-6 bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] hover:opacity-90 transition-opacity"
                data-testid="cta-start-building-btn"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Project Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleSeePricing}
                variant="outline"
                className="text-lg px-8 py-6 border-white/20 text-white hover:text-white hover:bg-white/10"
              >
                View Pricing Plans
              </Button>
            </div>
            <p className="text-sm text-[#94A3B8] mt-6">
              ₹1,499 starting price • 15-day money-back guarantee • No credit card required to start
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#3B82F6]" />
                <span className="heading-font text-xl font-bold">SeeForge</span>
              </div>
              <p className="text-[#94A3B8] text-sm">
                Building the next generation of startups, one MVP at a time.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <div className="space-y-2 text-sm text-[#94A3B8]">
                <button onClick={handleSeeTemplates} className="block hover:text-[#22D3EE]">Templates</button>
                <button onClick={handleSeePricing} className="block hover:text-[#22D3EE]">Pricing</button>
                <button onClick={handleHowItWorks} className="block hover:text-[#22D3EE]">How It Works</button>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <div className="space-y-2 text-sm text-[#94A3B8]">
                <a href="#" className="block hover:text-[#22D3EE]">Documentation</a>
                <a href="#" className="block hover:text-[#22D3EE]">Blog</a>
                <a href="#" className="block hover:text-[#22D3EE]">Support</a>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <div className="space-y-2 text-sm text-[#94A3B8]">
                <a href="#" className="block hover:text-[#22D3EE]">About</a>
                <a href="#" className="block hover:text-[#22D3EE]">Contact</a>
                <a href="#" className="block hover:text-[#22D3EE]">Careers</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-[#94A3B8]">
            <p>&copy; 2024 SeeForge. All rights reserved. Built for founders, by builders.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;