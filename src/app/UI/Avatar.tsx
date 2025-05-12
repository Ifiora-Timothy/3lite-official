"use client"
import Image from 'next/image';
import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy' | null;
  walletAddress?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status = null,
  walletAddress,
}) => {
  
  const getInitials = (name: string): string => {
    if (walletAddress) {
      // Show first 2 + last 2 characters of wallet address
      return `${walletAddress.substring(0, 2)}..${walletAddress.substring(walletAddress.length - 2)}`;
    }
    
    console.log({src})
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClassMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const sizeClass = sizeClassMap[size];
  const statusClass = status ? statusColors[status] : '';
  const statusSize = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="relative inline-flex">
      {src ? (
        <Image
          src={src}
          alt={name}
          className={`${sizeClass} rounded-full object-cover glow-border`}
          width={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 56 : 80}
          height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 56 : 80}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-full flex items-center justify-center bg-primary-color text-white glow-border`}
        >
          {getInitials(name)}
        </div>
      )}
      
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSize} ${statusClass} rounded-full ring-2 ring-white`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;