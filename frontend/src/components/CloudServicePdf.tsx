'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CloudServiceData } from '@/types/documents';
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
  party: CloudServiceData['party1'];
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

interface CloudServicePdfProps {
  formData: CloudServiceData;
}

export function CloudServicePdf({ formData }: CloudServicePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Cloud Service Agreement</Text>
          <Text style={styles.subtitle}>Common Paper Cloud Service Agreement Standard Terms</Text>
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

          <Text style={styles.sectionTitle}>Cloud Service Description</Text>
          <Text style={styles.text}>
            {placeholder(formData.purpose, '[Description of the cloud service]')}
          </Text>

          <Text style={styles.sectionTitle}>Effective Date</Text>
          <Text style={styles.text}>{formatDate(formData.effectiveDate)}</Text>

          <Text style={styles.sectionTitle}>Subscription Period</Text>
          <Text style={styles.text}>
            {placeholder(formData.subscriptionPeriod, '[Duration]')}
          </Text>

          <Text style={styles.sectionTitle}>Technical Support</Text>
          <Text style={styles.text}>
            {placeholder(formData.technicalSupport, '[Support level description]')}
          </Text>

          <Text style={styles.sectionTitle}>Fees</Text>
          <Text style={styles.text}>
            {placeholder(formData.fees, '[Pricing structure]')}
          </Text>

          <Text style={styles.sectionTitle}>Payment Terms</Text>
          <Text style={styles.text}>
            {placeholder(formData.paymentTerms, '[Payment schedule]')}
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
          By signing this Order Form, each party agrees to enter into this Cloud Service Agreement as of the Effective Date.
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
          <Text style={styles.termTitle}>1. Service</Text>
          <Text style={styles.termText}>
            During the Subscription Period, Customer may access and use the Cloud Service and copy and use
            included Software and Documentation for internal business purposes. Provider will provide
            Technical Support as described in the Order Form.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>2. Restrictions & Obligations</Text>
          <Text style={styles.termText}>
            Customer will not reverse engineer, sublicense, or use the Product to develop a competing service.
            Provider may suspend access for material breach or non-payment.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>3. Privacy & Security</Text>
          <Text style={styles.termText}>
            Before submitting Personal Data governed by GDPR, Customer must enter into a data processing agreement.
            Customer will not submit Prohibited Data unless authorized.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>4. Payment & Taxes</Text>
          <Text style={styles.termText}>
            Customer will pay Fees according to the Payment Process. Fees are non-refundable except as
            specifically provided. Customer is responsible for applicable taxes.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>5. Term & Termination</Text>
          <Text style={styles.termText}>
            The Agreement continues through the Subscription Period and automatically renews unless
            one party gives notice of non-renewal. Either party may terminate for material breach.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>6. Representations & Warranties</Text>
          <Text style={styles.termText}>
            Each party represents it has legal authority to enter into this Agreement. Provider will not
            materially reduce the general functionality of the Cloud Service during the Subscription Period.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>7. Limitation of Liability</Text>
          <Text style={styles.termText}>
            Each party's total liability is capped as specified. Neither party is liable for lost profits
            or consequential damages except for breach of confidentiality.
          </Text>
        </View>

        <View style={styles.termSection}>
          <Text style={styles.termTitle}>8. Confidentiality</Text>
          <Text style={styles.termText}>
            Each party will protect the other's Confidential Information using at least the same protections
            used for its own similar information.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Common Paper Cloud Service Agreement free to use under CC BY 4.0.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
