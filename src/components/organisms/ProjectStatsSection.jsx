import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatCard from '@/components/molecules/StatCard';

const ProjectStatsSection = ({ tasks, delay = 0 }) => {
  const getTaskStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(task => task.status === 'todo').length;
    const inProgress = tasks.filter(task => task.status === 'inProgress').length;
    const done = tasks.filter(task => task.status === 'done').length;
    return { total, todo, inProgress, done };
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    return tasks
      .filter(task => {
        if (!task.dueDate || task.status === 'done') return false;
        const dueDate = new Date(task.dueDate);
        const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 14; // Next 14 days
      })
      .length;
  };

  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      return new Date(task.dueDate) < today;
    }).length;
  };

  const stats = getTaskStats();
  const upcomingDeadlinesCount = getUpcomingDeadlines();
  const overdueTasksCount = getOverdueTasks();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Tasks"
        value={stats.total}
        icon="CheckSquare"
        colorClass="bg-primary"
        delay={delay + 0.0}
      />
      <StatCard
        title="Completed"
        value={stats.done}
        icon="CheckCircle"
        colorClass="bg-status-success"
        delay={delay + 0.1}
      />
      <StatCard
        title="Due Soon"
        value={upcomingDeadlinesCount}
        icon="Clock"
        colorClass="bg-status-warning"
        delay={delay + 0.2}
      />
      <StatCard
        title="Overdue"
        value={overdueTasksCount}
        icon="AlertTriangle"
        colorClass="bg-status-error"
        delay={delay + 0.3}
      />
    </div>
  );
};

export default ProjectStatsSection;