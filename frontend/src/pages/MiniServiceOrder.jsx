import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Check, Star, Clock, Mail, Phone } from 'lucide-react';
import miniServices from '@/data/miniServices.json';

const MiniServiceOrder = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDetails: '',
    specialRequirements: ''
  });

  useEffect(() => {
    const foundService = miniServices.miniServices.find(s => s.id === serviceId);
    setService(foundService);
  }, [serviceId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Service Order:', {
      service: service?.name,
      ...formData
    });
    
    // Show success message and redirect
    alert('Thank you! We\'ll contact you within 24 hours to discuss your service requirements.');
    navigate('/');
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-[#E6EEF8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <Button onClick={() => navigate('/pricing')}>Back to Pricing</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E6EEF8] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/pricing')} 
            className="flex items-center text-[#94A3B8] hover:text-[#22D3EE] mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Services
          </button>
          <h1 className="heading-font text-4xl font-bold mb-2">Order {service.name}</h1>
          <p className="text-[#94A3B8]">Fill out the form below and we'll contact you to get started</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <div>
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{service.name}</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold gradient-text">
                    ₹{service.price.toLocaleString()}
                    {service.recurring ? '/mo' : ''}
                  </div>
                  <div className="flex items-center text-sm text-[#22D3EE] mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.deliveryTime}
                  </div>
                </div>
              </div>
              
              <p className="text-[#94A3B8] mb-4">{service.description}</p>
              
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-[#22D3EE]">What's Included:</h3>
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#22D3EE] flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {service.category && (
                <div className="inline-block bg-white/10 text-sm px-3 py-1 rounded text-[#94A3B8]">
                  Category: {service.category}
                </div>
              )}
            </Card>

            {/* How It Works */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-[#22D3EE]" />
                How It Works
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Submit Your Request</h4>
                    <p className="text-sm text-[#94A3B8]">Fill out the form with your details and requirements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">We Contact You</h4>
                    <p className="text-sm text-[#94A3B8]">Our team will reach out within 24 hours to discuss details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Service Delivery</h4>
                    <p className="text-sm text-[#94A3B8]">We deliver the service and you pay upon completion</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 1234567890"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company/Project Name</label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your company or project name"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Details</label>
                <Textarea
                  value={formData.projectDetails}
                  onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                  placeholder="Tell us about your current project or website..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Requirements</label>
                <Textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  placeholder="Any specific requirements or questions about this service?"
                  className="bg-white/5 border-white/10 min-h-[80px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] py-6 text-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Request This Service
              </Button>

              <p className="text-sm text-[#94A3B8] text-center">
                No payment required now. We'll contact you to discuss details and pricing.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MiniServiceOrder;