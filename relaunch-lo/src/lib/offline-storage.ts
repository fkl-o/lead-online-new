/**
 * Offline Data Storage with IndexedDB
 * Provides offline-first data persistence for leads and user data
 */

interface StoredData {
  id: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

interface OfflineQueue {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  timestamp: number;
}

class OfflineStorage {
  private dbName = 'LeadOnlineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store for cached API responses
        if (!db.objectStoreNames.contains('apiCache')) {
          const apiStore = db.createObjectStore('apiCache', { keyPath: 'id' });
          apiStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for offline queue (pending sync)
        if (!db.objectStoreNames.contains('offlineQueue')) {
          const queueStore = db.createObjectStore('offlineQueue', { keyPath: 'id' });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for user preferences and settings
        if (!db.objectStoreNames.contains('userSettings')) {
          db.createObjectStore('userSettings', { keyPath: 'key' });
        }

        // Store for leads data
        if (!db.objectStoreNames.contains('leads')) {
          const leadsStore = db.createObjectStore('leads', { keyPath: 'id' });
          leadsStore.createIndex('timestamp', 'timestamp', { unique: false });
          leadsStore.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  }

  async storeApiResponse(key: string, data: any, ttl: number = 3600000): Promise<void> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['apiCache'], 'readwrite');
    const store = transaction.objectStore('apiCache');

    const storedData: StoredData = {
      id: key,
      data,
      timestamp: Date.now(),
      synced: true
    };

    await this.promisifyRequest(store.put(storedData));
    
    // Clean up expired entries
    this.cleanupExpiredEntries('apiCache', ttl);
  }

  async getApiResponse(key: string, maxAge: number = 3600000): Promise<any | null> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['apiCache'], 'readonly');
    const store = transaction.objectStore('apiCache');
    
    const result = await this.promisifyRequest(store.get(key));
    
    if (!result) return null;
    
    const age = Date.now() - result.timestamp;
    if (age > maxAge) {
      // Remove expired entry
      this.deleteApiResponse(key);
      return null;
    }
    
    return result.data;
  }

  async deleteApiResponse(key: string): Promise<void> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['apiCache'], 'readwrite');
    const store = transaction.objectStore('apiCache');
    
    await this.promisifyRequest(store.delete(key));
  }

  async addToOfflineQueue(method: string, url: string, data?: any): Promise<void> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['offlineQueue'], 'readwrite');
    const store = transaction.objectStore('offlineQueue');

    const queueItem: OfflineQueue = {
      id: `${method}-${url}-${Date.now()}`,
      method: method as any,
      url,
      data,
      timestamp: Date.now()
    };

    await this.promisifyRequest(store.add(queueItem));
  }

  async getOfflineQueue(): Promise<OfflineQueue[]> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['offlineQueue'], 'readonly');
    const store = transaction.objectStore('offlineQueue');
    
    const result = await this.promisifyRequest(store.getAll());
    return result || [];
  }

  async removeFromOfflineQueue(id: string): Promise<void> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['offlineQueue'], 'readwrite');
    const store = transaction.objectStore('offlineQueue');
    
    await this.promisifyRequest(store.delete(id));
  }

  async storeLead(lead: any): Promise<void> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['leads'], 'readwrite');
    const store = transaction.objectStore('leads');

    const storedLead: StoredData = {
      id: lead.id || `temp-${Date.now()}`,
      data: lead,
      timestamp: Date.now(),
      synced: !!lead.id // If has ID, it's synced
    };

    await this.promisifyRequest(store.put(storedLead));
  }

  async getLeads(): Promise<any[]> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['leads'], 'readonly');
    const store = transaction.objectStore('leads');
    
    const result = await this.promisifyRequest(store.getAll());
    return (result || []).map((item: StoredData) => item.data);
  }

  async getUnsyncedLeads(): Promise<any[]> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['leads'], 'readonly');
    const store = transaction.objectStore('leads');
    const index = store.index('synced');
    
    const result = await this.promisifyRequest(index.getAll(0)); // Use 0 instead of false
    return (result || []).map((item: StoredData) => item.data);
  }

  async storeSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['userSettings'], 'readwrite');
    const store = transaction.objectStore('userSettings');

    await this.promisifyRequest(store.put({ key, value }));
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.initialize();

    const transaction = this.db!.transaction(['userSettings'], 'readonly');
    const store = transaction.objectStore('userSettings');
    
    const result = await this.promisifyRequest(store.get(key));
    return result?.value;
  }

  async syncOfflineData(): Promise<void> {
    const queue = await this.getOfflineQueue();
    
    for (const item of queue) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: item.data ? JSON.stringify(item.data) : undefined,
        });

        if (response.ok) {
          await this.removeFromOfflineQueue(item.id);
          console.log(`✅ Synced offline action: ${item.method} ${item.url}`);
        }
      } catch (error) {
        console.error(`❌ Failed to sync: ${item.method} ${item.url}`, error);
      }
    }

    // Sync unsynced leads
    const unsyncedLeads = await this.getUnsyncedLeads();
    for (const lead of unsyncedLeads) {
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lead),
        });

        if (response.ok) {
          const syncedLead = await response.json();
          await this.storeLead(syncedLead); // Update with server ID
          console.log(`✅ Synced offline lead:`, lead);
        }
      } catch (error) {
        console.error(`❌ Failed to sync lead:`, lead, error);
      }
    }
  }

  private async cleanupExpiredEntries(storeName: string, maxAge: number): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore('storeName');
    const index = store.index('timestamp');
    
    const cutoff = Date.now() - maxAge;
    const range = IDBKeyRange.upperBound(cutoff);
    
    const request = index.openCursor(range);
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }

  private promisifyRequest(request: IDBRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Create singleton instance
export const offlineStorage = new OfflineStorage();

// Initialize on module load
if (typeof window !== 'undefined') {
  offlineStorage.initialize().catch(console.error);
  
  // Sync when coming back online
  window.addEventListener('online', () => {
    console.log('🌐 Back online - syncing offline data');
    offlineStorage.syncOfflineData().catch(console.error);
  });
}

export default offlineStorage;
