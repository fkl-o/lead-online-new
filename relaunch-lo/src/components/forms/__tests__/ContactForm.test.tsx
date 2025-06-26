import { render, screen, waitFor, userEvent } from '@/test/test-utils';
import { ContactForm } from '../ContactForm';

// Mock the SecurityUtils
jest.mock('@/lib/security', () => ({
  SecurityUtils: {
    sanitizeInput: jest.fn((input) => input),
    validateEmail: jest.fn((email) => email.includes('@')),
  },
}));

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch for form submission
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefon/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unternehmen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nachricht/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nachricht senden/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /nachricht senden/i });
    await user.click(submitButton);
    
    // Should show validation errors
    expect(screen.getByText(/name ist erforderlich/i)).toBeInTheDocument();
    expect(screen.getByText(/e-mail ist erforderlich/i)).toBeInTheDocument();
    expect(screen.getByText(/nachricht ist erforderlich/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /nachricht senden/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/ungültige e-mail-adresse/i)).toBeInTheDocument();
  });

  it('validates consent checkbox', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // Fill required fields but leave consent unchecked
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com');
    await user.type(screen.getByLabelText(/nachricht/i), 'Test message');
    
    const submitButton = screen.getByRole('button', { name: /nachricht senden/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/datenschutz zustimmung erforderlich/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.mocked(global.fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);
    
    render(<ContactForm />);
    
    // Fill all required fields
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com');
    await user.type(screen.getByLabelText(/telefon/i), '+49 123 456789');
    await user.type(screen.getByLabelText(/unternehmen/i), 'Test Company');
    await user.type(screen.getByLabelText(/nachricht/i), 'This is a test message');
    
    // Check consent
    const consentCheckbox = screen.getByRole('checkbox');
    await user.click(consentCheckbox);
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /nachricht senden/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('Test User'),
      }));
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.mocked(global.fetch);
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<ContactForm />);
    
    // Fill required fields
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com');
    await user.type(screen.getByLabelText(/nachricht/i), 'Test message');
    await user.click(screen.getByRole('checkbox'));
    
    const submitButton = screen.getByRole('button', { name: /nachricht senden/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/wird gesendet/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('handles submission errors', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.mocked(global.fetch);
    mockFetch.mockRejectedValue(new Error('Network error'));
    
    render(<ContactForm />);
    
    // Fill required fields
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com');
    await user.type(screen.getByLabelText(/nachricht/i), 'Test message');
    await user.click(screen.getByRole('checkbox'));
    
    const submitButton = screen.getByRole('button', { name: /nachricht senden/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/fehler beim senden/i)).toBeInTheDocument();
    });
  });

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.mocked(global.fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);
    
    render(<ContactForm />);
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com');
    await user.type(screen.getByLabelText(/nachricht/i), 'Test message');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /nachricht senden/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/nachricht erfolgreich gesendet/i)).toBeInTheDocument();
    });
  });
});
