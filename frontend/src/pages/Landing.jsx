import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Rocket, Code2, Palette, Shield } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E6EEF8]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-[#3B82F6]" />
              <span className="heading-font text-2xl font-bold">SeeForge</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-[#22D3EE] transition-colors">Features</a>
              <a href="/pricing" className="hover:text-[#22D3EE] transition-colors">Pricing</a>
              <a href="/how-it-works" className="hover:text-[#22D3EE] transition-colors">How It Works</a>
              <a href="/templates" className="hover:text-[#22D3EE] transition-colors">Templates</a>
            </div>
            <Button 
              onClick={() => navigate('/new-project')} 
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
                <span>Quick Deploy</span>
              </div>
              <div className="flex items-center space-x-2 glass px-6 py-3 rounded-full">
                <Shield className="w-5 h-5 text-[#22D3EE]" />
                <span>Founder-friendly</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                onClick={() => navigate('/new-project')}
                className="text-lg px-8 py-6 bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] hover:opacity-90 transition-opacity"
                data-testid="hero-start-building-btn"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Building
              </Button>
              <Button
                onClick={() => navigate('/templates')}
                variant="outline"
                className="text-lg px-8 py-6 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                data-testid="see-templates-btn"
              >
                See Templates
              </Button>
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
              <div key={index} className="card" data-testid={`feature-card-${index}`}>
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
          <div className="card">
            <h2 className="heading-font text-4xl font-bold mb-6">
              Ready to build your startup?
            </h2>
            <p className="text-xl text-[#94A3B8] mb-8">
              Join founders who are shipping faster with SeeForge
            </p>
            <Button
              onClick={() => navigate('/new-project')}
              className="text-lg px-8 py-6 bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] hover:opacity-90 transition-opacity"
              data-testid="cta-start-building-btn"
            >
              Start Your Project Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="w-6 h-6 text-[#3B82F6]" />
            <span className="heading-font text-xl font-bold">SeeForge</span>
          </div>
          <div className="flex space-x-6 text-[#94A3B8]">
            <a href="/pricing" className="hover:text-[#22D3EE]">Pricing</a>
            <a href="/how-it-works" className="hover:text-[#22D3EE]">How it Works</a>
            <a href="/templates" className="hover:text-[#22D3EE]">Templates</a>
            <a href="#" className="hover:text-[#22D3EE]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;