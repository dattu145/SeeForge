import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    preview_image: '',
    features: '',
    tech_stack_frontend: '',
    tech_stack_backend: '',
    estimated_build_time: '',
    base_price: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API}/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      preview_image: '',
      features: '',
      tech_stack_frontend: '',
      tech_stack_backend: '',
      estimated_build_time: '',
      base_price: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      preview_image: template.preview_image,
      features: template.features.join(', '),
      tech_stack_frontend: template.tech_stack.frontend,
      tech_stack_backend: template.tech_stack.backend,
      estimated_build_time: template.estimated_build_time,
      base_price: template.base_price.toString()
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token') || 'admin-demo-token';
      const templateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        preview_image: formData.preview_image,
        features: formData.features.split(',').map(f => f.trim()),
        tech_stack: {
          frontend: formData.tech_stack_frontend,
          backend: formData.tech_stack_backend
        },
        estimated_build_time: formData.estimated_build_time,
        base_price: parseFloat(formData.base_price)
      };

      if (editingTemplate) {
        await axios.put(`${API}/admin/templates/${editingTemplate.id}`, templateData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success('Template updated successfully');
      } else {
        await axios.post(`${API}/admin/templates`, templateData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success('Template created successfully');
      }
      
      setIsModalOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    try {
      const token = localStorage.getItem('admin_token') || 'admin-demo-token';
      await axios.delete(`${API}/admin/templates/${templateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E6EEF8]">
      {/* Admin Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-[#94A3B8] hover:text-[#22D3EE]"
                data-testid="back-to-admin-btn"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </button>
            </div>
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => navigate('/admin')}
            >
              <Sparkles className="w-8 h-8 text-[#3B82F6]" />
              <span className="heading-font text-2xl font-bold">SeeForge Admin</span>
            </div>
            <Button 
              onClick={handleCreate}
              className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
              data-testid="create-template-btn"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Template
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="heading-font text-4xl font-bold mb-2">Manage Templates</h1>
            <p className="text-[#94A3B8]">
              Create and manage project templates
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="loading text-[#3B82F6] text-xl">Loading templates...</div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-20">
              <div className="card max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">No templates yet</h2>
                <p className="text-[#94A3B8] mb-6">
                  Create your first project template
                </p>
                <Button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Template
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="card" data-testid={`template-card-${template.id}`}>
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={template.preview_image} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  <p className="text-[#94A3B8] mb-4 line-clamp-2">{template.description}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Category:</span>
                      <span>{template.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Price:</span>
                      <span className="text-[#22D3EE]">₹{template.base_price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(template)}
                      variant="outline"
                      className="flex-1 border-white/20"
                      size="sm"
                      data-testid={`edit-template-${template.id}`}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(template.id)}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      size="sm"
                      data-testid={`delete-template-${template.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-[#0A0A0F] border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Template Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="bg-white/5 border-white/10"
                data-testid="template-name-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                className="bg-white/5 border-white/10"
                data-testid="template-description-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  className="bg-white/5 border-white/10"
                  data-testid="template-category-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Base Price (₹) *</label>
                <Input
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                  required
                  className="bg-white/5 border-white/10"
                  data-testid="template-price-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preview Image URL *</label>
              <Input
                value={formData.preview_image}
                onChange={(e) => setFormData({...formData, preview_image: e.target.value})}
                required
                className="bg-white/5 border-white/10"
                data-testid="template-image-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Features (comma-separated) *</label>
              <Textarea
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                required
                className="bg-white/5 border-white/10"
                placeholder="Auth, Dashboard, Analytics"
                data-testid="template-features-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Frontend Tech *</label>
                <Input
                  value={formData.tech_stack_frontend}
                  onChange={(e) => setFormData({...formData, tech_stack_frontend: e.target.value})}
                  required
                  className="bg-white/5 border-white/10"
                  placeholder="React + Tailwind"
                  data-testid="template-frontend-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Backend Tech *</label>
                <Input
                  value={formData.tech_stack_backend}
                  onChange={(e) => setFormData({...formData, tech_stack_backend: e.target.value})}
                  required
                  className="bg-white/5 border-white/10"
                  placeholder="Node.js + MongoDB"
                  data-testid="template-backend-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Build Time *</label>
              <Input
                value={formData.estimated_build_time}
                onChange={(e) => setFormData({...formData, estimated_build_time: e.target.value})}
                required
                className="bg-white/5 border-white/10"
                placeholder="2-3 weeks"
                data-testid="template-buildtime-input"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="flex-1 border-white/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
                data-testid="save-template-btn"
              >
                {editingTemplate ? 'Update' : 'Create'} Template
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTemplates;