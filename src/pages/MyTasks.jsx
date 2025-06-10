import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import taskService from '../services/api/taskService';
import projectService from '../services/api/projectService';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    project: 'all'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.id, taskData);
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.project !== 'all' && task.projectId !== filters.project) return false;
      return true;
    });
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'Unknown Project';
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="flex space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-surface-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-surface-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" size={48} className="text-status-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Tasks</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-surface-900 mb-4">My Tasks</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.project}
            onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>

          {(filters.status !== 'all' || filters.priority !== 'all' || filters.project !== 'all') && (
            <button
              onClick={() => setFilters({ status: 'all', priority: 'all', project: 'all' })}
              className="px-3 py-2 text-surface-600 hover:text-surface-900 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </motion.div>

      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No tasks found</h3>
          <p className="mt-2 text-surface-500">
            {tasks.length === 0 
              ? "You don't have any tasks yet" 
              : "No tasks match your current filters"
            }
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task, index) => (
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
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1 text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      <ApperIcon name="Edit2" size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-surface-400 hover:text-status-error transition-colors"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </button>
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

      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleEditTask}
          title="Edit Task"
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default MyTasks;