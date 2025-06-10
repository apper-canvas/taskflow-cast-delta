import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ percentage, className = '' }) => {
  return (
    <div className={`w-full bg-surface-200 rounded-full h-2 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-status-success h-2 rounded-full"
      />
    </div>
  );
};

export default ProgressBar;