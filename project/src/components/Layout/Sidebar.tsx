import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Monitor, 
  RefreshCw, 
  Calendar, 
  Users, 
  Bell, 
  BarChart3, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const navigationItems = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'user'] },
    { name: t('nav.equipment'), href: '/equipment', icon: Monitor, roles: ['admin', 'teacher', 'user'] },
    { name: t('nav.borrowReturn'), href: '/borrow-return', icon: RefreshCw, roles: ['admin', 'teacher'] },
    { name: t('nav.schedule'), href: '/schedule', icon: Calendar, roles: ['admin', 'teacher', 'user'] },
    { name: t('nav.manageUsers'), href: '/users', icon: Users, roles: ['admin'] },
    { name: t('nav.notifications'), href: '/notifications', icon: Bell, roles: ['admin', 'teacher', 'user'] },
    { name: t('nav.reports'), href: '/reports', icon: BarChart3, roles: ['admin'] },
    { name: t('nav.settings'), href: '/settings', icon: Settings, roles: ['admin'] }
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || 'user')
  );

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen flex flex-col transition-colors duration-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
            <img 
              src="/Logo_MTA_new.png" 
              alt="MTA Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Quản lý</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Giảng Đường</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.avatar || user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          <span className="font-medium">{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;