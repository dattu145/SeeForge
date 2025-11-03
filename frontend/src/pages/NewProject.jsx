import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NewProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    category: '',
    platform: 'web',
    frontend: '',
    backend: '',
    ui_template: '',
    features: [],
    addons: [],
    deployment_option: '',
    github_repo_url: '',
    tier: 'Starter',
    is_student: false
  });
  const [pricing, setPricing] = useState(null);

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFeatureToggle = (feature) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleAddonToggle = (addon) => {
    setProjectData(prev => ({
      ...prev,
      addons: prev.addons.includes(addon)
        ? prev.addons.filter(a => a !== addon)
        : [...prev.addons, addon]
    }));
  };

  const calculatePricing = async () => {
    try {
      const response = await axios.post(`${API}/pricing/calculate`, projectData);
      setPricing(response.data);
    } catch (error) {
      console.error('Pricing calculation error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await calculatePricing();
      // In production, create project in database
      const response = await axios.post(`${API}/projects`, projectData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Project creation error:', error);
    }
  };

  React.useEffect(() => {
    if (step === 6) {
      calculatePricing();
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E6EEF8] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-[#94A3B8] hover:text-[#22D3EE] mb-4"
            data-testid="back-to-home-btn"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="heading-font text-4xl font-bold mb-2">Create Your Project</h1>
          <p className="text-[#94A3B8]">Step {step} of {totalSteps} — Tell us about your idea</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Content */}
        <div className="glass rounded-2xl p-8 mb-8">
          {/* Step 1: Project Basics */}
          {step === 1 && (
            <div className="space-y-6" data-testid="step-1">
              <h2 className="text-2xl font-bold mb-6">Project Basics</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Project Name *</label>
                <Input
                  value={projectData.name}
                  onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                  placeholder="My Awesome Startup"
                  className="bg-white/5 border-white/10"
                  data-testid="project-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                  placeholder="Describe your project..."
                  className="bg-white/5 border-white/10 min-h-[120px]"
                  data-testid="project-description-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={projectData.category}
                  onChange={(e) => setProjectData({...projectData, category: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3"
                  data-testid="project-category-select"
                >
                  <option value="">Select category</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="saas">SaaS</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="education">Education/LMS</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Platform *</label>
                <select
                  value={projectData.platform}
                  onChange={(e) => setProjectData({...projectData, platform: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3"
                  data-testid="project-platform-select"
                >
                  <option value="web">Web</option>
                  <option value="mobile">Mobile (PWA)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Frontend */}
          {step === 2 && (
            <div className="space-y-6" data-testid="step-2">
              <h2 className="text-2xl font-bold mb-6">Choose Frontend</h2>
              <div className="grid gap-4">
                {[
                  { value: 'react-vite', title: 'React + Vite', desc: 'Recommended - Fast, modern', time: '+0 days' },
                  { value: 'nextjs', title: 'Next.js', desc: 'SSR/SSG for SEO', time: '+2 days' },
                  { value: 'react-tailwind', title: 'React + Tailwind + shadcn', desc: 'Beautiful UI components', time: '+1 day' },
                  { value: 'vanilla', title: 'HTML/CSS/JS', desc: 'Simple & lightweight', time: '-2 days' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setProjectData({...projectData, frontend: option.value})}
                    className={`card text-left ${
                      projectData.frontend === option.value
                        ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                        : ''
                    }`}
                    data-testid={`frontend-${option.value}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                        <p className="text-[#94A3B8] mb-2">{option.desc}</p>
                        <span className="text-sm text-[#22D3EE]">{option.time}</span>
                      </div>
                      {projectData.frontend === option.value && (
                        <Check className="w-6 h-6 text-[#22D3EE]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Backend */}
          {step === 3 && (
            <div className="space-y-6" data-testid="step-3">
              <h2 className="text-2xl font-bold mb-6">Choose Backend</h2>
              <div className="grid gap-4">
                {[
                  { value: 'supabase', title: 'Supabase (Auth + DB)', desc: 'Recommended for rapid builds', time: '+0 days' },
                  { value: 'firebase', title: 'Firebase', desc: 'Serverless, easy setup', time: '+1 day' },
                  { value: 'nodejs-express', title: 'Node.js + Express', desc: 'Full control, flexible', time: '+3 days' },
                  { value: 'fastapi', title: 'FastAPI + MongoDB', desc: 'Python backend', time: '+3 days' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setProjectData({...projectData, backend: option.value})}
                    className={`card text-left ${
                      projectData.backend === option.value
                        ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                        : ''
                    }`}
                    data-testid={`backend-${option.value}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                        <p className="text-[#94A3B8] mb-2">{option.desc}</p>
                        <span className="text-sm text-[#22D3EE]">{option.time}</span>
                      </div>
                      {projectData.backend === option.value && (
                        <Check className="w-6 h-6 text-[#22D3EE]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: UI Template */}
          {step === 4 && (
            <div className="space-y-6" data-testid="step-4">
              <h2 className="text-2xl font-bold mb-6">UI Template</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { value: 'minimal', title: 'Minimal Dashboard', desc: 'Clean & compact' },
                  { value: 'ecommerce', title: 'E-commerce', desc: 'Product + Checkout' },
                  { value: 'marketplace', title: 'Marketplace', desc: 'Multi-vendor platform' },
                  { value: 'portfolio', title: 'Portfolio', desc: 'Creator showcase' },
                  { value: 'lms', title: 'Education LMS', desc: 'Course platform' },
                  { value: 'custom', title: 'Custom', desc: 'Your design brief' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setProjectData({...projectData, ui_template: option.value})}
                    className={`card text-left ${
                      projectData.ui_template === option.value
                        ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                        : ''
                    }`}
                    data-testid={`ui-template-${option.value}`}
                  >
                    <h3 className="text-lg font-bold mb-2">{option.title}</h3>
                    <p className="text-[#94A3B8]">{option.desc}</p>
                    {projectData.ui_template === option.value && (
                      <Check className="w-5 h-5 text-[#22D3EE] mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Features & Add-ons */}
          {step === 5 && (
            <div className="space-y-6" data-testid="step-5">
              <h2 className="text-2xl font-bold mb-6">Features & Add-ons</h2>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Core Features</h3>
                <div className="space-y-3">
                  {[
                    { id: 'Auth', label: 'Authentication (Email/Google/GitHub)', price: 'Included' },
                    { id: 'Payments', label: 'Payment Integration (Stripe/Razorpay)', price: '₹500' },
                    { id: 'Admin Panel', label: 'Admin Panel (CRUD)', price: '₹1,500' },
                    { id: 'Multi-language', label: 'Multi-language (i18n)', price: '₹800' },
                    { id: 'Chat Support', label: 'Chat/Support Widget', price: '₹1,200' },
                    { id: 'SEO Setup', label: 'SEO & Meta Setup', price: 'Included' }
                  ].map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between card">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={projectData.features.includes(feature.id)}
                          onCheckedChange={() => handleFeatureToggle(feature.id)}
                          data-testid={`feature-${feature.id}`}
                        />
                        <label className="cursor-pointer">{feature.label}</label>
                      </div>
                      <span className="text-[#22D3EE] font-semibold">{feature.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Add-on Services</h3>
                <div className="space-y-3">
                  {[
                    { id: 'Custom Domain Setup', label: 'Custom Domain Setup', price: '₹499' },
                    { id: 'Logo + Branding Pack', label: 'Logo + Branding Pack', price: '₹799' },
                    { id: 'SEO Optimization', label: 'SEO Optimization', price: '₹999' },
                    { id: 'AI Assistant Integration', label: 'AI Assistant Integration', price: '₹1,499' },
                    { id: 'Analytics Dashboard', label: 'Analytics Dashboard', price: '₹499' },
                    { id: 'Maintenance Support', label: 'Maintenance Support (monthly)', price: '₹999/mo' }
                  ].map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between card">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={projectData.addons.includes(addon.id)}
                          onCheckedChange={() => handleAddonToggle(addon.id)}
                          data-testid={`addon-${addon.id}`}
                        />
                        <label className="cursor-pointer">{addon.label}</label>
                      </div>
                      <span className="text-[#22D3EE] font-semibold">{addon.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Enhancement Option */}
              <div className="card border-2 border-[#22D3EE]">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-[#22D3EE]" />
                  Enhance My Existing Project
                </h3>
                <p className="text-[#94A3B8] mb-4">
                  Already have a GitHub repository? Connect it and we'll enhance your project based on your requirements.
                </p>
                <Input
                  value={projectData.github_repo_url}
                  onChange={(e) => setProjectData({...projectData, github_repo_url: e.target.value})}
                  placeholder="https://github.com/username/repo"
                  className="bg-white/5 border-white/10 mb-3"
                  data-testid="github-repo-input"
                />
                <p className="text-sm text-[#94A3B8]">
                  Base price: ₹700 (may vary based on requirements)
                  <br />
                  <span className="text-[#22D3EE]">Note:</span> By connecting your repo, you agree to grant read access. We respect your code ownership and licensing.
                </p>
              </div>

              {/* Student Discount */}
              <div className="flex items-center space-x-3 card">
                <Checkbox
                  checked={projectData.is_student}
                  onCheckedChange={(checked) => setProjectData({...projectData, is_student: checked})}
                  data-testid="student-discount-checkbox"
                />
                <label className="cursor-pointer">
                  I'm a student (15% discount with verification)
                </label>
              </div>
            </div>
          )}

          {/* Step 6: Review & Pricing */}
          {step === 6 && (
            <div className="space-y-6" data-testid="step-6">
              <h2 className="text-2xl font-bold mb-6">Review & Pricing</h2>
              
              {/* Project Summary */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Project Summary</h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p><span className="text-[#E6EEF8] font-medium">Name:</span> {projectData.name}</p>
                  <p><span className="text-[#E6EEF8] font-medium">Category:</span> {projectData.category}</p>
                  <p><span className="text-[#E6EEF8] font-medium">Frontend:</span> {projectData.frontend}</p>
                  <p><span className="text-[#E6EEF8] font-medium">Backend:</span> {projectData.backend}</p>
                  <p><span className="text-[#E6EEF8] font-medium">UI Template:</span> {projectData.ui_template}</p>
                  <p><span className="text-[#E6EEF8] font-medium">Features:</span> {projectData.features.length} selected</p>
                  <p><span className="text-[#E6EEF8] font-medium">Add-ons:</span> {projectData.addons.length} selected</p>
                </div>
              </div>

              {/* Pricing Breakdown */}
              {pricing && (
                <div className="card border-2 border-[#3B82F6]">
                  <h3 className="text-xl font-semibold mb-4">Pricing Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Base Package</span>
                      <span>₹{pricing.base_cost.toLocaleString()}</span>
                    </div>
                    {pricing.features_cost > 0 && (
                      <div className="flex justify-between">
                        <span>Features</span>
                        <span>₹{pricing.features_cost.toLocaleString()}</span>
                      </div>
                    )}
                    {pricing.addons_cost > 0 && (
                      <div className="flex justify-between">
                        <span>Add-ons</span>
                        <span>₹{pricing.addons_cost.toLocaleString()}</span>
                      </div>
                    )}
                    {projectData.is_student && (
                      <div className="flex justify-between text-[#22D3EE]">
                        <span>Student Discount (15%)</span>
                        <span>-₹{((pricing.base_cost + pricing.features_cost + pricing.addons_cost) * 0.15).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3 mt-3">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Total</span>
                        <span className="gradient-text">₹{pricing.total_cost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Estimated Timeline</h3>
                <p className="text-3xl font-bold text-[#22D3EE]">2-3 weeks</p>
                <p className="text-[#94A3B8] mt-2">From project kickoff to deployment</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={step === 1}
            className="border-white/20"
            data-testid="back-step-btn"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
              data-testid="next-step-btn"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
              data-testid="submit-project-btn"
            >
              Start Project
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProject;