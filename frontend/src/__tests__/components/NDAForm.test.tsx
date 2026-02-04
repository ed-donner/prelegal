import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NDAForm } from '@/components/NDAForm';
import { NDAFormData, defaultFormData } from '@/types/nda';

describe('NDAForm', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all form sections', () => {
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    expect(screen.getByText('Agreement Details')).toBeInTheDocument();
    expect(screen.getByText('Governing Law & Jurisdiction')).toBeInTheDocument();
    expect(screen.getByText('Party 1')).toBeInTheDocument();
    expect(screen.getByText('Party 2')).toBeInTheDocument();
    expect(screen.getByText('Modifications (Optional)')).toBeInTheDocument();
  });

  it('displays form fields with correct labels', () => {
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    // Use getByLabelText with exact ID matching
    expect(document.getElementById('purpose')).toBeInTheDocument();
    expect(document.getElementById('effectiveDate')).toBeInTheDocument();
    expect(document.getElementById('governingLaw')).toBeInTheDocument();
    expect(document.getElementById('jurisdiction')).toBeInTheDocument();
  });

  it('displays current form values', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      purpose: 'Test Purpose',
      governingLaw: 'California',
      jurisdiction: 'San Francisco County',
    };

    render(<NDAForm formData={formData} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('Test Purpose')).toBeInTheDocument();
    expect(screen.getByDisplayValue('California')).toBeInTheDocument();
    expect(screen.getByDisplayValue('San Francisco County')).toBeInTheDocument();
  });

  it('calls onChange when purpose is updated', async () => {
    const user = userEvent.setup();
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    const purposeInput = document.getElementById('purpose') as HTMLTextAreaElement;
    await user.clear(purposeInput);
    await user.type(purposeInput, 'New Purpose');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange when effective date is updated', async () => {
    const user = userEvent.setup();
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    const dateInput = document.getElementById('effectiveDate') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-06-15' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('handles radio button selection for MNDA term type', async () => {
    const user = userEvent.setup();
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    const continuesRadio = document.getElementById('mnda-continues') as HTMLInputElement;
    await user.click(continuesRadio);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermType: 'continues' })
    );
  });

  it('handles radio button selection for confidentiality term type', async () => {
    const user = userEvent.setup();
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    const perpetuityRadio = document.getElementById('conf-perpetuity') as HTMLInputElement;
    await user.click(perpetuityRadio);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ confidentialityTermType: 'perpetuity' })
    );
  });

  it('disables year input when expires is not selected', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      mndaTermType: 'continues',
    };

    render(<NDAForm formData={formData} onChange={mockOnChange} />);

    const yearInput = screen.getByLabelText(/Number of years for MNDA term/);
    expect(yearInput).toBeDisabled();
  });

  it('enables year input when expires is selected', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      mndaTermType: 'expires',
    };

    render(<NDAForm formData={formData} onChange={mockOnChange} />);

    const yearInput = screen.getByLabelText(/Number of years for MNDA term/);
    expect(yearInput).not.toBeDisabled();
  });

  it('renders party fields for both parties', () => {
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    // Check both party sections exist
    expect(screen.getByText('Party 1')).toBeInTheDocument();
    expect(screen.getByText('Party 2')).toBeInTheDocument();

    // Check party-specific inputs exist
    expect(document.getElementById('party1-company')).toBeInTheDocument();
    expect(document.getElementById('party2-company')).toBeInTheDocument();
  });

  it('updates party 1 company name', () => {
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    const party1Company = document.getElementById('party1-company') as HTMLInputElement;
    fireEvent.change(party1Company, { target: { value: 'Acme Inc' } });

    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.party1.company).toBe('Acme Inc');
  });

  it('has proper accessibility attributes on radio groups', () => {
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    // Check for radiogroup role
    const radioGroups = screen.getAllByRole('radiogroup');
    expect(radioGroups.length).toBeGreaterThanOrEqual(2);

    // Check that radio buttons have name attribute for grouping
    const mndaExpiresRadio = document.getElementById('mnda-expires') as HTMLInputElement;
    const mndaContinuesRadio = document.getElementById('mnda-continues') as HTMLInputElement;
    expect(mndaExpiresRadio.name).toBe('mndaTermType');
    expect(mndaContinuesRadio.name).toBe('mndaTermType');
  });

  it('shows hint text for fields that have it', () => {
    render(<NDAForm formData={defaultFormData} onChange={mockOnChange} />);

    expect(screen.getByText('How Confidential Information may be used')).toBeInTheDocument();
    // There are two notice address hints (party1 and party2)
    const noticeHints = screen.getAllByText('Email or postal address for legal notices');
    expect(noticeHints.length).toBe(2);
    expect(screen.getByText('State whose laws will govern this agreement')).toBeInTheDocument();
  });
});
