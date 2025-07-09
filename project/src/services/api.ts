const API_BASE_URL = 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('eduequip_token');
};

// Create headers with auth token
const createHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: createHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    const response = await apiRequest<{
      success: boolean;
      token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('eduequip_token', response.token);
      localStorage.setItem('eduequip_user', JSON.stringify(response.user));
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('eduequip_token');
      localStorage.removeItem('eduequip_user');
    }
  },

  getCurrentUser: async () => {
    return await apiRequest<{ user: any }>('/auth/me');
  },
};

// Equipment API
export const equipmentAPI = {
  getAll: async (params?: { status?: string; type?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return await apiRequest<{ equipment: any[] }>(`/equipment${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return await apiRequest<{ equipment: any }>(`/equipment/${id}`);
  },

  create: async (equipment: any) => {
    return await apiRequest<{ equipment: any }>('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipment),
    });
  },

  update: async (id: string, equipment: any) => {
    return await apiRequest<{ equipment: any }>(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipment),
    });
  },

  delete: async (id: string) => {
    return await apiRequest<{ success: boolean; message: string }>(`/equipment/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return await apiRequest<{ stats: any }>('/equipment/stats/overview');
  },
};

// Users API
export const usersAPI = {
  getAll: async (params?: { role?: string; status?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return await apiRequest<{ users: any[] }>(`/users${query ? `?${query}` : ''}`);
  },

  create: async (user: any) => {
    return await apiRequest<{ user: any }>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  updateStatus: async (id: string, status: string) => {
    return await apiRequest<{ user: any }>(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: string) => {
    return await apiRequest<{ success: boolean; message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Borrow API
export const borrowAPI = {
  getAll: async (params?: { status?: string; user_id?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.user_id) queryParams.append('user_id', params.user_id);
    
    const query = queryParams.toString();
    return await apiRequest<{ requests: any[] }>(`/borrow${query ? `?${query}` : ''}`);
  },

  create: async (request: any) => {
    return await apiRequest<{ request: any }>('/borrow', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  updateStatus: async (id: string, status: string, notes?: string) => {
    return await apiRequest<{ success: boolean; message: string }>(`/borrow/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  returnEquipment: async (id: string, notes?: string) => {
    return await apiRequest<{ success: boolean; message: string }>(`/borrow/${id}/return`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    });
  },
};

// Schedules API
export const schedulesAPI = {
  getAll: async (params?: { date?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append('date', params.date);
    if (params?.status) queryParams.append('status', params.status);
    
    const query = queryParams.toString();
    return await apiRequest<{ schedules: any[] }>(`/schedules${query ? `?${query}` : ''}`);
  },

  create: async (schedule: any) => {
    return await apiRequest<{ schedule: any }>('/schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  },

  updateStatus: async (id: string, status: string) => {
    return await apiRequest<{ schedule: any }>(`/schedules/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: string) => {
    return await apiRequest<{ success: boolean; message: string }>(`/schedules/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return await apiRequest<{
      stats: any;
      weeklyData: any[];
      typeDistribution: any[];
      recentActivities: any[];
    }>('/dashboard/stats');
  },
};