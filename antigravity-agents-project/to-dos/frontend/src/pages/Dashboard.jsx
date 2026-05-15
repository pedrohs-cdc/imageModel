import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckSquare, Clock, AlertTriangle, TrendingUp, Hand } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';
import SkeletonCard from '../components/SkeletonCard';
import FAB from '../components/FAB';
import { useToast } from '../components/Toast';
import { useAppData } from '../hooks/useAppData';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { openTaskModal } = useAppData();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get('/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      addToast('Erro ao carregar os dados do painel.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('refresh-tasks', loadData);
    return () => window.removeEventListener('refresh-tasks', loadData);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };


  if (loading) {
    return (
      <div className="dashboard animate-fade-in">
        <SkeletonCard height="80px" />
        <div className="stats-grid">
          <SkeletonCard height="120px" />
          <SkeletonCard height="120px" />
          <SkeletonCard height="120px" />
          <SkeletonCard height="120px" />
        </div>
        <div className="charts-row">
          <SkeletonCard height="350px" />
          <SkeletonCard height="350px" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard animate-fade-in">
      <div className="greeting-section">
        <h1 className="greeting-title">
          {getGreeting()}, {user?.name.split(' ')[0]} <Hand size={28} className="wave-icon" color="#E5A335" />
        </h1>
        <p className="greeting-subtitle">Aqui está o resumo da sua produtividade de hoje.</p>
      </div>

      <div className="stats-grid">
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon primary"><CheckSquare size={24} /></div>
          <div className="stat-info">
            <span className="stat-title">Total de Tarefas</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </motion.div>
        
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon success"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <span className="stat-title">Concluídas Hoje</span>
            <span className="stat-value">{stats.doneToday}</span>
          </div>
        </motion.div>
        
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon warning"><Clock size={24} /></div>
          <div className="stat-info">
            <span className="stat-title">Em Andamento</span>
            <span className="stat-value">{stats.inProgress}</span>
          </div>
        </motion.div>
        
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="stat-icon danger"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <span className="stat-title">Atrasadas</span>
            <span className="stat-value">{stats.overdue}</span>
          </div>
        </motion.div>
      </div>

      <div className="charts-row">
        <motion.div className="chart-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3>Produtividade (Últimos 7 dias)</h3>
          {stats.productivity && stats.productivity.some(p => p.count > 0) ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.productivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="date" stroke="#737373" tickFormatter={(v) => v.substring(5, 10)} axisLine={false} tickLine={false} />
                  <YAxis stroke="#737373" axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid #27272A', borderRadius: '8px', color: '#EDEDED' }}
                  />
                  <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <TrendingUp size={48} />
              <p>Nenhuma tarefa concluída nos últimos 7 dias.</p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>Comece a concluir tarefas para ver o gráfico.</p>
            </div>
          )}
        </motion.div>

        <motion.div className="chart-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h3>Próximos Prazos</h3>
          {stats.upcoming && stats.upcoming.length > 0 ? (
            <div className="upcoming-list">
              {stats.upcoming.map(task => (
                <div key={task.id} className="upcoming-item" style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>{task.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{task.category_name || 'Sem categoria'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: task.priority === 'urgent' ? 'var(--danger-color)' : 'var(--warning-color)' }}>
                      {new Date(task.due_date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ minHeight: 'auto', padding: '24px' }}>
              <CheckSquare size={32} />
              <p>Nenhuma tarefa com prazo próximo.</p>
            </div>
          )}
        </motion.div>
      </div>

      <FAB onClick={() => openTaskModal()} />
    </div>
  );
};

export default Dashboard;
