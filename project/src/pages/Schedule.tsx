import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Clock, User, Edit, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import CreateScheduleModal from '../components/Modals/CreateScheduleModal';

interface Schedule {
  id: string;
  subject: string;
  class: string;
  instructor: string;
  room: string;
  floor: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending';
}

const SchedulePage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('today');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      subject: 'Advanced Mathematics',
      class: 'Grade 12A',
      instructor: 'John Teacher',
      room: 'A101',
      floor: '1st Floor',
      date: 'Monday, January 15, 2024',
      startTime: '08:00',
      endTime: '09:30',
      status: 'confirmed'
    },
    {
      id: '2',
      subject: 'Physics Laboratory',
      class: 'Grade 11B',
      instructor: 'Sarah Wilson',
      room: 'Lab 205',
      floor: '2nd Floor',
      date: 'Monday, January 15, 2024',
      startTime: '10:00',
      endTime: '11:30',
      status: 'pending'
    }
  ]);

  const tabs = [
    { id: 'today', label: t('schedule.today') },
    { id: 'upcoming', label: t('schedule.upcoming') },
    { id: 'all', label: t('schedule.allSchedules') }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
      case 'pending':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' };
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600' };
    }
  };

  const handleCreateSchedule = (newSchedule: Schedule) => {
    setSchedules([...schedules, newSchedule]);
  };

  const handleConfirm = (id: string) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, status: 'confirmed' as const } : s));
  };

  // Check if user can create schedule (only admin and teacher)
  const canCreateSchedule = user?.role === 'admin' || user?.role === 'teacher';

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('schedule.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('schedule.subtitle')}</p>
          </div>
          {canCreateSchedule && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>{t('schedule.createSchedule')}</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((schedule) => {
          const statusStyle = getStatusBadge(schedule.status);
          return (
            <div key={schedule.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{schedule.subject}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {t(`schedule.${schedule.status}`)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{t('schedule.class')}: {schedule.class} • {t('schedule.instructor')}: {schedule.instructor}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{t('schedule.room')} {schedule.room}, {schedule.floor}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{schedule.date}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                {canCreateSchedule && (
                  <button className="flex-1 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span>{t('schedule.edit')}</span>
                  </button>
                )}
                
                {schedule.status === 'pending' && canCreateSchedule && (
                  <button
                    onClick={() => handleConfirm(schedule.id)}
                    className="flex-1 px-3 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('schedule.confirm')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No schedules found.</p>
        </div>
      )}

      {canCreateSchedule && (
        <CreateScheduleModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateSchedule}
        />
      )}
    </div>
  );
};

export default SchedulePage;