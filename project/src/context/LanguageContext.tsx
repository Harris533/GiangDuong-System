import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'vi' | 'km';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.equipment': 'Equipment',
    'nav.borrowReturn': 'Borrow/Return',
    'nav.schedule': 'Schedule',
    'nav.manageUsers': 'Manage Users',
    'nav.notifications': 'Notifications',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.subtitle': "Here's what's happening in your equipment management system today.",
    'dashboard.totalEquipment': 'TOTAL EQUIPMENT',
    'dashboard.currentlyBorrowed': 'CURRENTLY BORROWED',
    'dashboard.needsMaintenance': 'NEEDS MAINTENANCE',
    'dashboard.activeUsers': 'ACTIVE USERS',
    'dashboard.weeklyStats': 'Weekly Borrow/Return Statistics',
    'dashboard.equipmentDistribution': 'Equipment Distribution',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    
    // Equipment
    'equipment.title': 'Equipment Management',
    'equipment.subtitle': 'Manage and track all educational equipment',
    'equipment.addEquipment': 'Add Equipment',
    'equipment.totalEquipment': 'Total Equipment',
    'equipment.available': 'Available',
    'equipment.borrowed': 'Borrowed',
    'equipment.maintenance': 'Maintenance',
    'equipment.searchPlaceholder': 'Search equipment...',
    'equipment.allStatus': 'All Status',
    'equipment.edit': 'Edit',
    'equipment.delete': 'Delete',
    
    // Borrow/Return
    'borrowReturn.title': 'Borrow/Return Management',
    'borrowReturn.subtitle': 'Manage all equipment borrow and return requests',
    'borrowReturn.allRequests': 'All Requests',
    'borrowReturn.pending': 'Pending',
    'borrowReturn.approved': 'Approved',
    'borrowReturn.returned': 'Returned',
    'borrowReturn.rejected': 'Rejected',
    'borrowReturn.approve': 'Approve',
    'borrowReturn.reject': 'Reject',
    'borrowReturn.borrower': 'Borrower',
    'borrowReturn.dateTime': 'Date & Time',
    'borrowReturn.purpose': 'Purpose',
    
    // Schedule
    'schedule.title': 'Schedule Management',
    'schedule.subtitle': 'Manage class schedules and room assignments',
    'schedule.createSchedule': 'Create Schedule',
    'schedule.today': 'Today',
    'schedule.upcoming': 'Upcoming',
    'schedule.allSchedules': 'All Schedules',
    'schedule.confirmed': 'confirmed',
    'schedule.pending': 'pending',
    'schedule.class': 'Class',
    'schedule.instructor': 'Instructor',
    'schedule.room': 'Room',
    'schedule.edit': 'Edit',
    'schedule.confirm': 'Confirm',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.add': 'Add',
    'common.create': 'Create',
    'common.location': 'Location',
    'common.description': 'Description',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.name': 'Name',
    'common.type': 'Type',
  },
  vi: {
    // Navigation
    'nav.dashboard': 'Bảng điều khiển',
    'nav.equipment': 'Thiết bị',
    'nav.borrowReturn': 'Mượn/Trả',
    'nav.schedule': 'Lịch học',
    'nav.manageUsers': 'Quản lý người dùng',
    'nav.notifications': 'Thông báo',
    'nav.reports': 'Báo cáo',
    'nav.settings': 'Cài đặt',
    'nav.logout': 'Đăng xuất',
    
    // Dashboard
    'dashboard.welcome': 'Chào mừng trở lại',
    'dashboard.subtitle': 'Đây là những gì đang diễn ra trong hệ thống quản lý thiết bị của bạn hôm nay.',
    'dashboard.totalEquipment': 'TỔNG THIẾT BỊ',
    'dashboard.currentlyBorrowed': 'ĐANG MƯỢN',
    'dashboard.needsMaintenance': 'CẦN BẢO TRÌ',
    'dashboard.activeUsers': 'NGƯỜI DÙNG HOẠT ĐỘNG',
    'dashboard.weeklyStats': 'Thống kê Mượn/Trả theo tuần',
    'dashboard.equipmentDistribution': 'Phân bố Thiết bị',
    'dashboard.recentActivity': 'Hoạt động gần đây',
    'dashboard.quickActions': 'Thao tác nhanh',
    
    // Equipment
    'equipment.title': 'Quản lý Thiết bị',
    'equipment.subtitle': 'Quản lý và theo dõi tất cả thiết bị giáo dục',
    'equipment.addEquipment': 'Thêm Thiết bị',
    'equipment.totalEquipment': 'Tổng Thiết bị',
    'equipment.available': 'Có sẵn',
    'equipment.borrowed': 'Đang mượn',
    'equipment.maintenance': 'Bảo trì',
    'equipment.searchPlaceholder': 'Tìm kiếm thiết bị...',
    'equipment.allStatus': 'Tất cả trạng thái',
    'equipment.edit': 'Chỉnh sửa',
    'equipment.delete': 'Xóa',
    
    // Borrow/Return
    'borrowReturn.title': 'Quản lý Mượn/Trả',
    'borrowReturn.subtitle': 'Quản lý tất cả yêu cầu mượn và trả thiết bị',
    'borrowReturn.allRequests': 'Tất cả yêu cầu',
    'borrowReturn.pending': 'Chờ duyệt',
    'borrowReturn.approved': 'Đã duyệt',
    'borrowReturn.returned': 'Đã trả',
    'borrowReturn.rejected': 'Từ chối',
    'borrowReturn.approve': 'Duyệt',
    'borrowReturn.reject': 'Từ chối',
    'borrowReturn.borrower': 'Người mượn',
    'borrowReturn.dateTime': 'Ngày & Giờ',
    'borrowReturn.purpose': 'Mục đích',
    
    // Schedule
    'schedule.title': 'Quản lý Lịch học',
    'schedule.subtitle': 'Quản lý lịch học và phân công phòng học',
    'schedule.createSchedule': 'Tạo Lịch học',
    'schedule.today': 'Hôm nay',
    'schedule.upcoming': 'Sắp tới',
    'schedule.allSchedules': 'Tất cả lịch học',
    'schedule.confirmed': 'đã xác nhận',
    'schedule.pending': 'chờ xử lý',
    'schedule.class': 'Lớp',
    'schedule.instructor': 'Giảng viên',
    'schedule.room': 'Phòng',
    'schedule.edit': 'Chỉnh sửa',
    'schedule.confirm': 'Xác nhận',
    
    // Common
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.cancel': 'Hủy',
    'common.save': 'Lưu',
    'common.add': 'Thêm',
    'common.create': 'Tạo',
    'common.location': 'Vị trí',
    'common.description': 'Mô tả',
    'common.status': 'Trạng thái',
    'common.actions': 'Thao tác',
    'common.date': 'Ngày',
    'common.time': 'Thời gian',
    'common.name': 'Tên',
    'common.type': 'Loại',
  },
  km: {
    // Navigation
    'nav.dashboard': 'ផ្ទាំងគ្រប់គ្រង',
    'nav.equipment': 'ឧបករណ៍',
    'nav.borrowReturn': 'ខ្ចី/ត្រឡប់',
    'nav.schedule': 'កាលវិភាគ',
    'nav.manageUsers': 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
    'nav.notifications': 'ការជូនដំណឹង',
    'nav.reports': 'របាយការណ៍',
    'nav.settings': 'ការកំណត់',
    'nav.logout': 'ចាកចេញ',
    
    // Dashboard
    'dashboard.welcome': 'សូមស្វាគមន៍ការត្រឡប់មកវិញ',
    'dashboard.subtitle': 'នេះជាអ្វីដែលកំពុងកើតឡើងនៅក្នុងប្រព័ន្ធគ្រប់គ្រងឧបករណ៍របស់អ្នកនៅថ្ងៃនេះ។',
    'dashboard.totalEquipment': 'ឧបករណ៍សរុប',
    'dashboard.currentlyBorrowed': 'កំពុងខ្ចី',
    'dashboard.needsMaintenance': 'ត្រូវការថែទាំ',
    'dashboard.activeUsers': 'អ្នកប្រើប្រាស់សកម្ម',
    'dashboard.weeklyStats': 'ស្ថិតិខ្ចី/ត្រឡប់ប្រចាំសប្តាហ៍',
    'dashboard.equipmentDistribution': 'ការចែកចាយឧបករណ៍',
    'dashboard.recentActivity': 'សកម្មភាពថ្មីៗ',
    'dashboard.quickActions': 'សកម្មភាពរហ័ស',
    
    // Equipment
    'equipment.title': 'គ្រប់គ្រងឧបករណ៍',
    'equipment.subtitle': 'គ្រប់គ្រង និងតាមដានឧបករណ៍អប់រំទាំងអស់',
    'equipment.addEquipment': 'បន្ថែមឧបករណ៍',
    'equipment.totalEquipment': 'ឧបករណ៍សរុប',
    'equipment.available': 'មាន',
    'equipment.borrowed': 'កំពុងខ្ចី',
    'equipment.maintenance': 'ថែទាំ',
    'equipment.searchPlaceholder': 'ស្វែងរកឧបករណ៍...',
    'equipment.allStatus': 'ស្ថានភាពទាំងអស់',
    'equipment.edit': 'កែសម្រួល',
    'equipment.delete': 'លុប',
    
    // Borrow/Return
    'borrowReturn.title': 'គ្រប់គ្រងការខ្ចី/ត្រឡប់',
    'borrowReturn.subtitle': 'គ្រប់គ្រងសំណើខ្ចី និងត្រឡប់ឧបករណ៍ទាំងអស់',
    'borrowReturn.allRequests': 'សំណើទាំងអស់',
    'borrowReturn.pending': 'កំពុងរង់ចាំ',
    'borrowReturn.approved': 'បានអនុម័ត',
    'borrowReturn.returned': 'បានត្រឡប់',
    'borrowReturn.rejected': 'បានបដិសេធ',
    'borrowReturn.approve': 'អនុម័ត',
    'borrowReturn.reject': 'បដិសេធ',
    'borrowReturn.borrower': 'អ្នកខ្ចី',
    'borrowReturn.dateTime': 'កាលបរិច្ឆេទ និងពេលវេលា',
    'borrowReturn.purpose': 'គោលបំណង',
    
    // Schedule
    'schedule.title': 'គ្រប់គ្រងកាលវិភាគ',
    'schedule.subtitle': 'គ្រប់គ្រងកាលវិភាគថ្នាក់ និងការចាត់តាំងបន្ទប់',
    'schedule.createSchedule': 'បង្កើតកាលវិភាគ',
    'schedule.today': 'ថ្ងៃនេះ',
    'schedule.upcoming': 'នាពេលខាងមុខ',
    'schedule.allSchedules': 'កាលវិភាគទាំងអស់',
    'schedule.confirmed': 'បានបញ្ជាក់',
    'schedule.pending': 'កំពុងរង់ចាំ',
    'schedule.class': 'ថ្នាក់',
    'schedule.instructor': 'គ្រូបង្រៀន',
    'schedule.room': 'បន្ទប់',
    'schedule.edit': 'កែសម្រួល',
    'schedule.confirm': 'បញ្ជាក់',
    
    // Common
    'common.search': 'ស្វែងរក',
    'common.filter': 'តម្រង',
    'common.cancel': 'បោះបង់',
    'common.save': 'រក្សាទុក',
    'common.add': 'បន្ថែម',
    'common.create': 'បង្កើត',
    'common.location': 'ទីតាំង',
    'common.description': 'ការពិពណ៌នា',
    'common.status': 'ស្ថានភាព',
    'common.actions': 'សកម្មភាព',
    'common.date': 'កាលបរិច្ឆេទ',
    'common.time': 'ពេលវេលា',
    'common.name': 'ឈ្មោះ',
    'common.type': 'ប្រភេទ',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('eduequip_language') as Language;
    if (savedLanguage && ['en', 'vi', 'km'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('eduequip_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};