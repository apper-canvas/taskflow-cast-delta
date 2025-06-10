import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import ApperIcon from './ApperIcon';

const KanbanColumn = ({ 
  column, 
  tasks, 
  onTaskEdit, 
  onTaskDelete, 
  onDragStart, 
  onDragEnd, 
  onDrop,
  draggedTask 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== column.id) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (draggedTask && onDrop) {
      onDrop(column.id);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-surface-900">{column.title}</h3>
        <div className="flex items-center space-x-2">
          <span className="bg-surface-200 text-surface-700 text-xs px-2 py-1 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
      </div>

      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 min-h-32 p-3 rounded-lg border-2 border-dashed transition-all duration-200 ${
          column.bgColor
        } ${
          isDragOver 
            ? `${column.borderColor} border-solid scale-105 shadow-lg` 
            : 'border-surface-200'
        }`}
      >
        <div className="space-y-3 h-full overflow-y-auto">
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onTaskEdit(task)}
                onDelete={() => onTaskDelete(task.id)}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={draggedTask?.id === task.id}
              />
            ))}
          </AnimatePresence>

          {tasks.length === 0 && !isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-32 text-surface-400"
            >
              <ApperIcon name="Plus" size={24} className="mb-2 opacity-50" />
              <p className="text-sm">No tasks</p>
            </motion.div>
          )}

          {isDragOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center h-16 border-2 border-primary border-dashed rounded-lg bg-primary/5"
            >
              <div className="flex items-center space-x-2 text-primary">
                <ApperIcon name="ArrowDown" size={20} />
                <span className="font-medium">Drop here</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default KanbanColumn;