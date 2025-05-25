import React from 'react';
import Card, { CardBody } from '../common/Card';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  trend,
  color = 'green'
}) => {
  const getIconColor = () => {
    switch (color) {
      case 'blue': return 'text-blue-500 bg-blue-100';
      case 'green': return 'text-green-500 bg-green-100';
      case 'red': return 'text-red-500 bg-red-100';
      case 'yellow': return 'text-yellow-500 bg-yellow-100';
      case 'purple': return 'text-purple-500 bg-purple-100';
      default: return 'text-green-500 bg-green-100';
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'neutral': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '';
  };

  return (
    <Card className="h-full">
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            
            {change && (
              <div className={`mt-1 text-sm ${getTrendColor()}`}>
                {getTrendIcon()} {change}
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-full ${getIconColor()}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatCard;