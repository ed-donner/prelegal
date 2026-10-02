jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn(),
  Document: 'Document',
  Page: 'Page',
  Text: 'Text',
  View: 'View',
  StyleSheet: { create: (styles: unknown) => styles },
}));

import { buildPdfDocument, generateDocumentFilename } from '@/utils/documentPdf';
import { DocumentType, getDefaultFormData } from '@/types/documents';
import { NDAPdf } from '@/components/NDAPdf';
import { PilotPdf } from '@/components/PilotPdf';
import { CloudServicePdf } from '@/components/CloudServicePdf';
import { GenericPdf } from '@/components/GenericPdf';

describe('generateDocumentFilename', () => {
  it('builds the filename from document name, companies and effective date', () => {
    const formData = {
      ...getDefaultFormData(DocumentType.CLOUD_SERVICE),
      effectiveDate: '2026-10-02',
      party1: { ...getDefaultFormData(DocumentType.CLOUD_SERVICE).party1, company: 'Acme Inc' },
      party2: { ...getDefaultFormData(DocumentType.CLOUD_SERVICE).party2, company: 'Tech & Co.' },
    };
    expect(generateDocumentFilename(DocumentType.CLOUD_SERVICE, formData)).toBe(
      'Cloud-Service-Agreement_Acme_Inc_Tech___Co__2026-10-02.pdf'
    );
  });

  it('falls back to placeholders and today when fields are empty', () => {
    const formData = { ...getDefaultFormData(DocumentType.SLA), effectiveDate: '' };
    const today = new Date().toISOString().split('T')[0];
    expect(generateDocumentFilename(DocumentType.SLA, formData)).toBe(
      `Service-Level-Agreement_Party1_Party2_${today}.pdf`
    );
  });
});

describe('buildPdfDocument', () => {
  it.each([
    [DocumentType.MUTUAL_NDA, NDAPdf],
    [DocumentType.PILOT, PilotPdf],
    [DocumentType.CLOUD_SERVICE, CloudServicePdf],
    [DocumentType.SLA, GenericPdf],
    [DocumentType.AI_ADDENDUM, GenericPdf],
  ])('uses the right PDF component for %s', (type, component) => {
    expect(buildPdfDocument(type, getDefaultFormData(type)).type).toBe(component);
  });
});
