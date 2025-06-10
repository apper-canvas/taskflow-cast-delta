import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import activityService from '@/services/api/activityService';
import projectService from '@/services/api/projectService';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import Select from '@/components/atoms/Select';
import { format } from 'date-fns';

const ActivityFeedPage = () => {
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    eventType: 'all',
    projectId: 'all'
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [activitiesData, projectsData] = await Promise.all([
        activityService.getAll(filters),
        projectService.getAll()
      ]);
      setActivities(activitiesData || []);
      setProjects(projectsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load activity feed');
      toast.error('Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    if (type.includes('project')) {
      if (type.includes('created')) return 'FolderPlus';
      if (type.includes('updated')) return 'Edit';
      if (type.includes('deleted')) return 'FolderMinus';
      return 'Folder';
    }
    if (type.includes('task')) {
      if (type.includes('created')) return 'Plus';
      if (type.includes('status')) return 'ArrowRight';
      if (type.includes('assigned')) return 'User';
      if (type.includes('completed')) return 'CheckCircle';
      if (type.includes('priority')) return 'AlertTriangle';
      if (type.includes('due_date')) return 'Calendar';
      if (type.includes('deleted')) return 'Trash2';
      return 'CheckSquare';
    }
    return 'Activity';
  };

  const getActivityColor = (type) => {
    if (type.includes('created')) return 'text-status-success';
    if (type.includes('deleted')) return 'text-status-error';
    if (type.includes('updated') || type.includes('status') || type.includes('assigned')) return 'text-primary';
    if (type.includes('completed')) return 'text-status-success';
    if (type.includes('priority')) return 'text-status-warning';
    return 'text-surface-600';
  };

  const eventTypeOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'project', label: 'Project Events' },
    { value: 'task', label: 'Task Events' }
  ];

  const projectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(p => ({ value: p.id, label: p.title }))
  ];

  const areFiltersActive = filters.eventType !== 'all' || filters.projectId !== 'all';

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState title="Loading Activity Feed" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Error Loading Activity Feed"
          message={error}
          onRetry={loadData}
        />
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
        <h1 className="text-2xl font-bold text-surface-900 mb-6">Activity Feed</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            value={filters.eventType}
            onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value }))}
            options={eventTypeOptions}
          />
          <Select
            value={filters.projectId}
            onChange={(e) => setFilters(prev => ({ ...prev, projectId: e.target.value }))}
            options={projectOptions}
          />
          {areFiltersActive && (
            <button
              onClick={() => setFilters({ eventType: 'all', projectId: 'all' })}
              className="text-primary hover:text-primary-dark text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      </motion.div>

      {activities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-surface-50 rounded-lg"
        >
          <ApperIcon name="Activity" size={48} className="text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No Activity Yet</h3>
          <p className="text-surface-600">
            {areFiltersActive ? "No activities match your current filters" : "Activity will appear here as you work on projects and tasks"}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-surface-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-lg bg-surface-50 ${getActivityColor(activity.type)}`}>
                  <ApperIcon name={getActivityIcon(activity.type)} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-surface-900">{activity.title}</h3>
                    <span className="text-sm text-surface-500">
                      {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-surface-600 mb-2">{activity.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-surface-500">
                    <span className="flex items-center space-x-1">
                      <ApperIcon name="User" size={14} />
                      <span>{activity.userName}</span>
                    </span>
                    {activity.projectTitle && (
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="Folder" size={14} />
                        <span>{activity.projectTitle}</span>
                      </span>
                    )}
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

export default ActivityFeedPage;