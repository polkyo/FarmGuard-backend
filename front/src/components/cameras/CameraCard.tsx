import React, { useEffect, useRef, useState } from 'react';
import { Camera } from '../../types';
import Card, { CardBody, CardFooter } from '../common/Card';
import { Video, AlertTriangle } from 'lucide-react';

interface CameraCardProps {
  camera: Camera;
  onClick?: () => void;
}

const CameraCard: React.FC<CameraCardProps> = ({ camera, onClick }) => {
  const { name, location, status, lastAlert } = camera;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  
  // Generate a random but consistent seed for the camera image
  const seed = name.toLowerCase().replace(/\s+/g, '-');
  
  useEffect(() => {
    if (status === 'online' && location === 'Local Device') {
      // Try to get access to the camera
      navigator.mediaDevices.getUserMedia({ video: true })
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
  }, [status, location]);

  return (
    <Card 
      hoverable
      onClick={onClick}
      className="h-full transition-all duration-200"
    >
      <div className="relative">
        {/* Camera feed */}
        <div className="bg-gray-800 h-48 flex items-center justify-center overflow-hidden">
          {status === 'online' && location === 'Local Device' && !error ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={`https://picsum.photos/seed/${seed}/400/300`} 
              alt={`${name} feed`}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Status indicator */}
          <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${
            status === 'online' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {status === 'online' ? 'LIVE' : 'OFFLINE'}
          </div>
          
          {/* Overlay when offline */}
          {status === 'offline' && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-80" />
                <p className="font-medium">Camera Offline</p>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="text-white text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-80" />
                <p className="font-medium">Camera Error</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <CardBody>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600">{location}</p>
        
        {lastAlert && (
          <div className="mt-3 flex items-center text-amber-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-sm">Recent alert detected</span>
          </div>
        )}
      </CardBody>
      
      <CardFooter className="flex justify-between items-center bg-gray-50">
        <span className="text-sm text-gray-500">
          {status === 'online' ? 'Monitoring active' : 'Check connection'}
        </span>
        
        <button 
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={(e) => {
            e.stopPropagation();
            // In a real app, this would open camera settings
          }}
        >
          Settings
        </button>
      </CardFooter>
    </Card>
  );
};

export default CameraCard;