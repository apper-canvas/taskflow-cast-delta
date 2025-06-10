import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';

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
    <motion.div
      whileHover={{ translateY: -2 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-surface-100 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-surface-900 break-words">{project.title}</h3>
        {(onEdit || onDelete) && (
          <div className="flex space-x-1 ml-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 text-surface-400 hover:text-surface-600 transition-colors"
              >
                <ApperIcon name="Edit2" size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 text-surface-400 hover:text-status-error transition-colors"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
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
        
        <div className="w-full bg-surface-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-status-success h-2 rounded-full"
          />
        </div>

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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenBoard}
            className="flex-1 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
          >
            <div className="flex items-center justify-center space-x-1">
              <ApperIcon name="Kanban" size={14} />
              <span>Board</span>
            </div>
          </motion.button>
        )}
        
        {onOpenDashboard && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenDashboard}
            className="flex-1 px-3 py-2 bg-surface-100 text-surface-700 text-sm rounded-lg hover:bg-surface-200 transition-colors"
          >
            <div className="flex items-center justify-center space-x-1">
              <ApperIcon name="BarChart3" size={14} />
              <span>Dashboard</span>
            </div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;