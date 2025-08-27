import React from 'react';
import type { InputProps } from '@/types';

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  required = false,
  className = '',
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-lg transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          ${error 
            ? 'border-red-300 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-primary-500'
          }
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input; 