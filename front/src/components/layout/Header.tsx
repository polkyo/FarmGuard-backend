import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Menu, X, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useAlert();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-green-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8" />
              <span className="text-xl font-bold">FarmGuard</span>
            </NavLink>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive 
                          ? 'bg-green-900 text-white' 
                          : 'text-green-100 hover:bg-green-700'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    to="/cameras" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive 
                          ? 'bg-green-900 text-white' 
                          : 'text-green-100 hover:bg-green-700'
                      }`
                    }
                  >
                    Cameras
                  </NavLink>
                  <NavLink 
                    to="/alerts" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive 
                          ? 'bg-green-900 text-white' 
                          : 'text-green-100 hover:bg-green-700'
                      }`
                    }
                  >
                    <div className="relative inline-flex items-center">
                      Alerts
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </NavLink>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive 
                          ? 'bg-green-900 text-white' 
                          : 'text-green-100 hover:bg-green-700'
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                  <button 
                    onClick={logout}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-green-100 hover:bg-green-700"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive 
                          ? 'bg-green-900 text-white' 
                          : 'text-green-100 hover:bg-green-700'
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive 
                          ? 'bg-green-900 text-white' 
                          : 'text-green-100 hover:bg-green-700'
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Notification icon and mobile menu button */}
          <div className="flex items-center md:hidden">
            {user && (
              <NavLink to="/alerts" className="mr-2 relative">
                <Bell className="h-6 w-6 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-green-800 text-white' 
                        : 'text-green-100 hover:bg-green-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/cameras" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-green-800 text-white' 
                        : 'text-green-100 hover:bg-green-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cameras
                </NavLink>
                <NavLink 
                  to="/alerts" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-green-800 text-white' 
                        : 'text-green-100 hover:bg-green-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    Alerts
                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-green-800 text-white' 
                        : 'text-green-100 hover:bg-green-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-green-100 hover:bg-green-700"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-green-800 text-white' 
                        : 'text-green-100 hover:bg-green-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-green-800 text-white' 
                        : 'text-green-100 hover:bg-green-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;