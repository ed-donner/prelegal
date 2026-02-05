'use client';

import { DocumentType, DocumentFormData, DOCUMENT_NAMES, MutualNDAData, PilotData, CloudServiceData, DesignPartnerData, SLAData, ProfessionalServicesData, PartnershipData, SoftwareLicenseData, DPAData, BAAData, AIAddendumData } from '@/types/documents';
import { NDAPreview } from './NDAPreview';
import { PilotPreview } from './PilotPreview';
import { CloudServicePreview } from './CloudServicePreview';
import { GenericPreview } from './GenericPreview';

interface DocumentPreviewProps {
  documentType: DocumentType | null;
  formData: DocumentFormData;
}

export function DocumentPreview({ documentType, formData }: DocumentPreviewProps) {
  // Initial state - no document type detected yet
  if (!documentType) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 mb-4 text-slate-300">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-500 mb-2">Tell me what document you need</p>
        <p className="text-sm text-slate-400">The preview will appear as we gather information</p>
      </div>
    );
  }

  // Route to the appropriate preview component
  switch (documentType) {
    case DocumentType.MUTUAL_NDA:
      return <NDAPreview formData={formData as MutualNDAData} />;

    case DocumentType.PILOT:
      return <PilotPreview formData={formData as PilotData} />;

    case DocumentType.CLOUD_SERVICE:
      return <CloudServicePreview formData={formData as CloudServiceData} />;

    // For documents without specific preview components, use the generic preview
    case DocumentType.DESIGN_PARTNER:
    case DocumentType.SLA:
    case DocumentType.PROFESSIONAL_SERVICES:
    case DocumentType.PARTNERSHIP:
    case DocumentType.SOFTWARE_LICENSE:
    case DocumentType.DPA:
    case DocumentType.BAA:
    case DocumentType.AI_ADDENDUM:
      return <GenericPreview documentType={documentType} formData={formData} />;

    default:
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-slate-500">Preview not available for this document type</p>
        </div>
      );
  }
}
