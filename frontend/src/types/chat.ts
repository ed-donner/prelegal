import { DocumentType, DocumentFormData, getDefaultFormData } from './documents';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PartyInfoExtraction {
  name?: string;
  title?: string;
  company?: string;
  noticeAddress?: string;
  date?: string;
}

export interface ChatResponse {
  response: string;

  // Document type detection
  documentType?: string;
  suggestedDocument?: string;

  // Common fields
  purpose?: string;
  effectiveDate?: string;
  governingLaw?: string;
  jurisdiction?: string;

  // Mutual NDA specific
  mndaTermType?: 'expires' | 'continues';
  mndaTermYears?: number;
  confidentialityTermType?: 'years' | 'perpetuity';
  confidentialityTermYears?: number;
  modifications?: string;

  // Cloud Service Agreement
  providerName?: string;
  customerName?: string;
  subscriptionPeriod?: string;
  technicalSupport?: string;
  fees?: string;
  paymentTerms?: string;

  // Pilot Agreement
  pilotPeriod?: string;
  evaluationPurpose?: string;
  generalCapAmount?: string;

  // Design Partner Agreement
  programName?: string;
  feedbackRequirements?: string;
  accessPeriod?: string;

  // SLA
  uptimeTarget?: string;
  responseTimeCommitment?: string;
  serviceCredits?: string;

  // Professional Services
  deliverables?: string;
  projectTimeline?: string;
  paymentSchedule?: string;
  ipOwnership?: string;

  // Partnership
  partnershipScope?: string;
  trademarkRights?: string;
  revenueShare?: string;

  // Software License
  licensedSoftware?: string;
  licenseType?: string;
  licenseFees?: string;
  supportTerms?: string;

  // DPA
  dataSubjects?: string;
  processingPurpose?: string;
  dataCategories?: string;
  subprocessors?: string;

  // BAA
  phiDescription?: string;
  permittedUses?: string;
  safeguards?: string;

  // AI Addendum
  aiFeatures?: string;
  trainingDataRights?: string;
  outputOwnership?: string;

  // Party information
  party1?: PartyInfoExtraction;
  party2?: PartyInfoExtraction;

  isComplete: boolean;
}

/**
 * Extract document form fields from a chat response.
 * Returns a partial DocumentFormData with only the fields that were extracted.
 */
export function extractFieldsFromResponse(response: ChatResponse): Partial<DocumentFormData> {
  const fields: Partial<DocumentFormData> = {};

  // All extractable scalar fields across document types
  const scalarFields = [
    // Common
    'purpose', 'effectiveDate', 'governingLaw', 'jurisdiction',
    // NDA
    'mndaTermType', 'mndaTermYears', 'confidentialityTermType', 'confidentialityTermYears', 'modifications',
    // Cloud Service
    'providerName', 'customerName', 'subscriptionPeriod', 'technicalSupport', 'fees', 'paymentTerms',
    // Pilot
    'pilotPeriod', 'evaluationPurpose', 'generalCapAmount',
    // Design Partner
    'programName', 'feedbackRequirements', 'accessPeriod',
    // SLA
    'uptimeTarget', 'responseTimeCommitment', 'serviceCredits',
    // Professional Services
    'deliverables', 'projectTimeline', 'paymentSchedule', 'ipOwnership',
    // Partnership
    'partnershipScope', 'trademarkRights', 'revenueShare',
    // Software License
    'licensedSoftware', 'licenseType', 'licenseFees', 'supportTerms',
    // DPA
    'dataSubjects', 'processingPurpose', 'dataCategories', 'subprocessors',
    // BAA
    'phiDescription', 'permittedUses', 'safeguards',
    // AI Addendum
    'aiFeatures', 'trainingDataRights', 'outputOwnership',
  ];

  // Extract all non-null scalar fields
  scalarFields.forEach(field => {
    const value = (response as unknown as Record<string, unknown>)[field];
    if (value != null) {
      (fields as unknown as Record<string, unknown>)[field] = value;
    }
  });

  // Extract party info
  if (response.party1) {
    fields.party1 = {
      name: response.party1.name ?? '',
      title: response.party1.title ?? '',
      company: response.party1.company ?? '',
      noticeAddress: response.party1.noticeAddress ?? '',
      date: response.party1.date ?? '',
    };
  }

  if (response.party2) {
    fields.party2 = {
      name: response.party2.name ?? '',
      title: response.party2.title ?? '',
      company: response.party2.company ?? '',
      noticeAddress: response.party2.noticeAddress ?? '',
      date: response.party2.date ?? '',
    };
  }

  return fields;
}

/**
 * Parse documentType string from API response to DocumentType enum.
 */
export function parseDocumentType(docTypeStr: string | undefined): DocumentType | null {
  if (!docTypeStr) return null;
  const normalized = docTypeStr.toLowerCase().replace(/-/g, '_');
  return Object.values(DocumentType).find(dt => dt === normalized) ?? null;
}
