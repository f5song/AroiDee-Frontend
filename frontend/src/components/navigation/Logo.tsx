import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => (
  <Link to="/" className="hover:opacity-90 transition-opacity inline-flex items-center">
    <img 
      src="/AroiDee.svg" 
      alt="AroiDee" 
      className="h-10 md:h-14 object-contain drop-shadow-sm" 
    />
  </Link>
);

export default Logo;