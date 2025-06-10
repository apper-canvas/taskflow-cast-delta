import { toast } from 'react-toastify';

const activityService = {
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "type", "title", "description", "entity_type", "entity_id", "entity_title", "project_title", "user_name", "timestamp", "metadata", "project_id", "user_id"],
        orderBy: [
          {
            fieldName: "timestamp",
            SortType: "DESC"
          }
        ]
      };

      // Add filters if provided
      if (filters.eventType && filters.eventType !== 'all') {
        params.where = [
          {
            fieldName: "type",
            operator: "Contains",
            values: [filters.eventType]
          }
        ];
      }

      if (filters.projectId && filters.projectId !== 'all') {
        const projectFilter = {
          fieldName: "project_id",
          operator: "EqualTo",
          values: [parseInt(filters.projectId)]
        };

        if (params.where) {
          params.where.push(projectFilter);
        } else {
          params.where = [projectFilter];
        }
      }

      const response = await apperClient.fetchRecords('Activity1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to fetch ${failedRecords.length} activity records:${failedRecords}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => ({
          id: result.data.Id,
          type: result.data.type,
          title: result.data.title,
          description: result.data.description,
          entityType: result.data.entity_type,
          entityId: result.data.entity_id,
          entityTitle: result.data.entity_title,
          projectId: result.data.project_id,
          projectTitle: result.data.project_title,
          userId: result.data.user_id,
          userName: result.data.user_name,
          timestamp: result.data.timestamp,
          metadata: result.data.metadata ? JSON.parse(result.data.metadata) : {},
          name: result.data.Name,
          tags: result.data.Tags,
          owner: result.data.Owner
        }));
      }

      return response.data ? [response.data].map(activity => ({
        id: activity.Id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        entityType: activity.entity_type,
        entityId: activity.entity_id,
        entityTitle: activity.entity_title,
        projectId: activity.project_id,
        projectTitle: activity.project_title,
        userId: activity.user_id,
        userName: activity.user_name,
        timestamp: activity.timestamp,
        metadata: activity.metadata ? JSON.parse(activity.metadata) : {},
        name: activity.Name,
        tags: activity.Tags,
        owner: activity.Owner
      })) : [];
    } catch (error) {
      console.error('Error fetching activities:', error);
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
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "type", "title", "description", "entity_type", "entity_id", "entity_title", "project_title", "user_name", "timestamp", "metadata", "project_id", "user_id"]
      };

      const response = await apperClient.getRecordById('Activity1', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        throw new Error('Activity not found');
      }

      return {
        id: response.data.Id,
        type: response.data.type,
        title: response.data.title,
        description: response.data.description,
        entityType: response.data.entity_type,
        entityId: response.data.entity_id,
        entityTitle: response.data.entity_title,
        projectId: response.data.project_id,
        projectTitle: response.data.project_title,
        userId: response.data.user_id,
        userName: response.data.user_name,
        timestamp: response.data.timestamp,
        metadata: response.data.metadata ? JSON.parse(response.data.metadata) : {},
        name: response.data.Name,
        tags: response.data.Tags,
        owner: response.data.Owner
      };
    } catch (error) {
      console.error(`Error fetching activity with ID ${id}:`, error);
      throw error;
    }
  },

  async getByProject(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "type", "title", "description", "entity_type", "entity_id", "entity_title", "project_title", "user_name", "timestamp", "metadata", "project_id", "user_id"],
        where: [
          {
            fieldName: "project_id",
            operator: "EqualTo",
            values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            SortType: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('Activity1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to fetch ${failedRecords.length} activity records for project ${projectId}:${failedRecords}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => ({
          id: result.data.Id,
          type: result.data.type,
          title: result.data.title,
          description: result.data.description,
          entityType: result.data.entity_type,
          entityId: result.data.entity_id,
          entityTitle: result.data.entity_title,
          projectId: result.data.project_id,
          projectTitle: result.data.project_title,
          userId: result.data.user_id,
          userName: result.data.user_name,
          timestamp: result.data.timestamp,
          metadata: result.data.metadata ? JSON.parse(result.data.metadata) : {},
          name: result.data.Name,
          tags: result.data.Tags,
          owner: result.data.Owner
        }));
      }

      return response.data ? [response.data].map(activity => ({
        id: activity.Id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        entityType: activity.entity_type,
        entityId: activity.entity_id,
        entityTitle: activity.entity_title,
        projectId: activity.project_id,
        projectTitle: activity.project_title,
        userId: activity.user_id,
        userName: activity.user_name,
        timestamp: activity.timestamp,
        metadata: activity.metadata ? JSON.parse(activity.metadata) : {},
        name: activity.Name,
        tags: activity.Tags,
        owner: activity.Owner
      })) : [];
    } catch (error) {
      console.error(`Error fetching activities for project ${projectId}:`, error);
      throw error;
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for creation
      const createData = {
        Name: activityData.title,
        Tags: activityData.tags || '',
        Owner: activityData.owner,
        type: activityData.type,
        title: activityData.title,
        description: activityData.description,
        entity_type: activityData.entityType,
        entity_id: activityData.entityId?.toString(),
        entity_title: activityData.entityTitle,
        project_title: activityData.projectTitle,
        user_name: activityData.userName,
        timestamp: new Date().toISOString(),
        metadata: JSON.stringify(activityData.metadata || {}),
        project_id: activityData.projectId ? parseInt(activityData.projectId) : null,
        user_id: activityData.userId ? parseInt(activityData.userId) : null
      };

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('Activity1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} activity records:${failedRecords}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdActivity = successfulRecords[0].data;
          return {
            id: createdActivity.Id,
            type: createdActivity.type,
            title: createdActivity.title,
            description: createdActivity.description,
            entityType: createdActivity.entity_type,
            entityId: createdActivity.entity_id,
            entityTitle: createdActivity.entity_title,
            projectId: createdActivity.project_id,
            projectTitle: createdActivity.project_title,
            userId: createdActivity.user_id,
            userName: createdActivity.user_name,
            timestamp: createdActivity.timestamp,
            metadata: createdActivity.metadata ? JSON.parse(createdActivity.metadata) : {},
            name: createdActivity.Name,
            tags: createdActivity.Tags,
            owner: createdActivity.Owner
          };
        }
      }

      throw new Error('Failed to create activity');
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  async logProjectActivity(type, projectData, userId = 'user1', userName = 'Current User') {
    const activityMap = {
      created: {
        title: 'Project Created',
        description: `New project '${projectData.title}' was created`
      },
      updated: {
        title: 'Project Updated',
        description: `Project '${projectData.title}' details were updated`
      },
      deleted: {
        title: 'Project Deleted',
        description: `Project '${projectData.title}' was deleted`
      }
    };

    const activity = activityMap[type];
    if (!activity) return;

    return this.create({
      type: `project_${type}`,
      title: activity.title,
      description: activity.description,
      entityType: 'project',
      entityId: projectData.id,
      entityTitle: projectData.title,
      userId,
      userName,
      metadata: {
        projectName: projectData.title
      }
    });
  },

  async logTaskActivity(type, taskData, projectData = null, userId = 'user1', userName = 'Current User', metadata = {}) {
    const activityMap = {
      created: {
        title: 'Task Added',
        description: projectData 
          ? `Task '${taskData.title}' was added to project '${projectData.title}'`
          : `Task '${taskData.title}' was created`
      },
      updated: {
        title: 'Task Updated',
        description: `Task '${taskData.title}' was updated`
      },
      deleted: {
        title: 'Task Deleted',
        description: `Task '${taskData.title}' was deleted`
      },
      status_changed: {
        title: 'Task Status Updated',
        description: `Task '${taskData.title}' status changed from '${metadata.oldStatus}' to '${metadata.newStatus}'`
      },
      assigned: {
        title: 'Task Assigned',
        description: `Task '${taskData.title}' was assigned to ${metadata.assignedTo}`
      },
      completed: {
        title: 'Task Completed',
        description: `Task '${taskData.title}' was marked as completed`
      },
      priority_changed: {
        title: 'Task Priority Updated',
        description: `Task '${taskData.title}' priority changed from '${metadata.oldPriority}' to '${metadata.newPriority}'`
      },
      due_date_changed: {
        title: 'Task Due Date Updated',
        description: `Task '${taskData.title}' due date was updated`
      }
    };

    const activity = activityMap[type];
    if (!activity) return;

    const activityData = {
      type: `task_${type}`,
      title: activity.title,
      description: activity.description,
      entityType: 'task',
      entityId: taskData.id,
      entityTitle: taskData.title,
      userId,
      userName,
      metadata: {
        taskTitle: taskData.title,
        ...metadata
      }
    };

    if (projectData) {
      activityData.projectId = projectData.id;
      activityData.projectTitle = projectData.title;
    }

    return this.create(activityData);
  }
};

export default activityService;