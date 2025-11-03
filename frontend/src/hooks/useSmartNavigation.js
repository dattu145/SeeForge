import { useNavigate } from 'react-router-dom';
import { useProject } from '@/context/ProjectContext';

export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useProject();

  const navigateToWorkflow = (targetPage, options = {}) => {
    const { template, reset = false } = options;
    
    if (reset) {
      dispatch({ type: 'RESET_PROJECT' });
    }

    switch (targetPage) {
      case 'templates':
        dispatch({ type: 'SET_STEP', payload: 'templates' });
        navigate('/templates');
        break;
      
      case 'new-project':
        if (template) {
          dispatch({ type: 'SELECT_TEMPLATE', payload: template });
        } else {
          dispatch({ type: 'SET_STEP', payload: 'project' });
        }
        navigate('/new-project');
        break;
      
      case 'pricing':
        // Allow direct access to pricing from landing page
        dispatch({ type: 'SET_STEP', payload: 'pricing' });
        navigate('/pricing');
        break;
      
      case 'checkout':
        // Only allow checkout if project is configured
        if (state.projectConfig.name) {
          navigate('/checkout');
        } else {
          // If no project config, redirect to templates first
          navigate('/templates');
        }
        break;
      
      default:
        navigate(targetPage);
    }
  };

  const navigateFromPricing = () => {
    if (state.projectConfig.name) {
      navigate('/checkout');
    } else {
      navigate('/templates');
    }
  };

  return { navigateToWorkflow, navigateFromPricing };
};