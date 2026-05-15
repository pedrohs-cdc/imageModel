import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/client';
import SubtaskList from './SubtaskList';
import './TaskModal.css';

const TaskModal = ({ task, categories, tags, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    category_id: '',
    due_date: '',
    tag_ids: []
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        category_id: task.category_id || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        tag_ids: task.tags ? task.tags.map(t => t.id) : []
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => {
      const isSelected = prev.tag_ids.includes(tagId);
      if (isSelected) {
        return { ...prev, tag_ids: prev.tag_ids.filter(id => id !== tagId) };
      } else {
        return { ...prev, tag_ids: [...prev.tag_ids, tagId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        category_id: formData.category_id ? Number(formData.category_id) : null,
      };

      if (task) {
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      onClose(true); // refresh
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar tarefa');
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        className="modal-content glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <h2>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button className="close-btn" onClick={() => onClose()}><X size={24} /></button>
        </div>

        <div className="modal-body">
          <form id="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="done">Concluída</option>
                </select>
              </div>

              <div className="form-group">
                <label>Prioridade</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoria</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange}>
                  <option value="">Nenhuma</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Data de Prazo</label>
                <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="tags-selection">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`tag-toggle ${formData.tag_ids.includes(tag.id) ? 'selected' : ''}`}
                    style={{ borderColor: tag.color, color: formData.tag_ids.includes(tag.id) ? '#fff' : tag.color, backgroundColor: formData.tag_ids.includes(tag.id) ? tag.color : 'transparent' }}
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {task && (
            <div className="subtasks-section">
              <SubtaskList taskId={task.id} subtasks={task.subtasks || []} />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={() => onClose()}>Cancelar</button>
          <button type="submit" form="task-form" className="btn-primary">
            <Save size={18} /> Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskModal;
