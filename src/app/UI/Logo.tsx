import React from 'react';
import { MessageSquare } from 'lucide-react';

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 32 }) => {
  return (
    <div className="relative ">
      <div className="absolute  inset-0 bg-accent-color opacity-50 blur-md rounded-full"></div>
      <div className="relative w-fit bg-primary-color rounded-full p-2 flex items-center justify-center">
        <MessageSquare size={size * 0.6} color="white" />
      </div>
      <div className="absolute top-0 right-0 w-3 h-3 bg-accent-color rounded-full"></div>
    </div>
  );
};

export default Logo;