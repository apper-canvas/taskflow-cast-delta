import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Clock, Filter, Project, CheckSquare, FolderOpen, User, Calendar, AlertCircle, TrendingUp, Archive } from 'lucide-react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import activityService from '@/services/api/activityService';
import projectService from '@/services/api/projectService';

const ACTIVITY_TYPES = {
  all: 'All Activities',
  project: 'Projects',
  task: 'Tasks'
};

const ACTIVITY_ICONS = {
  project_created: FolderOpen,
  project_updated: FolderOpen,
  project_deleted: Archive,
  task_created: CheckSquare,
  task_updated: CheckSquare,
  task_deleted: Archive,
  task_status_changed: TrendingUp,
  task_assigned: User,
  task_completed: CheckSquare,
  task_priority_changed: AlertCircle,
  task_due_date_changed: Calendar
};

const ACTIVITY_COLORS = {
  project_created: 'text-blue-600 bg-blue-50',
  project_updated: 'text-blue-600 bg-blue-50',
  project_deleted: 'text-red-600 bg-red-50',
  task_created: 'text-green-600 bg-green-50',
  task_updated: 'text-yellow-600 bg-yellow-50',
  task_deleted: 'text-red-600 bg-red-50',
  task_status_changed: 'text-purple-600 bg-purple-50',
  task_assigned: 'text-indigo-600 bg-indigo-50',
  task_completed: 'text-green-600 bg-green-50',
  task_priority_changed: 'text-orange-600 bg-orange-50',
  task_due_date_changed: 'text-blue-600 bg-blue-50'
};

function ActivityFeedPage() {
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    eventType: 'all',
    projectId: 'all'
  });
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [activitiesData, projectsData] = await Promise.all([
        activityService.getAll(filters),
        projectService.getAll()
      ]);
      
      setActivities(activitiesData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setDisplayCount(20); // Reset display count when filtering
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  const getActivityIcon = (type) => {
    const IconComponent = ACTIVITY_ICONS[type] || CheckSquare;
    return IconComponent;
  };

  const getActivityLink = (activity) => {
    if (activity.entityType === 'project') {
      return `/projects/${activity.entityId}/dashboard`;
    } else if (activity.entityType === 'task' && activity.projectId) {
      return `/projects/${activity.projectId}/board`;
    }
    return null;
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = parseISO(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  if (loading) {
    return <LoadingState message="Loading activity feed..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Failed to load activity feed"
        onRetry={fetchData}
      />
    );
  }

  const displayedActivities = activities.slice(0, displayCount);
  const hasMore = displayCount < activities.length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Activity Feed</h1>
          <p className="text-surface-600 mt-1">Track all recent updates and changes</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={filters.eventType}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
            className="min-w-[140px]"
          >
            {Object.entries(ACTIVITY_TYPES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          
          <Select
            value={filters.projectId}
            onChange={(e) => handleFilterChange('projectId', e.target.value)}
            className="min-w-[160px]"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Activity List */}
      {displayedActivities.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No Activities"
          description="No activities match your current filters. Try adjusting the filters above."
        />
      ) : (
        <div className="space-y-4">
          {displayedActivities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const iconColorClass = ACTIVITY_COLORS[activity.type] || 'text-surface-600 bg-surface-100';
            const activityLink = getActivityLink(activity);

            return (
              <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Activity Icon */}
                  <div className={`flex-shrink-0 p-2 rounded-lg ${iconColorClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-surface-900 mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-surface-600 text-sm mb-2">
                          {activity.description}
                        </p>
                        
                        {/* Activity Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-surface-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{activity.userName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(activity.timestamp)}</span>
                          </div>
                          {activity.projectTitle && (
                            <div className="flex items-center gap-1">
                              <Project className="w-3 h-3" />
                              <span>{activity.projectTitle}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Link */}
                      {activityLink && (
                        <Link
                          to={activityLink}
                          className="flex-shrink-0 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={loadMore}
                className="px-6"
              >
                Load More Activities
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ActivityFeedPage;