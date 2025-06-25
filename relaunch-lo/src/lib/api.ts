// API Base Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://relaunch-lo-backend.onrender.com/api'
  : 'http://localhost:5000/api';

// Cache for user data to avoid repeated API calls
const userCache = {
  data: null as any,
  timestamp: 0,
  TTL: 5 * 60 * 1000 // 5 minutes
};

// Request queue to prevent duplicate requests
const requestQueue = new Map();

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  data?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface LeadData {
  name: string;
  email: string;
  salutation: 'herr' | 'frau';
  source: 'automation' | 'digitalization' | 'website' | 'contact' | 'manual';
  leadType?: 'hot' | 'warm' | 'cold';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  serviceDetails?: {
    automation?: {
      monthlyBudget?: number;
      conversionRate?: number;
      marginPerSale?: number;
      estimatedRoi?: number;
      estimatedProfit?: number;
    };
    digitalization?: {
      currentUrl?: string;
      areas?: string[];
      urgency?: string;
      timeline?: string;
    };
    website?: {
      currentUrl?: string;
      goals?: string[];
      style?: string;
      timeline?: string;
      budget?: string;
    };
  };
  estimatedValue?: number;
  privacyConsent: boolean;
  marketingConsent?: boolean;
}

// Generic API call function
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    (defaultOptions.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const finalOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Check request queue
  const requestKey = `${finalOptions.method}-${url}`;
  if (requestQueue.has(requestKey)) {
    return requestQueue.get(requestKey);
  }

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    // Cache user data
    if (endpoint === '/auth/me' && data.success) {
      userCache.data = data.data;
      userCache.timestamp = Date.now();
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  } finally {
    requestQueue.delete(requestKey);
  }
};

// Lead API functions
export const leadApi = {
  // Create lead from form submission
  createLead: async (leadData: LeadData): Promise<ApiResponse> => {
    return apiCall('/leads/create', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  // Get all leads (requires auth)
  getLeads: async (filters: Record<string, string> = {}): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams(filters);
    return apiCall(`/leads?${queryParams}`);
  },

  // Get single lead
  getLead: async (id: string): Promise<ApiResponse> => {
    return apiCall(`/leads/${id}`);
  },

  // Update lead status
  updateLeadStatus: async (id: string, status: string): Promise<ApiResponse> => {
    return apiCall(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  // Update lead data
  updateLead: async (id: string, leadData: Partial<any>): Promise<ApiResponse> => {
    return apiCall(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },

  // Add communication to lead
  addCommunication: async (id: string, communication: any): Promise<ApiResponse> => {
    return apiCall(`/leads/${id}/communication`, {
      method: 'POST',
      body: JSON.stringify(communication),
    });
  },
  // Add comment to lead
  addComment: async (id: string, comment: { text: string }): Promise<ApiResponse> => {
    return apiCall(`/leads/${id}/communication`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'follow-up',
        subject: 'Kommentar',
        content: comment.text,
        date: new Date().toISOString()
      }),
    });
  },  // Upload file to lead
  uploadFile: async (id: string, file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/leads/${id}/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        // Content-Type wird automatisch von FormData gesetzt
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const result = await response.json();
    return result;
  },

  // Get lead statistics
  getLeadStats: async (): Promise<ApiResponse> => {
    return apiCall('/leads/stats');
  },

  // Get recent activities
  getRecentActivities: async (limit: number = 10): Promise<ApiResponse> => {
    return apiCall(`/leads/activities?limit=${limit}`);
  },
};

// Auth API functions
export const authApi = {
  // Login
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  },

  // Register
  register: async (userData: any): Promise<LoginResponse> => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  },
  // Get current user
  getMe: async (): Promise<ApiResponse> => {
    // Check cache first
    const now = Date.now();
    if (userCache.data && (now - userCache.timestamp) < userCache.TTL) {
      return {
        success: true,
        data: userCache.data
      };
    }

    // If cache is stale or empty, make API call
    const response = await apiCall('/auth/me');
    
    // Update cache on successful response
    if (response.success) {
      userCache.data = response.data;
      userCache.timestamp = now;
    }
    
    return response;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    userCache.data = null;
    userCache.timestamp = 0;
  },
};

// User API functions
export const userApi = {
  // Get all users with filters and pagination
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
  }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall(endpoint);
  },

  // Get single user by ID
  getUser: async (id: string): Promise<ApiResponse> => {
    return apiCall(`/users/${id}`);
  },  // Create new user
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    salutation?: 'herr' | 'frau' | null;
    role: 'admin' | 'vertrieb' | 'kunde' | 'lead';
    profile?: {
      company?: string;
      companyUrl?: string;
      phone?: string;
      department?: string;
      position?: string;
    };
  }): Promise<ApiResponse> => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  // Update user
  updateUser: async (id: string, userData: Partial<{
    name: string;
    email: string;
    salutation: 'herr' | 'frau' | null;
    role: 'admin' | 'vertrieb' | 'kunde' | 'lead';
    isActive: boolean;
    profile: {
      company?: string;
      companyUrl?: string;
      phone?: string;
      department?: string;
      position?: string;
    };
  }>): Promise<ApiResponse> => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  // Delete user (soft delete - deactivate)
  deleteUser: async (id: string): Promise<ApiResponse> => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Permanently delete user (hard delete)
  permanentDeleteUser: async (id: string): Promise<ApiResponse> => {
    return apiCall(`/users/${id}/permanent`, {
      method: 'DELETE',
    });
  },

  // Get user statistics
  getUserStats: async (): Promise<ApiResponse> => {
    return apiCall('/users/stats');
  },

  // Reset user password
  resetPassword: async (id: string, newPassword: string): Promise<ApiResponse> => {
    return apiCall(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password: newPassword }),
    });
  },

  // Toggle user active status
  toggleUserStatus: async (id: string, isActive: boolean): Promise<ApiResponse> => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  },

  // Change password (for current user)
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    return apiCall('/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
};

// Health check
export const healthCheck = async (): Promise<ApiResponse> => {
  return apiCall('/health');
};

export default apiCall;
