import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import { useCamera } from '../../contexts/CameraContext';

interface AddRealCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRealCameraModal: React.FC<AddRealCameraModalProps> = ({ isOpen, onClose }) => {
  const { addCamera } = useCamera();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Get available video devices
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          setAvailableDevices(videoDevices);
          if (videoDevices.length > 0) {
            setSelectedDevice(videoDevices[0].deviceId);
          }
        })
        .catch(err => {
          setError('Failed to get camera devices: ' + err.message);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDevice && videoRef.current) {
      // Stop previous stream if exists
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Start new stream
      navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDevice }
      })
        .then(newStream => {
          setStream(newStream);
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
        })
        .catch(err => {
          setError('Failed to access camera: ' + err.message);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDevice]);

  const handleAddCamera = async () => {
    if (!stream) {
      setError('Please select a camera first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const deviceInfo = availableDevices.find(d => d.deviceId === selectedDevice);
      await addCamera({
        name: deviceInfo?.label || 'Camera ' + Date.now(),
        location: 'Local Device',
        status: 'online'
      });
      onClose();
    } catch (err) {
      setError('Failed to add camera: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Add Real Camera</h3>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-6 py-4">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Camera
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {availableDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleAddCamera}
              isLoading={loading}
            >
              Add Camera
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRealCameraModal; 