import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useForm, validators } from '../hooks/customHooks';
import './TaskForm.css';

const TaskForm = ({ onTaskCreated = null, initialTask = null, isEditing = false }) => {
  const { createTask, updateTask } = useTask();
  const [isExpanded, setIsExpanded] = useState(isEditing);

  const handleSubmit = async (values) => {
    try {
      if (isEditing && initialTask) {
        await updateTask(initialTask._id, values);
      } else {
        await createTask(values);
        resetForm();
        setIsExpanded(false);
      }
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
      // Error handled in context
    }
  };

  const form = useForm(
    initialTask || {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    },
    handleSubmit,
    {
      title: validators.title,
      description: validators.description,
      priority: validators.priority,
      dueDate: validators.dueDate
    }
  );

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit: onSubmit, resetForm } = form;

  return (
    <div className="task-form-container">
      <form onSubmit={onSubmit} className={`task-form ${isExpanded ? 'expanded' : ''}`}>
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter task title"
            className={`form-input ${errors.title && touched.title ? 'error' : ''}`}
            onFocus={() => setIsExpanded(true)}
          />
          {errors.title && touched.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        {isExpanded && (
          <>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter task description (optional)"
                className={`form-textarea ${errors.description && touched.description ? 'error' : ''}`}
                rows="3"
              />
              {errors.description && touched.description && (
                <span className="error-message">{errors.description}</span>
              )}
              <span className="char-count">{values.description.length}/500</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={values.priority}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-select ${errors.priority && touched.priority ? 'error' : ''}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && touched.priority && (
                  <span className="error-message">{errors.priority}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={values.dueDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.dueDate && touched.dueDate ? 'error' : ''}`}
                />
                {errors.dueDate && touched.dueDate && (
                  <span className="error-message">{errors.dueDate}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
              </button>
              {!isEditing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    resetForm();
                    setIsExpanded(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}

        {!isExpanded && (
          <button
            type="button"
            className="btn btn-expand"
            onClick={() => setIsExpanded(true)}
          >
            + Add new task
          </button>
        )}
      </form>
    </div>
  );
};

export default TaskForm;
