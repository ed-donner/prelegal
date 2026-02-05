'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { NDAPreview } from '@/components/NDAPreview';
import { DownloadButton } from '@/components/DownloadButton';
import { NDAFormData, defaultFormData } from '@/types/nda';

export default function Home() {
  const [formData, setFormData] = useState<NDAFormData>(defaultFormData);
  const [isComplete, setIsComplete] = useState(false);

  const handleFieldsExtracted = (fields: Partial<NDAFormData>) => {
    setFormData(prev => {
      // Spread top-level fields, excluding party fields (handled separately)
      const { party1: newParty1, party2: newParty2, ...scalarFields } = fields;

      return {
        ...prev,
        ...scalarFields,
        // Merge party fields, filtering out empty strings to preserve existing values
        party1: newParty1 ? mergeParty(prev.party1, newParty1) : prev.party1,
        party2: newParty2 ? mergeParty(prev.party2, newParty2) : prev.party2,
      };
    });
  };

  // Merge party info, only updating non-empty values
  function mergeParty(existing: NDAFormData['party1'], updates: NDAFormData['party1']) {
    return {
      name: updates.name || existing.name,
      title: updates.title || existing.title,
      company: updates.company || existing.company,
      noticeAddress: updates.noticeAddress || existing.noticeAddress,
      date: updates.date || existing.date,
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Mutual NDA Creator</h1>
            <p className="text-sm text-slate-500">Create a professional NDA with AI assistance</p>
          </div>
          {isComplete && <DownloadButton formData={formData} />}
        </div>
      </header>

      {/* Main Content - Side by Side */}
      <main className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">AI Assistant</h2>
              <p className="text-sm text-slate-500">Chat to create your NDA</p>
            </div>
            <div className="p-6 h-[calc(100vh-220px)]">
              <ChatInterface
                formData={formData}
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
              <NDAPreview formData={formData} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center text-sm text-slate-500">
          Based on the{' '}
          <a
            href="https://commonpaper.com/standards/mutual-nda/1.0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Common Paper Mutual NDA Standard Terms
          </a>{' '}
          (Version 1.0), licensed under{' '}
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
