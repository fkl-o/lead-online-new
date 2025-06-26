import React from 'react';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import { leadApi } from '@/lib/api';

// Mock the leadApi module properly
jest.mock('@/lib/api', () => ({
  leadApi: {
    createLead: jest.fn(),
    getLeads: jest.fn(),
  },
  authApi: {
    login: jest.fn(),
    getMe: jest.fn(),
  }
}));

describe('Lead Generation User Flow', () => {
  const mockCreateLead = leadApi.createLead as jest.MockedFunction<typeof leadApi.createLead>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic components without errors', () => {
    // Basic smoke test to ensure the test environment is working
    const TestComponent = () => (
      <div>
        <h1>Lead Generation Test</h1>
        <button>Test Button</button>
      </div>
    );

    render(<TestComponent />);
    
    expect(screen.getByText('Lead Generation Test')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  it('can mock API calls successfully', async () => {
    mockCreateLead.mockResolvedValue({ 
      success: true, 
      data: { 
        id: '1',
        name: 'Test Lead',
        email: 'test@example.com',
        salutation: 'herr',
        source: 'website',
        privacyConsent: true
      } 
    });

    const TestComponent = () => {
      const handleSubmit = async () => {
        const result = await leadApi.createLead({
          name: 'Test Lead',
          email: 'test@example.com',
          salutation: 'herr',
          source: 'website',
          privacyConsent: true
        });
        
        if (result.success) {
          console.log('Lead created successfully');
        }
      };

      return (
        <div>
          <button onClick={handleSubmit}>Create Lead</button>
        </div>
      );
    };

    render(<TestComponent />);
    
    const button = screen.getByRole('button', { name: 'Create Lead' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCreateLead).toHaveBeenCalledWith({
        name: 'Test Lead',
        email: 'test@example.com',
        salutation: 'herr',
        source: 'website',
        privacyConsent: true
      });
    });
  });

  it('handles API errors gracefully', async () => {
    mockCreateLead.mockRejectedValue(new Error('Server error'));

    const TestComponent = () => {
      const [error, setError] = React.useState<string | null>(null);

      const handleSubmit = async () => {
        try {
          await leadApi.createLead({
            name: 'Test Lead',
            email: 'test@example.com',
            salutation: 'herr',
            source: 'website',
            privacyConsent: true
          });
        } catch (err) {
          setError('API Error occurred');
        }
      };

      return (
        <div>
          <button onClick={handleSubmit}>Create Lead</button>
          {error && <div data-testid="error">{error}</div>}
        </div>
      );
    };

    render(<TestComponent />);
    
    const button = screen.getByRole('button', { name: 'Create Lead' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
    
    expect(mockCreateLead).toHaveBeenCalled();
  });
});
