import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckSquare } from 'lucide-react';
import api from '../api/client';
import TaskCard from '../components/TaskCard';
import FAB from '../components/FAB';
import { useToast } from '../components/Toast';
import { useAppData } from '../hooks/useAppData';
import SkeletonCard from '../components/SkeletonCard';
import './Tasks.css';

const Tasks = () => {
  const { addToast } = useToast();
  const { categories, tags, openTaskModal } = useAppData();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let query = `/tasks?order_by=${orderBy}`;
      if (statusFilter) query += `&status=${statusFilter}`;
      if (priorityFilter) query += `&priority=${priorityFilter}`;
      if (categoryFilter) query += `&category_id=${categoryFilter}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await api.get(query);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, priorityFilter, categoryFilter, orderBy]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      addToast('Status atualizado com sucesso', 'success');
      fetchTasks();
    } catch (err) {
      console.error(err);
      addToast('Erro ao atualizar status', 'error');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      addToast('Tarefa excluída', 'info');
      fetchTasks();
    } catch (err) {
      console.error(err);
      addToast('Erro ao excluir tarefa', 'error');
    }
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tarefas</h1>
          <p className="page-subtitle">Gerencie suas atividades diárias</p>
        </div>
        <button className="btn-primary" onClick={() => openTaskModal()}>
          <Plus size={20} /> Nova Tarefa
        </button>
      </div>

      <div className="filters-bar glass-panel">
        <div className="search-input">
          <Search size={18} className="input-icon" />
          <input 
            type="text" 
            placeholder="Buscar tarefas..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="filter-selects">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Status (Todos)</option>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Andamento</option>
            <option value="done">Concluída</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">Prioridade (Todas)</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Categoria (Todas)</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value="created_at">Mais Recentes</option>
            <option value="due_date">Prazo</option>
            <option value="priority">Maior Prioridade</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="tasks-grid">
          <SkeletonCard height="200px" />
          <SkeletonCard height="200px" />
          <SkeletonCard height="200px" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CheckSquare size={48} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
          <h3>Nenhuma tarefa encontrada</h3>
          <p>Tente ajustar os filtros ou crie uma nova tarefa.</p>
          <button className="btn-primary" onClick={() => openTaskModal()} style={{ marginTop: '16px' }}>
            <Plus size={18} /> Criar a primeira
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={() => openTaskModal(task)}
              onChangeStatus={handleStatusChange}
              onDelete={() => handleDelete(task.id)}
            />
          ))}
        </div>
      )}

      <FAB onClick={() => openTaskModal()} />
    </div>
  );
};

export default Tasks;
