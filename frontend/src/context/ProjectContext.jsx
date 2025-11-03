import React, { createContext, useContext, useReducer } from 'react';

const ProjectContext = createContext();

const initialState = {
  selectedTemplate: null,
  projectConfig: {
    name: '',
    description: '',
    category: '',
    platform: 'web',
    frontend: '',
    backend: '',
    ui_template: '',
    features: [],
    addons: [],
    deployment_option: 'vercel',
    github_repo_url: '',
    tier: 'Starter',
    is_student: false
  },
  pricing: {
    basePrice: 0,
    addonsPrice: 0,
    total: 0,
    timeline: '2-3 weeks'
  },
  currentStep: 'landing'
};

function projectReducer(state, action) {
  switch (action.type) {
    case 'SELECT_TEMPLATE':
      return {
        ...state,
        selectedTemplate: action.payload,
        projectConfig: {
          ...state.projectConfig,
          category: action.payload.category,
          frontend: action.payload.tech_stack?.frontend || '',
          backend: action.payload.tech_stack?.backend || '',
          ui_template: action.payload.name.toLowerCase().replace(/\s+/g, '-'),
          tier: 'Starter'
        },
        currentStep: 'project'
      };
    
    case 'UPDATE_PROJECT_CONFIG':
      return {
        ...state,
        projectConfig: { ...state.projectConfig, ...action.payload }
      };
    
    case 'SET_PRICING':
      return {
        ...state,
        pricing: action.payload,
        currentStep: 'pricing'
      };
    
    case 'RESET_PROJECT':
      return initialState;
    
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
    
    default:
      return state;
  }
}

export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  
  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};