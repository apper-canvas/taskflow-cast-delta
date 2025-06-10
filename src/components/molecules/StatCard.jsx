import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatCard = ({ title, value, icon, colorClass, onClick, delay = 0 }) => {
  return (
    <Card 
      onClick={onClick} 
      className="border border-surface-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
    >
      <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4`}>
        <ApperIcon name={icon} size={24} className="text-white" />
      </div>
      <div className="text-2xl font-bold text-surface-900 mb-1">{value}</div>
      <div className="text-sm text-surface-600">{title}</div>
    </Card>
  );
};

export default StatCard;