import React from 'react';
import Spinner from '@/components/atoms/Spinner';

const LoadingState = ({ title = 'Loading...', className = '' }) => {
  return (
    <div className={`text-center py-12 flex flex-col items-center justify-center ${className}`}>
      <Spinner size="lg" className="text-primary mb-4" />
      <h3 className="text-lg font-medium text-surface-900">{title}</h3>
      <p className="text-surface-600">Please wait while we fetch the data...</p>
    </div>
  );
};

export default LoadingState;