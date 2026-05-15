import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Trello, CalendarDays, LogOut, Settings as SettingsIcon, Tag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import TagModal from './TagModal';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const navigate = useNavigate();



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
        <button className="nav-item" onClick={() => setIsTagModalOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}>
          <Tag size={20} />
          <span>Tags</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} title="Ver Perfil">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="Avatar" className="avatar" style={{ border: 'none', objectFit: 'cover' }} />
          ) : (
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          )}
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
        
        <div className="footer-actions">
          <button className="theme-toggle" onClick={() => navigate('/settings')} title="Configurações">
            <SettingsIcon size={18} />
          </button>
          <button className="logout-btn" onClick={logout} title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {isTagModalOpen && <TagModal onClose={() => setIsTagModalOpen(false)} />}
    </aside>
  );
};

export default Sidebar;
