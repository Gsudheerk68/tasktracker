import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import './TaskFilters.css';

const TaskFilters = () => {
  const { filters, updateFilters, sort, updateSort } = useTask();
  const [searchInput, setSearchInput] = useState(filters.searchTerm);

  const handleStatusChange = (status) => {
    updateFilters({ status });
  };

  const handlePriorityChange = (priority) => {
    updateFilters({ priority });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    // Debounce search
    clearTimeout(handleSearchChange.timeout);
    handleSearchChange.timeout = setTimeout(() => {
      updateFilters({ searchTerm: value });
    }, 300);
  };

  const handleSortChange = (field) => {
    updateSort(field);
  };

  const clearFilters = () => {
    setSearchInput('');
    updateFilters({
      status: 'all',
      priority: 'all',
      searchTerm: ''
    });
  };

  const isFiltered = filters.status !== 'all' || filters.priority !== 'all' || filters.searchTerm !== '';

  return (
    <div className="filters-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search tasks"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="filters-group">
        <div className="filter-section">
          <label className="filter-label">Status</label>
          <div className="filter-options">
            {['all', 'pending', 'completed'].map(status => (
              <button
                key={status}
                className={`filter-btn ${filters.status === status ? 'active' : ''}`}
                onClick={() => handleStatusChange(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">Priority</label>
          <div className="filter-options">
            {['all', 'low', 'medium', 'high'].map(priority => (
              <button
                key={priority}
                className={`filter-btn ${filters.priority === priority ? 'active' : ''}`}
                onClick={() => handlePriorityChange(priority)}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">Sort By</label>
          <div className="filter-options">
            {[
              { field: 'createdAt', label: 'Created' },
              { field: 'dueDate', label: 'Due Date' },
              { field: 'priority', label: 'Priority' },
              { field: 'title', label: 'Title' }
            ].map(option => (
              <button
                key={option.field}
                className={`filter-btn sort-btn ${sort.field === option.field ? 'active' : ''}`}
                onClick={() => handleSortChange(option.field)}
                title={`Sort by ${option.label} (${sort.field === option.field ? sort.order : 'desc'})`}
              >
                {option.label}
                {sort.field === option.field && (
                  <span className="sort-arrow">{sort.order === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isFiltered && (
        <button
          className="btn btn-secondary clear-filters"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
