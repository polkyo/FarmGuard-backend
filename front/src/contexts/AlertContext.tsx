import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert, AlertContextType } from '../types';
import { useAuth } from './AuthContext';
import { useCamera } from './CameraContext';

// Demo alerts data
const DEMO_ALERTS: Alert[] = [
  {
    id: '1',
    cameraId: '1',
    cameraName: 'North Field Camera',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    type: 'person',
    description: 'Unidentified person detected at north perimeter',
    imageUrl: 'https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    viewed: false
  },
  {
    id: '2',
    cameraId: '2',
    cameraName: 'Barn Area',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    type: 'animal',
    description: 'Large animal detected near barn storage area',
    imageUrl: 'https://images.pexels.com/photos/1252825/pexels-photo-1252825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    viewed: true
  },
  {
    id: '3',
    cameraId: '1',
    cameraName: 'North Field Camera',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
    type: 'vehicle',
    description: 'Unauthorized vehicle approaching north field',
    imageUrl: 'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    viewed: true
  }
];

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { cameras } = useCamera();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadAlerts();
    } else {
      setAlerts([]);
    }
  }, [isAuthenticated]);

  // Simulate real-time alerts from cameras
  useEffect(() => {
    if (!isAuthenticated || cameras.length === 0) return;

    // Only run this effect if we have online cameras
    const onlineCameras = cameras.filter(c => c.status === 'online');
    if (onlineCameras.length === 0) return;

    const alertInterval = setInterval(() => {
      // 10% chance of generating a new alert
      if (Math.random() < 0.1) {
        // Select a random online camera
        const randomCamera = onlineCameras[Math.floor(Math.random() * onlineCameras.length)];
        
        // Create a new alert
        const alertTypes: Alert['type'][] = ['motion', 'person', 'animal', 'vehicle', 'other'];
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        let description = '';
        let imageUrl = '';
        
        switch (randomType) {
          case 'person':
            description = `Person detected at ${randomCamera.location}`;
            imageUrl = 'https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
            break;
          case 'animal':
            description = `Animal detected near ${randomCamera.location}`;
            imageUrl = 'https://images.pexels.com/photos/1252825/pexels-photo-1252825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
            break;
          case 'vehicle':
            description = `Vehicle approaching ${randomCamera.location}`;
            imageUrl = 'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
            break;
          case 'motion':
            description = `Motion detected at ${randomCamera.location}`;
            imageUrl = 'https://images.pexels.com/photos/533850/pexels-photo-533850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
            break;
          default:
            description = `Unknown activity at ${randomCamera.location}`;
            imageUrl = 'https://images.pexels.com/photos/681335/pexels-photo-681335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
        }
        
        const newAlert: Alert = {
          id: Date.now().toString(),
          cameraId: randomCamera.id,
          cameraName: randomCamera.name,
          timestamp: new Date().toISOString(),
          type: randomType,
          description,
          imageUrl,
          viewed: false
        };
        
        addAlert(newAlert);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(alertInterval);
  }, [isAuthenticated, cameras]);

  const loadAlerts = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Load stored alerts or use demo data
    const storedAlerts = localStorage.getItem('farm-protect-alerts');
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    } else {
      setAlerts(DEMO_ALERTS);
      localStorage.setItem('farm-protect-alerts', JSON.stringify(DEMO_ALERTS));
    }
    
    setLoading(false);
  };

  const addAlert = (alert: Alert) => {
    const updatedAlerts = [alert, ...alerts].slice(0, 100); // Keep last 100 alerts
    setAlerts(updatedAlerts);
    localStorage.setItem('farm-protect-alerts', JSON.stringify(updatedAlerts));
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Farm Protection Alert', {
        body: `${alert.cameraName}: ${alert.description}`,
        icon: '/alert-icon.png'
      });
    }
  };

  const markAsRead = (id: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, viewed: true } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('farm-protect-alerts', JSON.stringify(updatedAlerts));
  };

  const markAllAsRead = () => {
    const updatedAlerts = alerts.map(alert => ({ ...alert, viewed: true }));
    setAlerts(updatedAlerts);
    localStorage.setItem('farm-protect-alerts', JSON.stringify(updatedAlerts));
  };

  const unreadCount = alerts.filter(alert => !alert.viewed).length;

  return (
    <AlertContext.Provider value={{ alerts, unreadCount, loading, markAsRead, markAllAsRead }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};