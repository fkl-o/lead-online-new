import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mock data for tests
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  salutation: 'herr',
  profile: {
    firstName: 'Test',
    lastName: 'User',
    phone: '+49 123 456789',
    position: 'Developer',
    department: 'IT',
    companyName: 'Test Company',
    companyUrl: 'https://test.com',
  },
};

export const mockLead = {
  id: '1',
  name: 'Test Lead',
  email: 'lead@example.com',
  phone: '+49 123 456789',
  company: 'Test Company',
  message: 'Test message',
  type: 'website',
  status: 'new',
  priority: 'medium',
  assignedTo: null,
  source: 'website',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  comments: [],
  attachments: [],
  metadata: {},
};

// Custom wrapper component for tests
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        {children}
      </HelmetProvider>
    </BrowserRouter>
  );
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Utility functions for common test operations
export const mockApiCall = <T,>(data: T, delay = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (message = 'API Error', delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

// Mock form data for testing
export const mockFormData = {
  website: {
    websiteUrl: 'test-company.de',
    selectedGoals: ['conversions', 'traffic'],
    selectedStyle: 'minimal',
    salutation: 'herr',
    name: 'Test User',
    email: 'test@example.com',
    privacyAgreed: true,
  },
  automation: {
    monthlyBudget: 5000,
    conversionRate: 25,
    name: 'Test User',
    email: 'test@example.com',
    privacyAgreed: true,
  },
  digitalization: {
    url: 'test-company.de',
    areas: ['Logistik', 'Vertrieb'],
    urgency: 'sofort',
    salutation: 'herr',
    name: 'Test User',
    email: 'test@example.com',
    privacyAgreed: true,
  },
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render export
export { customRender as render };

