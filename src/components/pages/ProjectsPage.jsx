import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import ProjectModal from '@/components/organisms/ProjectModal';
import ProjectList from '@/components/organisms/ProjectList';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import Button from '@/components/atoms/Button';
import projectService from '@/services/api/projectService';
import taskService from '@/services/api/taskService';

const ProjectsPage = () => {
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
        <LoadingState title="Loading Projects" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Error Loading Projects"
          message={error}
          onRetry={loadProjects}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Projects</h1>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <ApperIcon name="Plus" size={18} />
          <span>Create Project</span>
        </Button>
      </div>

      <ProjectList 
        projects={projects}
        onEdit={setEditingProject}
        onDelete={handleDeleteProject}
        onOpenBoard={openKanbanBoard}
        onOpenDashboard={openProjectDashboard}
        onCreateNew={() => setShowCreateModal(true)}
      />

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

export default ProjectsPage;