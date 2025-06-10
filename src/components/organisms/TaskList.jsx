import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import TaskCard from '@/components/molecules/TaskCard';
import ApperIcon from '@/components/ApperIcon';
import EmptyState from '@/components/organisms/EmptyState';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const TaskList = ({ 
  tasks, 
  projects, 
  filters, 
  setFilters, 
  onEdit, 
  onDelete, 
  className = '' 
}) => {

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'Unknown Project';
  };

  const projectOptions = [{ value: 'all', label: 'All Projects' }, ...projects.map(p => ({ value: p.id, label: p.title }))];
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'todo', label: 'To Do' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];
  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const areFiltersActive = filters.status !== 'all' || filters.priority !== 'all' || filters.project !== 'all';

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          options={statusOptions}
        />
        <Select
          value={filters.priority}
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          options={priorityOptions}
        />
        <Select
          value={filters.project}
          onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
          options={projectOptions}
        />

        {areFiltersActive && (
          <Button
            variant="text"
            onClick={() => setFilters({ status: 'all', priority: 'all', project: 'all' })}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          iconName="CheckSquare"
          title="No tasks found"
          message={areFiltersActive ? "No tasks match your current filters" : "You don't have any tasks yet"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-surface-900 break-words">{task.title}</h3>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="icon"
                      onClick={() => onEdit(task)}
                      className="text-surface-400 hover:text-surface-600"
                    >
                      <ApperIcon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="icon"
                      onClick={() => onDelete(task.id)}
                      className="text-surface-400 hover:text-status-error"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-sm text-surface-600 mb-3 break-words">{task.description}</p>
                )}

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-surface-500">Project:</span>
                    <span className="font-medium text-surface-700">{getProjectName(task.projectId)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-surface-500">Assignee:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {task.assignee?.split(' ').map(n => n[0]).join('') || 'UN'}
                        </span>
                      </div>
                      <span className="font-medium text-surface-700">{task.assignee || 'Unassigned'}</span>
                    </div>
                  </div>

                  {task.dueDate && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-surface-500">Due:</span>
                      <span className="font-medium text-surface-700">
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'high' ? 'bg-priority-high text-white' :
                    task.priority === 'medium' ? 'bg-priority-medium text-white' :
                    'bg-priority-low text-white'
                  }`}>
                    {task.priority}
                  </div>

                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    task.status === 'done' ? 'bg-green-100 text-green-800' :
                    task.status === 'inProgress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status === 'inProgress' ? 'In Progress' : 
                     task.status === 'done' ? 'Done' : 'To Do'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;