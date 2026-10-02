import { DocumentType, DocumentFormData, DOCUMENT_NAMES, MutualNDAData, PilotData, CloudServiceData } from '@/types/documents';
import { NDAPdf } from '@/components/NDAPdf';
import { PilotPdf } from '@/components/PilotPdf';
import { CloudServicePdf } from '@/components/CloudServicePdf';
import { GenericPdf } from '@/components/GenericPdf';
import { NDAFormData } from '@/types/nda';

function sanitizeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9-]/g, '_').substring(0, 50);
}

export function generateDocumentFilename(documentType: DocumentType, formData: DocumentFormData): string {
  const docName = DOCUMENT_NAMES[documentType].replace(/\s+/g, '-');
  const party1Name = sanitizeFilename(formData.party1.company || 'Party1');
  const party2Name = sanitizeFilename(formData.party2.company || 'Party2');
  const date = formData.effectiveDate || new Date().toISOString().split('T')[0];
  return `${docName}_${party1Name}_${party2Name}_${date}.pdf`;
}

export function buildPdfDocument(documentType: DocumentType, formData: DocumentFormData) {
  switch (documentType) {
    case DocumentType.MUTUAL_NDA: {
      // Convert to NDAFormData format for backward compatibility
      const ndaData = formData as MutualNDAData;
      const ndaFormData: NDAFormData = {
        purpose: ndaData.purpose,
        effectiveDate: ndaData.effectiveDate,
        mndaTermType: ndaData.mndaTermType,
        mndaTermYears: ndaData.mndaTermYears,
        confidentialityTermType: ndaData.confidentialityTermType,
        confidentialityTermYears: ndaData.confidentialityTermYears,
        governingLaw: ndaData.governingLaw,
        jurisdiction: ndaData.jurisdiction,
        modifications: ndaData.modifications,
        party1: ndaData.party1,
        party2: ndaData.party2,
      };
      return <NDAPdf formData={ndaFormData} />;
    }
    case DocumentType.PILOT:
      return <PilotPdf formData={formData as PilotData} />;
    case DocumentType.CLOUD_SERVICE:
      return <CloudServicePdf formData={formData as CloudServiceData} />;
    default:
      return <GenericPdf documentType={documentType} formData={formData} />;
  }
}
