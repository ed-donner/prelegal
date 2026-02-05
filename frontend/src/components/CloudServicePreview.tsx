'use client';

import { CloudServiceData } from '@/types/documents';
import { formatDate } from '@/utils/nda';

interface CloudServicePreviewProps {
  formData: CloudServiceData;
}

function Placeholder({ value, fallback = '___________' }: { value: string; fallback?: string }) {
  return value ? (
    <span className="text-slate-900 font-medium">{value}</span>
  ) : (
    <span className="text-slate-400 italic">{fallback}</span>
  );
}

function SignatureBlock({ party, label }: { party: CloudServiceData['party1']; label: string }) {
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

export function CloudServicePreview({ formData }: CloudServicePreviewProps) {
  return (
    <div className="prose prose-slate prose-sm max-w-none">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Cloud Service Agreement</h1>
        <p className="text-sm text-slate-500">
          Common Paper Cloud Service Agreement Standard Terms
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
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Cloud Service Description</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.purpose} fallback="[Description of the cloud service]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Effective Date</h3>
            <p className="text-slate-700 mt-0 mb-0">{formatDate(formData.effectiveDate)}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Subscription Period</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.subscriptionPeriod} fallback="[Duration]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Technical Support</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.technicalSupport} fallback="[Support level description]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Fees</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.fees} fallback="[Pricing structure]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Payment Terms</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.paymentTerms} fallback="[Payment schedule]" />
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
          By signing this Order Form, each party agrees to enter into this Cloud Service Agreement as of the Effective Date.
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
            <p className="font-semibold text-slate-800">1. Service</p>
            <p>
              During the Subscription Period, Customer may access and use the Cloud Service and copy and use
              included Software and Documentation for internal business purposes. Provider will provide
              Technical Support as described in the Order Form.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">2. Restrictions & Obligations</p>
            <p>
              Customer will not reverse engineer, sublicense, or use the Product to develop a competing service.
              Provider may suspend access for material breach or non-payment.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">3. Privacy & Security</p>
            <p>
              Before submitting Personal Data governed by GDPR, Customer must enter into a data processing agreement.
              Customer will not submit Prohibited Data unless authorized.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">4. Payment & Taxes</p>
            <p>
              Customer will pay Fees according to the Payment Process. Fees are non-refundable except as
              specifically provided. Customer is responsible for applicable taxes.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">5. Term & Termination</p>
            <p>
              The Agreement continues through the Subscription Period and automatically renews unless
              one party gives notice of non-renewal. Either party may terminate for material breach.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">6. Representations & Warranties</p>
            <p>
              Each party represents it has legal authority to enter into this Agreement. Provider will not
              materially reduce the general functionality of the Cloud Service during the Subscription Period.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">7. Limitation of Liability</p>
            <p>
              Each party&apos;s total liability is capped as specified. Neither party is liable for lost profits
              or consequential damages except for breach of confidentiality.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">8. Confidentiality</p>
            <p>
              Each party will protect the other&apos;s Confidential Information using at least the same protections
              used for its own similar information.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500">
          <p>
            Common Paper Cloud Service Agreement free to use under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" className="text-blue-600 hover:underline">
              CC BY 4.0
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
