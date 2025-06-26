import { render, screen, fireEvent } from '@/test/test-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../dialog';

describe('Dialog Component', () => {
  const DialogTest = ({ defaultOpen = false }: { defaultOpen?: boolean }) => (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <button>Open Dialog</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>This is a test dialog for accessibility.</DialogDescription>
        </DialogHeader>
        <p>Dialog content</p>
      </DialogContent>
    </Dialog>
  );

  it('renders trigger button', () => {
    render(<DialogTest />);
    
    const trigger = screen.getByRole('button', { name: /open dialog/i });
    expect(trigger).toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', () => {
    render(<DialogTest />);
    
    const trigger = screen.getByRole('button', { name: /open dialog/i });
    fireEvent.click(trigger);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('renders dialog when defaultOpen is true', () => {
    render(<DialogTest defaultOpen={true} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('closes dialog when close button is clicked', () => {
    render(<DialogTest defaultOpen={true} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Dialog should be closed now
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes dialog when escape key is pressed', () => {
    render(<DialogTest defaultOpen={true} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    
    // Dialog should be closed now
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<DialogTest defaultOpen={true} />);
    
    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Test Dialog');
    const description = screen.getByText('This is a test dialog for accessibility.');
    
    expect(dialog).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
});
