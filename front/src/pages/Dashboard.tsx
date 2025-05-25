import React, { useState } from 'react';
import { Camera, Video, ShieldAlert, Bell, Users } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import CameraSummary from '../components/dashboard/CameraSummary';
import AddCameraModal from '../components/cameras/AddCameraModal';
import { useCamera } from '../contexts/CameraContext';
import { useAlert } from '../contexts/AlertContext';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { cameras } = useCamera();
  const { alerts } = useAlert();
  const [showAddCamera, setShowAddCamera] = useState(false);

  // Calculate stats
  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const recentAlerts = alerts.slice(0, 24).length; // Last 24 hours (simulated)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Here's what's happening on your farm today</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setShowAddCamera(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Camera className="h-4 w-4 mr-2" />
            Add Camera
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Cameras"
          value={onlineCameras}
          icon={Video}
          change={cameras.length > 0 ? `${Math.round((onlineCameras / cameras.length) * 100)}% online` : 'No cameras'}
          trend={cameras.length > 0 ? (onlineCameras === cameras.length ? 'up' : 'neutral') : 'neutral'}
          color="green"
        />
        
        <StatCard
          title="Recent Alerts"
          value={recentAlerts}
          icon={ShieldAlert}
          change="Last 24 hours"
          trend={recentAlerts > 3 ? 'up' : 'neutral'}
          color="red"
        />
        
        <StatCard
          title="Notification Enabled"
          value="Yes"
          icon={Bell}
          change="Push & Email"
          color="blue"
        />
        
        <StatCard
          title="Authorized Users"
          value="1"
          icon={Users}
          color="purple"
        />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentAlerts />
        <CameraSummary onAddCamera={() => setShowAddCamera(true)} />
      </div>
      
      {/* Add Camera Modal */}
      <AddCameraModal
        isOpen={showAddCamera}
        onClose={() => setShowAddCamera(false)}
      />
    </div>
  );
};

export default Dashboard;