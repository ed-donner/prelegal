'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { DocumentPreview } from '@/components/DocumentPreview';
import { DocumentDownload } from '@/components/DocumentDownload';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES, getDefaultFormData, MutualNDAData } from '@/types/documents';

export default function Home() {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [formData, setFormData] = useState<DocumentFormData>(getDefaultFormData(DocumentType.MUTUAL_NDA));
  const [isComplete, setIsComplete] = useState(false);

  const handleDocumentTypeDetected = (type: DocumentType) => {
    setDocumentType(type);
    // Initialize with default form data for the new document type
    setFormData(getDefaultFormData(type));
  };

  const handleFieldsExtracted = (fields: Partial<DocumentFormData>) => {
    setFormData(prev => {
      // Spread top-level fields, excluding party fields (handled separately)
      const { party1: newParty1, party2: newParty2, ...scalarFields } = fields;

      return {
        ...prev,
        ...scalarFields,
        // Merge party fields, filtering out empty strings to preserve existing values
        party1: newParty1 ? mergeParty(prev.party1, newParty1) : prev.party1,
        party2: newParty2 ? mergeParty(prev.party2, newParty2) : prev.party2,
      } as DocumentFormData;
    });
  };

  // Merge party info, only updating non-empty values
  function mergeParty(existing: DocumentFormData['party1'], updates: DocumentFormData['party1']) {
    return {
      name: updates.name !== '' ? updates.name : existing.name,
      title: updates.title !== '' ? updates.title : existing.title,
      company: updates.company !== '' ? updates.company : existing.company,
      noticeAddress: updates.noticeAddress !== '' ? updates.noticeAddress : existing.noticeAddress,
      date: updates.date !== '' ? updates.date : existing.date,
    };
  }

  // Get dynamic page title based on document type
  const pageTitle = documentType
    ? `${DOCUMENT_NAMES[documentType]} Creator`
    : 'Legal Document Creator';

  const pageSubtitle = documentType
    ? `Create a professional ${DOCUMENT_NAMES[documentType]} with AI assistance`
    : 'Create professional legal documents with AI assistance';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>
              <p className="text-sm text-slate-500">{pageSubtitle}</p>
            </div>
            {documentType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {DOCUMENT_NAMES[documentType]}
              </span>
            )}
          </div>
          {isComplete && documentType && <DocumentDownload documentType={documentType} formData={formData} />}
        </div>
      </header>

      {/* Main Content - Side by Side */}
      <main className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">AI Assistant</h2>
              <p className="text-sm text-slate-500">
                {documentType
                  ? `Creating your ${DOCUMENT_NAMES[documentType]}`
                  : 'Tell me what document you need'}
              </p>
            </div>
            <div className="p-6 h-[calc(100vh-220px)]">
              <ChatInterface
                formData={formData}
                onDocumentTypeDetected={handleDocumentTypeDetected}
                onFieldsExtracted={handleFieldsExtracted}
                onComplete={() => setIsComplete(true)}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Document Preview</h2>
                <p className="text-sm text-slate-500">Live preview updates as you chat</p>
              </div>
              {isComplete && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Ready to download
                </span>
              )}
            </div>
            <div className="p-6 max-h-[calc(100vh-220px)] overflow-y-auto">
              <DocumentPreview documentType={documentType} formData={formData} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center text-sm text-slate-500">
          Based on{' '}
          <a
            href="https://commonpaper.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Common Paper
          </a>{' '}
          Standard Terms, licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            CC BY 4.0
          </a>
        </div>
      </footer>
    </div>
  );
}
