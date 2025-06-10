import React from 'react';

const Input = ({ label, id, value, onChange, type = 'text', placeholder, error, className = '', ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-') || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
    error ? 'border-status-error' : 'border-surface-200'
  } ${className}`;

  return (
    <input
      id={inputId}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputClasses}
      {...props}
    />
  );
};

export default Input;