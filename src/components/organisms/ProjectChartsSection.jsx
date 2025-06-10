import React from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const ProjectChartsSection = ({ tasks, delay = 0 }) => {
  const getTaskStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(task => task.status === 'todo').length;
    const inProgress = tasks.filter(task => task.status === 'inProgress').length;
    const done = tasks.filter(task => task.status === 'done').length;
    
    const priorityStats = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    };

    return { total, todo, inProgress, done, priorityStats };
  };

  const stats = getTaskStats();

  const statusChartOptions = {
    chart: { type: 'donut', width: '100%' },
    labels: ['To Do', 'In Progress', 'Done'],
    colors: ['#3B82F6', '#F59E0B', '#10B981'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: { size: '70%' }
      }
    }
  };

  const priorityChartOptions = {
    chart: { type: 'bar', width: '100%' },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%' }
    },
    dataLabels: { enabled: false },
    xaxis: { categories: ['High', 'Medium', 'Low'] },
    colors: ['#EC4899', '#F59E0B', '#6B7280'],
    title: { text: 'Tasks by Priority' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.4 }}
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Task Status Distribution</h3>
        {stats.total > 0 ? (
          <Chart
            options={statusChartOptions}
            series={[stats.todo, stats.inProgress, stats.done]}
            type="donut"
            height={300}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-surface-500">
            <div className="text-center">
              <ApperIcon name="PieChart" size={48} className="mx-auto mb-2 opacity-50" />
              <p>No tasks to display</p>
            </div>
          </div>
        )}
      </Card>

      <Card
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.5 }}
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Priority Distribution</h3>
        {stats.total > 0 ? (
          <Chart
            options={priorityChartOptions}
            series={[{
              name: 'Tasks',
              data: [stats.priorityStats.high, stats.priorityStats.medium, stats.priorityStats.low]
            }]}
            type="bar"
            height={300}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-surface-500">
            <div className="text-center">
              <ApperIcon name="BarChart3" size={48} className="mx-auto mb-2 opacity-50" />
              <p>No tasks to display</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectChartsSection;