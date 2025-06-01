import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import CameraCard from '../components/cameras/CameraCard';
import AddRealCameraModal from '../components/cameras/AddRealCameraModal';
import Button from '../components/common/Button';
import { useCamera } from '../contexts/CameraContext';

const Cameras: React.FC = () => {
  const { cameras, loading } = useCamera();
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'online' | 'offline'>('all');
  
  // Filter cameras based on search query and status
  const filteredCameras = cameras.filter(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          camera.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || camera.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Cameras</h1>
          <p className="text-gray-600">Manage and monitor your farm's camera system</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={() => setShowAddCamera(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Camera
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cameras by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedStatus === 'all'
                ? 'bg-green-700 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedStatus('online')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedStatus === 'online'
                ? 'bg-green-700 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setSelectedStatus('offline')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedStatus === 'offline'
                ? 'bg-green-700 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Offline
          </button>
        </div>
      </div>
      
      {/* Camera Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </div>
      ) : filteredCameras.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.55-2.275A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No cameras found</h3>
          {cameras.length === 0 ? (
            <p className="mt-1 text-gray-500">Get started by adding your first camera.</p>
          ) : (
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
          )}
          <div className="mt-6">
            <Button onClick={() => setShowAddCamera(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Camera
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCameras.map(camera => (
            <CameraCard 
              key={camera.id} 
              camera={camera}
              onClick={() => {
                // In a real app, this could navigate to a detailed view of the camera
                console.log(`Viewing camera ${camera.id}`);
              }}
            />
          ))}
        </div>
      )}
      
      {/* Add Camera Modal */}
      <AddRealCameraModal
        isOpen={showAddCamera}
        onClose={() => setShowAddCamera(false)}
      />
    </div>
  );
};

export default Cameras;