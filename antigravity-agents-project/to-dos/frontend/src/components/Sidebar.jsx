import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Trello, CalendarDays, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = React.useState(document.documentElement.getAttribute('data-theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo">
          <CheckSquare size={28} color="var(--primary-color)" />
          <h2>TaskFlow</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <CheckSquare size={20} />
          <span>Tarefas</span>
        </NavLink>
        <NavLink to="/kanban" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Trello size={20} />
          <span>Kanban</span>
        </NavLink>
        <NavLink to="/calendar" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <CalendarDays size={20} />
          <span>Calendário</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
        
        <div className="footer-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Alternar tema">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="logout-btn" onClick={logout} title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
