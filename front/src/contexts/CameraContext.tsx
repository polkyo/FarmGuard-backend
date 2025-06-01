import React, { createContext, useState, useContext, useEffect } from 'react';
import { Camera, CameraContextType } from '../types';
import { useAuth } from './AuthContext';

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadCameras();
    } else {
      setCameras([]);
    }
  }, [isAuthenticated]);

  const loadCameras = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Load stored cameras
    const storedCameras = localStorage.getItem('farm-protect-cameras');
    if (storedCameras) {
      setCameras(JSON.parse(storedCameras));
    } else {
      setCameras([]);
    }
    
    setLoading(false);
  };

  const addCamera = async (camera: Omit<Camera, 'id'>) => {
    const newCamera = {
      ...camera,
      id: Date.now().toString(),
    };
    
    const updatedCameras = [...cameras, newCamera];
    setCameras(updatedCameras);
    localStorage.setItem('farm-protect-cameras', JSON.stringify(updatedCameras));
  };

  const removeCamera = async (id: string) => {
    const updatedCameras = cameras.filter(camera => camera.id !== id);
    setCameras(updatedCameras);
    localStorage.setItem('farm-protect-cameras', JSON.stringify(updatedCameras));
  };

  const updateCamera = async (id: string, data: Partial<Camera>) => {
    const updatedCameras = cameras.map(camera => 
      camera.id === id ? { ...camera, ...data } : camera
    );
    setCameras(updatedCameras);
    localStorage.setItem('farm-protect-cameras', JSON.stringify(updatedCameras));
  };

  return (
    <CameraContext.Provider value={{ cameras, loading, addCamera, removeCamera, updateCamera }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};