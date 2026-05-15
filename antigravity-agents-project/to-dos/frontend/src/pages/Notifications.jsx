import React from 'react';
import { motion } from 'framer-motion';
import { CheckCheck, BellRing } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import './Notifications.css';

const Notifications = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppData();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="notifications-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Suas Notificações</h1>
          <p className="page-subtitle">Histórico de avisos e lembretes</p>
        </div>
        
        {notifications.some(n => !n.is_read) && (
          <button className="btn-secondary" onClick={markAllNotificationsAsRead}>
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="notifications-container">
        {notifications.length === 0 ? (
          <div className="empty-state glass-panel">
            <BellRing size={48} />
            <p>Você não tem nenhuma notificação.</p>
          </div>
        ) : (
          <div className="notif-history-list glass-panel">
            {notifications.map((notif, index) => (
              <motion.div 
                key={notif.id}
                className={`history-item ${!notif.is_read ? 'unread' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !notif.is_read && markNotificationAsRead(notif.id)}
              >
                <div className="history-icon">
                  <BellRing size={20} />
                </div>
                <div className="history-content">
                  <div className="history-header">
                    <h4>{notif.title}</h4>
                    <span className="history-date">{formatDate(notif.created_at)}</span>
                  </div>
                  <p>{notif.message}</p>
                </div>
                {!notif.is_read && <div className="unread-dot"></div>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
