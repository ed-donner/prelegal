'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { DocumentType, DocumentFormData } from '@/types/documents';
import { buildPdfDocument, generateDocumentFilename } from '@/utils/documentPdf';

interface DocumentDownloadProps {
  documentType: DocumentType | null;
  formData: DocumentFormData;
  disabled?: boolean;
  disabledReason?: string;
  size?: 'sm' | 'md';
}

const SIZE_CLASSES = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
};

export function DocumentDownload({
  documentType,
  formData,
  disabled = false,
  disabledReason,
  size = 'md',
}: DocumentDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = disabled || !documentType || isGenerating;

  const handleDownload = async () => {
    if (!documentType) return;

    setIsGenerating(true);
    setError(null);

    let url: string | null = null;

    try {
      const blob = await pdf(buildPdfDocument(documentType, formData)).toBlob();
      url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = generateDocumentFilename(documentType, formData);
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
    <div className="relative flex flex-col items-end">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDisabled}
        aria-busy={isGenerating}
        title={isDisabled && !isGenerating ? disabledReason : undefined}
        className={`flex items-center justify-center gap-2 ${SIZE_CLASSES[size]} bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm`}
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
        <p className="absolute top-full mt-1 whitespace-nowrap text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
