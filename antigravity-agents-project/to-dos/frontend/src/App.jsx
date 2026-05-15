import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AppDataProvider, useAppData } from './hooks/useAppData';
import { ToastProvider } from './components/Toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskModal from './components/TaskModal';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Kanban from './pages/Kanban';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

const PrivateRoute = ({ children }) => {
  const { signed, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  if (!signed) return <Navigate to="/login" />;
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content-area">
        <Header />
        {children}
      </main>
    </div>
  );
};

const GlobalModalWrapper = () => {
  const { isTaskModalOpen, editingTask, categories, tags, closeTaskModal, refreshCoreData } = useAppData();
  
  if (!isTaskModalOpen) return null;
  
  return (
    <TaskModal 
      task={editingTask}
      categories={categories}
      tags={tags}
      onClose={(refresh) => {
        closeTaskModal();
        if (refresh) {
          // You might want to trigger a global refresh or let the active page fetch its tasks
          // For now, refreshing core data
          refreshCoreData();
          window.dispatchEvent(new Event('refresh-tasks'));
        }
      }}
    />
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppDataProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
              <Route path="/kanban" element={<PrivateRoute><Kanban /></PrivateRoute>} />
              <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            </Routes>
            <GlobalModalWrapper />
          </AppDataProvider>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
