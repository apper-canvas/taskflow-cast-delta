import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import projectService from '../services/api/projectService';
import taskService from '../services/api/taskService';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [projects, tasks] = await Promise.all([
          projectService.getAll(),
          taskService.getAll()
        ]);

        const completedTasks = tasks.filter(task => task.status === 'done').length;
        const upcomingDeadlines = tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
          return daysDiff >= 0 && daysDiff <= 7;
        }).length;

        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks,
          upcomingDeadlines
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: 'FolderOpen',
      color: 'bg-primary',
      action: () => navigate('/projects')
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: 'CheckSquare',
      color: 'bg-secondary',
      action: () => navigate('/my-tasks')
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: 'CheckCircle',
      color: 'bg-status-success',
      action: () => navigate('/my-tasks')
    },
    {
      title: 'Due This Week',
      value: stats.upcomingDeadlines,
      icon: 'Clock',
      color: 'bg-status-warning',
      action: () => navigate('/my-tasks')
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-surface-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-12 w-12 bg-surface-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-surface-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Welcome back!</h1>
        <p className="text-surface-600">Here's an overview of your project activity</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, translateY: -2 }}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-surface-100"
            onClick={card.action}
          >
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
              <ApperIcon name={card.icon} size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-surface-900 mb-1">{card.value}</div>
            <div className="text-sm text-surface-600">{card.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/projects')}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-surface-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Plus" size={18} className="text-primary" />
              <span className="text-surface-700">Create New Project</span>
            </button>
            <button
              onClick={() => navigate('/my-tasks')}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-surface-50 rounded-lg transition-colors"
            >
              <ApperIcon name="ListTodo" size={18} className="text-secondary" />
              <span className="text-surface-700">View All Tasks</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Tips</h3>
          <div className="space-y-3 text-sm text-surface-600">
            <div className="flex items-start space-x-2">
              <ApperIcon name="Lightbulb" size={16} className="text-status-warning mt-0.5" />
              <span>Use drag-and-drop in Kanban boards to update task status quickly</span>
            </div>
            <div className="flex items-start space-x-2">
              <ApperIcon name="Target" size={16} className="text-primary mt-0.5" />
              <span>Set due dates on tasks to track upcoming deadlines</span>
            </div>
            <div className="flex items-start space-x-2">
              <ApperIcon name="Users" size={16} className="text-secondary mt-0.5" />
              <span>Assign tasks to team members for better collaboration</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;