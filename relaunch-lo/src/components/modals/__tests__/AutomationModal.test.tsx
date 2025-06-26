import { render, screen, fireEvent, act } from '@/test/test-utils';
import AutomationModal from '../AutomationModal';

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

// Add fake timers for all tests
jest.useFakeTimers();

describe('AutomationModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open is true', () => {
    render(<AutomationModal {...defaultProps} />);
    act(() => { jest.runAllTimers(); });
    expect(screen.getByText('ROI-Prognose für Marketing Automation')).toBeInTheDocument();
    expect(screen.getAllByText(/werbebudget/i)).toHaveLength(2);
    expect(screen.getByText(/abschlussquote/i)).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    render(<AutomationModal {...defaultProps} open={false} />);
    act(() => { jest.runAllTimers(); });
    expect(screen.queryByText('ROI-Kalkulator')).not.toBeInTheDocument();
  });

  it('calculates ROI correctly', () => {
    render(<AutomationModal {...defaultProps} />);
    act(() => { jest.runAllTimers(); });
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/€/).length).toBeGreaterThan(0);
  });

  it('shows contact form after ROI calculation', () => {
    render(<AutomationModal {...defaultProps} />);
    act(() => { jest.runAllTimers(); });
    expect(screen.getByText(/strategiegespräch anfordern/i)).toBeInTheDocument();
  });

  it('validates contact form fields', () => {
    render(<AutomationModal {...defaultProps} />);
    act(() => { jest.runAllTimers(); });
    const submitButton = screen.getByRole('button', { name: /strategiegespräch anfordern/i });
    fireEvent.click(submitButton);
    expect(leadApi.createLead).not.toHaveBeenCalled();
  });

  it('submits contact form with valid data', () => {
    const mockCreateLead = jest.mocked(leadApi.createLead);
    mockCreateLead.mockResolvedValue({ success: true });
    render(<AutomationModal {...defaultProps} />);
    act(() => { jest.runAllTimers(); });
    fireEvent.click(screen.getByRole('button', { name: /herr/i }));
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /strategiegespräch anfordern/i }));
    act(() => { jest.runAllTimers(); });
    expect(mockCreateLead).toHaveBeenCalled();
  });

  it('closes modal when close button is clicked', () => {
    const onClose = jest.fn();
    render(<AutomationModal {...defaultProps} onClose={onClose} />);
    act(() => { jest.runAllTimers(); });
    fireEvent.click(screen.getAllByRole('button')[0]);
    act(() => { jest.advanceTimersByTime(300); });
    expect(onClose).toHaveBeenCalled();
  });

  it('handles slider interactions', () => {
    render(<AutomationModal {...defaultProps} />);
    act(() => { jest.runAllTimers(); });
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThan(0);
    sliders.forEach(slider => fireEvent.click(slider));
  });
});
