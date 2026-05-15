import React, { useEffect, useState } from 'react';
import { LogOut, User, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="profile-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Meu Perfil</h1>
          <p className="page-subtitle">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <motion.div 
        className="profile-card glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-avatar-container">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="Avatar" className="profile-avatar" />
          ) : (
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h2 className="profile-name">{user?.name}</h2>
        <p className="profile-email">{user?.email}</p>

        <div className="profile-stats">
          <div className="profile-stat-item">
            <span className="profile-stat-value">{stats ? stats.total : '-'}</span>
            <span className="profile-stat-label">Tarefas Criadas</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-value">{stats ? stats.totalDone : '-'}</span>
            <span className="profile-stat-label">Concluídas</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-value">{stats ? stats.streak : '-'}</span>
            <span className="profile-stat-label">Dias no Foco</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-danger" onClick={logout}>
            <LogOut size={18} /> Sair da Conta
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
