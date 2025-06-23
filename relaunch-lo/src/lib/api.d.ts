// TypeScript declarations for api.js

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

export interface AuthApi {
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<ApiResponse>;
  getMe: () => Promise<ApiResponse>;
}

export interface LeadApi {
  createLead: (leadData: LeadData) => Promise<ApiResponse>;
  getLeads: () => Promise<ApiResponse>;
  getLeadStats: () => Promise<ApiResponse>;
}

export declare const authApi: AuthApi;
export declare const leadApi: LeadApi;
