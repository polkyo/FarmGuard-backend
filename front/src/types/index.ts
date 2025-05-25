export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  lastAlert?: string;
}

export interface Alert {
  id: string;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  type: 'motion' | 'person' | 'animal' | 'vehicle' | 'other';
  description: string;
  imageUrl?: string;
  viewed: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface CameraContextType {
  cameras: Camera[];
  loading: boolean;
  addCamera: (camera: Omit<Camera, 'id'>) => Promise<void>;
  removeCamera: (id: string) => Promise<void>;
  updateCamera: (id: string, data: Partial<Camera>) => Promise<void>;
}

export interface AlertContextType {
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}