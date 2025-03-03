import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-center p-6">
            <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
            <p className="text-2xl text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
            <Button
                className="mt-6 flex items-center gap-2 bg-gray-600"
                onClick={() => navigate('/')}
            >
                <Home className="w-5 h-5" /> Back to Home
            </Button>
        </div>
    );
};

export default NotFoundPage;