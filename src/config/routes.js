import Home from '../pages/Home';
import Projects from '../pages/Projects';
import MyTasks from '../pages/MyTasks';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'FolderOpen',
    component: Projects
  },
  myTasks: {
    id: 'myTasks',
    label: 'My Tasks',
    path: '/my-tasks',
    icon: 'CheckSquare',
    component: MyTasks
  }
};

export const routeArray = Object.values(routes);