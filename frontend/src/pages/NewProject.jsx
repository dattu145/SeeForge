import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles, Check, Zap, Star, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useProject } from '@/context/ProjectContext';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';

// Import JSON data
import frontendStacks from '@/data/techStacks.json';
import backendStacks from '@/data/techStacks.json';
import uiTemplates from '@/data/uiTemplates.json';
import featuresAddons from '@/data/featuresAddons.json';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NewProject = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useProject();
  const { navigateToWorkflow } = useSmartNavigation();

  const [step, setStep] = useState(1);
  const [pricing, setPricing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customDesignDescription, setCustomDesignDescription] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  // Use project data from context instead of local state
  const projectData = state.projectConfig;

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Update project config in context
  const updateProjectConfig = (updates) => {
    dispatch({ type: 'UPDATE_PROJECT_CONFIG', payload: updates });
  };

  const handleFeatureToggle = (featureId) => {
    const newFeatures = projectData.features.includes(featureId)
      ? projectData.features.filter(f => f !== featureId)
      : [...projectData.features, featureId];

    updateProjectConfig({ features: newFeatures });
  };

  const handleAddonToggle = (addonId) => {
    const newAddons = projectData.addons.includes(addonId)
      ? projectData.addons.filter(a => a !== addonId)
      : [...projectData.addons, addonId];

    updateProjectConfig({ addons: newAddons });
  };

  const handleTemplateSelect = (templateId) => {
    updateProjectConfig({ ui_template: templateId });

    // Show custom description input if custom template is selected
    if (templateId === 'custom') {
      setShowCustomPrompt(true);
    } else {
      setShowCustomPrompt(false);
      setCustomDesignDescription('');
    }
  };

  const handleCustomDescriptionChange = (description) => {
    setCustomDesignDescription(description);
    updateProjectConfig({ custom_design_description: description });
  };

  const calculatePricing = async () => {
    try {
      const response = await axios.post(`${API}/pricing/calculate`, {
        ...projectData,
        custom_design_description: customDesignDescription
      });
      setPricing(response.data);

      // Update pricing in context
      dispatch({
        type: 'SET_PRICING',
        payload: {
          basePrice: response.data.base_cost,
          addonsPrice: response.data.addons_cost,
          featuresPrice: response.data.features_cost,
          total: response.data.total_cost,
          timeline: response.data.timeline || '2-3 weeks'
        }
      });
    } catch (error) {
      console.error('Pricing calculation error:', error);
      // Fallback pricing calculation
      const baseCost = 3000;
      const featuresCost = projectData.features.reduce((total, featureId) => {
        const feature = featuresAddons.features.find(f => f.id === featureId);
        return total + (feature?.price || 0);
      }, 0);
      const addonsCost = projectData.addons.reduce((total, addonId) => {
        const addon = featuresAddons.addons.find(a => a.id === addonId);
        return total + (addon?.price || 0);
      }, 0);

      const subtotal = baseCost + featuresCost + addonsCost;
      const discount = projectData.is_student ? subtotal * 0.15 : 0;
      const totalCost = subtotal - discount;

      const fallbackPricing = {
        base_cost: baseCost,
        features_cost: featuresCost,
        addons_cost: addonsCost,
        discount: discount,
        total_cost: totalCost,
        timeline: '2-3 weeks'
      };
      setPricing(fallbackPricing);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create project in database
      const response = await axios.post(`${API}/projects`, {
        ...projectData,
        custom_design_description: customDesignDescription
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
        }
      });

      // Reset project and navigate to dashboard
      dispatch({ type: 'RESET_PROJECT' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Project creation error:', error);
      // For demo purposes, still navigate to dashboard
      dispatch({ type: 'RESET_PROJECT' });
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPricing = () => {
    calculatePricing();
    navigateToWorkflow('pricing');
  };

  useEffect(() => {
    if (step === 6) {
      calculatePricing();
    }
  }, [step]);

  // Show selected template info if coming from templates
  const SelectedTemplateInfo = () => {
    if (!state.selectedTemplate) return null;

    return (
      <div className="mb-6 p-4 border border-[#3B82F6] rounded-lg bg-[#3B82F6]/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#3B82F6]">
              Using Template: {state.selectedTemplate.name}
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Some fields have been pre-filled based on your template selection
            </p>
          </div>
          <Zap className="w-6 h-6 text-[#3B82F6]" />
        </div>
      </div>
    );
  };

  // Custom Template Highlight Component
  const CustomTemplateHighlight = () => (
    <div className="relative">
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#3B82F6] to-blue-300 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse">
        Popular
      </div>
    </div>
  );

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

        {/* Selected Template Info */}
        <SelectedTemplateInfo />

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Content */}
        <div className="glass rounded-2xl p-6 mb-8">
          {/* Step 1: Project Basics */}
          {step === 1 && (
            <div className="space-y-6" data-testid="step-1">
              <h2 className="text-2xl font-bold mb-6">Project Basics</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Project Name *</label>
                <Input
                  value={projectData.name}
                  onChange={(e) => updateProjectConfig({ name: e.target.value })}
                  placeholder="My Awesome Startup"
                  className="bg-white/5 border-white/10"
                  data-testid="project-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={projectData.description}
                  onChange={(e) => updateProjectConfig({ description: e.target.value })}
                  placeholder="Describe your project..."
                  className="bg-white/5 border-white/10 min-h-[120px]"
                  data-testid="project-description-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={projectData.category}
                  onChange={(e) => updateProjectConfig({ category: e.target.value })}
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
                  onChange={(e) => updateProjectConfig({ platform: e.target.value })}
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
              <h2 className="text-2xl font-bold mb-6">Choose Frontend Technology</h2>
              <div className="grid gap-4">
                {frontendStacks.frontend.map((stack) => (
                  <button
                    key={stack.id}
                    onClick={() => updateProjectConfig({ frontend: stack.id })}
                    className={`card text-left transition-all duration-200 ${projectData.frontend === stack.id
                        ? 'border-[#3B82F6] bg-[#3B82F6]/10 ring-2 ring-[#3B82F6]'
                        : 'hover:border-white/30'
                      }`}
                    data-testid={`frontend-${stack.id}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{stack.name}</h3>
                          {stack.recommended && (
                            <span className="bg-[#22D3EE] text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-[#94A3B8] mb-3">{stack.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-[#22D3EE] font-semibold">{stack.timeImpact}</span>
                          <span className="text-[#94A3B8]">Best for: {stack.bestFor}</span>
                        </div>
                      </div>
                      {projectData.frontend === stack.id && (
                        <Check className="w-6 h-6 text-[#22D3EE] flex-shrink-0 ml-4" />
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
              <h2 className="text-2xl font-bold mb-6">Choose Backend Technology</h2>
              <div className="grid gap-4">
                {backendStacks.backend.map((stack) => (
                  <button
                    key={stack.id}
                    onClick={() => updateProjectConfig({ backend: stack.id })}
                    className={`card text-left transition-all duration-200 ${projectData.backend === stack.id
                        ? 'border-[#3B82F6] bg-[#3B82F6]/10 ring-2 ring-[#3B82F6]'
                        : 'hover:border-white/30'
                      }`}
                    data-testid={`backend-${stack.id}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{stack.name}</h3>
                          {stack.recommended && (
                            <span className="bg-[#22D3EE] text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-[#94A3B8] mb-3">{stack.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-[#22D3EE] font-semibold">{stack.timeImpact}</span>
                          <span className="text-[#94A3B8]">Best for: {stack.bestFor}</span>
                        </div>
                      </div>
                      {projectData.backend === stack.id && (
                        <Check className="w-6 h-6 text-[#22D3EE] flex-shrink-0 ml-4" />
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
              <h2 className="text-2xl font-bold mb-6">Choose UI Template</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uiTemplates.templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`card text-left transition-all duration-200 relative border border-white/10 ${projectData.ui_template === template.id
                        ? 'border-[#3B82F6] bg-[#3B82F6]/10 ring-2 ring-[#3B82F6]'
                        : 'hover:border-[#3B82F6]/50 hover:bg-white/5'
                      } ${template.isCustom ? 'border-2 border-dashed border-[#3B82F6]' : ''}`}
                    data-testid={`ui-template-${template.id}`}
                  >
                    {template.isCustom && <CustomTemplateHighlight />}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                          {template.name}
                          {template.isCustom && <Sparkles className="w-4 h-4 text-[#3B82F6]" />}
                        </h3>
                        <p className="text-[#94A3B8] text-sm">{template.description}</p>
                      </div>
                      {projectData.ui_template === template.id && (
                        <Check className="w-5 h-5 text-[#22D3EE] flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Design Description */}
              {showCustomPrompt && (
                <div className="mt-6 card border-2 border-[#3B82F6] bg-[#3B82F6]/5">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-[#3B82F6]" />
                    <h3 className="text-lg font-bold text-[#3B82F6]">Describe Your Vision</h3>
                  </div>
                  <Textarea
                    value={customDesignDescription}
                    onChange={(e) => handleCustomDescriptionChange(e.target.value)}
                    placeholder="Tell us about your design requirements, color preferences, layout ideas, and any specific features you want. The more details you provide, the better we can bring your vision to life!"
                    className="bg-white/5 border-white/10 min-h-[120px] text-white"
                    data-testid="custom-design-textarea"
                  />
                  <p className="text-sm text-[#94A3B8] mt-2">
                    Our designers will review your description and create a unique design tailored to your needs.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Features & Add-ons */}
          {step === 5 && (
            <div className="space-y-8" data-testid="step-5">
              <h2 className="text-2xl font-bold mb-6">Features & Add-ons</h2>

              {/* Core Features */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Core Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {featuresAddons.features.map((feature) => (
                    <div
                      key={feature.id}
                      className={`card cursor-pointer transition-all duration-200 ${projectData.features.includes(feature.id)
                          ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                          : 'hover:border-white/30'
                        }`}
                      onClick={() => handleFeatureToggle(feature.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={projectData.features.includes(feature.id)}
                            onCheckedChange={() => handleFeatureToggle(feature.id)}
                            data-testid={`feature-${feature.id}`}
                          />
                          <div className="flex-1">
                            <label className="cursor-pointer font-medium block mb-1">
                              {feature.name}
                            </label>
                            <p className="text-sm text-[#94A3B8]">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-[#22D3EE] font-semibold whitespace-nowrap ml-2">
                          {feature.included ? 'Included' : `₹${feature.price}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-on Services */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Add-on Services</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {featuresAddons.addons.map((addon) => (
                    <div
                      key={addon.id}
                      className={`card cursor-pointer transition-all duration-200 ${projectData.addons.includes(addon.id)
                          ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                          : 'hover:border-white/30'
                        }`}
                      onClick={() => handleAddonToggle(addon.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={projectData.addons.includes(addon.id)}
                            onCheckedChange={() => handleAddonToggle(addon.id)}
                            data-testid={`addon-${addon.id}`}
                          />
                          <div className="flex-1">
                            <label className="cursor-pointer font-medium block mb-1">
                              {addon.name}
                            </label>
                            <p className="text-sm text-[#94A3B8]">
                              {addon.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-[#22D3EE] font-semibold whitespace-nowrap ml-2">
                          ₹{addon.price}{addon.recurring ? '/mo' : ''}
                        </span>
                      </div>
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
                  onChange={(e) => updateProjectConfig({ github_repo_url: e.target.value })}
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
                  onCheckedChange={(checked) => updateProjectConfig({ is_student: checked })}
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><span className="text-[#E6EEF8] font-medium">Name:</span> {projectData.name}</p>
                    <p><span className="text-[#E6EEF8] font-medium">Category:</span> {projectData.category}</p>
                    <p><span className="text-[#E6EEF8] font-medium">Platform:</span> {projectData.platform}</p>
                  </div>
                  <div>
                    <p><span className="text-[#E6EEF8] font-medium">Frontend:</span> {frontendStacks.frontend.find(f => f.id === projectData.frontend)?.name}</p>
                    <p><span className="text-[#E6EEF8] font-medium">Backend:</span> {backendStacks.backend.find(b => b.id === projectData.backend)?.name}</p>
                    <p><span className="text-[#E6EEF8] font-medium">UI Template:</span> {uiTemplates.templates.find(t => t.id === projectData.ui_template)?.name}</p>
                  </div>
                </div>

                {/* Selected Features & Add-ons */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Selected Features ({projectData.features.length})</h4>
                      <ul className="text-sm text-[#94A3B8] space-y-1">
                        {projectData.features.map(featureId => {
                          const feature = featuresAddons.features.find(f => f.id === featureId);
                          return feature ? <li key={featureId}>• {feature.name}</li> : null;
                        })}
                        {projectData.features.length === 0 && <li>No features selected</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Selected Add-ons ({projectData.addons.length})</h4>
                      <ul className="text-sm text-[#94A3B8] space-y-1">
                        {projectData.addons.map(addonId => {
                          const addon = featuresAddons.addons.find(a => a.id === addonId);
                          return addon ? <li key={addonId}>• {addon.name}</li> : null;
                        })}
                        {projectData.addons.length === 0 && <li>No add-ons selected</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Custom Design Description */}
                {customDesignDescription && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="font-medium mb-2">Custom Design Requirements</h4>
                    <p className="text-sm text-[#94A3B8]">{customDesignDescription}</p>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              {pricing && (
                <div className="card border-2 border-[#3B82F6]">
                  <h3 className="text-xl font-semibold mb-4">Pricing Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Base Package</span>
                      <span>₹{pricing.base_cost?.toLocaleString() || '0'}</span>
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
                        <span>-₹{pricing.discount?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3 mt-3">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Total</span>
                        <span className="gradient-text">₹{pricing.total_cost?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Estimated Timeline</h3>
                <p className="text-3xl font-bold text-[#22D3EE]">{pricing?.timeline || '2-3 weeks'}</p>
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
            <div className="flex gap-4">
              <Button
                onClick={goToPricing}
                variant="outline"
                className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
              >
                View Detailed Pricing
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
                data-testid="submit-project-btn"
              >
                {isSubmitting ? (
                  <>Creating Project...</>
                ) : (
                  <>
                    Start Project
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProject;