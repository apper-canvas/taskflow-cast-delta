import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import projectService from '../services/api/projectService';
import taskService from '../services/api/taskService';

const ProjectDashboard = () => {
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

  const getTaskStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(task => task.status === 'todo').length;
    const inProgress = tasks.filter(task => task.status === 'inProgress').length;
    const done = tasks.filter(task => task.status === 'done').length;
    
    const priorityStats = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    };

    return { total, todo, inProgress, done, priorityStats };
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

  const statusChartOptions = {
    chart: { type: 'donut', width: '100%' },
    labels: ['To Do', 'In Progress', 'Done'],
    colors: ['#3B82F6', '#F59E0B', '#10B981'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: { size: '70%' }
      }
    }
  };

  const priorityChartOptions = {
    chart: { type: 'bar', width: '100%' },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%' }
    },
    dataLabels: { enabled: false },
    xaxis: { categories: ['High', 'Medium', 'Low'] },
    colors: ['#EC4899', '#F59E0B', '#6B7280'],
    title: { text: 'Tasks by Priority' }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 bg-surface-200 rounded animate-pulse"></div>
            <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-32 mb-4"></div>
              <div className="h-48 bg-surface-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" size={48} className="text-status-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Project</h3>
          <p className="text-surface-600 mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const stats = getTaskStats();
  const upcomingDeadlines = getUpcomingDeadlines();
  const overdueTasks = getOverdueTasks();

  return (
    <div className="p-6 max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} className="text-surface-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">{project.title}</h1>
            <p className="text-surface-600">Project Dashboard</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/projects/${projectId}/board`)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Kanban" size={18} />
          <span>Kanban Board</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900">{stats.total}</div>
              <div className="text-sm text-surface-600">Total Tasks</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-status-success rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900">{stats.done}</div>
              <div className="text-sm text-surface-600">Completed</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-status-warning rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900">{upcomingDeadlines.length}</div>
              <div className="text-sm text-surface-600">Due Soon</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-status-error rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900">{overdueTasks.length}</div>
              <div className="text-sm text-surface-600">Overdue</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Task Status Distribution</h3>
          {stats.total > 0 ? (
            <Chart
              options={statusChartOptions}
              series={[stats.todo, stats.inProgress, stats.done]}
              type="donut"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-surface-500">
              <div className="text-center">
                <ApperIcon name="PieChart" size={48} className="mx-auto mb-2 opacity-50" />
                <p>No tasks to display</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Priority Distribution</h3>
          {stats.total > 0 ? (
            <Chart
              options={priorityChartOptions}
              series={[{
                name: 'Tasks',
                data: [stats.priorityStats.high, stats.priorityStats.medium, stats.priorityStats.low]
              }]}
              type="bar"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-surface-500">
              <div className="text-center">
                <ApperIcon name="BarChart3" size={48} className="mx-auto mb-2 opacity-50" />
                <p>No tasks to display</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Upcoming Deadlines & Overdue Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-100"
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
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDashboard;