import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';

const ProjectCard = ({ 
  project, 
  onEdit, 
  onDelete, 
  onOpenBoard, 
  onOpenDashboard 
}) => {
  const completionPercentage = project.taskCount?.total > 0 
    ? Math.round((project.taskCount.done / project.taskCount.total) * 100) 
    : 0;

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-surface-900 break-words flex-1 pr-2">
          {project.title}
        </h3>
        {(onEdit || onDelete) && (
          <div className="flex space-x-1 ml-2">
            {onEdit && (
              <Button
                variant="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-surface-400 hover:text-surface-600"
              >
                <ApperIcon name="Edit2" size={16} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-surface-400 hover:text-status-error"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            )}
          </div>
        )}
      </div>

      {project.description && (
        <p className="text-surface-600 text-sm mb-4 break-words line-clamp-3">
          {project.description}
        </p>
      )}

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-surface-500">Progress</span>
          <span className="font-medium text-surface-700">{completionPercentage}%</span>
        </div>
        
        <ProgressBar percentage={completionPercentage} />

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium text-surface-900">{project.taskCount?.todo || 0}</div>
            <div className="text-surface-500">To Do</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-surface-900">{project.taskCount?.inProgress || 0}</div>
            <div className="text-surface-500">In Progress</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-surface-900">{project.taskCount?.done || 0}</div>
            <div className="text-surface-500">Done</div>
          </div>
        </div>
      </div>

      {(project.startDate || project.endDate) && (
        <div className="text-xs text-surface-500 mb-4 space-y-1">
          {project.startDate && (
            <div>Start: {format(new Date(project.startDate), 'MMM dd, yyyy')}</div>
          )}
          {project.endDate && (
            <div>End: {format(new Date(project.endDate), 'MMM dd, yyyy')}</div>
          )}
        </div>
      )}

      <div className="flex space-x-2">
        {onOpenBoard && (
          <Button
            variant="primary"
            onClick={onOpenBoard}
            className="flex-1 text-sm"
          >
            <ApperIcon name="Kanban" size={14} />
            <span>Board</span>
          </Button>
        )}
        
        {onOpenDashboard && (
          <Button
            variant="light"
            onClick={onOpenDashboard}
            className="flex-1 text-sm"
          >
            <ApperIcon name="BarChart3" size={14} />
            <span>Dashboard</span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;