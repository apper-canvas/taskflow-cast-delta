import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskDetailsItem from '@/components/molecules/TaskDetailsItem';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd,
  isDragging = false 
}) => {
  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(task);
    }
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const priorityColors = {
    high: 'bg-priority-high text-white',
    medium: 'bg-priority-medium text-white', 
    low: 'bg-priority-low text-white'
  };

  const statusColors = {
    done: 'bg-green-100 text-green-800',
    inProgress: 'bg-yellow-100 text-yellow-800',
    todo: 'bg-blue-100 text-blue-800',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 1.05 : 1
      }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-lg p-4 shadow-sm border border-surface-100 hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? 'shadow-lg rotate-2' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-surface-900 break-words flex-1 pr-2">{task.title}</h4>
        {(onEdit || onDelete) && (
          <div className="flex space-x-1">
            {onEdit && (
              <Button
                variant="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-surface-400 hover:text-surface-600"
                draggable={false}
              >
                <ApperIcon name="Edit2" size={14} />
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
                draggable={false}
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            )}
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-surface-600 mb-3 break-words line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="space-y-2 mb-3">
        {task.assignee && (
          <TaskDetailsItem icon="User" label="Assignee">
             <div className="flex items-center space-x-1">
               <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                 <span className="text-xs text-white font-medium">
                   {task.assignee.split(' ').map(n => n[0]).join('')}
                 </span>
               </div>
               <span className="text-sm text-surface-600">{task.assignee}</span>
             </div>
          </TaskDetailsItem>
        )}

        {task.dueDate && (
          <TaskDetailsItem icon="Calendar" label="Due">
            <span className="text-sm text-surface-600">
              {format(new Date(task.dueDate), 'MMM dd')}
            </span>
          </TaskDetailsItem>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          priorityColors[task.priority] || priorityColors.low
        } ${task.priority === 'high' ? 'animate-pulse-priority' : ''}`}>
          {task.priority}
        </div>

        <div className="flex items-center space-x-1">
          <ApperIcon name="MessageCircle" size={14} className="text-surface-400" />
          <span className="text-xs text-surface-500">0</span> {/* Placeholder for comments */}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;