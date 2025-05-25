import React, { useState } from 'react';
import { Bell, Search, CheckCircle, Calendar } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import { useAlert } from '../contexts/AlertContext';
import { Alert as AlertType } from '../types';

const Alerts: React.FC = () => {
  const { alerts, loading, markAsRead, markAllAsRead, unreadCount } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedType, setSelectedType] = useState<'all' | AlertType['type']>('all');
  
  // Filter alerts based on search, status, and type
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.cameraName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
                          (selectedStatus === 'unread' && !alert.viewed) || 
                          (selectedStatus === 'read' && alert.viewed);
    
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Alerts</h1>
          <p className="text-gray-600">View and manage all detected security incidents</p>
        </div>
        
        {unreadCount > 0 && (
          <div className="mt-4 md:mt-0">
            <Button onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by description or camera name..."
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
            onClick={() => setSelectedStatus('unread')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedStatus === 'unread'
                ? 'bg-green-700 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setSelectedStatus('read')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedStatus === 'read'
                ? 'bg-green-700 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Read
          </button>
        </div>
      </div>
      
      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1 rounded-md text-xs font-medium ${
            selectedType === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Types
        </button>
        <button
          onClick={() => setSelectedType('person')}
          className={`px-3 py-1 rounded-md text-xs font-medium ${
            selectedType === 'person'
              ? 'bg-red-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Person
        </button>
        <button
          onClick={() => setSelectedType('vehicle')}
          className={`px-3 py-1 rounded-md text-xs font-medium ${
            selectedType === 'vehicle'
              ? 'bg-amber-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Vehicle
        </button>
        <button
          onClick={() => setSelectedType('animal')}
          className={`px-3 py-1 rounded-md text-xs font-medium ${
            selectedType === 'animal'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Animal
        </button>
        <button
          onClick={() => setSelectedType('motion')}
          className={`px-3 py-1 rounded-md text-xs font-medium ${
            selectedType === 'motion'
              ? 'bg-purple-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Motion
        </button>
        <button
          onClick={() => setSelectedType('other')}
          className={`px-3 py-1 rounded-md text-xs font-medium ${
            selectedType === 'other'
              ? 'bg-gray-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Other
        </button>
      </div>
      
      {/* Alerts List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Security Incidents</h3>
            <span className="text-sm text-gray-500">
              {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'} found
            </span>
          </div>
        </CardHeader>
        
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No alerts found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${!alert.viewed ? 'bg-green-50' : ''}`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Alert image thumbnail */}
                    <div className="w-full md:w-48 h-32 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      {alert.imageUrl ? (
                        <img 
                          src={alert.imageUrl} 
                          alt="Alert capture" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <Bell className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                                alert.type === 'person'
                                  ? 'bg-red-100 text-red-800'
                                  : alert.type === 'vehicle'
                                  ? 'bg-amber-100 text-amber-800'
                                  : alert.type === 'animal'
                                  ? 'bg-blue-100 text-blue-800'
                                  : alert.type === 'motion'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                            </span>
                            <h4 className="text-lg font-semibold text-gray-900">{alert.description}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Detected on <strong>{alert.cameraName}</strong>
                          </p>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(alert.timestamp)}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              // In a real app, this would show alert details
                            }}
                          >
                            View Details
                          </Button>
                          
                          {!alert.viewed && (
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(alert.id);
                              }}
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                        
                        <div>
                          {!alert.viewed && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Alerts;