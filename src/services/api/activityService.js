import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let activities = [...activitiesData];

const activityService = {
  async getAll(filters = {}) {
    await delay(300);
    let filteredActivities = [...activities];

    // Filter by event type
    if (filters.eventType && filters.eventType !== 'all') {
      filteredActivities = filteredActivities.filter(activity => 
        activity.type.includes(filters.eventType)
      );
    }

    // Filter by project
    if (filters.projectId && filters.projectId !== 'all') {
      filteredActivities = filteredActivities.filter(activity => 
        activity.projectId === filters.projectId
      );
    }

    // Sort by timestamp (newest first)
    filteredActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return filteredActivities;
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.id === id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  },

  async getByProject(projectId) {
    await delay(300);
    return activities
      .filter(activity => activity.projectId === projectId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(activity => ({ ...activity }));
  },

  async create(activityData) {
    await delay(200);
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    activities.unshift(newActivity); // Add to beginning for newest first
    return { ...newActivity };
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