import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as taskAPI from '../services/taskAPI';
import { useNotification } from './NotificationContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    searchTerm: ''
  });
  const [sort, setSort] = useState({
    field: 'createdAt',
    order: 'desc'
  });

  const { showNotification } = useNotification();

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskAPI.getTasks();
      setTasks(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Create new task
  const createTask = useCallback(async (taskData) => {
    setLoading(true);
    try {
      const newTask = await taskAPI.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      showNotification('Task created successfully', 'success');
      return newTask;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create task';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Update task
  const updateTask = useCallback(async (taskId, updates) => {
    setLoading(true);
    try {
      const updatedTask = await taskAPI.updateTask(taskId, updates);
      setTasks(prev =>
        prev.map(task => task._id === taskId ? updatedTask : task)
      );
      showNotification('Task updated successfully', 'success');
      return updatedTask;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update task';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Delete task
  const deleteTask = useCallback(async (taskId) => {
    setLoading(true);
    try {
      await taskAPI.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      showNotification('Task deleted successfully', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback(async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const updatedTask = await updateTask(taskId, { completed: !task.completed });
      return updatedTask;
    } catch (err) {
      // Error handled in updateTask
      throw err;
    }
  }, [tasks, updateTask]);

  // Apply filters and sort
  const getFilteredAndSortedTasks = useCallback(() => {
    let filtered = tasks.filter(task => {
      const statusMatch = filters.status === 'all' || 
        (filters.status === 'completed' && task.completed) ||
        (filters.status === 'pending' && !task.completed);

      const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;

      const searchMatch = filters.searchTerm === '' ||
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return statusMatch && priorityMatch && searchMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sort.field];
      let bValue = b[sort.field];

      if (sort.field === 'createdAt' || sort.field === 'dueDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sort.order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, filters, sort]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const updateSort = useCallback((field) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const value = {
    tasks: getFilteredAndSortedTasks(),
    allTasks: tasks,
    loading,
    error,
    filters,
    sort,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    updateFilters,
    updateSort,
    fetchTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};
