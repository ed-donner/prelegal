'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PilotData } from '@/types/documents';
import { formatDate, placeholder } from '@/utils/nda';

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
  party: PilotData['party1'];
  label: string;
}

function PartySignature({ party, label }: PartySignatureProps) {
  return (
    <View style={styles.signatureBox}>
      <Text style={[styles.sectionTitle, { marginTop: 0 }]}>{label}</Text>

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

interface PilotPdfProps {
  formData: PilotData;
}

export function PilotPdf({ formData }: PilotPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pilot Agreement</Text>
          <Text style={styles.subtitle}>Common Paper Pilot Agreement Standard Terms Version 1.1</Text>
        </View>

        {/* Order Form */}
        <View style={styles.coverPage}>
          <Text style={styles.coverPageTitle}>Order Form</Text>

          <Text style={styles.sectionTitle}>Provider</Text>
          <Text style={styles.text}>
            {placeholder(formData.providerName || formData.party1?.company, '[Provider Company]')}
          </Text>

          <Text style={styles.sectionTitle}>Customer</Text>
          <Text style={styles.text}>
            {placeholder(formData.customerName || formData.party2?.company, '[Customer Company]')}
          </Text>

          <Text style={styles.sectionTitle}>Product / Purpose</Text>
          <Text style={styles.text}>
            {placeholder(formData.purpose, '[Product being piloted]')}
          </Text>

          <Text style={styles.sectionTitle}>Effective Date</Text>
          <Text style={styles.text}>{formatDate(formData.effectiveDate)}</Text>

          <Text style={styles.sectionTitle}>Pilot Period</Text>
          <Text style={styles.text}>
            {placeholder(formData.pilotPeriod, '[Duration of pilot]')}
          </Text>

          <Text style={styles.sectionTitle}>Evaluation Purpose</Text>
          <Text style={styles.text}>
            {placeholder(formData.evaluationPurpose, '[What will be evaluated]')}
          </Text>

          <Text style={styles.sectionTitle}>General Cap Amount</Text>
          <Text style={styles.text}>
            {placeholder(formData.generalCapAmount, '[Liability cap]')}
          </Text>

          <Text style={styles.sectionTitle}>Governing Law & Jurisdiction</Text>
          <Text style={styles.text}>
            Governing Law: {placeholder(formData.governingLaw, '[State]')}
          </Text>
          <Text style={styles.text}>
            Jurisdiction: {placeholder(formData.jurisdiction, '[City/County, State]')}
          </Text>
        </View>

        {/* Signature Introduction */}
        <Text style={[styles.text, styles.italic]}>
          By signing this Order Form, each party agrees to enter into this Pilot Agreement as of the Effective Date.
        </Text>

        {/* Signature Blocks */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureGrid}>
            <PartySignature party={formData.party1} label="Provider" />
            <PartySignature party={formData.party2} label="Customer" />
          </View>
        </View>
      </Page>

      {/* Standard Terms Page */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.termsTitle, { marginTop: 0, borderTop: 'none', paddingTop: 0 }]}>
          Standard Terms Summary
        </Text>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>1. Pilot Access</Text>
          <Text style={styles.termText}>
            During the Pilot Period, Customer may access and use the Product solely for Customer's
            Evaluation Purposes. Provider grants Customer a limited, non-exclusive, non-sublicensable,
            non-transferable license to install and use included Software.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>2. Term & Termination</Text>
          <Text style={styles.termText}>
            The Agreement starts on the Effective Date and continues through the Pilot Period.
            Either party may terminate for material breach (with 30 days notice to cure) or
            for any reason with 30 days notice.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>3. Disclaimer of Warranties</Text>
          <Text style={styles.termText}>
            The Product is provided on an "AS IS" and "AS AVAILABLE" basis. Provider disclaims all
            warranties, including merchantability, fitness for a particular purpose, title, and
            non-infringement.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>4. Limitation of Liability</Text>
          <Text style={styles.termText}>
            Each party's total cumulative liability is limited to the General Cap Amount.
            Neither party is liable for lost profits or consequential damages.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>5. Confidentiality</Text>
          <Text style={styles.termText}>
            Each party will protect the other's Confidential Information and will not use or
            disclose it except as authorized by this Agreement.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>6. General Terms</Text>
          <Text style={styles.termText}>
            This Agreement is the entire agreement between the parties. Any waiver, modification,
            or change must be in writing. Neither party may assign without consent. The parties
            are independent contractors.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Common Paper Pilot Agreement (Version 1.1) free to use under CC BY 4.0.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
