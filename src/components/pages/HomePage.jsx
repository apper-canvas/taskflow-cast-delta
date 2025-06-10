import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import projectService from '@/services/api/projectService';
import taskService from '@/services/api/taskService';
import StatCard from '@/components/molecules/StatCard';
import DashboardOverview from '@/components/organisms/DashboardOverview';
import LoadingState from '@/components/organisms/LoadingState';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

const HomePage = () => {
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
        <LoadingState />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-12 w-12 bg-surface-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-surface-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-24"></div>
            </Card>
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
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            colorClass={card.color}
            onClick={card.action}
            delay={index * 0.1}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="text"
              onClick={() => navigate('/projects')}
              className="w-full justify-start !p-3"
            >
              <ApperIcon name="Plus" size={18} className="text-primary" />
              <span className="text-surface-700">Create New Project</span>
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/my-tasks')}
              className="w-full justify-start !p-3"
            >
              <ApperIcon name="ListTodo" size={18} className="text-secondary" />
              <span className="text-surface-700">View All Tasks</span>
            </Button>
          </div>
        </Card>

        <Card
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
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
        </Card>
      </div>

      <DashboardOverview />
    </div>
  );
};

export default HomePage;