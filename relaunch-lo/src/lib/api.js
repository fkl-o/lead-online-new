// API Base Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ihr-backend.onrender.com/api'  // Später durch echte URL ersetzen
  : 'http://localhost:5000/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const finalOptions = {
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
  createLead: async (leadData) => {
    return apiCall('/leads/create', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  // Get all leads (requires auth)
  getLeads: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    return apiCall(`/leads?${queryParams}`);
  },

  // Get single lead
  getLead: async (id) => {
    return apiCall(`/leads/${id}`);
  },

  // Update lead status
  updateLeadStatus: async (id, status) => {
    return apiCall(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Add communication to lead
  addCommunication: async (id, communication) => {
    return apiCall(`/leads/${id}/communication`, {
      method: 'POST',
      body: JSON.stringify(communication),
    });
  },

  // Get lead statistics
  getLeadStats: async () => {
    return apiCall('/leads/stats');
  },
};

// Auth API functions
export const authApi = {
  // Login
  login: async (credentials) => {
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
  register: async (userData) => {
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
  getMe: async () => {
    return apiCall('/auth/me');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Health check
export const healthCheck = async () => {
  return apiCall('/health');
};

export default apiCall;
