import { NDAFormData } from './nda';

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
  purpose?: string;
  effectiveDate?: string;
  mndaTermType?: 'expires' | 'continues';
  mndaTermYears?: number;
  confidentialityTermType?: 'years' | 'perpetuity';
  confidentialityTermYears?: number;
  governingLaw?: string;
  jurisdiction?: string;
  modifications?: string;
  party1?: PartyInfoExtraction;
  party2?: PartyInfoExtraction;
  isComplete: boolean;
}

/**
 * Extract NDA form fields from a chat response.
 * Returns a partial NDAFormData with only the fields that were extracted.
 */
export function extractFieldsFromResponse(response: ChatResponse): Partial<NDAFormData> {
  const fields: Partial<NDAFormData> = {};

  // Extract scalar fields (use != null to check both undefined and null)
  if (response.purpose != null) fields.purpose = response.purpose;
  if (response.effectiveDate != null) fields.effectiveDate = response.effectiveDate;
  if (response.mndaTermType != null) fields.mndaTermType = response.mndaTermType;
  if (response.mndaTermYears != null) fields.mndaTermYears = response.mndaTermYears;
  if (response.confidentialityTermType != null) fields.confidentialityTermType = response.confidentialityTermType;
  if (response.confidentialityTermYears != null) fields.confidentialityTermYears = response.confidentialityTermYears;
  if (response.governingLaw != null) fields.governingLaw = response.governingLaw;
  if (response.jurisdiction != null) fields.jurisdiction = response.jurisdiction;
  if (response.modifications != null) fields.modifications = response.modifications;

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
