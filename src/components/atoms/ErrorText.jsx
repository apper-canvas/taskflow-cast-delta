import React from 'react';

const ErrorText = ({ children, className = '' }) => {
  if (!children) return null;
  return (
    <p className={`mt-1 text-sm text-status-error ${className}`}>
      {children}
    </p>
  );
};

export default ErrorText;