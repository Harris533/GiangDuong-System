import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, Users, Monitor } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ReportsPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('equipment');

  const reportTypes = [
    { id: 'equipment', name: 'Equipment Usage', icon: Monitor },
    { id: 'users', name: 'User Activity', icon: Users },
    { id: 'trends', name: 'Usage Trends', icon: TrendingUp }
  ];

  const periods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];

  const mockData = {
    equipment: {
      totalBorrows: 156,
      totalReturns: 142,
      activeEquipment: 89,
      maintenanceItems: 7,
      topEquipment: [
        { name: 'Sony VPL-EX455 Projector', borrows: 23, returns: 21 },
        { name: 'Dell Latitude 5520', borrows: 18, returns: 16 },
        { name: 'Canon EOS R6', borrows: 15, returns: 14 },
        { name: 'Wireless Microphone', borrows: 12, returns: 11 }
      ]
    },
    users: {
      totalUsers: 48,
      activeUsers: 35,
      newUsers: 8,
      topUsers: [
        { name: 'John Teacher', borrows: 15, returns: 14 },
        { name: 'Sarah Wilson', borrows: 12, returns: 12 },
        { name: 'Mike Johnson', borrows: 10, returns: 9 },
        { name: 'Lisa Chen', borrows: 8, returns: 8 }
      ]
    }
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    alert(`Exporting ${selectedReport} report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <BarChart3 className="w-7 h-7" />
              <span>{t('nav.reports')}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and export system reports</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => exportReport('excel')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => exportReport('pdf')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>{period.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'equipment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Equipment Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{mockData.equipment.totalBorrows}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Total Borrows</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{mockData.equipment.totalReturns}</p>
                <p className="text-sm text-green-700 dark:text-green-300">Total Returns</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{mockData.equipment.activeEquipment}</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">Active Equipment</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{mockData.equipment.maintenanceItems}</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">In Maintenance</p>
              </div>
            </div>
          </div>

          {/* Top Equipment */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Used Equipment</h3>
            <div className="space-y-4">
              {mockData.equipment.topEquipment.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.borrows} borrows • {item.returns} returns
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{mockData.users.totalUsers}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Total Users</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{mockData.users.activeUsers}</p>
                <p className="text-sm text-green-700 dark:text-green-300">Active Users</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{mockData.users.newUsers}</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">New Users</p>
              </div>
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Active Users</h3>
            <div className="space-y-4">
              {mockData.users.topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.borrows} borrows • {user.returns} returns
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'trends' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Usage Trends</h3>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Trend analysis coming soon</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Advanced analytics and trend visualization will be available here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;