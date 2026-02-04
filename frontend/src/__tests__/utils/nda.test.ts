import {
  formatDate,
  getMndaTermText,
  getConfidentialityTermText,
  sanitizeFilename,
  generateNdaFilename,
  placeholder,
  parseYearsInput,
} from '@/utils/nda';
import { NDAFormData, defaultFormData } from '@/types/nda';

describe('formatDate', () => {
  it('returns placeholder for empty string', () => {
    expect(formatDate('')).toBe('___________');
  });

  it('formats a valid date string correctly', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
  });

  it('formats dates in different months correctly', () => {
    expect(formatDate('2024-12-25')).toBe('December 25, 2024');
    expect(formatDate('2024-06-01')).toBe('June 1, 2024');
  });

  it('handles leap year dates', () => {
    expect(formatDate('2024-02-29')).toBe('February 29, 2024');
  });

  it('handles dates at year boundaries consistently across timezones', () => {
    // This test ensures UTC handling prevents off-by-one errors
    expect(formatDate('2024-01-01')).toBe('January 1, 2024');
    expect(formatDate('2024-12-31')).toBe('December 31, 2024');
  });
});

describe('getMndaTermText', () => {
  it('returns expires text for expires type', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      mndaTermType: 'expires',
      mndaTermYears: 2,
    };
    expect(getMndaTermText(formData)).toBe('Expires 2 year(s) from Effective Date.');
  });

  it('returns continues text for continues type', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      mndaTermType: 'continues',
    };
    expect(getMndaTermText(formData)).toBe(
      'Continues until terminated in accordance with the terms of the MNDA.'
    );
  });

  it('handles different year values', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      mndaTermType: 'expires',
      mndaTermYears: 5,
    };
    expect(getMndaTermText(formData)).toBe('Expires 5 year(s) from Effective Date.');
  });
});

describe('getConfidentialityTermText', () => {
  it('returns years text with trade secrets clause', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      confidentialityTermType: 'years',
      confidentialityTermYears: 3,
    };
    expect(getConfidentialityTermText(formData)).toContain('3 year(s) from Effective Date');
    expect(getConfidentialityTermText(formData)).toContain('trade secrets');
  });

  it('returns perpetuity text for perpetuity type', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      confidentialityTermType: 'perpetuity',
    };
    expect(getConfidentialityTermText(formData)).toBe('In perpetuity.');
  });
});

describe('sanitizeFilename', () => {
  it('replaces spaces with underscores', () => {
    expect(sanitizeFilename('Acme Inc')).toBe('Acme_Inc');
  });

  it('replaces special characters with underscores', () => {
    expect(sanitizeFilename('Acme/LLC')).toBe('Acme_LLC');
    expect(sanitizeFilename('Company & Co.')).toBe('Company___Co_');
  });

  it('preserves alphanumeric characters and hyphens', () => {
    expect(sanitizeFilename('Acme-Corp123')).toBe('Acme-Corp123');
  });

  it('truncates long strings to 50 characters', () => {
    const longName = 'A'.repeat(100);
    expect(sanitizeFilename(longName).length).toBe(50);
  });

  it('handles empty strings', () => {
    expect(sanitizeFilename('')).toBe('');
  });
});

describe('generateNdaFilename', () => {
  it('generates filename with party names and date', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      effectiveDate: '2024-01-15',
      party1: { ...defaultFormData.party1, company: 'Acme Inc' },
      party2: { ...defaultFormData.party2, company: 'Tech Corp' },
    };
    expect(generateNdaFilename(formData)).toBe('Mutual-NDA_Acme_Inc_Tech_Corp_2024-01-15.pdf');
  });

  it('uses Party1/Party2 placeholders for empty company names', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      effectiveDate: '2024-01-15',
    };
    expect(generateNdaFilename(formData)).toBe('Mutual-NDA_Party1_Party2_2024-01-15.pdf');
  });

  it('sanitizes company names with special characters', () => {
    const formData: NDAFormData = {
      ...defaultFormData,
      effectiveDate: '2024-01-15',
      party1: { ...defaultFormData.party1, company: 'Acme/LLC' },
      party2: { ...defaultFormData.party2, company: 'Tech & Co.' },
    };
    expect(generateNdaFilename(formData)).toBe('Mutual-NDA_Acme_LLC_Tech___Co__2024-01-15.pdf');
  });
});

describe('placeholder', () => {
  it('returns value when provided', () => {
    expect(placeholder('Test Value')).toBe('Test Value');
  });

  it('returns default fallback for empty string', () => {
    expect(placeholder('')).toBe('___________');
  });

  it('returns custom fallback when provided', () => {
    expect(placeholder('', '[Enter value]')).toBe('[Enter value]');
  });
});

describe('parseYearsInput', () => {
  it('parses valid positive numbers', () => {
    expect(parseYearsInput('5')).toBe(5);
    expect(parseYearsInput('10')).toBe(10);
  });

  it('returns 1 for empty string', () => {
    expect(parseYearsInput('')).toBe(1);
  });

  it('returns 1 for NaN values', () => {
    expect(parseYearsInput('abc')).toBe(1);
    expect(parseYearsInput('.')).toBe(1);
  });

  it('returns 1 for zero or negative numbers', () => {
    expect(parseYearsInput('0')).toBe(1);
    expect(parseYearsInput('-5')).toBe(1);
  });

  it('handles decimal strings by truncating', () => {
    expect(parseYearsInput('2.7')).toBe(2);
  });
});
