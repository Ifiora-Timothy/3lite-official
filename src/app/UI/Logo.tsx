import React from 'react';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 32 }) => {
  return (
    <div className="relative ">
      <div className="absolute  inset-0 bg-accent-color opacity-50 blur-md rounded-full"></div>
      <div className="relative w-fit bg-slate-100 rounded-full p-2 flex items-center justify-center">
      <Image
          src="/logo.png"
          alt="Logo"
          width={size}
          height={size}
          className={`h-6 w-6`}
        />
      </div>
      <div className="absolute top-0 right-0 w-3 h-3 bg-accent-color rounded-full"></div>
    </div>
  );
};

export default Logo;