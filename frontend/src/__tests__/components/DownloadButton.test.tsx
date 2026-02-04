/**
 * @jest-environment jsdom
 */
import { generateNdaFilename, sanitizeFilename } from '@/utils/nda';
import { defaultFormData, NDAFormData } from '@/types/nda';

// Note: Full DownloadButton component tests require more complex setup for @react-pdf/renderer
// These tests focus on the critical filename generation logic that the component uses

describe('DownloadButton filename generation', () => {
  it('generates filename with party names and date', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      effectiveDate: '2024-06-15',
      party1: { ...defaultFormData.party1, company: 'Acme Inc' },
      party2: { ...defaultFormData.party2, company: 'Tech Corp' },
    };
    expect(generateNdaFilename(formData)).toBe('Mutual-NDA_Acme_Inc_Tech_Corp_2024-06-15.pdf');
  });

  it('uses Party1/Party2 placeholders for empty company names', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      effectiveDate: '2024-06-15',
    };
    expect(generateNdaFilename(formData)).toBe('Mutual-NDA_Party1_Party2_2024-06-15.pdf');
  });

  it('sanitizes company names with special characters', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      effectiveDate: '2024-06-15',
      party1: { ...defaultFormData.party1, company: 'Acme/LLC' },
      party2: { ...defaultFormData.party2, company: 'Tech & Co.' },
    };
    expect(generateNdaFilename(formData)).toBe('Mutual-NDA_Acme_LLC_Tech___Co__2024-06-15.pdf');
  });

  it('sanitizes spaces in company names', () => {
    expect(sanitizeFilename('Acme Corporation')).toBe('Acme_Corporation');
  });

  it('sanitizes slashes and special chars', () => {
    expect(sanitizeFilename('Acme/Tech Inc.')).toBe('Acme_Tech_Inc_');
  });

  it('truncates long company names to 50 chars', () => {
    const longName = 'A'.repeat(100);
    expect(sanitizeFilename(longName).length).toBe(50);
  });

  it('preserves alphanumeric and hyphens', () => {
    expect(sanitizeFilename('Acme-Tech123')).toBe('Acme-Tech123');
  });
});
