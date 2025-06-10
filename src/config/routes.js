import HomePage from '@/components/pages/HomePage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import MyTasksPage from '@/components/pages/MyTasksPage';
import ActivityFeedPage from '@/components/pages/ActivityFeedPage';
export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'FolderOpen',
component: ProjectsPage
  },
myTasks: {
    id: 'myTasks',
    label: 'My Tasks',
    path: '/my-tasks',
    icon: 'CheckSquare',
    component: MyTasksPage
  },
  activity: {
    id: 'activity',
    label: 'Activity Feed',
    path: '/activity',
    icon: 'Clock',
    component: ActivityFeedPage
  }
};

export const routeArray = Object.values(routes);