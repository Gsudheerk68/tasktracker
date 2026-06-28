import React, { useMemo } from 'react';
import { useTask } from '../context/TaskContext';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = () => {
  const { tasks, loading, error, allTasks } = useTask();

  const stats = useMemo(() => {
    return {
      total: allTasks.length,
      completed: allTasks.filter(t => t.completed).length,
      pending: allTasks.filter(t => !t.completed).length,
      overdue: allTasks.filter(t => {
        if (!t.dueDate || t.completed) return false;
        return new Date(t.dueDate) < new Date();
      }).length
    };
  }, [allTasks]);

  if (error) {
    return (
      <div className="task-list-error">
        <div className="error-icon">⚠️</div>
        <h3>Failed to load tasks</h3>
        <p>{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list-wrapper">
      <div className="task-stats">
        <div className="stat-card">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value completed">{stats.completed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value pending">{stats.pending}</span>
        </div>
        {stats.overdue > 0 && (
          <div className="stat-card overdue">
            <span className="stat-label">Overdue</span>
            <span className="stat-value">{stats.overdue}</span>
          </div>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>
            {allTasks.length === 0
              ? 'Create your first task to get started!'
              : 'No tasks match your current filters. Try adjusting them.'}
          </p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <TaskItem key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
