import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const TaskDetailsItem = ({ icon, label, children, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <ApperIcon name={icon} size={14} className="text-surface-400" />
      <span className="text-xs text-surface-600">
        {label && <span className="font-medium mr-1">{label}:</span>}
        {children}
      </span>
    </div>
  );
};

export default TaskDetailsItem;