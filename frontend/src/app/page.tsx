'use client';

import { useState } from 'react';
import { NDAForm } from '@/components/NDAForm';
import { NDAPreview } from '@/components/NDAPreview';
import { DownloadButton } from '@/components/DownloadButton';
import { NDAFormData, defaultFormData } from '@/types/nda';

export default function Home() {
  const [formData, setFormData] = useState<NDAFormData>(defaultFormData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Mutual NDA Creator</h1>
            <p className="text-sm text-slate-500">Create a professional NDA in minutes</p>
          </div>
          <DownloadButton formData={formData} />
        </div>
      </header>

      {/* Main Content - Side by Side */}
      <main className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Enter Agreement Details</h2>
              <p className="text-sm text-slate-500">Fill in the form to generate your NDA</p>
            </div>
            <div className="p-6 max-h-[calc(100vh-220px)] overflow-y-auto">
              <NDAForm formData={formData} onChange={setFormData} />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Document Preview</h2>
              <p className="text-sm text-slate-500">Live preview updates as you type</p>
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
