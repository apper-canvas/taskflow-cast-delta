import tasksData from '../mockData/tasks.json';
import activityService from './activityService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async getByProjectId(projectId) {
    await delay(300);
    return tasks.filter(task => task.projectId === projectId).map(task => ({ ...task }));
  },

async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    
    // Log activity
    try {
      await activityService.logTaskActivity('created', newTask, null, 'user1', 'Current User');
    } catch (error) {
      console.warn('Failed to log task creation activity:', error);
    }
    
    return { ...newTask };
  },

async update(id, taskData) {
    await delay(400);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const oldTask = { ...tasks[index] };
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    tasks[index] = updatedTask;
    
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
      } else if (oldTask.assignedTo !== updatedTask.assignedTo) {
        await activityService.logTaskActivity('assigned', updatedTask, null, 'user1', 'Current User', {
          assignedTo: updatedTask.assignedTo,
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
    
    return { ...updatedTask };
  },

async delete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const taskToDelete = { ...tasks[index] };
    tasks.splice(index, 1);
    
    // Log activity
    try {
      await activityService.logTaskActivity('deleted', taskToDelete, null, 'user1', 'Current User');
    } catch (error) {
      console.warn('Failed to log task deletion activity:', error);
    }
    
    return true;
  }
};

export default taskService;