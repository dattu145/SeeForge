import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, Code2, Rocket, Download, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Lightbulb className="w-12 h-12 text-[#3B82F6]" />,
      title: "Share Your Idea",
      description: "Tell us about your startup vision through our simple wizard. Answer questions about your target market, features, and preferences.",
      details: [
        "Project name and description",
        "Choose your tech stack",
        "Select UI template",
        "Pick features and add-ons"
      ]
    },
    {
      icon: <Code2 className="w-12 h-12 text-[#3B82F6]" />,
      title: "AI Generates Your MVP",
      description: "Our AI analyzes your requirements and generates a complete project scaffold with production-ready code.",
      details: [
        "Frontend components and pages",
        "Backend API endpoints",
        "Database schema",
        "Authentication & security"
      ]
    },
    {
      icon: <Rocket className="w-12 h-12 text-[#3B82F6]" />,
      title: "Review & Deploy",
      description: "Review your project, make adjustments, and deploy to your preferred hosting platform.",
      details: [
        "Preview your application",
        "Request customizations",
        "Deploy to Vercel/Netlify",
        "Connect custom domain"
      ]
    },
    {
      icon: <Download className="w-12 h-12 text-[#3B82F6]" />,
      title: "Own Your Code",
      description: "Export clean, documented code to your GitHub or download as a ZIP. It's your project, you own everything.",
      details: [
        "Full source code access",
        "Documentation included",
        "GitHub repository setup",
        "No vendor lock-in"
      ]
    }
  ];

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
              <a href="/templates" className="hover:text-[#22D3EE]">Templates</a>
              <a href="/pricing" className="hover:text-[#22D3EE]">Pricing</a>
              <a href="/dashboard" className="hover:text-[#22D3EE]">Dashboard</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="heading-font text-5xl font-bold mb-6">
            How <span className="gradient-text">SeeForge</span> Works
          </h1>
          <p className="text-xl text-[#94A3B8]">
            From idea to deployed MVP in weeks, not months
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-8" data-testid={`step-${index}`}>
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] flex items-center justify-center text-2xl font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 card">
                  <div className="mb-4">{step.icon}</div>
                  <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
                  <p className="text-[#94A3B8] text-lg mb-6">{step.description}</p>
                  <div className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-[#22D3EE] flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center">
            <Sparkles className="w-16 h-16 text-[#3B82F6] mx-auto mb-6" />
            <h2 className="heading-font text-3xl font-bold mb-4">
              Ready to See It in Action?
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8">
              Start building your project now and experience the power of AI-assisted development
            </p>
            <Button
              onClick={() => navigate('/new-project')}
              className="text-lg px-8 py-6 bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
              data-testid="start-building-btn"
            >
              Start Building Now
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-font text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How long does it take to build my MVP?",
                a: "Most projects are completed in 2-3 weeks, depending on complexity and features selected."
              },
              {
                q: "Can I modify the code after delivery?",
                a: "Absolutely! You get full source code with documentation. It's your project, modify it as you wish."
              },
              {
                q: "What if I need changes after deployment?",
                a: "We offer maintenance and support packages. You can also make changes yourself or hire any developer."
              },
              {
                q: "Do you support existing projects?",
                a: "Yes! Use our 'Enhance My Project' option to connect your GitHub repo and get AI-powered enhancements."
              }
            ].map((faq, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-bold mb-2">{faq.q}</h3>
                <p className="text-[#94A3B8]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;