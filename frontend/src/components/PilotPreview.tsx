'use client';

import { PilotData } from '@/types/documents';
import { formatDate } from '@/utils/nda';

interface PilotPreviewProps {
  formData: PilotData;
}

function Placeholder({ value, fallback = '___________' }: { value: string; fallback?: string }) {
  return value ? (
    <span className="text-slate-900 font-medium">{value}</span>
  ) : (
    <span className="text-slate-400 italic">{fallback}</span>
  );
}

function SignatureBlock({ party, label }: { party: PilotData['party1']; label: string }) {
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

export function PilotPreview({ formData }: PilotPreviewProps) {
  return (
    <div className="prose prose-slate prose-sm max-w-none">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Pilot Agreement</h1>
        <p className="text-sm text-slate-500">
          Common Paper Pilot Agreement Standard Terms Version 1.1
        </p>
      </div>

      {/* Order Form / Cover Page */}
      <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 mt-0">Order Form</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Provider</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.providerName || formData.party1?.company} fallback="[Provider Company]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Customer</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.customerName || formData.party2?.company} fallback="[Customer Company]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Product / Purpose</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.purpose} fallback="[Product being piloted]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Effective Date</h3>
            <p className="text-slate-700 mt-0 mb-0">{formatDate(formData.effectiveDate)}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Pilot Period</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.pilotPeriod} fallback="[Duration of pilot]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Evaluation Purpose</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.evaluationPurpose} fallback="[What will be evaluated]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">General Cap Amount</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.generalCapAmount} fallback="[Liability cap]" />
            </p>
          </div>

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
          By signing this Order Form, each party agrees to enter into this Pilot Agreement as of the Effective Date.
        </p>

        <div className="grid grid-cols-2 gap-8">
          <SignatureBlock party={formData.party1} label="Provider" />
          <SignatureBlock party={formData.party2} label="Customer" />
        </div>
      </div>

      {/* Standard Terms Summary */}
      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Standard Terms Summary</h2>

        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-800">1. Pilot Access</p>
            <p>
              During the Pilot Period, Customer may access and use the Product solely for Customer&apos;s
              Evaluation Purposes. Provider grants Customer a limited, non-exclusive, non-sublicensable,
              non-transferable license to install and use included Software.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">2. Term & Termination</p>
            <p>
              The Agreement starts on the Effective Date and continues through the Pilot Period.
              Either party may terminate for material breach (with 30 days notice to cure) or
              for any reason with 30 days notice.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">3. Disclaimer of Warranties</p>
            <p>
              The Product is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis.
              Provider disclaims all warranties, including merchantability, fitness for a particular purpose,
              title, and non-infringement.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">4. Limitation of Liability</p>
            <p>
              Each party&apos;s total cumulative liability is limited to the General Cap Amount.
              Neither party is liable for lost profits or consequential damages.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">5. Confidentiality</p>
            <p>
              Each party will protect the other&apos;s Confidential Information and will not use or
              disclose it except as authorized by this Agreement.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500">
          <p>
            Common Paper Pilot Agreement (Version 1.1) free to use under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" className="text-blue-600 hover:underline">
              CC BY 4.0
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
