import React, { useState, useEffect } from 'react';
import './Notifications.css';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'dispatch';
  title?: string;
  message: string;
  icon?: string;
  duration?: number;
  variant?: 'default' | 'compact';
  vehicleDescription?: string;
  pedDescription?: string;
  street?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleNotification = (event: any) => {
      if (event.data.action === 'notification') {
        const notification = {
          id: Math.random().toString(36).substr(2, 9),
          ...event.data.data
        };
        
        setNotifications(prev => [...prev, notification]);
        // Auto remove notification after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            removeNotification(notification.id);
          }, notification.duration || 3000);
        }
      }
    };

    window.addEventListener('message', handleNotification);
    return () => window.removeEventListener('message', handleNotification);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Separate notifications by variant
  const defaultNotifications = notifications.filter(n => n.variant !== 'compact');
  const compactNotifications = notifications.filter(n => n.variant === 'compact');

  return (
    <>
      <div className="notification-container top-right">
        {defaultNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.type} ${notification.variant || 'default'}`}
            style={{ '--duration': notification.duration || 3000 } as React.CSSProperties}
          >
            {notification.icon && (
              <div className="notification-icon">{notification.icon}</div>
            )}
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              {notification.type === 'dispatch' && (
                <>
                  {notification.vehicleDescription && <p>Vehicle: {notification.vehicleDescription}</p>}
                  {notification.pedDescription && <p>Pedestrian: {notification.pedDescription}</p>}
                  {notification.street && <p>Location: {notification.street}</p>}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="notification-container bottom-center">
        {compactNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.type} compact`}
            style={{ '--duration': notification.duration || 3000 } as React.CSSProperties}
          >
            {notification.icon && (
              <div className="notification-icon">{notification.icon}</div>
            )}
            <div className="notification-content">
              <p>{notification.message}</p>
              {notification.type === 'dispatch' && (
                <>
                  {notification.vehicleDescription && <p>Vehicle: {notification.vehicleDescription}</p>}
                  {notification.pedDescription && <p>Pedestrian: {notification.pedDescription}</p>}
                  {notification.street && <p>Location: {notification.street}</p>}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Notifications;