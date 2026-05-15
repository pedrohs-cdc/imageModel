import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import api from '../api/client';
import './SimpleModal.css';

const CategoryModal = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#7C6FFF');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post('/categories', { name, color });
      setName('');
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir categoria? As tarefas associadas ficarão sem categoria.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="simple-modal-overlay" onClick={onClose}>
      <div className="simple-modal-content" onClick={e => e.stopPropagation()}>
        <div className="simple-modal-header">
          <h2>Gerenciar Categorias</h2>
          <button className="simple-modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="simple-modal-body">
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input 
              type="text" 
              placeholder="Nova categoria" 
              value={name} 
              onChange={e => setName(e.target.value)}
              style={{ flex: 1 }}
            />
            <input 
              type="color" 
              value={color} 
              onChange={e => setColor(e.target.value)} 
              style={{ width: '40px', padding: '0', height: '40px' }}
            />
            <button type="submit" className="btn-primary">Adicionar</button>
          </form>

          <div className="items-list">
            {categories.map(cat => (
              <div key={cat.id} className="list-item">
                <div className="list-item-info">
                  <div className="color-dot" style={{ backgroundColor: cat.color }}></div>
                  <span>{cat.name}</span>
                </div>
                <div className="list-item-actions">
                  <button onClick={() => handleDelete(cat.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
