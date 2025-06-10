import activityService from './activityService';
import { toast } from 'react-toastify';

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "description", "assignee", "due_date", "priority", "status", "project_id"]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to fetch ${failedRecords.length} task records:${failedRecords}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => ({
          id: result.data.Id,
          title: result.data.title || result.data.Name,
          description: result.data.description,
          assignee: result.data.assignee,
          dueDate: result.data.due_date,
          priority: result.data.priority,
          status: result.data.status,
          projectId: result.data.project_id,
          createdAt: result.data.CreatedOn,
          updatedAt: result.data.ModifiedOn,
          name: result.data.Name,
          tags: result.data.Tags,
          owner: result.data.Owner
        }));
      }

      return response.data ? [response.data].map(task => ({
        id: task.Id,
        title: task.title || task.Name,
        description: task.description,
        assignee: task.assignee,
        dueDate: task.due_date,
        priority: task.priority,
        status: task.status,
        projectId: task.project_id,
        createdAt: task.CreatedOn,
        updatedAt: task.ModifiedOn,
        name: task.Name,
        tags: task.Tags,
        owner: task.Owner
      })) : [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "description", "assignee", "due_date", "priority", "status", "project_id"]
      };

      const response = await apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        throw new Error('Task not found');
      }

      return {
        id: response.data.Id,
        title: response.data.title || response.data.Name,
        description: response.data.description,
        assignee: response.data.assignee,
        dueDate: response.data.due_date,
        priority: response.data.priority,
        status: response.data.status,
        projectId: response.data.project_id,
        createdAt: response.data.CreatedOn,
        updatedAt: response.data.ModifiedOn,
        name: response.data.Name,
        tags: response.data.Tags,
        owner: response.data.Owner
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async getByProjectId(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "description", "assignee", "due_date", "priority", "status", "project_id"],
        where: [
          {
            fieldName: "project_id",
            operator: "EqualTo",
            values: [parseInt(projectId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to fetch ${failedRecords.length} task records for project ${projectId}:${failedRecords}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => ({
          id: result.data.Id,
          title: result.data.title || result.data.Name,
          description: result.data.description,
          assignee: result.data.assignee,
          dueDate: result.data.due_date,
          priority: result.data.priority,
          status: result.data.status,
          projectId: result.data.project_id,
          createdAt: result.data.CreatedOn,
          updatedAt: result.data.ModifiedOn,
          name: result.data.Name,
          tags: result.data.Tags,
          owner: result.data.Owner
        }));
      }

      return response.data ? [response.data].map(task => ({
        id: task.Id,
        title: task.title || task.Name,
        description: task.description,
        assignee: task.assignee,
        dueDate: task.due_date,
        priority: task.priority,
        status: task.status,
        projectId: task.project_id,
        createdAt: task.CreatedOn,
        updatedAt: task.ModifiedOn,
        name: task.Name,
        tags: task.Tags,
        owner: task.Owner
      })) : [];
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for creation
      const createData = {
        Name: taskData.title,
        Tags: taskData.tags || '',
        Owner: taskData.owner,
        title: taskData.title,
        description: taskData.description,
        assignee: taskData.assignee,
        due_date: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status || 'todo',
        project_id: parseInt(taskData.projectId)
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task records:${failedRecords}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          const newTask = {
            id: createdTask.Id,
            title: createdTask.title || createdTask.Name,
            description: createdTask.description,
            assignee: createdTask.assignee,
            dueDate: createdTask.due_date,
            priority: createdTask.priority,
            status: createdTask.status,
            projectId: createdTask.project_id,
            createdAt: createdTask.CreatedOn,
            updatedAt: createdTask.ModifiedOn,
            name: createdTask.Name,
            tags: createdTask.Tags,
            owner: createdTask.Owner
          };

          // Log activity
          try {
            await activityService.logTaskActivity('created', newTask, null, 'user1', 'Current User');
          } catch (error) {
            console.warn('Failed to log task creation activity:', error);
          }

          return newTask;
        }
      }

      throw new Error('Failed to create task');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get old task data for activity logging
      const oldTask = await this.getById(id);

      // Only include Updateable fields for update
      const updateData = {
        Id: parseInt(id),
        Name: taskData.title,
        Tags: taskData.tags || '',
        Owner: taskData.owner,
        title: taskData.title,
        description: taskData.description,
        assignee: taskData.assignee,
        due_date: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
        project_id: parseInt(taskData.projectId)
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task records:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedTaskData = successfulUpdates[0].data;
          const updatedTask = {
            id: updatedTaskData.Id,
            title: updatedTaskData.title || updatedTaskData.Name,
            description: updatedTaskData.description,
            assignee: updatedTaskData.assignee,
            dueDate: updatedTaskData.due_date,
            priority: updatedTaskData.priority,
            status: updatedTaskData.status,
            projectId: updatedTaskData.project_id,
            createdAt: updatedTaskData.CreatedOn,
            updatedAt: updatedTaskData.ModifiedOn,
            name: updatedTaskData.Name,
            tags: updatedTaskData.Tags,
            owner: updatedTaskData.Owner
          };

          // Log activity for specific changes
          try {
            if (oldTask.status !== updatedTask.status) {
              await activityService.logTaskActivity('status_changed', updatedTask, null, 'user1', 'Current User', {
                oldStatus: oldTask.status,
                newStatus: updatedTask.status
              });
            } else if (oldTask.priority !== updatedTask.priority) {
              await activityService.logTaskActivity('priority_changed', updatedTask, null, 'user1', 'Current User', {
                oldPriority: oldTask.priority,
                newPriority: updatedTask.priority
              });
            } else if (oldTask.assignee !== updatedTask.assignee) {
              await activityService.logTaskActivity('assigned', updatedTask, null, 'user1', 'Current User', {
                assignedTo: updatedTask.assignee,
                assignedToId: updatedTask.assignedToId
              });
            } else if (oldTask.dueDate !== updatedTask.dueDate) {
              await activityService.logTaskActivity('due_date_changed', updatedTask, null, 'user1', 'Current User', {
                oldDueDate: oldTask.dueDate,
                newDueDate: updatedTask.dueDate
              });
            } else {
              await activityService.logTaskActivity('updated', updatedTask, null, 'user1', 'Current User');
            }
          } catch (error) {
            console.warn('Failed to log task update activity:', error);
          }

          return updatedTask;
        }
      }

      throw new Error('Failed to update task');
    } catch (error) {
      console.error('Error updating task:', error);
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

      // Get task data for activity logging before deletion
      const taskToDelete = await this.getById(id);

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          // Log activity
          try {
            await activityService.logTaskActivity('deleted', taskToDelete, null, 'user1', 'Current User');
          } catch (error) {
            console.warn('Failed to log task deletion activity:', error);
          }

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

export default taskService;