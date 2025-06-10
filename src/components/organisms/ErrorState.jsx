import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ title, message, onRetry, retryText = 'Try Again', onBack, backText, className = '' }) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <ApperIcon name="AlertCircle" size={48} className="text-status-error mx-auto mb-4" />
      <h3 className="text-lg font-medium text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 mb-4">{message}</p>
      <div className="flex justify-center space-x-4">
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
          >
            {retryText}
          </Button>
        )}
        {onBack && (
          <Button
            variant="light"
            onClick={onBack}
          >
            {backText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;