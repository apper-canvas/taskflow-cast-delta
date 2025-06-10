import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import KanbanBoard from './pages/KanbanBoard';
import ProjectDashboard from './pages/ProjectDashboard';
import MyTasks from './pages/MyTasks';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/projects" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId/board" element={<KanbanBoard />} />
            <Route path="projects/:projectId/dashboard" element={<ProjectDashboard />} />
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="*" element={<NotFound />} />
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