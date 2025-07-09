import React from 'react';
import { useState, useEffect } from 'react';
import { Monitor, Clock, AlertTriangle, Users } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import BarChart from '../components/Dashboard/BarChart';
import PieChart from '../components/Dashboard/PieChart';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import QuickActions from '../components/Dashboard/QuickActions';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, {user?.name}!</h1>
        <p className="text-blue-100">
          Đây là những gì đang diễn ra trong hệ thống quản lý thiết bị của bạn hôm nay.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="TỔNG THIẾT BỊ"
          value={dashboardData.stats.totalEquipment}
          change="+12% from last month"
          changeType="increase"
          icon={Monitor}
          color="bg-blue-500"
        />
        <StatCard
          title="ĐANG MƯỢN"
          value={dashboardData.stats.currentlyBorrowed}
          change="8% from last month"
          changeType="increase"
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="CẦN BẢO TRÌ"
          value={dashboardData.stats.needsMaintenance}
          change="3% from last month"
          changeType="increase"
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title="NGƯỜI DÙNG HOẠT ĐỘNG"
          value={dashboardData.stats.activeUsers}
          change="+15% from last month"
          changeType="increase"
          icon={Users}
          color="bg-green-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BarChart data={dashboardData.weeklyData} />
        <PieChart data={dashboardData.typeDistribution} />
      </div>

      {/* Activity and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={dashboardData.recentActivities} />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;