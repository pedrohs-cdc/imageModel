import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/client';
import { useAppData } from '../hooks/useAppData';
import './Calendar.css';

const Calendar = () => {
  const { openTaskModal } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

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
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const onDateClick = (day) => {
    // Pode abrir modal para criar nova tarefa na data clicada
  };

  const handleTaskClick = (e, task) => {
    e.stopPropagation();
    openTaskModal(task);
  };

  const renderHeader = () => {
    return (
      <div className="calendar-header-controls">
        <div className="month-selector">
          <button className="btn-secondary" onClick={prevMonth}>
            <ChevronLeft size={20} />
          </button>
          <span style={{ minWidth: '150px', textAlign: 'center', textTransform: 'capitalize' }}>
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button className="btn-secondary" onClick={nextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];
    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="calendar-day-header" key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: ptBR })}
        </div>
      );
    }
    return <div className="calendar-grid" style={{ flex: 'none', marginBottom: '8px' }}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    const priorityColors = {
      low: 'var(--success-color)',
      medium: 'var(--primary-color)',
      high: 'var(--warning-color)',
      urgent: 'var(--danger-color)'
    };

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        // Find tasks for this day
        const dayTasks = tasks.filter(t => t.due_date && isSameDay(parseISO(t.due_date), cloneDay));

        days.push(
          <div
            className={`calendar-cell ${!isSameMonth(day, monthStart) ? "different-month" : ""} ${isSameDay(day, new Date()) ? "today" : ""}`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="cell-date">{formattedDate}</span>
            <div className="cell-tasks">
              {dayTasks.map(task => (
                <div 
                  key={task.id} 
                  className="calendar-task-badge"
                  style={{ backgroundColor: priorityColors[task.priority] }}
                  onClick={(e) => handleTaskClick(e, task)}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-grid" key={day} style={{ flex: '1 1 0' }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>{rows}</div>;
  };

  return (
    <div className="calendar-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendário</h1>
          <p className="page-subtitle">Visualize seus prazos</p>
        </div>
      </div>

      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
