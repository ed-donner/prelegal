import { DocumentType } from '@/types/documents';

export interface FieldConfig {
  key: string;
  label: string;
}

export interface DocumentFieldConfig {
  fields: FieldConfig[];
  party1Label: string;
  party2Label: string;
}

/**
 * Get document-specific field labels and party names for preview/PDF rendering.
 */
export function getFieldConfig(documentType: DocumentType): DocumentFieldConfig {
  switch (documentType) {
    case DocumentType.DESIGN_PARTNER:
      return {
        fields: [
          { key: 'programName', label: 'Program Name' },
          { key: 'feedbackRequirements', label: 'Feedback Requirements' },
          { key: 'accessPeriod', label: 'Access Period' },
        ],
        party1Label: 'Provider',
        party2Label: 'Design Partner',
      };
    case DocumentType.SLA:
      return {
        fields: [
          { key: 'uptimeTarget', label: 'Uptime Target' },
          { key: 'responseTimeCommitment', label: 'Response Time Commitment' },
          { key: 'serviceCredits', label: 'Service Credits' },
        ],
        party1Label: 'Provider',
        party2Label: 'Customer',
      };
    case DocumentType.PROFESSIONAL_SERVICES:
      return {
        fields: [
          { key: 'deliverables', label: 'Deliverables' },
          { key: 'projectTimeline', label: 'Project Timeline' },
          { key: 'fees', label: 'Fees' },
          { key: 'paymentSchedule', label: 'Payment Schedule' },
          { key: 'ipOwnership', label: 'IP Ownership' },
        ],
        party1Label: 'Provider',
        party2Label: 'Client',
      };
    case DocumentType.PARTNERSHIP:
      return {
        fields: [
          { key: 'partnershipScope', label: 'Partnership Scope' },
          { key: 'trademarkRights', label: 'Trademark Rights' },
          { key: 'revenueShare', label: 'Revenue Share' },
          { key: 'fees', label: 'Fees' },
        ],
        party1Label: 'Partner 1',
        party2Label: 'Partner 2',
      };
    case DocumentType.SOFTWARE_LICENSE:
      return {
        fields: [
          { key: 'licensedSoftware', label: 'Licensed Software' },
          { key: 'licenseType', label: 'License Type' },
          { key: 'licenseFees', label: 'License Fees' },
          { key: 'supportTerms', label: 'Support Terms' },
        ],
        party1Label: 'Licensor',
        party2Label: 'Licensee',
      };
    case DocumentType.DPA:
      return {
        fields: [
          { key: 'dataSubjects', label: 'Data Subjects' },
          { key: 'processingPurpose', label: 'Processing Purpose' },
          { key: 'dataCategories', label: 'Data Categories' },
          { key: 'subprocessors', label: 'Subprocessors' },
        ],
        party1Label: 'Data Processor',
        party2Label: 'Data Controller',
      };
    case DocumentType.BAA:
      return {
        fields: [
          { key: 'phiDescription', label: 'PHI Description' },
          { key: 'permittedUses', label: 'Permitted Uses' },
          { key: 'safeguards', label: 'Security Safeguards' },
        ],
        party1Label: 'Business Associate',
        party2Label: 'Covered Entity',
      };
    case DocumentType.AI_ADDENDUM:
      return {
        fields: [
          { key: 'aiFeatures', label: 'AI Features' },
          { key: 'trainingDataRights', label: 'Training Data Rights' },
          { key: 'outputOwnership', label: 'Output Ownership' },
        ],
        party1Label: 'AI Provider',
        party2Label: 'Customer',
      };
    default:
      return {
        fields: [],
        party1Label: 'Party 1',
        party2Label: 'Party 2',
      };
  }
}
