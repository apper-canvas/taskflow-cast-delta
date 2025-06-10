import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/molecules/ProjectCard';
import EmptyState from '@/components/organisms/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ProjectList = ({ projects, onEdit, onDelete, onOpenBoard, onOpenDashboard, onCreateNew }) => {
  if (projects.length === 0) {
    return (
      <EmptyState
        iconName="FolderOpen"
        title="No projects yet"
        message="Get started by creating your first project"
        actionText="Create Project"
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProjectCard
            project={project}
            onEdit={() => onEdit(project)}
            onDelete={() => onDelete(project.id)}
            onOpenBoard={() => onOpenBoard(project.id)}
            onOpenDashboard={() => onOpenDashboard(project.id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectList;