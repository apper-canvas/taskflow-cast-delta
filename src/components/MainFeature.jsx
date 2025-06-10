import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';
import ProjectCard from './ProjectCard';
import projectService from '../services/api/projectService';
import taskService from '../services/api/taskService';

const MainFeature = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);

      // Add task counts to projects
      const projectsWithStats = projectsData.map(project => {
        const projectTasks = tasksData.filter(task => task.projectId === project.id);
        const taskCount = {
          total: projectTasks.length,
          todo: projectTasks.filter(task => task.status === 'todo').length,
          inProgress: projectTasks.filter(task => task.status === 'inProgress').length,
          done: projectTasks.filter(task => task.status === 'done').length
        };
        return { ...project, taskCount };
      });

      // Get recent tasks (last 5)
      const recent = tasksData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setProjects(projectsWithStats);
      setRecentTasks(recent);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-surface-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Recent Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-surface-900">Recent Projects</h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </button>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onOpenBoard={() => navigate(`/projects/${project.id}/board`)}
                  onOpenDashboard={() => navigate(`/projects/${project.id}/dashboard`)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-surface-50 rounded-lg">
            <ApperIcon name="FolderOpen" size={32} className="text-surface-300 mx-auto mb-2" />
            <p className="text-surface-600">No projects yet</p>
            <button
              onClick={() => navigate('/projects')}
              className="mt-2 text-primary hover:text-primary/80 transition-colors"
            >
              Create your first project
            </button>
          </div>
        )}
      </section>

      {/* Recent Tasks */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-surface-900">Recent Tasks</h2>
          <button
            onClick={() => navigate('/my-tasks')}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </button>
        </div>
        
        {recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-surface-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-surface-900 truncate">{task.title}</h3>
                    <p className="text-sm text-surface-600">
                      {projects.find(p => p.id === task.projectId)?.title || 'Unknown Project'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
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
        ) : (
          <div className="text-center py-8 bg-surface-50 rounded-lg">
            <ApperIcon name="CheckSquare" size={32} className="text-surface-300 mx-auto mb-2" />
            <p className="text-surface-600">No recent tasks</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MainFeature;