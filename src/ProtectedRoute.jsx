import React, {useEffect} from 'react'
import { useAuth } from './hooks/useAuth'
import Legalease from './assets/images/Legalease.png'
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({allRoles}) => {
    const { user,role, loading, processed } = useAuth();
    const navigate = useNavigate();

     useEffect(() => {
        // Skip routing logic if the auth state is still loading
        if (loading || !processed) return;

        
        if (!user) {

            if (sessionStorage.getItem("logged_out")) {
                sessionStorage.removeItem("logged_out");
                return;
            }
            toast.error("You need to be logged in to access this page.");
            navigate('/login', { replace: true });
            return;
        }

        // User doesn't have the required role
        if (allRoles && !allRoles.includes(role)) {
            toast.error("You do not have permission to access this page.");
            navigate('/', { replace: true });
        }
    }, [user, role, loading, processed, allRoles, navigate]);

    if (loading || !processed) {
       return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <img src={Legalease} alt="Loading..." className="w-24 h-24 object-contain animate-pulse mb-2" />
            <p className="text-gray-500 font-medium animate-pulse">
            {loading ? "Verifying session..." : "Redirecting..."}
            </p>
        </div>
    ); 
    }

   
  return <Outlet />
}

export default ProtectedRoute