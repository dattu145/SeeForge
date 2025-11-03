import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowLeft, ExternalLink, Code2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('admin_token') || 'admin-demo-token';
      const response = await axios.get(`${API}/admin/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'text-yellow-400',
      'in_progress': 'text-blue-400',
      'completed': 'text-green-400',
      'deployed': 'text-[#22D3EE]'
    };
    return colors[status] || 'text-gray-400';
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
            <div />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="heading-font text-4xl font-bold mb-2">All Projects</h1>
            <p className="text-[#94A3B8]">
              Monitor and manage customer projects
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="loading text-[#3B82F6] text-xl">Loading projects...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="card max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">No projects yet</h2>
                <p className="text-[#94A3B8]">
                  Projects will appear here once customers create them
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="card" data-testid={`admin-project-${project.id}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                      <span className={`text-sm font-semibold ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <Code2 className="w-8 h-8 text-[#3B82F6]" />
                  </div>

                  <p className="text-[#94A3B8] mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">User ID:</span>
                      <span className="text-xs">{project.user_id?.slice(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Category:</span>
                      <span>{project.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Frontend:</span>
                      <span>{project.frontend}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Backend:</span>
                      <span>{project.backend}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Cost:</span>
                      <span className="text-[#22D3EE] font-semibold">
                        ₹{project.estimated_cost?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-white/20"
                      size="sm"
                    >
                      View Details
                    </Button>
                    {project.deployed_url && (
                      <Button 
                        variant="outline" 
                        className="border-white/20"
                        size="sm"
                        onClick={() => window.open(project.deployed_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;