import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './useAuth';

const AppDataContext = createContext({});

export const AppDataProvider = ({ children }) => {
  const { signed } = useAuth();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Global Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchCoreData = async () => {
    if (!signed) return;
    try {
      setIsDataLoading(true);
      const [catRes, tagRes, notifRes] = await Promise.all([
        api.get('/categories'),
        api.get('/tags'),
        api.get('/notifications')
      ]);
      setCategories(catRes.data);
      setTags(tagRes.data);
      setNotifications(notifRes.data.notifications);
      setUnreadNotifications(notifRes.data.unreadCount);
    } catch (err) {
      console.error('[AppData] Erro ao buscar dados globais:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchCoreData();
  }, [signed]);

  const markNotificationAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadNotifications(0);
    } catch (err) {
      console.error(err);
    }
  };

  const openTaskModal = (task = null) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <AppDataContext.Provider value={{
      categories,
      tags,
      notifications,
      unreadNotifications,
      isDataLoading,
      refreshCoreData: fetchCoreData,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      // Global Modal
      isTaskModalOpen,
      editingTask,
      openTaskModal,
      closeTaskModal
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
