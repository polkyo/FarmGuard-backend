import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useCamera } from '../../contexts/CameraContext';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCameraModal: React.FC<AddCameraModalProps> = ({ isOpen, onClose }) => {
  const { addCamera } = useCamera();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !location) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await addCamera({
        name,
        location,
        status: 'online', // New cameras default to online for demo
      });
      
      // Reset form and close modal
      setName('');
      setLocation('');
      onClose();
    } catch (err) {
      setError('Failed to add camera');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Add New Camera</h3>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <Input
                label="Camera Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., North Field Camera"
                fullWidth
              />
              
              <Input
                label="Location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., North Boundary"
                fullWidth
              />
              
              <p className="mt-2 text-sm text-gray-500">
                Note: In a real implementation, you would also need to configure the camera's IP address, credentials, and other technical details.
              </p>
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
                type="button"
                isLoading={loading}
                onClick={() => setShowCamera(true)}
              >
                Add Camera
              </Button>
            </div>
          </form>
          {showCamera && <CameraPreview onClose={() => setShowCamera(false)} />}
        </div>
      </div>
    </div>
  );
};

const CameraPreview: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [processedFrame, setProcessedFrame] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    let stopped = false;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        wsRef.current = new WebSocket('ws://localhost:8000/ws/video');
        wsRef.current.onopen = () => {
          sendFrames();
        };
        wsRef.current.onmessage = (event) => {
          // Получаем обработанный кадр (base64 jpeg)
          setProcessedFrame(event.data);
        };
      })
      .catch((err) => {
        alert('Не удалось получить доступ к камере: ' + err);
        onClose();
      });

    function sendFrames() {
      if (
        stopped ||
        !videoRef.current ||
        !canvasRef.current ||
        !wsRef.current ||
        wsRef.current.readyState !== 1
      )
        return;
      const ctx = canvasRef.current.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
      canvasRef.current.toBlob((blob) => {
        if (blob && wsRef.current && wsRef.current.readyState === 1) {
          wsRef.current.send(blob);
        }
        setTimeout(sendFrames, 100); // 10 fps
      }, 'image/jpeg', 0.7);
    }

    return () => {
      stopped = true;
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (wsRef.current) wsRef.current.close();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-4 rounded shadow-lg flex flex-col items-center">
        <video ref={videoRef} autoPlay playsInline width={320} height={240} style={{ display: 'none' }} />
        <canvas ref={canvasRef} width={320} height={240} style={{ display: 'none' }} />
        {processedFrame ? (
          <img src={processedFrame} alt="Processed" width={320} height={240} />
        ) : (
          <div className="text-gray-500">Ожидание обработки...</div>
        )}
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={onClose}>
          Закрыть камеру
        </button>
      </div>
    </div>
  );
};

export default AddCameraModal;