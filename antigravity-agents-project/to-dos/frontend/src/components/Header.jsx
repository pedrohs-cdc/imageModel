import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import './Header.css';

const Header = () => {
  const { notifications, unreadNotifications, markNotificationAsRead } = useAppData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id) => {
    markNotificationAsRead(id);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="top-header">
      <div className="header-actions">
        <div className="notification-container" ref={dropdownRef}>
          <button 
            className="bell-btn" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Notificações"
          >
            <Bell size={22} />
            {unreadNotifications > 0 && (
              <span className="badge">{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="notification-dropdown glass-panel">
              <div className="dropdown-header">
                <h3>Notificações</h3>
              </div>
              
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">Sem notificações recentes</div>
                ) : (
                  notifications.slice(0, 5).map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notif.id)}
                    >
                      <div className="notif-content">
                        <strong>{notif.title}</strong>
                        <p>{notif.message}</p>
                        <span className="notif-time">{formatTime(notif.created_at)}</span>
                      </div>
                      {!notif.is_read && <div className="unread-dot"></div>}
                    </div>
                  ))
                )}
              </div>
              
              <div 
                className="dropdown-footer" 
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/notifications');
                }}
              >
                Ver todas as notificações
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
