import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Wrench, Monitor, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Equipment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AddEquipmentModal from '../components/Modals/AddEquipmentModal';

const EquipmentPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Projector Sony VPL-EX455',
      type: 'Projector',
      location: 'Room A101',
      status: 'available',
      serialNumber: 'SN-2023-001',
      purchaseDate: new Date('2023-01-15'),
      description: 'High-definition projector for presentations'
    },
    {
      id: '2',
      name: 'Wireless Microphone System',
      type: 'Audio',
      location: 'Room B205',
      status: 'borrowed',
      borrowedBy: 'John Teacher',
      borrowedAt: new Date('2024-01-10'),
      returnDate: new Date('2024-01-17'),
      serialNumber: 'SN-2023-002',
      description: 'Professional wireless microphone set'
    },
    {
      id: '3',
      name: 'Dell Latitude 5520',
      type: 'Laptop',
      location: 'Room C303',
      status: 'available',
      serialNumber: 'SN-2023-003',
      description: 'Business laptop with Windows 11'
    },
    {
      id: '4',
      name: 'Canon EOS R6',
      type: 'Camera',
      location: 'Media Lab',
      status: 'maintenance',
      serialNumber: 'SN-2023-004',
      description: 'Professional DSLR camera'
    },
    {
      id: '5',
      name: 'Smart Board Interactive Display',
      type: 'Display',
      location: 'Room D401',
      status: 'available',
      serialNumber: 'SN-2023-005',
      description: '75-inch interactive display'
    },
    {
      id: '6',
      name: 'Apple MacBook Pro M2',
      type: 'Laptop',
      location: 'Design Lab',
      status: 'borrowed',
      borrowedBy: 'Sarah Wilson',
      borrowedAt: new Date('2024-01-12'),
      returnDate: new Date('2024-01-19'),
      serialNumber: 'SN-2023-006',
      description: 'MacBook Pro for design work'
    }
  ]);

  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'available':
        return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
      case 'borrowed':
        return { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-800 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' };
      case 'maintenance':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' };
      case 'broken':
        return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600' };
    }
  };

  const getStatusIcon = (status: Equipment['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'borrowed':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Monitor className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: equipment.length,
    available: equipment.filter(e => e.status === 'available').length,
    borrowed: equipment.filter(e => e.status === 'borrowed').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length
  };

  const handleAddEquipment = (newEquipment: Equipment) => {
    setEquipment([...equipment, newEquipment]);
  };

  // Check if user can add equipment (only admin and teacher)
  const canAddEquipment = user?.role === 'admin' || user?.role === 'teacher';

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('equipment.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('equipment.subtitle')}</p>
          </div>
          {canAddEquipment && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>{t('equipment.addEquipment')}</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <Monitor className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">{t('equipment.totalEquipment')}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.available}</p>
                <p className="text-sm text-green-700 dark:text-green-300">{t('equipment.available')}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.borrowed}</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">{t('equipment.borrowed')}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.maintenance}</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{t('equipment.maintenance')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('equipment.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="all">{t('equipment.allStatus')}</option>
                <option value="available">{t('equipment.available')}</option>
                <option value="borrowed">{t('equipment.borrowed')}</option>
                <option value="maintenance">{t('equipment.maintenance')}</option>
                <option value="broken">Broken</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => {
          const statusStyle = getStatusBadge(item.status);
          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.type}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.location}</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {canAddEquipment && (
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors duration-200">
                      <Wrench className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
              )}

              {item.status === 'borrowed' && item.borrowedBy && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Borrowed by: {item.borrowedBy}</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Return date: {item.returnDate?.toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Serial: {item.serialNumber}</span>
                <span>Added: {item.purchaseDate?.toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No equipment found matching your search criteria.</p>
        </div>
      )}

      {canAddEquipment && (
        <AddEquipmentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEquipment}
        />
      )}
    </div>
  );
};

export default EquipmentPage;