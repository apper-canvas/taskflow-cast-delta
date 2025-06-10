import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-6"
        >
          <ApperIcon name="FileQuestion" size={72} className="text-surface-300 mx-auto" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Page Not Found</h1>
        <p className="text-surface-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Go Back
          </Button>
          
          <Button
            variant="light"
            onClick={() => navigate('/projects')}
            className="w-full"
          >
            Go to Projects
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;