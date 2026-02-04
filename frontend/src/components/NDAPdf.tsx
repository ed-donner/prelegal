'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { NDAFormData } from '@/types/nda';
import { formatDate, getMndaTermText, getConfidentialityTermText, placeholder } from '@/utils/nda';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 9,
    color: '#666',
  },
  coverPage: {
    backgroundColor: '#f8fafc',
    padding: 15,
    marginBottom: 20,
    borderRadius: 4,
  },
  coverPageTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 3,
    marginTop: 8,
  },
  text: {
    fontSize: 10,
    color: '#334155',
    marginBottom: 5,
  },
  signatureSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  signatureGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  signatureBox: {
    flex: 1,
    border: '1 solid #e2e8f0',
    padding: 12,
    borderRadius: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 2,
  },
  signatureValue: {
    fontSize: 10,
    color: '#1e293b',
    marginBottom: 8,
  },
  signatureLine: {
    borderBottom: '1 solid #cbd5e1',
    height: 20,
    marginBottom: 8,
  },
  termsTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
    marginBottom: 10,
    borderTop: '1 solid #e2e8f0',
    paddingTop: 15,
  },
  termSection: {
    marginBottom: 10,
  },
  termTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginBottom: 3,
  },
  termText: {
    fontSize: 9,
    color: '#475569',
    textAlign: 'justify',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1 solid #e2e8f0',
    fontSize: 8,
    color: '#64748b',
  },
  italic: {
    fontStyle: 'italic',
  },
});

interface PartySignatureProps {
  party: NDAFormData['party1'];
  partyNumber: 1 | 2;
}

function PartySignature({ party, partyNumber }: PartySignatureProps) {
  return (
    <View style={styles.signatureBox}>
      <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Party {partyNumber}</Text>

      <Text style={styles.signatureLabel}>Company</Text>
      <Text style={styles.signatureValue}>{placeholder(party.company)}</Text>

      <Text style={styles.signatureLabel}>Signature</Text>
      <View style={styles.signatureLine} />

      <Text style={styles.signatureLabel}>Print Name</Text>
      <Text style={styles.signatureValue}>{placeholder(party.name)}</Text>

      <Text style={styles.signatureLabel}>Title</Text>
      <Text style={styles.signatureValue}>{placeholder(party.title)}</Text>

      <Text style={styles.signatureLabel}>Notice Address</Text>
      <Text style={styles.signatureValue}>{placeholder(party.noticeAddress)}</Text>

      <Text style={styles.signatureLabel}>Date</Text>
      <Text style={styles.signatureValue}>{formatDate(party.date)}</Text>
    </View>
  );
}

interface NDAPdfProps {
  formData: NDAFormData;
}

export function NDAPdf({ formData }: NDAPdfProps) {
  const mndaTerm = getMndaTermText(formData);
  const confidentialityTerm = getConfidentialityTermText(formData);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mutual Non-Disclosure Agreement</Text>
          <Text style={styles.subtitle}>Common Paper Mutual NDA Standard Terms Version 1.0</Text>
        </View>

        {/* Cover Page */}
        <View style={styles.coverPage}>
          <Text style={styles.coverPageTitle}>Cover Page</Text>

          <Text style={styles.sectionTitle}>Purpose</Text>
          <Text style={styles.text}>
            {placeholder(formData.purpose, '[How Confidential Information may be used]')}
          </Text>

          <Text style={styles.sectionTitle}>Effective Date</Text>
          <Text style={styles.text}>{formatDate(formData.effectiveDate)}</Text>

          <Text style={styles.sectionTitle}>MNDA Term</Text>
          <Text style={styles.text}>{mndaTerm}</Text>

          <Text style={styles.sectionTitle}>Term of Confidentiality</Text>
          <Text style={styles.text}>{confidentialityTerm}</Text>

          <Text style={styles.sectionTitle}>Governing Law & Jurisdiction</Text>
          <Text style={styles.text}>
            Governing Law: {placeholder(formData.governingLaw, '[State]')}
          </Text>
          <Text style={styles.text}>
            Jurisdiction: {placeholder(formData.jurisdiction, '[City/County, State]')}
          </Text>

          {formData.modifications && (
            <>
              <Text style={styles.sectionTitle}>Modifications</Text>
              <Text style={styles.text}>{formData.modifications}</Text>
            </>
          )}
        </View>

        {/* Signature Introduction */}
        <Text style={[styles.text, styles.italic]}>
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
        </Text>

        {/* Signature Blocks */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureGrid}>
            <PartySignature party={formData.party1} partyNumber={1} />
            <PartySignature party={formData.party2} partyNumber={2} />
          </View>
        </View>
      </Page>

      {/* Standard Terms Page */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.termsTitle, { marginTop: 0, borderTop: 'none', paddingTop: 0 }]}>
          Standard Terms
        </Text>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>1. Introduction.</Text>
          <Text style={styles.termText}>
            This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page) ("MNDA")
            allows each party ("Disclosing Party") to disclose or make available information in connection with the
            Purpose which (1) the Disclosing Party identifies to the receiving party ("Receiving Party") as
            "confidential", "proprietary", or the like or (2) should be reasonably understood as confidential
            or proprietary due to its nature and the circumstances of its disclosure ("Confidential Information").
            Each party's Confidential Information also includes the existence and status of the parties' discussions and
            information on the Cover Page.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>2. Use and Protection of Confidential Information.</Text>
          <Text style={styles.termText}>
            The Receiving Party shall: (a) use Confidential Information solely for the Purpose; (b) not disclose
            Confidential Information to third parties without the Disclosing Party's prior written approval, except
            that the Receiving Party may disclose Confidential Information to its employees, agents, advisors,
            contractors and other representatives having a reasonable need to know for the Purpose, provided these
            representatives are bound by confidentiality obligations no less protective of the Disclosing Party than
            the applicable terms in this MNDA; and (c) protect Confidential Information using at least the same
            protections the Receiving Party uses for its own similar information but no less than a reasonable
            standard of care.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>3. Exceptions.</Text>
          <Text style={styles.termText}>
            The Receiving Party's obligations in this MNDA do not apply to information that it can demonstrate:
            (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew
            or possessed prior to receipt from the Disclosing Party without confidentiality restrictions;
            (c) it rightfully obtained from a third party without confidentiality restrictions; or
            (d) it independently developed without using or referencing the Confidential Information.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>4. Disclosures Required by Law.</Text>
          <Text style={styles.termText}>
            The Receiving Party may disclose Confidential Information to the extent required by law, regulation or
            regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides
            the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates,
            at the Disclosing Party's expense, with the Disclosing Party's efforts to obtain confidential treatment
            for the Confidential Information.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>5. Term and Termination.</Text>
          <Text style={styles.termText}>
            This MNDA commences on the Effective Date and expires at the end of the MNDA Term. Either party may
            terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party's
            obligations relating to Confidential Information will survive for the Term of Confidentiality, despite
            any expiration or termination of this MNDA.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>6. Return or Destruction of Confidential Information.</Text>
          <Text style={styles.termText}>
            Upon expiration or termination of this MNDA or upon the Disclosing Party's earlier request, the
            Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing
            Party's written request, destroy all Confidential Information in the Receiving Party's possession
            or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party,
            confirm its compliance with these obligations in writing.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>7. Proprietary Rights.</Text>
          <Text style={styles.termText}>
            The Disclosing Party retains all of its intellectual property and other rights in its Confidential
            Information and its disclosure to the Receiving Party grants no license under such rights.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>8. Disclaimer.</Text>
          <Text style={styles.termText}>
            ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT WARRANTIES,
            INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>9. Governing Law and Jurisdiction.</Text>
          <Text style={styles.termText}>
            This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws
            of the State of {placeholder(formData.governingLaw, '[Governing Law]')}, without regard
            to the conflict of laws provisions of such State. Any legal suit, action, or proceeding relating to this
            MNDA must be instituted in the federal or state courts located in {placeholder(formData.jurisdiction, '[Jurisdiction]')}.
            Each party irrevocably submits to the exclusive jurisdiction of such courts.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>10. Equitable Relief.</Text>
          <Text style={styles.termText}>
            A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy.
            Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief,
            including an injunction, in addition to its other remedies.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>11. General.</Text>
          <Text style={styles.termText}>
            Neither party has an obligation under this MNDA to disclose Confidential Information to the other or
            proceed with any proposed transaction. Neither party may assign this MNDA without the prior written
            consent of the other party, except that either party may assign this MNDA in connection with a merger,
            reorganization, acquisition or other transfer of all or substantially all its assets or voting securities.
            This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its
            subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations,
            and warranties, whether written or oral, regarding such subject matter.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
