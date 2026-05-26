//This files ensures 
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
    navigate('/find-lawyers');
  };

  return {
    redirectToRegister,
    redirectToLogin,
    redirectToLawyers,
  };
};