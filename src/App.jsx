import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import HomePage from '@/components/pages/HomePage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import KanbanBoardPage from '@/components/pages/KanbanBoardPage';
import ProjectDashboardPage from '@/components/pages/ProjectDashboardPage';
import MyTasksPage from '@/components/pages/MyTasksPage';
import ActivityFeedPage from '@/components/pages/ActivityFeedPage';
import SearchResultsPage from '@/components/pages/SearchResultsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden">
        <Routes>
<Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/projects" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:projectId/board" element={<KanbanBoardPage />} />
            <Route path="projects/:projectId/dashboard" element={<ProjectDashboardPage />} />
            <Route path="my-tasks" element={<MyTasksPage />} />
            <Route path="activity" element={<ActivityFeedPage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="rounded-lg shadow-lg"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;