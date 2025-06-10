import HomePage from '@/components/pages/HomePage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import MyTasksPage from '@/components/pages/MyTasksPage';

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
  }
};

export const routeArray = Object.values(routes);