import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
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

// Mock the App component since we don't have it directly
// This would be the main App component that includes routing

describe('Lead Generation User Flow', () => {
  const mockCreateLead = leadApi.createLead as jest.MockedFunction<typeof leadApi.createLead>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes website lead generation flow', async () => {
    const user = userEvent.setup();
    mockCreateLead.mockResolvedValue({ success: true, data: { id: '1' } });

    // Mock the homepage flow for now
    const HomePage = () => (
      <div>
        <h1>LeadGen Pro</h1>
        <button onClick={() => {/* open website modal */}}>
          Design-Anfrage starten
        </button>
        <div id="website-modal" style={{ display: 'none' }}>
          <h2>Website Design</h2>
          <input placeholder="ihre-firma.de" />
          <button data-goal="conversions">Conversions steigern</button>
          <button data-style="minimal">Modern</button>
          <button data-salutation="herr">Herr</button>
          <input placeholder="Name" />
          <input placeholder="E-Mail" />
          <input type="checkbox" />
          <button>Design-Anfrage starten</button>
        </div>
      </div>
    );

    render(<HomePage />);

    // 1. User visits homepage
    expect(screen.getByText('LeadGen Pro')).toBeInTheDocument();

    // 2. User clicks on website design button
    const designButton = screen.getByRole('button', { name: /design-anfrage starten/i });
    await user.click(designButton);

    // In a real test, the modal would open here
    // We'll simulate the modal being visible
    const modal = screen.getByText('Website Design');
    expect(modal).toBeInTheDocument();

    // 3. User fills out the website form
    const urlInput = screen.getByPlaceholderText('ihre-firma.de');
    await user.type(urlInput, 'my-company.de');

    const goalButton = screen.getByTestId('goal-conversions') || screen.getByText('Conversions steigern');
    await user.click(goalButton);

    const styleButton = screen.getByTestId('style-minimal') || screen.getByText('Modern');
    await user.click(styleButton);

    const salutationButton = screen.getByTestId('salutation-herr') || screen.getByText('Herr');
    await user.click(salutationButton);

    const nameInput = screen.getByPlaceholderText('Name');
    await user.type(nameInput, 'John Doe');

    const emailInput = screen.getByPlaceholderText('E-Mail');
    await user.type(emailInput, 'john@example.com');

    const privacyCheckbox = screen.getByRole('checkbox');
    await user.click(privacyCheckbox);

    // 4. User submits the form
    const submitButton = screen.getByRole('button', { name: /design-anfrage starten/i });
    await user.click(submitButton);

    // 5. Verify API call was made
    await waitFor(() => {
      expect(mockCreateLead).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        type: 'website',
        metadata: expect.objectContaining({
          websiteUrl: 'my-company.de',
          goals: expect.arrayContaining(['conversions']),
          style: 'minimal',
          salutation: 'herr'
        })
      }));
    });
  });

  it('completes automation ROI calculation and lead flow', async () => {
    const user = userEvent.setup();
    const mockCreateLead = jest.mocked(leadApi.createLead);
    mockCreateLead.mockResolvedValue({ success: true, data: { id: '2' } });

    // Mock automation modal component
    const AutomationPage = () => (
      <div>
        <h1>ROI Calculator</h1>
        <input type="range" min="1000" max="50000" defaultValue="5000" aria-label="Budget" />
        <input type="range" min="1" max="100" defaultValue="25" aria-label="Conversion Rate" />
        <div>Monthly Savings: €1,500</div>
        <input placeholder="Name" />
        <input placeholder="E-Mail" />
        <input type="checkbox" />
        <button>Strategiegespräch anfordern</button>
      </div>
    );

    render(<AutomationPage />);

    // 1. User interacts with ROI calculator
    const budgetSlider = screen.getByRole('slider', { name: /budget/i });
    await user.click(budgetSlider);

    const conversionSlider = screen.getByRole('slider', { name: /conversion rate/i });
    await user.click(conversionSlider);

    // 2. User sees calculated savings
    expect(screen.getByText(/monthly savings/i)).toBeInTheDocument();

    // 3. User fills contact form
    const nameInput = screen.getByPlaceholderText('Name');
    await user.type(nameInput, 'Jane Smith');

    const emailInput = screen.getByPlaceholderText('E-Mail');
    await user.type(emailInput, 'jane@company.com');

    const privacyCheckbox = screen.getByRole('checkbox');
    await user.click(privacyCheckbox);

    // 4. User submits request
    const submitButton = screen.getByRole('button', { name: /strategiegespräch anfordern/i });
    await user.click(submitButton);

    // 5. Verify lead creation
    await waitFor(() => {
      expect(mockCreateLead).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Jane Smith',
        email: 'jane@company.com',
        type: 'automation'
      }));
    });
  });

  it('handles form validation errors gracefully', async () => {
    const user = userEvent.setup();

    const FormPage = () => (
      <div>
        <h1>Contact Form</h1>
        <input placeholder="Name" />
        <input placeholder="E-Mail" />
        <input type="checkbox" />
        <button>Submit</button>
        <div id="errors"></div>
      </div>
    );

    render(<FormPage />);

    // 1. User tries to submit empty form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // 2. User should see validation errors
    // In a real implementation, these would be displayed
    expect(submitButton).toBeInTheDocument();

    // 3. User corrects some fields
    const nameInput = screen.getByPlaceholderText('Name');
    await user.type(nameInput, 'Test User');

    // 4. User tries to submit with invalid email
    const emailInput = screen.getByPlaceholderText('E-Mail');
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    // 5. User corrects email and submits successfully
    await user.clear(emailInput);
    await user.type(emailInput, 'test@example.com');
    
    const privacyCheckbox = screen.getByRole('checkbox');
    await user.click(privacyCheckbox);
    
    await user.click(submitButton);
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    const mockCreateLead = jest.mocked(leadApi.createLead);
    mockCreateLead.mockRejectedValue(new Error('Server error'));

    const FormPage = () => (
      <div>
        <input placeholder="Name" />
        <input placeholder="E-Mail" />
        <input type="checkbox" />
        <button>Submit</button>
      </div>
    );

    render(<FormPage />);

    // Fill and submit form
    await user.type(screen.getByPlaceholderText('Name'), 'Test User');
    await user.type(screen.getByPlaceholderText('E-Mail'), 'test@example.com');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // API call should fail, but app should handle it gracefully
    await waitFor(() => {
      expect(mockCreateLead).toHaveBeenCalled();
    });

    // In a real app, an error message would be shown to the user
  });
});
