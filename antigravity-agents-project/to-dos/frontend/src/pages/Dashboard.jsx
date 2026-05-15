import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, CheckCircle, Clock, Flame, Download } from 'lucide-react';
import api from '../api/client';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error('Erro ao buscar dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleExport = async () => {
    try {
      const response = await api.get('/export?format=csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tarefas.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Erro na exportação', err);
    }
  };

  if (loading) return <div className="loading-state">Carregando métricas...</div>;
  if (!stats) return <div className="error-state">Erro ao carregar dados.</div>;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Sua visão geral de produtividade</p>
        </div>
        <button className="btn-secondary" onClick={handleExport}>
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      <div className="stats-grid">
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon" style={{ background: 'rgba(108, 99, 255, 0.2)', color: 'var(--primary-color)' }}>
            <Target size={24} />
          </div>
          <div className="stat-info">
            <h3>Total</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(67, 233, 123, 0.2)', color: 'var(--success-color)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Hoje</h3>
            <p className="stat-value">{stats.doneToday}</p>
          </div>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon" style={{ background: 'rgba(255, 107, 107, 0.2)', color: 'var(--danger-color)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Atrasadas</h3>
            <p className="stat-value">{stats.overdue}</p>
          </div>
        </motion.div>

        <motion.div className="stat-card glass-panel streak-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="stat-icon">
            <Flame size={24} fill="currentColor" />
          </div>
          <div className="stat-info">
            <h3>Streak</h3>
            <p className="stat-value">{stats.streak} dias</p>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-content">
        <div className="chart-section glass-panel">
          <h2>Produtividade (Últimos 7 dias)</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.productivity} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => format(parseISO(val), 'dd/MM', { locale: ptBR })}
                  stroke="var(--text-secondary)"
                />
                <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: '8px' }}
                  labelFormatter={(val) => format(parseISO(val), 'dd MMM yyyy', { locale: ptBR })}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.productivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--primary-color)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="upcoming-section glass-panel">
          <h2>Próximas Tarefas</h2>
          {stats.upcoming && stats.upcoming.length > 0 ? (
            <ul className="upcoming-list">
              {stats.upcoming.map(task => (
                <li key={task.id} className="upcoming-item">
                  <div className="upcoming-info">
                    <h4>{task.title}</h4>
                    {task.category_name && (
                      <span className="category-badge" style={{ backgroundColor: task.category_color + '40', color: task.category_color }}>
                        {task.category_name}
                      </span>
                    )}
                  </div>
                  <div className="upcoming-date">
                    {format(parseISO(task.due_date), 'dd/MM', { locale: ptBR })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">Nenhuma tarefa próxima.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
