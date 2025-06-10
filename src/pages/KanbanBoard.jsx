import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import KanbanColumn from '../components/KanbanColumn';
import projectService from '../services/api/projectService';
import taskService from '../services/api/taskService';

const KanbanBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'To Do', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { id: 'inProgress', title: 'In Progress', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { id: 'done', title: 'Done', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
  ];

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

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create({ ...taskData, projectId });
      setTasks(prev => [...prev, newTask]);
      setShowCreateModal(false);
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

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (columnId) => {
    if (!draggedTask || draggedTask.status === columnId) {
      return;
    }

    try {
      const updatedTask = await taskService.update(draggedTask.id, { status: columnId });
      setTasks(prev => prev.map(t => t.id === draggedTask.id ? updatedTask : t));
      toast.success(`Task moved to ${columns.find(c => c.id === columnId)?.title}`);
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 bg-surface-200 rounded animate-pulse"></div>
            <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-50 rounded-lg p-4">
              <div className="h-6 bg-surface-200 rounded w-24 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                    <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
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
          <div className="space-x-4">
            <button
              onClick={loadProjectData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-surface-200 text-surface-700 rounded-lg hover:bg-surface-300 transition-colors"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full h-full flex flex-col">
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
            <p className="text-surface-600">Kanban Board</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/projects/${projectId}/dashboard`)}
            className="flex items-center space-x-2 px-4 py-2 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors"
          >
            <ApperIcon name="BarChart3" size={18} />
            <span>Dashboard</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <ApperIcon name="Plus" size={18} />
            <span>Add Task</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            onTaskEdit={setEditingTask}
            onTaskDelete={handleDeleteTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggedTask={draggedTask}
          />
        ))}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <TaskModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateTask}
            title="Create New Task"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTask && (
          <TaskModal
            isOpen={!!editingTask}
            onClose={() => setEditingTask(null)}
            onSubmit={handleEditTask}
            title="Edit Task"
            initialData={editingTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KanbanBoard;