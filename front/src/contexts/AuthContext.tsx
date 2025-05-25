import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types';

// Sample user data for demo
const DEMO_USERS = [
  {
    id: '1',
    email: 'demo@farmprotect.com',
    password: 'password123',
    name: 'Demo User'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('farm-protect-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('farm-protect-user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid email or password');
    }
    
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    if (DEMO_USERS.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    // In a real app, we would call an API to register the user
    // For demo purposes, we'll create a new user object
    const newUser = {
      id: `${DEMO_USERS.length + 1}`,
      email,
      name
    };
    
    setUser(newUser);
    localStorage.setItem('farm-protect-user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farm-protect-user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};