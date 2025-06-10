import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskModal from '@/components/organisms/TaskModal';
import TaskList from '@/components/organisms/TaskList';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import taskService from '@/services/api/taskService';
import projectService from '@/services/api/projectService';

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
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

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setIsCreatingTask(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
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

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState title="Loading Your Tasks" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Error Loading Tasks"
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-surface-900">My Tasks</h1>
          <Button
            onClick={() => setIsCreatingTask(true)}
            variant="primary"
            className="inline-flex items-center gap-2 px-4 py-2 whitespace-nowrap"
            aria-label="Add new task"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </motion.div>
      <TaskList
        tasks={filteredTasks}
        projects={projects}
        filters={filters}
        setFilters={setFilters}
        onEdit={setEditingTask}
        onDelete={handleDeleteTask}
      />
{/* Create Task Modal */}
      {isCreatingTask && (
        <TaskModal
          isOpen={isCreatingTask}
          onClose={() => setIsCreatingTask(false)}
          onSubmit={handleCreateTask}
          title="Create New Task"
          initialData={null}
        />
      )}

      {/* Edit Task Modal */}
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

export default MyTasksPage;