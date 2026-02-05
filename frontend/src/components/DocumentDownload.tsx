'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES, MutualNDAData, PilotData, CloudServiceData } from '@/types/documents';
import { NDAPdf } from './NDAPdf';
import { PilotPdf } from './PilotPdf';
import { CloudServicePdf } from './CloudServicePdf';
import { GenericPdf } from './GenericPdf';
import { NDAFormData } from '@/types/nda';

interface DocumentDownloadProps {
  documentType: DocumentType;
  formData: DocumentFormData;
}

function sanitizeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9-]/g, '_').substring(0, 50);
}

function generateFilename(documentType: DocumentType, formData: DocumentFormData): string {
  const docName = DOCUMENT_NAMES[documentType].replace(/\s+/g, '-');
  const party1Name = sanitizeFilename(formData.party1.company || 'Party1');
  const party2Name = sanitizeFilename(formData.party2.company || 'Party2');
  const date = formData.effectiveDate || new Date().toISOString().split('T')[0];
  return `${docName}_${party1Name}_${party2Name}_${date}.pdf`;
}

export function DocumentDownload({ documentType, formData }: DocumentDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);

    let url: string | null = null;

    try {
      let pdfComponent;

      switch (documentType) {
        case DocumentType.MUTUAL_NDA:
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
          pdfComponent = <NDAPdf formData={ndaFormData} />;
          break;
        case DocumentType.PILOT:
          pdfComponent = <PilotPdf formData={formData as PilotData} />;
          break;
        case DocumentType.CLOUD_SERVICE:
          pdfComponent = <CloudServicePdf formData={formData as CloudServiceData} />;
          break;
        default:
          pdfComponent = <GenericPdf documentType={documentType} formData={formData} />;
          break;
      }

      const blob = await pdf(pdfComponent).toBlob();
      url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = generateFilename(documentType, formData);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      if (url) {
        URL.revokeObjectURL(url);
      }
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        aria-busy={isGenerating}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
