import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckSquare } from 'lucide-react';
import api from '../api/client';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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

  const fetchFiltersData = async () => {
    try {
      const [catRes, tagsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/tags')
      ]);
      setCategories(catRes.data);
      setTags(tagsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, priorityFilter, categoryFilter, orderBy]);

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = (shouldRefresh = false) => {
    setIsModalOpen(false);
    setEditingTask(null);
    if (shouldRefresh) fetchTasks();
  };

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

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tarefas</h1>
          <p className="page-subtitle">Gerencie suas atividades diárias</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
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
        <div className="loading-state">Buscando tarefas...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CheckSquare size={48} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
          <h3>Nenhuma tarefa encontrada</h3>
          <p>Tente ajustar os filtros ou crie uma nova tarefa.</p>
          <button className="btn-primary" onClick={() => handleOpenModal()} style={{ marginTop: '16px' }}>
            <Plus size={18} /> Criar a primeira
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={() => handleOpenModal(task)}
              onChangeStatus={handleStatusChange}
              onDelete={() => handleDelete(task.id)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <TaskModal 
          task={editingTask} 
          categories={categories}
          tags={tags}
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Tasks;
