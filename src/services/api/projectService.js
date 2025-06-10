import activityService from './activityService';
import { toast } from 'react-toastify';

const projectService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "description", "start_date", "end_date"]
      };

      const response = await apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to fetch ${failedRecords.length} project records:${failedRecords}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => ({
          id: result.data.Id,
          title: result.data.title || result.data.Name,
          description: result.data.description,
          startDate: result.data.start_date,
          endDate: result.data.end_date,
          createdAt: result.data.CreatedOn,
          name: result.data.Name,
          tags: result.data.Tags,
          owner: result.data.Owner
        }));
      }

      return response.data ? [response.data].map(project => ({
        id: project.Id,
        title: project.title || project.Name,
        description: project.description,
        startDate: project.start_date,
        endDate: project.end_date,
        createdAt: project.CreatedOn,
        name: project.Name,
        tags: project.Tags,
        owner: project.Owner
      })) : [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "description", "start_date", "end_date"]
      };

      const response = await apperClient.getRecordById('project', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        throw new Error('Project not found');
      }

      return {
        id: response.data.Id,
        title: response.data.title || response.data.Name,
        description: response.data.description,
        startDate: response.data.start_date,
        endDate: response.data.end_date,
        createdAt: response.data.CreatedOn,
        name: response.data.Name,
        tags: response.data.Tags,
        owner: response.data.Owner
      };
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  },

  async create(projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for creation
      const createData = {
        Name: projectData.title,
        Tags: projectData.tags || '',
        Owner: projectData.owner,
        title: projectData.title,
        description: projectData.description,
        start_date: projectData.startDate,
        end_date: projectData.endDate
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} project records:${failedRecords}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdProject = successfulRecords[0].data;
          const newProject = {
            id: createdProject.Id,
            title: createdProject.title || createdProject.Name,
            description: createdProject.description,
            startDate: createdProject.start_date,
            endDate: createdProject.end_date,
            createdAt: createdProject.CreatedOn,
            name: createdProject.Name,
            tags: createdProject.Tags,
            owner: createdProject.Owner
          };

          // Log activity
          try {
            await activityService.logProjectActivity('created', newProject, 'user1', 'Current User');
          } catch (error) {
            console.warn('Failed to log project creation activity:', error);
          }

          return newProject;
        }
      }

      throw new Error('Failed to create project');
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async update(id, projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update
      const updateData = {
        Id: parseInt(id),
        Name: projectData.title,
        Tags: projectData.tags || '',
        Owner: projectData.owner,
        title: projectData.title,
        description: projectData.description,
        start_date: projectData.startDate,
        end_date: projectData.endDate
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} project records:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedProject = successfulUpdates[0].data;
          const project = {
            id: updatedProject.Id,
            title: updatedProject.title || updatedProject.Name,
            description: updatedProject.description,
            startDate: updatedProject.start_date,
            endDate: updatedProject.end_date,
            createdAt: updatedProject.CreatedOn,
            name: updatedProject.Name,
            tags: updatedProject.Tags,
            owner: updatedProject.Owner
          };

          // Log activity
          try {
            await activityService.logProjectActivity('updated', project, 'user1', 'Current User');
          } catch (error) {
            console.warn('Failed to log project update activity:', error);
          }

          return project;
        }
      }

      throw new Error('Failed to update project');
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get project data for activity logging before deletion
      const projectToDelete = await this.getById(id);

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} project records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          // Log activity
          try {
            await activityService.logProjectActivity('deleted', projectToDelete, 'user1', 'Current User');
          } catch (error) {
            console.warn('Failed to log project deletion activity:', error);
          }

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};

export default projectService;