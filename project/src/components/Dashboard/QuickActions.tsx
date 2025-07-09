import React from 'react';
import { Plus, CheckSquare, Calendar, FileText } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 'add-equipment',
      title: 'Add New Equipment',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'approve-requests',
      title: 'Approve Requests',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'create-schedule',
      title: 'Create Schedule',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      color: 'text-gray-600 dark:text-gray-400'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${action.color} font-medium`}
          >
            {action.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;