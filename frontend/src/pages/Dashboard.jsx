import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Code2, Rocket, Download, ExternalLink, Plus } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const response = await axios.get(`${API}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Ensure we always set an array
      const data = response.data;

      if (Array.isArray(data)) {
        setProjects(data);
      } else if (Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        console.warn("Unexpected response shape:", data);
        setProjects([]);
      }

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
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/templates')}
                variant="ghost"
              >
                Templates
              </Button>
              <Button
                onClick={() => navigate('/new-project')}
                className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
                data-testid="new-project-btn"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="heading-font text-4xl font-bold mb-2">Your Projects</h1>
            <p className="text-[#94A3B8]">
              Manage and track all your startup projects in one place
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="loading text-[#3B82F6] text-xl">Loading projects...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="card max-w-md mx-auto">
                <Rocket className="w-16 h-16 text-[#3B82F6] mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">No projects yet</h2>
                <p className="text-[#94A3B8] mb-6">
                  Start building your first project with SeeForge
                </p>
                <Button
                  onClick={() => navigate('/new-project')}
                  className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]"
                  data-testid="create-first-project-btn"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="card" data-testid={`project-card-${project.id}`}>
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
                        ₹{project.estimated_cost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/20"
                      size="sm"
                    >
                      <Code2 className="w-4 h-4 mr-2" />
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
                    {project.status === 'completed' && (
                      <Button
                        variant="outline"
                        className="border-white/20"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
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

export default Dashboard;