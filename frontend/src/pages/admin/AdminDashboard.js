import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Users, FolderKanban, Layout, Settings } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTemplates: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token') || 'admin-demo-token';
      // In production, fetch real stats
      setStats({
        totalProjects: 42,
        activeProjects: 15,
        totalTemplates: 12,
        totalRevenue: 285000
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const adminSections = [
    {
      icon: <FolderKanban className="w-12 h-12 text-[#3B82F6]" />,
      title: "Projects",
      description: "Manage all customer projects",
      link: "/admin/projects",
      count: stats.totalProjects
    },
    {
      icon: <Layout className="w-12 h-12 text-[#3B82F6]" />,
      title: "Templates",
      description: "Manage project templates",
      link: "/admin/templates",
      count: stats.totalTemplates
    },
    {
      icon: <Users className="w-12 h-12 text-[#3B82F6]" />,
      title: "Users",
      description: "Manage user accounts",
      link: "/admin/users",
      count: 128
    },
    {
      icon: <Settings className="w-12 h-12 text-[#3B82F6]" />,
      title: "Settings",
      description: "Platform configuration",
      link: "/admin/settings",
      count: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E6EEF8]">
      {/* Admin Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => navigate('/admin')}
            >
              <Sparkles className="w-8 h-8 text-[#3B82F6]" />
              <span className="heading-font text-2xl font-bold">SeeForge Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="border-white/20"
                data-testid="view-site-btn"
              >
                View Site
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="heading-font text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-[#94A3B8]">
              Manage your SeeForge platform
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card" data-testid="stat-total-projects">
              <p className="text-[#94A3B8] text-sm mb-2">Total Projects</p>
              <p className="text-3xl font-bold">{stats.totalProjects}</p>
            </div>
            <div className="card" data-testid="stat-active-projects">
              <p className="text-[#94A3B8] text-sm mb-2">Active Projects</p>
              <p className="text-3xl font-bold text-[#22D3EE]">{stats.activeProjects}</p>
            </div>
            <div className="card" data-testid="stat-templates">
              <p className="text-[#94A3B8] text-sm mb-2">Templates</p>
              <p className="text-3xl font-bold">{stats.totalTemplates}</p>
            </div>
            <div className="card" data-testid="stat-revenue">
              <p className="text-[#94A3B8] text-sm mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-[#22D3EE]">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Admin Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {adminSections.map((section, index) => (
              <div 
                key={index} 
                className="card cursor-pointer"
                onClick={() => navigate(section.link)}
                data-testid={`admin-section-${section.title.toLowerCase()}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>{section.icon}</div>
                  {section.count !== null && (
                    <span className="text-2xl font-bold text-[#22D3EE]">
                      {section.count}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                <p className="text-[#94A3B8]">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;