import React from 'react';

const Textarea = ({ label, id, value, onChange, placeholder, error, rows = 3, className = '', ...props }) => {
  const textareaId = id || label?.toLowerCase().replace(/\s/g, '-') || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const textareaClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${
    error ? 'border-status-error' : 'border-surface-200'
  } ${className}`;

  return (
    <textarea
      id={textareaId}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={textareaClasses}
      {...props}
    />
  );
};

export default Textarea;