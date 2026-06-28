import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import './Notification.css';

const NotificationItem = ({ notification, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`notification notification-${notification.type}`}>
      <span className="notification-icon">{getIcon(notification.type)}</span>
      <span className="notification-message">{notification.message}</span>
      <button
        className="notification-close"
        onClick={() => onRemove(notification.id)}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container" role="region" aria-live="polite" aria-label="Notifications">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default Notification;
