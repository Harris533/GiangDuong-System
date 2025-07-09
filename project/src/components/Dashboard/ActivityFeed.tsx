import React from 'react';
import { Clock, CheckCircle, AlertTriangle, UserPlus } from 'lucide-react';

interface ActivityFeedProps {
  activities?: any[];
}

interface Activity {
  type: 'borrow' | 'return' | 'maintenance' | 'user_added';
  description: string;
  created_at: string;
  user_name: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities = [] }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'borrow_requested':
      case 'borrow_approved':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'equipment_returned':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'equipment_added':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'user_added':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityTitle = (type: string) => {
    switch (type) {
      case 'borrow_requested':
        return 'Equipment Requested';
      case 'borrow_approved':
        return 'Request Approved';
      case 'equipment_returned':
        return 'Equipment Returned';
      case 'equipment_added':
        return 'Equipment Added';
      case 'user_added':
        return 'New User Added';
      default:
        return 'Activity';
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getActivityTitle(activity.type)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatTimeAgo(activity.created_at)} • {activity.user_name}
              </p>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
          View all activities
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;