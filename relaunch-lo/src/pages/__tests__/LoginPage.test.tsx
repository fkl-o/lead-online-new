import { render, screen, waitFor, userEvent, fireEvent } from '@/test/test-utils';
import LoginPage from '../LoginPage';

// Mock the API module for this test
jest.mock('@/lib/api', () => ({
  authApi: {
    login: jest.fn(),
    forgotPassword: jest.fn(),
  },
}));

// Import the mocked API after the mock
import { authApi } from '@/lib/api';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: '/login',
    search: '',
    hash: '',
    state: null,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /einloggen/i })).toBeInTheDocument();
    expect(screen.getByText(/passwort vergessen/i)).toBeInTheDocument();
  });

  it('validates required fields', () => {
    render(<LoginPage />);
    const submitButton = screen.getByRole('button', { name: /einloggen/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/e-mail ist erforderlich/i)).toBeInTheDocument();
    expect(screen.getByText(/passwort ist erforderlich/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /einloggen/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/ungültige e-mail-adresse/i)).toBeInTheDocument();
  });

  it('submits login with valid credentials', async () => {
    const user = userEvent.setup();
    const mockLogin = jest.mocked(authApi.login);
    mockLogin.mockResolvedValue({ 
      success: true, 
      data: { id: '1', email: 'test@example.com', name: 'Test User', role: 'user' },
      token: 'mock-token'
    });
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/passwort/i);
    const submitButton = screen.getByRole('button', { name: /einloggen/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('handles login errors', async () => {
    const user = userEvent.setup();
    const mockLogin = jest.mocked(authApi.login);
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/passwort/i);
    const submitButton = screen.getByRole('button', { name: /einloggen/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/ungültige anmeldedaten/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    const mockLogin = jest.mocked(authApi.login);
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/passwort/i);
    const submitButton = screen.getByRole('button', { name: /einloggen/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(screen.getByText(/wird angemeldet/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('switches to forgot password mode', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const forgotPasswordLink = screen.getByText(/passwort vergessen/i);
    await user.click(forgotPasswordLink);
    
    expect(screen.getByText(/passwort zurücksetzen/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zurücksetzen/i })).toBeInTheDocument();
  });

  it('handles forgot password submission', async () => {
    const user = userEvent.setup();
    // Mock forgotPassword function if it doesn't exist
    const mockForgotPassword = jest.fn().mockResolvedValue({ success: true });
    (authApi as any).forgotPassword = mockForgotPassword;
    
    render(<LoginPage />);
    
    // Switch to forgot password mode
    await user.click(screen.getByText(/passwort vergessen/i));
    
    // Fill email and submit
    const emailInput = screen.getByLabelText(/e-mail/i);
    await user.type(emailInput, 'test@example.com');
    
    const resetButton = screen.getByRole('button', { name: /link senden/i });
    await user.click(resetButton);
    
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('redirects if already logged in', () => {
    // Mock localStorage to simulate logged in user
    const mockGetItem = jest.spyOn(Storage.prototype, 'getItem');
    mockGetItem.mockReturnValue('mock-token');
    
    render(<LoginPage />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    
    mockGetItem.mockRestore();
  });
});
