export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'user';
  avatar?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'broken';
  borrowedBy?: string;
  borrowedAt?: Date;
  returnDate?: Date;
  adminPassword?: string;
  description?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  warranty?: Date;
}

export interface BorrowRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  requestDate: Date;
  borrowDate: Date;
  returnDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  reason?: string;
  notes?: string;
}

export interface Schedule {
  id: string;
  title: string;
  room: string;
  subject: string;
  teacher: string;
  startTime: Date;
  endTime: Date;
  equipmentNeeded?: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Notification {
  id: string;
  type: 'borrow' | 'return' | 'maintenance' | 'approval' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  actionUrl?: string;
}

export interface DashboardStats {
  totalEquipment: number;
  borrowedEquipment: number;
  maintenanceNeeded: number;
  activeUsers: number;
  monthlyGrowth: {
    equipment: number;
    borrowed: number;
    maintenance: number;
    users: number;
  };
}

export interface ActivityLog {
  id: string;
  type: 'borrow' | 'return' | 'maintenance' | 'user_added' | 'equipment_added';
  description: string;
  timestamp: Date;
  user: string;
  icon: string;
  color: string;
}