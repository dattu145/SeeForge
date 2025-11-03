import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Zap, Star } from "lucide-react";
import { useProject } from '@/context/ProjectContext';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';

// Import JSON data
import uiTemplates from '@/data/uiTemplates.json';

const Templates = () => {
  const navigate = useNavigate();
  const { dispatch } = useProject();
  const { navigateToWorkflow } = useSmartNavigation();
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Use JSON data directly instead of API call
    setTemplates(uiTemplates.templates);
  }, []);

  const handleUseTemplate = (template) => {
    // Use smart navigation to go to new-project with template data
    navigateToWorkflow('new-project', { template });
  };

  const handleStartFromScratch = () => {
    // Reset project and go to new project page
    navigateToWorkflow('new-project', { reset: true });
  };

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E6EEF8]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Sparkles className="w-8 h-8 text-[#3B82F6]" />
              <span className="heading-font text-2xl font-bold">SeeForge</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/dashboard" className="hover:text-[#22D3EE]">
                Dashboard
              </Link>
              <Link to="/pricing" className="hover:text-[#22D3EE]">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 text-center">
        <h1 className="heading-font text-5xl font-bold mb-4">
          Choose Your <span className="gradient-text">Template</span>
        </h1>
        <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
          Start with a professionally designed template and customize it to match your vision
        </p>
        
        {/* Start from Scratch Option */}
        <div className="mt-8">
          <Button
            onClick={handleStartFromScratch}
            variant="outline"
            className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            Start from Scratch Instead
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3">
          {uiTemplates.categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category.value
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-white"
                  : "glass hover:border-[#3B82F6]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-[#3B82F6] text-xl">
              Loading templates...
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="card overflow-hidden hover:scale-105 transition-transform duration-300 relative"
                  data-testid={`template-${template.id}`}
                >
                  {/* Popular Badge */}
                  {template.popular && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Popular
                      </span>
                    </div>
                  )}

                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={template.preview_image}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#3B82F6] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {template.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                  <p className="text-[#94A3B8] mb-4">{template.description}</p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-[#94A3B8] mb-2">
                        Key Features:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {template.features?.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full glass"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features?.length > 3 && (
                          <span className="text-xs px-3 py-1 rounded-full glass">
                            +{template.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-[#94A3B8]">
                        <Clock className="w-4 h-4" />
                        <span>{template.estimated_build_time}</span>
                      </div>
                      <div className="text-[#22D3EE] font-semibold">
                        {typeof template.base_price === 'number' 
                          ? `₹${template.base_price.toLocaleString()}`
                          : template.base_price
                        }
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-sm text-[#94A3B8] mb-1">Tech Stack:</p>
                      <div className="flex flex-wrap gap-1 text-xs">
                        <span className="px-2 py-1 rounded bg-[#3B82F6]/20 text-[#3B82F6]">
                          {template.tech_stack?.frontend}
                        </span>
                        <span className="px-2 py-1 rounded bg-[#22D3EE]/20 text-[#22D3EE]">
                          {template.tech_stack?.backend}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleUseTemplate(template)}
                    className={`w-full ${
                      template.isCustom 
                        ? 'border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white'
                        : 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] hover:opacity-90 transition-opacity'
                    }`}
                    variant={template.isCustom ? 'outline' : 'default'}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {template.isCustom ? 'Start Custom Project' : 'Use This Template'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[#94A3B8] py-20">
              No templates found in this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Templates;