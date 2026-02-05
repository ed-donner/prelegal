'use client';

import { DocumentType, DocumentFormData, DOCUMENT_NAMES } from '@/types/documents';
import { formatDate } from '@/utils/nda';
import { getFieldConfig } from '@/utils/documentConfig';

interface GenericPreviewProps {
  documentType: DocumentType;
  formData: DocumentFormData;
}

function Placeholder({ value, fallback = '___________' }: { value: string; fallback?: string }) {
  return value ? (
    <span className="text-slate-900 font-medium">{value}</span>
  ) : (
    <span className="text-slate-400 italic">{fallback}</span>
  );
}

function SignatureBlock({ party, label }: { party: { name: string; title: string; company: string; noticeAddress: string; date: string }; label: string }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4 mt-0">
        {label}
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">Company</p>
          <p className="text-slate-800 font-medium">
            <Placeholder value={party.company} />
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Signature</p>
          <div className="border-b border-slate-300 h-8"></div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Print Name</p>
          <p className="text-slate-800">
            <Placeholder value={party.name} />
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Title</p>
          <p className="text-slate-800">
            <Placeholder value={party.title} />
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Notice Address</p>
          <p className="text-slate-800">
            <Placeholder value={party.noticeAddress} />
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Date</p>
          <p className="text-slate-800">{formatDate(party.date)}</p>
        </div>
      </div>
    </div>
  );
}


export function GenericPreview({ documentType, formData }: GenericPreviewProps) {
  const config = getFieldConfig(documentType);
  const documentName = DOCUMENT_NAMES[documentType];

  return (
    <div className="prose prose-slate prose-sm max-w-none">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{documentName}</h1>
        <p className="text-sm text-slate-500">
          Common Paper {documentName} Standard Terms
        </p>
      </div>

      {/* Order Form / Cover Page */}
      <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 mt-0">Agreement Details</h2>

        <div className="space-y-4">
          {/* Common fields */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Purpose</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.purpose} fallback="[Purpose of agreement]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Effective Date</h3>
            <p className="text-slate-700 mt-0 mb-0">{formatDate(formData.effectiveDate)}</p>
          </div>

          {/* Document-specific fields */}
          {config.fields.map(field => {
            const value = (formData as unknown as Record<string, unknown>)[field.key] as string || '';
            return (
              <div key={field.key}>
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">{field.label}</h3>
                <p className="text-slate-700 mt-0 mb-0">
                  <Placeholder value={value} fallback={`[${field.label}]`} />
                </p>
              </div>
            );
          })}

          {/* Governing Law */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Governing Law & Jurisdiction</h3>
            <p className="text-slate-700 mt-0 mb-0">
              Governing Law: <Placeholder value={formData.governingLaw} fallback="[State]" />
            </p>
            <p className="text-slate-700 mt-1 mb-0">
              Jurisdiction: <Placeholder value={formData.jurisdiction} fallback="[City/County, State]" />
            </p>
          </div>
        </div>
      </div>

      {/* Signature Block */}
      <div className="mb-8">
        <p className="text-slate-700 italic mb-6">
          By signing below, each party agrees to enter into this {documentName} as of the Effective Date.
        </p>

        <div className="grid grid-cols-2 gap-8">
          <SignatureBlock party={formData.party1} label={config.party1Label} />
          <SignatureBlock party={formData.party2} label={config.party2Label} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-4">
        <div className="text-xs text-slate-500">
          <p>
            Common Paper {documentName} free to use under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" className="text-blue-600 hover:underline">
              CC BY 4.0
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
