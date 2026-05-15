import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../components/Toast';
import './Settings.css';

const Settings = () => {
  const { addToast } = useToast();
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
  const [notifications, setNotifications] = useState(true);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    addToast(`Tema alterado para ${newTheme === 'dark' ? 'Escuro' : 'Claro'}`, 'success');
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    addToast(notifications ? 'Notificações desativadas' : 'Notificações ativadas', 'info');
  };

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Configurações</h1>
          <p className="page-subtitle">Personalize a sua experiência no TaskFlow</p>
        </div>
      </div>

      <motion.div 
        className="settings-section glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="settings-section-title"><SettingsIcon size={20} /> Preferências do Sistema</h2>
        
        <div className="settings-row">
          <div className="settings-info">
            <h3>Tema Escuro</h3>
            <p>Ativar o modo escuro premium para melhor leitura à noite.</p>
          </div>
          <div className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}>
            <div className="toggle-knob"></div>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-info">
            <h3>Notificações</h3>
            <p>Receber alertas e lembretes de tarefas atrasadas.</p>
          </div>
          <div className={`toggle-switch ${notifications ? 'active' : ''}`} onClick={toggleNotifications}>
            <div className="toggle-knob"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
