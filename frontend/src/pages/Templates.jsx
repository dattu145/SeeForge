import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Zap } from "lucide-react";
import axios from "axios";

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ✅ Use Vite's environment variable syntax
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API}/templates`);
      const data = response.data;

      // ✅ Ensure response is an array
      if (Array.isArray(data)) {
        setTemplates(data);
      } else {
        console.warn("Templates API did not return an array, using demo data.");
        setTemplates(getDemoTemplates());
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplates(getDemoTemplates());
    } finally {
      setLoading(false);
    }
  };

  const getDemoTemplates = () => [
    {
      id: "1",
      name: "E-commerce Starter",
      description:
        "Complete e-commerce platform with product catalog, cart, and checkout",
      category: "ecommerce",
      preview_image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
      features: [
        "Product Management",
        "Shopping Cart",
        "Payment Integration",
        "Admin Dashboard",
      ],
      tech_stack: { frontend: "React + Tailwind", backend: "Node.js + MongoDB" },
      estimated_build_time: "2-3 weeks",
      base_price: 6000,
    },
    {
      id: "2",
      name: "SaaS Dashboard",
      description: "Modern SaaS dashboard with user management and analytics",
      category: "saas",
      preview_image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      features: [
        "User Auth",
        "Analytics Dashboard",
        "Subscription Management",
        "API Integration",
      ],
      tech_stack: { frontend: "Next.js", backend: "Supabase" },
      estimated_build_time: "2 weeks",
      base_price: 8000,
    },
    {
      id: "3",
      name: "Marketplace Platform",
      description: "Multi-vendor marketplace with seller and buyer interfaces",
      category: "marketplace",
      preview_image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      features: [
        "Vendor Dashboard",
        "Product Listings",
        "Order Management",
        "Reviews & Ratings",
      ],
      tech_stack: {
        frontend: "React + Redux",
        backend: "FastAPI + PostgreSQL",
      },
      estimated_build_time: "3-4 weeks",
      base_price: 12000,
    },
    {
      id: "4",
      name: "Portfolio Website",
      description: "Stunning portfolio website for creators and professionals",
      category: "portfolio",
      preview_image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800",
      features: ["Project Showcase", "Blog", "Contact Form", "Admin Panel"],
      tech_stack: { frontend: "Next.js", backend: "Contentful CMS" },
      estimated_build_time: "1 week",
      base_price: 3000,
    },
    {
      id: "5",
      name: "Education LMS",
      description:
        "Learning management system with courses and student tracking",
      category: "education",
      preview_image:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
      features: [
        "Course Management",
        "Video Lessons",
        "Quizzes",
        "Progress Tracking",
      ],
      tech_stack: { frontend: "React", backend: "Firebase" },
      estimated_build_time: "3 weeks",
      base_price: 10000,
    },
    {
      id: "6",
      name: "Booking Platform",
      description: "Service booking platform with calendar and payments",
      category: "saas",
      preview_image:
        "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800",
      features: [
        "Calendar Booking",
        "Payment Processing",
        "Email Notifications",
        "User Profiles",
      ],
      tech_stack: {
        frontend: "React + TypeScript",
        backend: "Node.js + Stripe",
      },
      estimated_build_time: "2-3 weeks",
      base_price: 7000,
    },
  ];

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "saas", label: "SaaS" },
    { value: "marketplace", label: "Marketplace" },
    { value: "portfolio", label: "Portfolio" },
    { value: "education", label: "Education" },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : Array.isArray(templates)
      ? templates.filter((t) => t.category === selectedCategory)
      : [];

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
              <a href="/dashboard" className="hover:text-[#22D3EE]">
                Dashboard
              </a>
              <a href="/pricing" className="hover:text-[#22D3EE]">
                Pricing
              </a>
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
          Start with a professionally designed template and customize it to
          match your vision
        </p>
      </section>

      {/* Category Filter */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
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
                  className="card overflow-hidden"
                  data-testid={`template-${template.id}`}
                >
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={template.preview_image}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                  <p className="text-[#94A3B8] mb-4">{template.description}</p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-[#94A3B8] mb-2">
                        Key Features:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {template.features?.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full glass"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-[#94A3B8]">
                        <Clock className="w-4 h-4" />
                        <span>{template.estimated_build_time}</span>
                      </div>
                      <div className="text-[#22D3EE] font-semibold">
                        ₹{template.base_price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/new-project")}
                    className="w-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Use This Template
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
