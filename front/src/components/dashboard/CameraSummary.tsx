import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Plus } from 'lucide-react';
import { useCamera } from '../../contexts/CameraContext';
import Card, { CardHeader, CardBody } from '../common/Card';
import Button from '../common/Button';

const CameraSummary: React.FC<{ onAddCamera: () => void }> = ({ onAddCamera }) => {
  const navigate = useNavigate();
  const { cameras, loading } = useCamera();
  
  // Get counts
  const totalCameras = cameras.length;
  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const offlineCameras = totalCameras - onlineCameras;

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Camera Status</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/cameras')}
          >
            View All
          </Button>
          <Button
            size="sm"
            onClick={onAddCamera}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      
      <CardBody>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : totalCameras === 0 ? (
          <div className="text-center py-8">
            <Video className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cameras connected</h3>
            <p className="text-gray-500 mb-4">Add your first camera to start monitoring your farm</p>
            <Button onClick={onAddCamera}>
              <Plus className="h-4 w-4 mr-1" />
              Add Camera
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-semibold text-gray-800">{totalCameras}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-semibold text-green-700">{onlineCameras}</p>
                <p className="text-sm text-green-600">Online</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <p className="text-3xl font-semibold text-red-700">{offlineCameras}</p>
                <p className="text-sm text-red-600">Offline</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Last Connected</h4>
              <ul className="space-y-2">
                {cameras.slice(0, 3).map(camera => (
                  <li key={camera.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{camera.name}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      camera.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {camera.status === 'online' ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CameraSummary;