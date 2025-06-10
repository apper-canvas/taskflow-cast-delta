import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', whileHover = {}, transition = {}, onClick, ...props }) => {
  const baseStyle = 'bg-white rounded-lg p-6 shadow-sm border border-surface-100 transition-all duration-200';
  
  return (
    <motion.div
      whileHover={onClick ? { translateY: -2, ...whileHover } : whileHover}
      className={`${baseStyle} ${className} ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      transition={onClick ? { duration: 0.2 } : transition}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;