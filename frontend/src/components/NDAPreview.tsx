'use client';

import { NDAFormData } from '@/types/nda';

interface NDAPreviewProps {
  formData: NDAFormData;
}

function formatDate(dateString: string): string {
  if (!dateString) return '___________';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function Placeholder({ value, fallback = '___________' }: { value: string; fallback?: string }) {
  return value ? (
    <span className="text-slate-900 font-medium">{value}</span>
  ) : (
    <span className="text-slate-400 italic">{fallback}</span>
  );
}

export function NDAPreview({ formData }: NDAPreviewProps) {
  const mndaTerm =
    formData.mndaTermType === 'expires'
      ? `Expires ${formData.mndaTermYears} year(s) from Effective Date.`
      : 'Continues until terminated in accordance with the terms of the MNDA.';

  const confidentialityTerm =
    formData.confidentialityTermType === 'years'
      ? `${formData.confidentialityTermYears} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : 'In perpetuity.';

  return (
    <div className="prose prose-slate prose-sm max-w-none">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Mutual Non-Disclosure Agreement</h1>
        <p className="text-sm text-slate-500">
          Common Paper Mutual NDA Standard Terms Version 1.0
        </p>
      </div>

      {/* Cover Page Terms */}
      <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 mt-0">Cover Page</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Purpose</h3>
            <p className="text-slate-700 mt-0 mb-0">
              <Placeholder value={formData.purpose} fallback="[How Confidential Information may be used]" />
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Effective Date</h3>
            <p className="text-slate-700 mt-0 mb-0">{formatDate(formData.effectiveDate)}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">MNDA Term</h3>
            <p className="text-slate-700 mt-0 mb-0">{mndaTerm}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Term of Confidentiality</h3>
            <p className="text-slate-700 mt-0 mb-0">{confidentialityTerm}</p>
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

          {formData.modifications && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 mt-0">Modifications</h3>
              <p className="text-slate-700 mt-0 mb-0">{formData.modifications}</p>
            </div>
          )}
        </div>
      </div>

      {/* Signature Block */}
      <div className="mb-8">
        <p className="text-slate-700 italic mb-6">
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
        </p>

        <div className="grid grid-cols-2 gap-8">
          {/* Party 1 */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4 mt-0">Party 1</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Company</p>
                <p className="text-slate-800 font-medium">
                  <Placeholder value={formData.party1.company} />
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Signature</p>
                <div className="border-b border-slate-300 h-8"></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Print Name</p>
                <p className="text-slate-800">
                  <Placeholder value={formData.party1.name} />
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Title</p>
                <p className="text-slate-800">
                  <Placeholder value={formData.party1.title} />
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Notice Address</p>
                <p className="text-slate-800">
                  <Placeholder value={formData.party1.noticeAddress} />
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Date</p>
                <p className="text-slate-800">{formatDate(formData.party1.date)}</p>
              </div>
            </div>
          </div>

          {/* Party 2 */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4 mt-0">Party 2</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Company</p>
                <p className="text-slate-800 font-medium">
                  <Placeholder value={formData.party2.company} />
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Signature</p>
                <div className="border-b border-slate-300 h-8"></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Print Name</p>
                <p className="text-slate-800">
                  <Placeholder value={formData.party2.name} />
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Title</p>
                <p className="text-slate-800">
                  <Placeholder value={formData.party2.title} />
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Notice Address</p>
                <p className="text-slate-800">
                  <Placeholder value={formData.party2.noticeAddress} />
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Date</p>
                <p className="text-slate-800">{formatDate(formData.party2.date)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Terms */}
      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Standard Terms</h2>

        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-800">1. Introduction.</p>
            <p>
              This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page) (&ldquo;MNDA&rdquo;)
              allows each party (&ldquo;Disclosing Party&rdquo;) to disclose or make available information in connection with the
              Purpose which (1) the Disclosing Party identifies to the receiving party (&ldquo;Receiving Party&rdquo;) as
              &ldquo;confidential&rdquo;, &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood as confidential
              or proprietary due to its nature and the circumstances of its disclosure (&ldquo;Confidential Information&rdquo;).
              Each party&apos;s Confidential Information also includes the existence and status of the parties&apos; discussions and
              information on the Cover Page.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">2. Use and Protection of Confidential Information.</p>
            <p>
              The Receiving Party shall: (a) use Confidential Information solely for the Purpose; (b) not disclose
              Confidential Information to third parties without the Disclosing Party&apos;s prior written approval, except
              that the Receiving Party may disclose Confidential Information to its employees, agents, advisors,
              contractors and other representatives having a reasonable need to know for the Purpose, provided these
              representatives are bound by confidentiality obligations no less protective of the Disclosing Party than
              the applicable terms in this MNDA; and (c) protect Confidential Information using at least the same
              protections the Receiving Party uses for its own similar information but no less than a reasonable
              standard of care.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">3. Exceptions.</p>
            <p>
              The Receiving Party&apos;s obligations in this MNDA do not apply to information that it can demonstrate:
              (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew
              or possessed prior to receipt from the Disclosing Party without confidentiality restrictions;
              (c) it rightfully obtained from a third party without confidentiality restrictions; or
              (d) it independently developed without using or referencing the Confidential Information.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">4. Disclosures Required by Law.</p>
            <p>
              The Receiving Party may disclose Confidential Information to the extent required by law, regulation or
              regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides
              the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates,
              at the Disclosing Party&apos;s expense, with the Disclosing Party&apos;s efforts to obtain confidential treatment
              for the Confidential Information.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">5. Term and Termination.</p>
            <p>
              This MNDA commences on the Effective Date and expires at the end of the MNDA Term. Either party may
              terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party&apos;s
              obligations relating to Confidential Information will survive for the Term of Confidentiality, despite
              any expiration or termination of this MNDA.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">6. Return or Destruction of Confidential Information.</p>
            <p>
              Upon expiration or termination of this MNDA or upon the Disclosing Party&apos;s earlier request, the
              Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing
              Party&apos;s written request, destroy all Confidential Information in the Receiving Party&apos;s possession
              or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party,
              confirm its compliance with these obligations in writing.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">7. Proprietary Rights.</p>
            <p>
              The Disclosing Party retains all of its intellectual property and other rights in its Confidential
              Information and its disclosure to the Receiving Party grants no license under such rights.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">8. Disclaimer.</p>
            <p>
              ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT WARRANTIES,
              INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">9. Governing Law and Jurisdiction.</p>
            <p>
              This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws
              of the State of <Placeholder value={formData.governingLaw} fallback="[Governing Law]" />, without regard
              to the conflict of laws provisions of such State. Any legal suit, action, or proceeding relating to this
              MNDA must be instituted in the federal or state courts located in{' '}
              <Placeholder value={formData.jurisdiction} fallback="[Jurisdiction]" />. Each party irrevocably submits
              to the exclusive jurisdiction of such courts.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">10. Equitable Relief.</p>
            <p>
              A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy.
              Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief,
              including an injunction, in addition to its other remedies.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">11. General.</p>
            <p>
              Neither party has an obligation under this MNDA to disclose Confidential Information to the other or
              proceed with any proposed transaction. Neither party may assign this MNDA without the prior written
              consent of the other party, except that either party may assign this MNDA in connection with a merger,
              reorganization, acquisition or other transfer of all or substantially all its assets or voting securities.
              This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its
              subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations,
              and warranties, whether written or oral, regarding such subject matter.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500">
          <p>
            Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" className="text-blue-600 hover:underline">
              CC BY 4.0
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
