import { leadApi, authApi, type LeadData } from '../api';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to avoid noise in tests
console.error = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => 'mock-token'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('creates a lead successfully', async () => {
    const mockLead: LeadData = {
      name: 'Test Lead',
      email: 'test@example.com',
      salutation: 'herr',
      source: 'website',
      privacyConsent: true
    };

    const mockResponse = {
      success: true,
      data: { id: '1', ...mockLead }
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await leadApi.createLead(mockLead);

    expect(mockFetch).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it('handles login successfully', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockResponse = {
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      },
      token: 'mock-jwt-token'
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await authApi.login(credentials);

    expect(mockFetch).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });
});
