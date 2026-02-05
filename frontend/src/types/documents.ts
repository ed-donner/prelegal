/**
 * Document type definitions and registry for multi-document support.
 */

export enum DocumentType {
  MUTUAL_NDA = 'mutual_nda',
  CLOUD_SERVICE = 'cloud_service',
  PILOT = 'pilot',
  DESIGN_PARTNER = 'design_partner',
  SLA = 'sla',
  PROFESSIONAL_SERVICES = 'professional_services',
  PARTNERSHIP = 'partnership',
  SOFTWARE_LICENSE = 'software_license',
  DPA = 'dpa',
  BAA = 'baa',
  AI_ADDENDUM = 'ai_addendum',
}

export const DOCUMENT_NAMES: Record<DocumentType, string> = {
  [DocumentType.MUTUAL_NDA]: 'Mutual NDA',
  [DocumentType.CLOUD_SERVICE]: 'Cloud Service Agreement',
  [DocumentType.PILOT]: 'Pilot Agreement',
  [DocumentType.DESIGN_PARTNER]: 'Design Partner Agreement',
  [DocumentType.SLA]: 'Service Level Agreement',
  [DocumentType.PROFESSIONAL_SERVICES]: 'Professional Services Agreement',
  [DocumentType.PARTNERSHIP]: 'Partnership Agreement',
  [DocumentType.SOFTWARE_LICENSE]: 'Software License Agreement',
  [DocumentType.DPA]: 'Data Processing Agreement',
  [DocumentType.BAA]: 'Business Associate Agreement',
  [DocumentType.AI_ADDENDUM]: 'AI Addendum',
};

export interface PartyInfo {
  name: string;
  title: string;
  company: string;
  noticeAddress: string;
  date: string;
}

export const defaultPartyInfo: PartyInfo = {
  name: '',
  title: '',
  company: '',
  noticeAddress: '',
  date: '',
};

// Base interface shared by all documents
export interface BaseDocumentData {
  documentType?: DocumentType;
  purpose: string;
  effectiveDate: string;
  governingLaw: string;
  jurisdiction: string;
  party1: PartyInfo;
  party2: PartyInfo;
}

// Mutual NDA
export interface MutualNDAData extends BaseDocumentData {
  documentType: DocumentType.MUTUAL_NDA;
  mndaTermType: 'expires' | 'continues';
  mndaTermYears: number;
  confidentialityTermType: 'years' | 'perpetuity';
  confidentialityTermYears: number;
  modifications: string;
}

// Cloud Service Agreement
export interface CloudServiceData extends BaseDocumentData {
  documentType: DocumentType.CLOUD_SERVICE;
  providerName: string;
  customerName: string;
  subscriptionPeriod: string;
  technicalSupport: string;
  fees: string;
  paymentTerms: string;
}

// Pilot Agreement
export interface PilotData extends BaseDocumentData {
  documentType: DocumentType.PILOT;
  providerName: string;
  customerName: string;
  pilotPeriod: string;
  evaluationPurpose: string;
  generalCapAmount: string;
}

// Design Partner Agreement
export interface DesignPartnerData extends BaseDocumentData {
  documentType: DocumentType.DESIGN_PARTNER;
  providerName: string;
  customerName: string;
  programName: string;
  feedbackRequirements: string;
  accessPeriod: string;
}

// Service Level Agreement
export interface SLAData extends BaseDocumentData {
  documentType: DocumentType.SLA;
  providerName: string;
  customerName: string;
  uptimeTarget: string;
  responseTimeCommitment: string;
  serviceCredits: string;
}

// Professional Services Agreement
export interface ProfessionalServicesData extends BaseDocumentData {
  documentType: DocumentType.PROFESSIONAL_SERVICES;
  providerName: string;
  customerName: string;
  deliverables: string;
  projectTimeline: string;
  fees: string;
  paymentSchedule: string;
  ipOwnership: string;
}

// Partnership Agreement
export interface PartnershipData extends BaseDocumentData {
  documentType: DocumentType.PARTNERSHIP;
  partnershipScope: string;
  trademarkRights: string;
  revenueShare: string;
  fees: string;
}

// Software License Agreement
export interface SoftwareLicenseData extends BaseDocumentData {
  documentType: DocumentType.SOFTWARE_LICENSE;
  providerName: string;
  customerName: string;
  licensedSoftware: string;
  licenseType: string;
  licenseFees: string;
  supportTerms: string;
}

// Data Processing Agreement
export interface DPAData extends BaseDocumentData {
  documentType: DocumentType.DPA;
  providerName: string;
  customerName: string;
  dataSubjects: string;
  processingPurpose: string;
  dataCategories: string;
  subprocessors: string;
}

// Business Associate Agreement
export interface BAAData extends BaseDocumentData {
  documentType: DocumentType.BAA;
  providerName: string;
  customerName: string;
  phiDescription: string;
  permittedUses: string;
  safeguards: string;
}

// AI Addendum
export interface AIAddendumData extends BaseDocumentData {
  documentType: DocumentType.AI_ADDENDUM;
  providerName: string;
  customerName: string;
  aiFeatures: string;
  trainingDataRights: string;
  outputOwnership: string;
}

// Union type for all document data
export type DocumentFormData =
  | MutualNDAData
  | CloudServiceData
  | PilotData
  | DesignPartnerData
  | SLAData
  | ProfessionalServicesData
  | PartnershipData
  | SoftwareLicenseData
  | DPAData
  | BAAData
  | AIAddendumData;

// Default form data for each document type
export function getDefaultFormData(documentType: DocumentType): DocumentFormData {
  const today = new Date().toISOString().split('T')[0];
  const base = {
    purpose: '',
    effectiveDate: today,
    governingLaw: '',
    jurisdiction: '',
    party1: { ...defaultPartyInfo },
    party2: { ...defaultPartyInfo },
  };

  switch (documentType) {
    case DocumentType.MUTUAL_NDA:
      return {
        ...base,
        documentType: DocumentType.MUTUAL_NDA,
        mndaTermType: 'expires',
        mndaTermYears: 1,
        confidentialityTermType: 'years',
        confidentialityTermYears: 1,
        modifications: '',
      };
    case DocumentType.CLOUD_SERVICE:
      return {
        ...base,
        documentType: DocumentType.CLOUD_SERVICE,
        providerName: '',
        customerName: '',
        subscriptionPeriod: '1 year',
        technicalSupport: '',
        fees: '',
        paymentTerms: '',
      };
    case DocumentType.PILOT:
      return {
        ...base,
        documentType: DocumentType.PILOT,
        providerName: '',
        customerName: '',
        pilotPeriod: '90 days',
        evaluationPurpose: '',
        generalCapAmount: '$0',
      };
    case DocumentType.DESIGN_PARTNER:
      return {
        ...base,
        documentType: DocumentType.DESIGN_PARTNER,
        providerName: '',
        customerName: '',
        programName: '',
        feedbackRequirements: '',
        accessPeriod: '',
      };
    case DocumentType.SLA:
      return {
        ...base,
        documentType: DocumentType.SLA,
        providerName: '',
        customerName: '',
        uptimeTarget: '99.9%',
        responseTimeCommitment: '',
        serviceCredits: '',
      };
    case DocumentType.PROFESSIONAL_SERVICES:
      return {
        ...base,
        documentType: DocumentType.PROFESSIONAL_SERVICES,
        providerName: '',
        customerName: '',
        deliverables: '',
        projectTimeline: '',
        fees: '',
        paymentSchedule: '',
        ipOwnership: '',
      };
    case DocumentType.PARTNERSHIP:
      return {
        ...base,
        documentType: DocumentType.PARTNERSHIP,
        partnershipScope: '',
        trademarkRights: '',
        revenueShare: '',
        fees: '',
      };
    case DocumentType.SOFTWARE_LICENSE:
      return {
        ...base,
        documentType: DocumentType.SOFTWARE_LICENSE,
        providerName: '',
        customerName: '',
        licensedSoftware: '',
        licenseType: '',
        licenseFees: '',
        supportTerms: '',
      };
    case DocumentType.DPA:
      return {
        ...base,
        documentType: DocumentType.DPA,
        providerName: '',
        customerName: '',
        dataSubjects: '',
        processingPurpose: '',
        dataCategories: '',
        subprocessors: '',
      };
    case DocumentType.BAA:
      return {
        ...base,
        documentType: DocumentType.BAA,
        providerName: '',
        customerName: '',
        phiDescription: '',
        permittedUses: '',
        safeguards: '',
      };
    case DocumentType.AI_ADDENDUM:
      return {
        ...base,
        documentType: DocumentType.AI_ADDENDUM,
        providerName: '',
        customerName: '',
        aiFeatures: '',
        trainingDataRights: '',
        outputOwnership: '',
      };
    default:
      // Default to NDA
      return {
        ...base,
        documentType: DocumentType.MUTUAL_NDA,
        mndaTermType: 'expires',
        mndaTermYears: 1,
        confidentialityTermType: 'years',
        confidentialityTermYears: 1,
        modifications: '',
      };
  }
}
