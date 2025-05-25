import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeAlert as AlertIcon, ArrowRight } from 'lucide-react';
import { useAlert } from '../../contexts/AlertContext';
import { Alert } from '../../types';
import Card, { CardHeader, CardBody } from '../common/Card';
import Button from '../common/Button';

const RecentAlerts: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, loading, markAsRead } = useAlert();

  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  };

  // Get icon based on alert type
  const getAlertTypeIcon = (type: Alert['type']) => {
    let color: string;
    switch (type) {
      case 'person':
        color = 'text-red-500';
        break;
      case 'vehicle':
        color = 'text-amber-500';
        break;
      case 'animal':
        color = 'text-blue-500';
        break;
      case 'motion':
        color = 'text-purple-500';
        break;
      default:
        color = 'text-gray-500';
    }
    
    return <AlertIcon className={`h-5 w-5 ${color}`} />;
  };

  // Get the most recent alerts (max 5)
  const recentAlerts = alerts.slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/alerts')}
        >
          View All
        </Button>
      </CardHeader>
      
      <CardBody className="p-0">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : recentAlerts.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            <AlertIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>No recent alerts</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentAlerts.map((alert) => (
              <li 
                key={alert.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${!alert.viewed ? 'bg-green-50' : ''}`}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    {getAlertTypeIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {alert.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {alert.cameraName} • {formatTimeAgo(alert.timestamp)}
                    </p>
                  </div>
                  
                  <div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
};

export default RecentAlerts;