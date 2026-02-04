'use client';

import { NDAFormData, PartyInfo } from '@/types/nda';

interface NDAFormProps {
  formData: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3 pb-2 border-b border-slate-200">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

function PartyFields({
  party,
  partyNumber,
  onChange,
}: {
  party: PartyInfo;
  partyNumber: 1 | 2;
  onChange: (party: PartyInfo) => void;
}) {
  const updateField = (field: keyof PartyInfo, value: string) => {
    onChange({ ...party, [field]: value });
  };

  return (
    <FormSection title={`Party ${partyNumber}`}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Company Name">
          <input
            type="text"
            value={party.company}
            onChange={(e) => updateField('company', e.target.value)}
            className="input-field"
            placeholder="Acme Inc."
          />
        </FormField>
        <FormField label="Signatory Name">
          <input
            type="text"
            value={party.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="input-field"
            placeholder="John Smith"
          />
        </FormField>
      </div>
      <FormField label="Title">
        <input
          type="text"
          value={party.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="input-field"
          placeholder="Chief Executive Officer"
        />
      </FormField>
      <FormField label="Notice Address" hint="Email or postal address for legal notices">
        <input
          type="text"
          value={party.noticeAddress}
          onChange={(e) => updateField('noticeAddress', e.target.value)}
          className="input-field"
          placeholder="legal@company.com"
        />
      </FormField>
      <FormField label="Signature Date">
        <input
          type="date"
          value={party.date}
          onChange={(e) => updateField('date', e.target.value)}
          className="input-field"
        />
      </FormField>
    </FormSection>
  );
}

export function NDAForm({ formData, onChange }: NDAFormProps) {
  const updateField = <K extends keyof NDAFormData>(field: K, value: NDAFormData[K]) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-2">
      <FormSection title="Agreement Details">
        <FormField label="Purpose" hint="How Confidential Information may be used">
          <textarea
            value={formData.purpose}
            onChange={(e) => updateField('purpose', e.target.value)}
            className="input-field min-h-[80px] resize-none"
            rows={2}
          />
        </FormField>

        <FormField label="Effective Date">
          <input
            type="date"
            value={formData.effectiveDate}
            onChange={(e) => updateField('effectiveDate', e.target.value)}
            className="input-field"
          />
        </FormField>

        <FormField label="MNDA Term">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.mndaTermType === 'expires'}
                onChange={() => updateField('mndaTermType', 'expires')}
                className="text-blue-600"
              />
              <span className="text-sm text-slate-700">
                Expires{' '}
                <input
                  type="number"
                  min="1"
                  value={formData.mndaTermYears}
                  onChange={(e) => updateField('mndaTermYears', parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border border-slate-300 rounded text-center mx-1"
                  disabled={formData.mndaTermType !== 'expires'}
                />{' '}
                year(s) from Effective Date
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.mndaTermType === 'continues'}
                onChange={() => updateField('mndaTermType', 'continues')}
                className="text-blue-600"
              />
              <span className="text-sm text-slate-700">Continues until terminated</span>
            </label>
          </div>
        </FormField>

        <FormField label="Term of Confidentiality" hint="How long Confidential Information is protected">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.confidentialityTermType === 'years'}
                onChange={() => updateField('confidentialityTermType', 'years')}
                className="text-blue-600"
              />
              <span className="text-sm text-slate-700">
                <input
                  type="number"
                  min="1"
                  value={formData.confidentialityTermYears}
                  onChange={(e) => updateField('confidentialityTermYears', parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border border-slate-300 rounded text-center mr-1"
                  disabled={formData.confidentialityTermType !== 'years'}
                />{' '}
                year(s) from Effective Date (trade secrets protected longer)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.confidentialityTermType === 'perpetuity'}
                onChange={() => updateField('confidentialityTermType', 'perpetuity')}
                className="text-blue-600"
              />
              <span className="text-sm text-slate-700">In perpetuity</span>
            </label>
          </div>
        </FormField>
      </FormSection>

      <FormSection title="Governing Law & Jurisdiction">
        <FormField label="Governing Law" hint="State whose laws will govern this agreement">
          <input
            type="text"
            value={formData.governingLaw}
            onChange={(e) => updateField('governingLaw', e.target.value)}
            className="input-field"
            placeholder="Delaware"
          />
        </FormField>
        <FormField label="Jurisdiction" hint="Where legal disputes will be resolved">
          <input
            type="text"
            value={formData.jurisdiction}
            onChange={(e) => updateField('jurisdiction', e.target.value)}
            className="input-field"
            placeholder="New Castle County, Delaware"
          />
        </FormField>
      </FormSection>

      <PartyFields
        party={formData.party1}
        partyNumber={1}
        onChange={(party) => updateField('party1', party)}
      />

      <PartyFields
        party={formData.party2}
        partyNumber={2}
        onChange={(party) => updateField('party2', party)}
      />

      <FormSection title="Modifications (Optional)">
        <FormField label="Additional Terms" hint="Any modifications to the standard MNDA terms">
          <textarea
            value={formData.modifications}
            onChange={(e) => updateField('modifications', e.target.value)}
            className="input-field min-h-[60px] resize-none"
            rows={2}
            placeholder="None"
          />
        </FormField>
      </FormSection>
    </div>
  );
}
