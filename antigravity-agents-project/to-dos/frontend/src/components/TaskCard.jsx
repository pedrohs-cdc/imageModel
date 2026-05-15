import React from 'react';
import { Clock, CheckSquare, Tag, Trash2, Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onChangeStatus, onDelete }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
  
  const priorityColors = {
    low: 'var(--success-color)',
    medium: 'var(--primary-color)',
    high: 'var(--warning-color)',
    urgent: 'var(--danger-color)'
  };
  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente'
  };

  return (
    <div className={`task-card glass-panel ${task.status === 'done' ? 'task-done' : ''}`}>
      <div className="task-card-header">
        <div className="task-priority" style={{ backgroundColor: priorityColors[task.priority] }}></div>
        {task.category_name && (
          <div className="task-category" style={{ backgroundColor: task.category_color + '40', color: task.category_color }}>
            {task.category_name}
          </div>
        )}
        <div className="task-actions">
          <button onClick={onEdit} className="action-btn edit-btn" title="Editar">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="action-btn delete-btn" title="Excluir">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-tags">
        {task.tags?.map(tag => (
          <span key={tag.id} className="tag-badge" style={{ color: tag.color, borderColor: tag.color }}>
            <Tag size={12} /> {tag.name}
          </span>
        ))}
      </div>

      <div className="task-meta">
        {task.due_date && (
          <div className={`meta-item ${isOverdue ? 'overdue' : ''}`}>
            <Clock size={14} />
            <span>{format(parseISO(task.due_date), 'dd MMM', { locale: ptBR })}</span>
          </div>
        )}
        {task.subtask_count > 0 && (
          <div className="meta-item">
            <CheckSquare size={14} />
            <span>{task.subtask_done_count}/{task.subtask_count}</span>
          </div>
        )}
      </div>

      <div className="task-footer">
        <select 
          value={task.status} 
          onChange={(e) => onChangeStatus(task.id, e.target.value)}
          className={`status-select status-${task.status}`}
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Andamento</option>
          <option value="done">Concluída</option>
        </select>
        <div className="priority-label" style={{ color: priorityColors[task.priority] }}>
          {priorityLabels[task.priority]}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
