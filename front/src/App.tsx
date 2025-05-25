import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CameraProvider } from './contexts/CameraContext';
import { AlertProvider } from './contexts/AlertContext';

// Layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cameras from './pages/Cameras';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CameraProvider>
          <AlertProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public routes */}
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Protected routes */}
                <Route 
                  path="dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="cameras" 
                  element={
                    <ProtectedRoute>
                      <Cameras />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="alerts" 
                  element={
                    <ProtectedRoute>
                      <Alerts />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback for unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </AlertProvider>
        </CameraProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;