import React, { useState } from 'react';
import { Check, X, Plus, Trash2 } from 'lucide-react';
import api from '../api/client';
import './SubtaskList.css';

const SubtaskList = ({ taskId, subtasks: initialSubtasks }) => {
  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await api.post(`/tasks/${taskId}/subtasks`, { title: newTitle });
      setSubtasks([...subtasks, res.data]);
      setNewTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id, currentDone) => {
    try {
      const updatedDone = currentDone === 1 ? 0 : 1;
      // Otimista
      setSubtasks(subtasks.map(s => s.id === id ? { ...s, done: updatedDone } : s));
      await api.put(`/tasks/${taskId}/subtasks/${id}`, { done: updatedDone === 1 });
    } catch (err) {
      console.error(err);
      // Rollback poderia vir aqui
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${taskId}/subtasks/${id}`);
      setSubtasks(subtasks.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const progress = subtasks.length > 0 
    ? Math.round((subtasks.filter(s => s.done === 1).length / subtasks.length) * 100)
    : 0;

  return (
    <div className="subtask-list-container">
      <div className="subtasks-header">
        <h3>Subtarefas</h3>
        <span className="progress-text">{progress}% concluído</span>
      </div>
      
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <ul className="subtasks-list">
        {subtasks.map(sub => (
          <li key={sub.id} className="subtask-item">
            <button 
              className={`checkbox-btn ${sub.done === 1 ? 'checked' : ''}`}
              onClick={() => handleToggle(sub.id, sub.done)}
            >
              {sub.done === 1 && <Check size={14} />}
            </button>
            <span className={`subtask-title ${sub.done === 1 ? 'done-text' : ''}`}>
              {sub.title}
            </span>
            <button className="subtask-delete-btn" onClick={() => handleDelete(sub.id)}>
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="add-subtask-form">
        <input 
          type="text" 
          placeholder="Adicionar subtarefa..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit" disabled={!newTitle.trim()} className="btn-icon">
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
};

export default SubtaskList;
