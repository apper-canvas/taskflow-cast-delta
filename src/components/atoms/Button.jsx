import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', variant = 'primary', type = 'button', disabled = false, ...props }) => {
  const baseStyle = 'flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/20',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/20',
    light: 'bg-surface-100 text-surface-700 hover:bg-surface-200 focus:ring-surface-200',
    danger: 'bg-status-error text-white hover:bg-status-error/90 focus:ring-status-error/20',
    text: 'text-primary hover:text-primary/80 focus:ring-primary/20 bg-transparent shadow-none',
    icon: 'p-2 hover:bg-surface-100 rounded-lg transition-colors focus:ring-surface-200 shadow-none'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || variant === 'icon' || variant === 'text' ? 1 : 1.05 }}
      whileTap={{ scale: disabled || variant === 'icon' || variant === 'text' ? 1 : 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;