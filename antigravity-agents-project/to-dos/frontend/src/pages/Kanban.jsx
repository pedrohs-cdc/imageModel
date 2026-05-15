import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle, Clock } from 'lucide-react';
import api from '../api/client';
import TaskCard from '../components/TaskCard';
import { useAppData } from '../hooks/useAppData';
import './Kanban.css';

const Kanban = () => {
  const { openTaskModal } = useAppData();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    window.addEventListener('refresh-tasks', fetchTasks);
    return () => window.removeEventListener('refresh-tasks', fetchTasks);
  }, []);


  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      await handleStatusChange(taskId, newStatus);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const columns = [
    { id: 'pending', title: 'Pendente', icon: <Clock size={18} color="var(--warning-color)" /> },
    { id: 'in_progress', title: 'Em Andamento', icon: <LayoutDashboard size={18} color="var(--primary-color)" /> },
    { id: 'done', title: 'Concluída', icon: <CheckCircle size={18} color="var(--success-color)" /> },
  ];

  if (loading) return <div className="loading-state">Carregando Kanban...</div>;

  return (
    <div className="kanban-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kanban</h1>
          <p className="page-subtitle">Acompanhe o fluxo das suas tarefas</p>
        </div>
      </div>

      <div className="kanban-board">
        {columns.map(col => {
          const columnTasks = tasks.filter(t => t.status === col.id);
          return (
            <div 
              key={col.id} 
              className="kanban-column"
              onDrop={(e) => handleDrop(e, col.id)}
              onDragOver={handleDragOver}
            >
              <div className="column-header">
                <div className="column-title">
                  {col.icon} {col.title}
                </div>
                <div className="column-count">{columnTasks.length}</div>
              </div>
              
              <div className="kanban-tasks kanban-drop-zone">
                {columnTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ cursor: 'grab' }}
                  >
                    <TaskCard 
                      task={task} 
                      onEdit={() => openTaskModal(task)}
                      onChangeStatus={handleStatusChange}
                      onDelete={() => handleDelete(task.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kanban;
