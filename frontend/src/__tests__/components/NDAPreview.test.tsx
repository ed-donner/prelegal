import { render, screen } from '@testing-library/react';
import { NDAPreview } from '@/components/NDAPreview';
import { NDAFormData, defaultFormData } from '@/types/nda';

describe('NDAPreview', () => {
  it('renders the document title', () => {
    render(<NDAPreview formData={defaultFormData} />);

    expect(screen.getByText('Mutual Non-Disclosure Agreement')).toBeInTheDocument();
    expect(screen.getByText('Common Paper Mutual NDA Standard Terms Version 1.0')).toBeInTheDocument();
  });

  it('renders the cover page section', () => {
    render(<NDAPreview formData={defaultFormData} />);

    expect(screen.getByText('Cover Page')).toBeInTheDocument();
    expect(screen.getByText('Purpose')).toBeInTheDocument();
    expect(screen.getByText('Effective Date')).toBeInTheDocument();
    expect(screen.getByText('MNDA Term')).toBeInTheDocument();
    expect(screen.getByText('Term of Confidentiality')).toBeInTheDocument();
    expect(screen.getByText('Governing Law & Jurisdiction')).toBeInTheDocument();
  });

  it('displays purpose from form data', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      purpose: 'Testing the product integration',
    };

    render(<NDAPreview formData={formData} />);

    expect(screen.getByText('Testing the product integration')).toBeInTheDocument();
  });

  it('displays placeholder for empty purpose', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      purpose: '',
    };

    render(<NDAPreview formData={formData} />);

    expect(screen.getByText('[How Confidential Information may be used]')).toBeInTheDocument();
  });

  it('formats and displays effective date', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      effectiveDate: '2024-03-15',
    };

    render(<NDAPreview formData={formData} />);

    expect(screen.getByText('March 15, 2024')).toBeInTheDocument();
  });

  it('displays expires term text correctly', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      mndaTermType: 'expires',
      mndaTermYears: 3,
    };

    render(<NDAPreview formData={formData} />);

    expect(screen.getByText('Expires 3 year(s) from Effective Date.')).toBeInTheDocument();
  });

  it('displays continues term text correctly', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      mndaTermType: 'continues',
    };

    render(<NDAPreview formData={formData} />);

    expect(
      screen.getByText('Continues until terminated in accordance with the terms of the MNDA.')
    ).toBeInTheDocument();
  });

  it('displays confidentiality term in years', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      confidentialityTermType: 'years',
      confidentialityTermYears: 5,
    };

    render(<NDAPreview formData={formData} />);

    expect(screen.getByText(/5 year\(s\) from Effective Date/)).toBeInTheDocument();
  });

  it('displays perpetuity confidentiality term', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      confidentialityTermType: 'perpetuity',
    };

    render(<NDAPreview formData={formData} />);

    expect(screen.getByText('In perpetuity.')).toBeInTheDocument();
  });

  it('displays governing law and jurisdiction', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      governingLaw: 'Delaware',
      jurisdiction: 'New Castle County, Delaware',
    };

    render(<NDAPreview formData={formData} />);

    // These appear in multiple places (cover page and standard terms section 9)
    const delawareElements = screen.getAllByText('Delaware');
    expect(delawareElements.length).toBeGreaterThanOrEqual(1);

    const jurisdictionElements = screen.getAllByText('New Castle County, Delaware');
    expect(jurisdictionElements.length).toBeGreaterThanOrEqual(1);
  });

  it('displays placeholder for empty governing law', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      governingLaw: '',
    };

    render(<NDAPreview formData={formData} />);

    // Appears in cover page and section 9
    const placeholders = screen.getAllByText('[State]');
    expect(placeholders.length).toBeGreaterThanOrEqual(1);
  });

  it('displays modifications when provided', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      modifications: 'Custom clause about data handling',
    };

    render(<NDAPreview formData={formData} />);

    expect(screen.getByText('Modifications')).toBeInTheDocument();
    expect(screen.getByText('Custom clause about data handling')).toBeInTheDocument();
  });

  it('does not display modifications section when empty', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      modifications: '',
    };

    render(<NDAPreview formData={formData} />);

    // Modifications header should not appear
    const modificationsHeaders = screen.queryAllByText('Modifications');
    // It should not appear in the cover page section
    expect(modificationsHeaders.length).toBe(0);
  });

  it('renders signature blocks for both parties', () => {
    render(<NDAPreview formData={defaultFormData} />);

    // Check for Party 1 and Party 2 headers
    expect(screen.getByText('Party 1')).toBeInTheDocument();
    expect(screen.getByText('Party 2')).toBeInTheDocument();
  });

  it('displays party information when provided', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      party1: {
        company: 'Acme Corporation',
        name: 'John Smith',
        title: 'CEO',
        noticeAddress: 'legal@acme.com',
        date: '2024-03-15',
      },
      party2: {
        company: 'Tech Startup',
        name: 'Jane Doe',
        title: 'CTO',
        noticeAddress: 'legal@techstartup.com',
        date: '2024-03-16',
      },
    };

    render(<NDAPreview formData={formData} />);

    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('CEO')).toBeInTheDocument();
    expect(screen.getByText('legal@acme.com')).toBeInTheDocument();

    expect(screen.getByText('Tech Startup')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('CTO')).toBeInTheDocument();
    expect(screen.getByText('legal@techstartup.com')).toBeInTheDocument();
  });

  it('renders all standard terms sections', () => {
    render(<NDAPreview formData={defaultFormData} />);

    expect(screen.getByText('Standard Terms')).toBeInTheDocument();
    expect(screen.getByText('1. Introduction.')).toBeInTheDocument();
    expect(screen.getByText('2. Use and Protection of Confidential Information.')).toBeInTheDocument();
    expect(screen.getByText('3. Exceptions.')).toBeInTheDocument();
    expect(screen.getByText('4. Disclosures Required by Law.')).toBeInTheDocument();
    expect(screen.getByText('5. Term and Termination.')).toBeInTheDocument();
    expect(screen.getByText('6. Return or Destruction of Confidential Information.')).toBeInTheDocument();
    expect(screen.getByText('7. Proprietary Rights.')).toBeInTheDocument();
    expect(screen.getByText('8. Disclaimer.')).toBeInTheDocument();
    expect(screen.getByText('9. Governing Law and Jurisdiction.')).toBeInTheDocument();
    expect(screen.getByText('10. Equitable Relief.')).toBeInTheDocument();
    expect(screen.getByText('11. General.')).toBeInTheDocument();
  });

  it('renders CC BY 4.0 attribution link', () => {
    render(<NDAPreview formData={defaultFormData} />);

    const link = screen.getByRole('link', { name: 'CC BY 4.0' });
    expect(link).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
  });
});
