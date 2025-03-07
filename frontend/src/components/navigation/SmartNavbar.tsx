import React from 'react';
import Navbar from '@/components/navigation/index'; // Unified navbar component
import { useAuth } from '@/components/auth/AuthContext';

const SmartNavbar: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // While checking authentication status, you could show a loading indicator
  if (isLoading) {
    return (
      <div className="h-16 md:h-20 bg-white shadow-sm flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-md"></div>
      </div>
    );
  }
  
  // Render the navbar with authentication state
  return <Navbar isAuthenticated={isAuthenticated} />;
};

export default SmartNavbar;