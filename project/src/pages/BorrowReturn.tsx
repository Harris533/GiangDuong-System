import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, User, Calendar, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BorrowRequest {
  id: string;
  equipmentName: string;
  borrower: string;
  dateTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'returned' | 'rejected';
  requestDate: string;
}

const BorrowReturnPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState<BorrowRequest[]>([
    {
      id: '1',
      equipmentName: 'Projector Sony VPL-EX455',
      borrower: 'John Teacher',
      dateTime: 'Jan 15, 2024 • 09:00 - 11:00',
      purpose: 'Mathematics presentation',
      status: 'pending',
      requestDate: 'Jan 14, 2024'
    },
    {
      id: '2',
      equipmentName: 'Wireless Microphone System',
      borrower: 'John Teacher',
      dateTime: 'Jan 14, 2024 • 14:00 - 16:00',
      purpose: 'Lecture recording',
      status: 'approved',
      requestDate: 'Jan 13, 2024'
    }
  ]);

  const tabs = [
    { id: 'all', label: t('borrowReturn.allRequests'), count: requests.length },
    { id: 'pending', label: t('borrowReturn.pending'), count: requests.filter(r => r.status === 'pending').length },
    { id: 'approved', label: t('borrowReturn.approved'), count: requests.filter(r => r.status === 'approved').length },
    { id: 'returned', label: t('borrowReturn.returned'), count: requests.filter(r => r.status === 'returned').length },
    { id: 'rejected', label: t('borrowReturn.rejected'), count: requests.filter(r => r.status === 'rejected').length }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' };
      case 'approved':
        return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
      case 'returned':
        return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' };
      case 'rejected':
        return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600' };
    }
  };

  const filteredRequests = activeTab === 'all' ? requests : requests.filter(r => r.status === activeTab);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('borrowReturn.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('borrowReturn.subtitle')}</p>
          </div>
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
              {tab.label} {tab.count > 0 && <span className="ml-2 text-xs">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const statusStyle = getStatusBadge(request.status);
          return (
            <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.equipmentName}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{t('borrowReturn.borrower')}:</p>
                        <p>{request.borrower}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{t('borrowReturn.dateTime')}:</p>
                        <p>{request.dateTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{t('borrowReturn.purpose')}:</p>
                        <p>{request.purpose}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('borrowReturn.approve')}</span>
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{t('borrowReturn.reject')}</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Requested on {request.requestDate}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No requests found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default BorrowReturnPage;