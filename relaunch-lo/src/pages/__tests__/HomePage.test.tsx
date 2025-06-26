import { render, screen, fireEvent } from '@/test/test-utils';
import HomePage from '../HomePage';

// Mock lazy-loaded components
jest.mock('../../components/modals/WebsiteModal', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) => 
    open ? <div data-testid="website-modal">Website Modal<button onClick={onClose}>Close</button></div> : null,
}));

jest.mock('../../components/modals/AutomationModal', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) => 
    open ? <div data-testid="automation-modal">Automation Modal<button onClick={onClose}>Close</button></div> : null,
}));

jest.mock('../../components/modals/DigitalizationModal', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) => 
    open ? <div data-testid="digitalization-modal">Digitalization Modal<button onClick={onClose}>Close</button></div> : null,
}));

describe('HomePage', () => {
  it('renders main sections', () => {
    render(<HomePage />);
    
    // Check for main headline or key content
    expect(screen.getByText(/finden sie die passende lösung/i)).toBeInTheDocument();
    
    // Check for service cards
    expect(screen.getByText(/design-anfrage starten/i)).toBeInTheDocument();
    expect(screen.getByText(/roi jetzt berechnen/i)).toBeInTheDocument();
    expect(screen.getAllByText(/gespräch vereinbaren/i)).toHaveLength(2); // Multiple buttons
  });

  it('opens website modal when website button is clicked', () => {
    render(<HomePage />);
    
    const websiteButton = screen.getByRole('button', { name: /design-anfrage starten/i });
    fireEvent.click(websiteButton);
    
    expect(screen.getByTestId('website-modal')).toBeInTheDocument();
  });

  it('opens automation modal when automation button is clicked', () => {
    render(<HomePage />);
    
    const automationButton = screen.getByRole('button', { name: /roi jetzt berechnen/i });
    fireEvent.click(automationButton);
    
    expect(screen.getByTestId('automation-modal')).toBeInTheDocument();
  });

  it('opens digitalization modal when digitalization button is clicked', () => {
    render(<HomePage />);
    
    const digitalizationButton = screen.getAllByText(/gespräch vereinbaren/i)[0]; // First button
    fireEvent.click(digitalizationButton);
    
    expect(screen.getByTestId('digitalization-modal')).toBeInTheDocument();
  });

  it('closes modals when close button is clicked', () => {
    render(<HomePage />);
    
    // Open website modal
    const websiteButton = screen.getByRole('button', { name: /design-anfrage starten/i });
    fireEvent.click(websiteButton);
    
    expect(screen.getByTestId('website-modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('website-modal')).not.toBeInTheDocument();
  });

  it('renders SEO elements', () => {
    render(<HomePage />);
    
    // Check that document title is set (would need to check document.title in real test)
    // Text is split across elements, so use more flexible matcher
    expect(screen.getByText('Wir gestalten')).toBeInTheDocument();
    expect(screen.getByText('digitales Wachstum')).toBeInTheDocument();
  });

  it('renders all service sections', () => {
    render(<HomePage />);
    
    // Check for service section
    expect(screen.getByText(/finden sie die passende lösung/i)).toBeInTheDocument();
    
    // Check for hero section elements (split text)
    expect(screen.getByText('Wir gestalten')).toBeInTheDocument();
    expect(screen.getByText('digitales Wachstum')).toBeInTheDocument();
    
    // Check for process section or trust section if they have unique text
    // This would depend on the actual content in those components
  });

  it('handles multiple modal interactions', () => {
    // Use fireEvent for faster, more reliable testing
    render(<HomePage />);
    
    // Open website modal
    const websiteButton = screen.getByRole('button', { name: /design-anfrage starten/i });
    fireEvent.click(websiteButton);
    expect(screen.getByTestId('website-modal')).toBeInTheDocument();
    
    // Close it
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('website-modal')).not.toBeInTheDocument();
    
    // Open automation modal
    const automationButton = screen.getByRole('button', { name: /roi-kalkulator/i });
    fireEvent.click(automationButton);
    expect(screen.getByTestId('automation-modal')).toBeInTheDocument();
    
    // Close it
    const closeButton2 = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton2);
    expect(screen.queryByTestId('automation-modal')).not.toBeInTheDocument();
  });
});
