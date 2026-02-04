import { NDAFormData } from '@/types/nda';

/**
 * Formats a date string (YYYY-MM-DD) to a human-readable format.
 * Uses UTC to avoid timezone issues.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '___________';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Generates the MNDA term text based on form data.
 */
export function getMndaTermText(formData: NDAFormData): string {
  return formData.mndaTermType === 'expires'
    ? `Expires ${formData.mndaTermYears} year(s) from Effective Date.`
    : 'Continues until terminated in accordance with the terms of the MNDA.';
}

/**
 * Generates the confidentiality term text based on form data.
 */
export function getConfidentialityTermText(formData: NDAFormData): string {
  return formData.confidentialityTermType === 'years'
    ? `${formData.confidentialityTermYears} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
    : 'In perpetuity.';
}

/**
 * Sanitizes a string for use in a filename.
 */
export function sanitizeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9-]/g, '_').substring(0, 50);
}

/**
 * Generates a safe filename for the NDA PDF.
 */
export function generateNdaFilename(formData: NDAFormData): string {
  const party1Name = sanitizeFilename(formData.party1.company || 'Party1');
  const party2Name = sanitizeFilename(formData.party2.company || 'Party2');
  const date = formData.effectiveDate || new Date().toISOString().split('T')[0];
  return `Mutual-NDA_${party1Name}_${party2Name}_${date}.pdf`;
}

/**
 * Returns a placeholder string if value is empty.
 */
export function placeholder(value: string, fallback: string = '___________'): string {
  return value || fallback;
}

/**
 * Parses a number input value, returning a minimum of 1.
 */
export function parseYearsInput(value: string): number {
  if (value === '') return 1;
  const num = parseInt(value, 10);
  return isNaN(num) ? 1 : Math.max(1, num);
}
