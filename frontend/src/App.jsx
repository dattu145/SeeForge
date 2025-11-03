import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Pages
import Landing from './pages/Landing';
import NewProject from './pages/NewProject';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminProjects from './pages/admin/AdminProjects';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop /> 
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/templates" element={<AdminTemplates />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;