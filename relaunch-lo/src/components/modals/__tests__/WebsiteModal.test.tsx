import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import WebsiteModal from '../WebsiteModal';

// Mock the API module for this test
jest.mock('@/lib/api', () => ({
  leadApi: {
    createLead: jest.fn(),
  },
}));

// Mock the snackbar hook
jest.mock('@/components/ui/snackbar', () => ({
  useSnackbar: () => ({
    showSnackbar: jest.fn(),
  }),
}));

// Import the mocked API after the mock
import { leadApi } from '@/lib/api';

describe('WebsiteModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open is true', () => {
    render(<WebsiteModal {...defaultProps} />);
    
    expect(screen.getByText('Ihr interaktives Homepage-Design')).toBeInTheDocument();
    expect(screen.getByLabelText(/unternehmens-url/i)).toBeInTheDocument();
    expect(screen.getByText('Ziele Ihrer neuen Homepage')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    render(<WebsiteModal {...defaultProps} open={false} />);
    
    expect(screen.queryByText('Ihr interaktives Homepage-Design')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    
    render(<WebsiteModal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('allows selecting multiple goals', () => {
    render(<WebsiteModal {...defaultProps} />);
    
    const conversionGoal = screen.getByRole('button', { name: /conversions steigern/i });
    const trafficGoal = screen.getByRole('button', { name: /traffic erhöhen/i });
    
    fireEvent.click(conversionGoal);
    fireEvent.click(trafficGoal);
    
    expect(conversionGoal).toHaveAttribute('data-state', 'on');
    expect(trafficGoal).toHaveAttribute('data-state', 'on');
  });

  it('allows selecting a style', () => {
    render(<WebsiteModal {...defaultProps} />);
    
    const modernStyle = screen.getByRole('button', { name: /modern/i });
    fireEvent.click(modernStyle);
    
    expect(modernStyle).toHaveAttribute('data-state', 'on');
  });

  it('allows selecting salutation', () => {
    render(<WebsiteModal {...defaultProps} />);
    
    const herrButton = screen.getByRole('button', { name: /herr/i });
    fireEvent.click(herrButton);
    
    expect(herrButton).toHaveAttribute('data-state', 'on');
  });

  it('validates required fields on submit', () => {
    render(<WebsiteModal {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /website-design anfordern/i });
    fireEvent.click(submitButton);
    
    // Form should not submit without required fields
    expect(leadApi.createLead).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const mockCreateLead = jest.mocked(leadApi.createLead);
    mockCreateLead.mockResolvedValue({ success: true });
    
    render(<WebsiteModal {...defaultProps} />);
    
    // Fill in required fields
    const urlInput = screen.getByPlaceholderText('ihre-firma.de');
    fireEvent.change(urlInput, { target: { value: 'test-company.de' } });
    
    // Select a goal
    const conversionGoal = screen.getByRole('button', { name: /conversions steigern/i });
    fireEvent.click(conversionGoal);
    
    // Select a style
    const modernStyle = screen.getByRole('button', { name: /modern/i });
    fireEvent.click(modernStyle);
    
    // Select salutation
    const herrButton = screen.getByRole('button', { name: /herr/i });
    fireEvent.click(herrButton);
    
    // Fill in contact info
    const nameInput = screen.getByLabelText(/vor- und nachname/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Accept privacy
    const privacyCheckbox = screen.getByRole('checkbox');
    fireEvent.click(privacyCheckbox);
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /website-design anfordern/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreateLead).toHaveBeenCalledWith(expect.objectContaining({
        type: 'website',
        name: 'Test User',
        email: 'test@example.com',
      }));
    });
  });

  it('handles API errors gracefully', async () => {
    const mockCreateLead = jest.mocked(leadApi.createLead);
    mockCreateLead.mockRejectedValue(new Error('API Error'));
    
    render(<WebsiteModal {...defaultProps} />);
    
    // Fill minimal required data
    const urlInput = screen.getByPlaceholderText('ihre-firma.de');
    fireEvent.change(urlInput, { target: { value: 'test.de' } });
    
    const conversionGoal = screen.getByRole('button', { name: /conversions steigern/i });
    fireEvent.click(conversionGoal);
    
    const modernStyle = screen.getByRole('button', { name: /modern/i });
    fireEvent.click(modernStyle);
    
    const herrButton = screen.getByRole('button', { name: /herr/i });
    fireEvent.click(herrButton);
    
    const nameInput = screen.getByLabelText(/vor- und nachname/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const privacyCheckbox = screen.getByRole('checkbox');
    fireEvent.click(privacyCheckbox);
    
    const submitButton = screen.getByRole('button', { name: /website-design anfordern/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreateLead).toHaveBeenCalled();
    });
  });
});
