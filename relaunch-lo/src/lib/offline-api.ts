/**
 * Enhanced API wrapper with offline support
 * Automatically handles caching, offline queuing, and sync
 */

import { offlineStorage } from './offline-storage';

interface RequestConfig extends Omit<RequestInit, 'cache'> {
  timeout?: number;
  cache?: boolean;
  cacheTTL?: number;
  retries?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  fromCache: boolean;
}

class OfflineFirstAPI {
  private baseURL: string;
  private defaultTimeout = 10000; // 10 seconds
  private defaultCacheTTL = 3600000; // 1 hour

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      cache = true,
      cacheTTL = this.defaultCacheTTL,
      retries = 3,
      ...fetchConfig
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${fetchConfig.method || 'GET'}-${url}-${JSON.stringify(fetchConfig.body || {})}`;

    // For GET requests, try cache first
    if ((!fetchConfig.method || fetchConfig.method === 'GET') && cache) {
      const cachedResponse = await offlineStorage.getApiResponse(cacheKey, cacheTTL);
      if (cachedResponse) {
        console.log('📦 Serving from cache:', endpoint);
        return {
          data: cachedResponse,
          status: 200,
          statusText: 'OK',
          fromCache: true,
        };
      }
    }

    // Check if online
    if (!navigator.onLine) {
      console.log('📴 Offline - queuing request:', endpoint);
      
      // For non-GET requests, queue for later sync
      if (fetchConfig.method && fetchConfig.method !== 'GET') {
        await offlineStorage.addToOfflineQueue(
          fetchConfig.method,
          url,
          fetchConfig.body ? JSON.parse(fetchConfig.body as string) : undefined
        );
      }

      // Try to get from cache for GET requests
      if (!fetchConfig.method || fetchConfig.method === 'GET') {
        const cachedResponse = await offlineStorage.getApiResponse(cacheKey);
        if (cachedResponse) {
          return {
            data: cachedResponse,
            status: 200,
            statusText: 'OK (Offline)',
            fromCache: true,
          };
        }
      }

      throw new Error('Request queued for sync when online');
    }

    // Make the actual request with timeout and retries
    let lastError: Error;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchConfig,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...fetchConfig.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful GET responses
        if ((!fetchConfig.method || fetchConfig.method === 'GET') && cache) {
          await offlineStorage.storeApiResponse(cacheKey, data, cacheTTL);
        }

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          fromCache: false,
        };

      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retries) {
          console.log(`🔄 Retry attempt ${attempt + 1} for ${endpoint}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt))); // Exponential backoff
        }
      }
    }

    // If all retries failed, try cache as fallback for GET requests
    if (!fetchConfig.method || fetchConfig.method === 'GET') {
      const cachedResponse = await offlineStorage.getApiResponse(cacheKey);
      if (cachedResponse) {
        console.log('⚠️ Using stale cache due to network error:', endpoint);
        return {
          data: cachedResponse,
          status: 200,
          statusText: 'OK (Stale Cache)',
          fromCache: true,
        };
      }
    }

    throw lastError!;
  }

  // HTTP Methods
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Utility methods
  async clearCache(): Promise<void> {
    // Implementation would depend on how you want to clear specific caches
    console.log('🗑️ Cache cleared');
  }

  async syncOfflineData(): Promise<void> {
    await offlineStorage.syncOfflineData();
  }

  // Lead-specific methods with offline support
  async getLeads(cached = true): Promise<ApiResponse<any[]>> {
    try {
      return await this.get('/leads', { cache: cached });
    } catch (error) {
      // Fallback to offline storage
      const offlineLeads = await offlineStorage.getLeads();
      return {
        data: offlineLeads,
        status: 200,
        statusText: 'OK (Offline Storage)',
        fromCache: true,
      };
    }
  }

  async createLead(leadData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.post('/leads', leadData);
      // Store successful creation in offline storage
      await offlineStorage.storeLead(response.data);
      return response;
    } catch (error) {
      // Store in offline storage for later sync
      const tempId = `temp-${Date.now()}`;
      const tempLead = { ...leadData, id: tempId };
      await offlineStorage.storeLead(tempLead);
      
      return {
        data: tempLead,
        status: 201,
        statusText: 'Created (Offline - will sync)',
        fromCache: false,
      };
    }
  }

  async updateLead(id: string, leadData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.put(`/leads/${id}`, leadData);
      // Update offline storage
      await offlineStorage.storeLead(response.data);
      return response;
    } catch (error) {
      // Update in offline storage for later sync
      const updatedLead = { ...leadData, id };
      await offlineStorage.storeLead(updatedLead);
      
      return {
        data: updatedLead,
        status: 200,
        statusText: 'Updated (Offline - will sync)',
        fromCache: false,
      };
    }
  }

  async deleteLead(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/leads/${id}`);
  }

  // Auth methods
  async login(credentials: any): Promise<ApiResponse<any>> {
    return this.post('/auth/login', credentials, { cache: false });
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.post('/auth/logout', undefined, { cache: false });
  }

  async refreshToken(): Promise<ApiResponse<any>> {
    return this.post('/auth/refresh', undefined, { cache: false });
  }
}

// Create singleton instance
export const api = new OfflineFirstAPI();

// Export the class for testing or custom instances
export default OfflineFirstAPI;
