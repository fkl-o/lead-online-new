// API Base Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://relaunch-lo-backend.onrender.com/api'
  : 'http://localhost:5000/api';

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

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
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

  // Add communication to lead
  addCommunication: async (id: string, communication: any): Promise<ApiResponse> => {
    return apiCall(`/leads/${id}/communication`, {
      method: 'POST',
      body: JSON.stringify(communication),
    });
  },

  // Get lead statistics
  getLeadStats: async (): Promise<ApiResponse> => {
    return apiCall('/leads/stats');
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
    return apiCall('/auth/me');
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Health check
export const healthCheck = async (): Promise<ApiResponse> => {
  return apiCall('/health');
};

export default apiCall;
