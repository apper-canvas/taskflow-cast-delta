import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isBefore } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import projectService from '@/services/api/projectService';
import taskService from '@/services/api/taskService';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ProjectStatsSection from '@/components/organisms/ProjectStatsSection';
import ProjectChartsSection from '@/components/organisms/ProjectChartsSection';

const ProjectDashboardPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectData, tasksData] = await Promise.all([
        projectService.getById(projectId),
        taskService.getByProjectId(projectId)
      ]);
      
      setProject(projectData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load project data');
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    return tasks
      .filter(task => {
        if (!task.dueDate || task.status === 'done') return false;
        const dueDate = new Date(task.dueDate);
        const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 14; // Next 14 days
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      return isBefore(new Date(task.dueDate), today);
    });
  };

  const upcomingDeadlines = getUpcomingDeadlines();
  const overdueTasks = getOverdueTasks();

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState title="Loading Project Dashboard" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Error Loading Project"
          message={error || 'Project not found'}
          onBack={() => navigate('/projects')}
          backText="Back to Projects"
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="icon"
            onClick={() => navigate('/projects')}
            className="p-2 text-surface-600"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">{project.title}</h1>
            <p className="text-surface-600">Project Dashboard</p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(`/projects/${projectId}/board`)}
        >
          <ApperIcon name="Kanban" size={18} />
          <span>Kanban Board</span>
        </Button>
      </div>

      <ProjectStatsSection tasks={tasks} />

      <ProjectChartsSection tasks={tasks} />

      {/* Upcoming Deadlines & Overdue Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-surface-900 truncate">{task.title}</p>
                    <p className="text-sm text-surface-600">
                      Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'high' ? 'bg-priority-high text-white' :
                    task.priority === 'medium' ? 'bg-priority-medium text-white' :
                    'bg-priority-low text-white'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-surface-500">
                <ApperIcon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
                <p>No upcoming deadlines</p>
              </div>
            )}
          </div>
        </Card>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Overdue Tasks</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {overdueTasks.length > 0 ? (
              overdueTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-surface-900 truncate">{task.title}</p>
                    <p className="text-sm text-red-600">
                      Overdue: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-status-error text-white rounded text-xs font-medium">
                    OVERDUE
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-surface-500">
                <ApperIcon name="CheckCircle" size={32} className="mx-auto mb-2 opacity-50" />
                <p>No overdue tasks</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDashboardPage;