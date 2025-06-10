import { toast } from 'react-toastify';

const commentService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "author", "content", "timestamp", "task_id"]
      };

      const response = await apperClient.fetchRecords('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to fetch ${failedRecords.length} comment records:${failedRecords}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => ({
          id: result.data.Id,
          taskId: result.data.task_id,
          author: result.data.author,
          content: result.data.content,
          timestamp: result.data.timestamp,
          name: result.data.Name,
          tags: result.data.Tags,
          owner: result.data.Owner
        }));
      }

      return response.data ? [response.data].map(comment => ({
        id: comment.Id,
        taskId: comment.task_id,
        author: comment.author,
        content: comment.content,
        timestamp: comment.timestamp,
        name: comment.Name,
        tags: comment.Tags,
        owner: comment.Owner
      })) : [];
    } catch (error) {
      console.error('Error fetching comments:', error);
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
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "author", "content", "timestamp", "task_id"]
      };

      const response = await apperClient.getRecordById('Comment1', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        throw new Error('Comment not found');
      }

      return {
        id: response.data.Id,
        taskId: response.data.task_id,
        author: response.data.author,
        content: response.data.content,
        timestamp: response.data.timestamp,
        name: response.data.Name,
        tags: response.data.Tags,
        owner: response.data.Owner
      };
    } catch (error) {
      console.error(`Error fetching comment with ID ${id}:`, error);
      throw error;
    }
  },

  async getByTaskId(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "author", "content", "timestamp", "task_id"],
        where: [
          {
            fieldName: "task_id",
            operator: "EqualTo",
            values: [parseInt(taskId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            SortType: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to fetch ${failedRecords.length} comment records for task ${taskId}:${failedRecords}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => ({
          id: result.data.Id,
          taskId: result.data.task_id,
          author: result.data.author,
          content: result.data.content,
          timestamp: result.data.timestamp,
          name: result.data.Name,
          tags: result.data.Tags,
          owner: result.data.Owner
        }));
      }

      return response.data ? [response.data].map(comment => ({
        id: comment.Id,
        taskId: comment.task_id,
        author: comment.author,
        content: comment.content,
        timestamp: comment.timestamp,
        name: comment.Name,
        tags: comment.Tags,
        owner: comment.Owner
      })) : [];
    } catch (error) {
      console.error(`Error fetching comments for task ${taskId}:`, error);
      throw error;
    }
  },

  async create(commentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for creation
      const createData = {
        Name: commentData.content?.substring(0, 50) || 'Comment',
        Tags: commentData.tags || '',
        Owner: commentData.owner,
        author: commentData.author,
        content: commentData.content,
        timestamp: new Date().toISOString(),
        task_id: parseInt(commentData.taskId)
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} comment records:${failedRecords}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdComment = successfulRecords[0].data;
          return {
            id: createdComment.Id,
            taskId: createdComment.task_id,
            author: createdComment.author,
            content: createdComment.content,
            timestamp: createdComment.timestamp,
            name: createdComment.Name,
            tags: createdComment.Tags,
            owner: createdComment.Owner
          };
        }
      }

      throw new Error('Failed to create comment');
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  async update(id, commentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update
      const updateData = {
        Id: parseInt(id),
        Name: commentData.content?.substring(0, 50) || 'Comment',
        Tags: commentData.tags || '',
        Owner: commentData.owner,
        author: commentData.author,
        content: commentData.content,
        timestamp: new Date().toISOString(),
        task_id: parseInt(commentData.taskId)
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} comment records:${failedUpdates}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedComment = successfulUpdates[0].data;
          return {
            id: updatedComment.Id,
            taskId: updatedComment.task_id,
            author: updatedComment.author,
            content: updatedComment.content,
            timestamp: updatedComment.timestamp,
            name: updatedComment.Name,
            tags: updatedComment.Tags,
            owner: updatedComment.Owner
          };
        }
      }

      throw new Error('Failed to update comment');
    } catch (error) {
      console.error('Error updating comment:', error);
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

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} comment records:${failedDeletions}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

export default commentService;