import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import TaskForm from './TaskForm';
import './TaskItem.css';

const TaskItem = ({ task }) => {
  const { updateTask, deleteTask, toggleTaskCompletion } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    try {
      await updateTask(task._id, { completed: !task.completed });
    } catch (error) {
      // Error handled in context
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      await deleteTask(task._id);
      setIsDeleting(false);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const handleEditClose = () => {
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
  const isDueSoon = daysUntilDue !== null && daysUntilDue <= 3 && daysUntilDue >= 0;

  if (isEditing) {
    return (
      <div className="task-item-edit">
        <TaskForm
          initialTask={task}
          isEditing={true}
          onTaskCreated={handleEditClose}
        />
        <button
          type="button"
          className="btn-cancel-edit"
          onClick={handleEditClose}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="checkbox-input"
          aria-label="Toggle task completion"
        />
      </div>

      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span
            className="task-priority"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
            title={`Priority: ${task.priority}`}
          >
            {task.priority.charAt(0).toUpperCase()}
          </span>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          {task.dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
              📅 {new Date(task.dueDate).toLocaleDateString()}
              {daysUntilDue !== null && (
                <span className="days-until">
                  {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                </span>
              )}
            </span>
          )}
          <span className="created-date">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="btn-icon edit"
          onClick={() => setIsEditing(true)}
          title="Edit task"
          aria-label="Edit task"
        >
          ✏️
        </button>
        <button
          className={`btn-icon delete ${isDeleting ? 'confirming' : ''}`}
          onClick={handleDelete}
          title={isDeleting ? 'Click again to confirm deletion' : 'Delete task'}
          aria-label="Delete task"
        >
          {isDeleting ? '⚠️' : '🗑️'}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
