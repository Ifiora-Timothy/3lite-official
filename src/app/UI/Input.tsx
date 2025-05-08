import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'search';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', variant = 'default', ...props }, ref) => {
    const inputClasses = `glass-effect w-full px-4 py-2 transition-all duration-300 focus:outline-none ${
      error ? 'border-red-500 focus:border-red-600' : 'focus:glow-border'
    } ${className}`;

    if (variant === 'search') {
      return (
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <input
            ref={ref}
            className={`${inputClasses} pl-10`}
            type="search"
            {...props}
          />
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium">{label}</label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;