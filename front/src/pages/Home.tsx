import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Video, BarChart3, BellRing, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setProcessedVideoUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a video file first');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/process-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Video processing failed');
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Received empty video file');
      }

      const videoUrl = URL.createObjectURL(blob);
      setProcessedVideoUrl(videoUrl);
      alert('Video processed successfully');
    } catch (error) {
      console.error('Error processing video:', error);
      alert(error instanceof Error ? error.message : 'Failed to process video');
      setProcessedVideoUrl(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/808510/pexels-photo-808510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Farm field" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Protect Your Farm with AI Technology
              </h1>
              <p className="mt-6 text-xl text-green-100 max-w-3xl">
                FarmGuard uses advanced AI to monitor your fields 24/7, detecting intruders, animals, and vehicles in real-time to keep your agricultural assets safe.
              </p>
              <div className="mt-10 flex space-x-4">
                <Button 
                  onClick={() => navigate('/register')} 
                  className="text-base"
                  size="lg"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login')} 
                  className="bg-transparent text-white border-white hover:bg-white hover:text-green-800 text-base"
                  size="lg"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Processing Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Video Processing</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label 
                htmlFor="video-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Select Video
              </label>
              {selectedFile && (
                <span className="text-gray-600">{selectedFile.name}</span>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isProcessing}
              className={`${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} w-full sm:w-auto`}
            >
              {isProcessing ? 'Processing...' : 'Process Video'}
            </Button>

            {processedVideoUrl && (
              <div className="mt-6">
                <p className="mb-2 font-medium">Processed Video:</p>
                <video
                  controls
                  className="w-full max-w-3xl rounded-lg shadow-lg"
                  src={processedVideoUrl}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Intelligent Farm Security
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Our AI-powered system provides comprehensive protection for your agricultural property.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-20 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                Real-time Monitoring
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Keep an eye on your entire property from anywhere, at any time. Our system provides 24/7 surveillance with intelligent alerts.
              </p>

              <dl className="mt-10 space-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-700 text-white">
                      <Video className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Multiple Camera Support</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Connect and monitor multiple cameras across your property from a single dashboard.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-700 text-white">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Analytics</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    AI-powered analysis detects and classifies potential threats, from intruders to wild animals.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-700 text-white">
                      <BellRing className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Instant Alerts</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Receive immediate notifications when suspicious activity is detected on your property.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
              <img 
                className="relative mx-auto rounded-lg shadow-lg" 
                src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Farm security monitoring" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to secure your farm?</span>
            <span className="block text-green-200">Start monitoring today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button
                onClick={() => navigate('/register')}
                className="text-green-700 bg-white hover:bg-gray-100"
              >
                Get started
                <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by Farmers
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 italic">
                  "Since installing FarmGuard, we've been able to prevent multiple trespassing incidents. The system alerted us immediately, allowing us to contact authorities."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-semibold">JD</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">John Deere</p>
                    <p className="text-sm text-gray-500">Wheat Farmer, Kansas</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 italic">
                  "The AI detection is incredibly accurate. It distinguishes between workers, wild animals, and potential intruders, so we don't get unnecessary alerts."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-semibold">SC</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Sarah Collins</p>
                    <p className="text-sm text-gray-500">Orchard Owner, Washington</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 italic">
                  "Setting up the cameras was simple, and the mobile app makes it easy to check on our property from anywhere. Worth every penny for the peace of mind."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-semibold">MP</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Michael Patel</p>
                    <p className="text-sm text-gray-500">Dairy Farmer, Wisconsin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;