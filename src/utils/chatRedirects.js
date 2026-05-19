// Centralized redirect handlers for ChatBox component
// ChatBox handles navigation internally - no props needed from parent pages

import { useNavigate } from 'react-router-dom';

export const useChatRedirects = () => {
  const navigate = useNavigate();

  const redirectToRegister = () => {
    navigate('/signup');
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  const redirectToLawyers = () => {
    navigate('/lawyers');
  };

  return {
    redirectToRegister,
    redirectToLogin,
    redirectToLawyers,
  };
};

// Direct functions (if not using hook)
export const handleTrialLimitRedirect = (navigate) => {
  navigate('/register');
};

export const handleSpeakToLawyerRedirect = (navigate) => {
  navigate('/lawyers');
};
