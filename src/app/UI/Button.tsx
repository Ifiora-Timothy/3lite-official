import React, { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all duration-300 flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-primary-color text-white hover:bg-blue-600 active:bg-blue-700 glow-border',
    secondary: 'bg-accent-color text-dark-bg hover:bg-cyan-400 active:bg-cyan-500',
    ghost: 'bg-transparent hover:bg-hover-bg active:bg-hover-bg',
    outline: 'bg-transparent border border-primary-color text-primary-color hover:bg-primary-color/10 active:bg-primary-color/20',
  };
  
  const sizeClasses = {
    sm: 'text-sm py-1.5 px-3 gap-1.5',
    md: 'text-base py-2 px-4 gap-2',
    lg: 'text-lg py-3 px-6 gap-3',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  return (
    <button className={buttonClasses} {...props}>
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};

export default Button;