import React, { useState } from 'react';
import { UserCircle, Bell, Shield, Lock } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user's profile
    alert('Profile updated successfully!');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update notification settings
    alert('Notification settings updated successfully!');
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('FarmGuard Notifications Enabled', {
          body: 'You will now receive alerts when security threats are detected',
          icon: '/alert-icon.png'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account and notification preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Avatar */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <UserCircle className="w-24 h-24 text-green-700" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-gray-600 mb-6">{user?.email}</p>
                
                <Button variant="outline" fullWidth>
                  Upload Photo
                </Button>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Account Security</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Password</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Two-Factor Auth</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Main settings area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </CardHeader>
            
            <CardBody>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                
                <div className="pt-2">
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
          
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            </CardHeader>
            
            <CardBody>
              <form onSubmit={handleSaveNotifications} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-gray-700" />
                      Enable All Notifications
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive alerts for all security events
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationsEnabled}
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">
                        Receive email alerts for security events
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                          disabled={!notificationsEnabled}
                        />
                        <div className={`w-11 h-6 ${notificationsEnabled ? 'bg-gray-200' : 'bg-gray-300'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600`}></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-500">
                        Receive browser push notifications
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={pushNotifications}
                          onChange={() => setPushNotifications(!pushNotifications)}
                          disabled={!notificationsEnabled}
                        />
                        <div className={`w-11 h-6 ${notificationsEnabled ? 'bg-gray-200' : 'bg-gray-300'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600`}></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 flex space-x-4">
                  <Button type="submit">
                    Save Preferences
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={requestNotificationPermission}
                  >
                    Enable Browser Notifications
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;