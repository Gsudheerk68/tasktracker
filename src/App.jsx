import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilters from './components/TaskFilters';
import Notification from './components/Notification';
import { TaskProvider } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <TaskProvider>
        <div className="app-container">
          <header className="app-header">
            <div className="header-content">
              <h1 className="app-title">Task Tracker</h1>
              <p className="app-subtitle">Organize, prioritize, and accomplish your goals</p>
            </div>
          </header>

          <main className="app-main">
            <div className="container">
              <div className="layout-grid">
                <section className="form-section">
                  <h2>Add New Task</h2>
                  <TaskForm />
                </section>

                <section className="tasks-section">
                  <TaskFilters />
                  <TaskList />
                </section>
              </div>
            </div>
          </main>

          <Notification />
        </div>
      </TaskProvider>
    </NotificationProvider>
  );
}

export default App;
