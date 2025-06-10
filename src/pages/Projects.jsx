import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import projectService from '../services/api/projectService';
import taskService from '../services/api/taskService';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const projectsData = await projectService.getAll();
      const tasksData = await taskService.getAll();
      
      // Calculate task counts for each project
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
      
      setProjects(projectsWithStats);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, { ...newProject, taskCount: { total: 0, todo: 0, inProgress: 0, done: 0 } }]);
      setShowCreateModal(false);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const handleEditProject = async (projectData) => {
    try {
      const updatedProject = await projectService.update(editingProject.id, projectData);
      setProjects(prev => prev.map(p => 
        p.id === editingProject.id 
          ? { ...updatedProject, taskCount: p.taskCount }
          : p
      ));
      setEditingProject(null);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return;
    }
    
    try {
      await projectService.delete(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const openKanbanBoard = (projectId) => {
    navigate(`/projects/${projectId}/board`);
  };

  const openProjectDashboard = (projectId) => {
    navigate(`/projects/${projectId}/dashboard`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-surface-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-2/3 mb-4"></div>
              <div className="flex space-x-4 mb-4">
                <div className="h-4 bg-surface-200 rounded w-16"></div>
                <div className="h-4 bg-surface-200 rounded w-16"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-surface-200 rounded w-20"></div>
                <div className="h-8 bg-surface-200 rounded w-20"></div>
              </div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Projects</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadProjects}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Projects</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <ApperIcon name="Plus" size={18} />
            <span>Create Project</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="FolderOpen" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No projects yet</h3>
          <p className="mt-2 text-surface-500">Get started by creating your first project</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Project
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showCreateModal && (
            <ProjectModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSubmit={handleCreateProject}
              title="Create New Project"
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Projects</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <ApperIcon name="Plus" size={18} />
          <span>Create Project</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProjectCard
              project={project}
              onEdit={() => setEditingProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
              onOpenBoard={() => openKanbanBoard(project.id)}
              onOpenDashboard={() => openProjectDashboard(project.id)}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <ProjectModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateProject}
            title="Create New Project"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingProject && (
          <ProjectModal
            isOpen={!!editingProject}
            onClose={() => setEditingProject(null)}
            onSubmit={handleEditProject}
            title="Edit Project"
            initialData={editingProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;