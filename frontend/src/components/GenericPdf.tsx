'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES } from '@/types/documents';
import { formatDate, placeholder } from '@/utils/nda';
import { getFieldConfig } from '@/utils/documentConfig';

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
  party: { name: string; title: string; company: string; noticeAddress: string; date: string };
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


interface GenericPdfProps {
  documentType: DocumentType;
  formData: DocumentFormData;
}

export function GenericPdf({ documentType, formData }: GenericPdfProps) {
  const config = getFieldConfig(documentType);
  const documentName = DOCUMENT_NAMES[documentType];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{documentName}</Text>
          <Text style={styles.subtitle}>Common Paper {documentName} Standard Terms</Text>
        </View>

        {/* Agreement Details */}
        <View style={styles.coverPage}>
          <Text style={styles.coverPageTitle}>Agreement Details</Text>

          <Text style={styles.sectionTitle}>Purpose</Text>
          <Text style={styles.text}>
            {placeholder(formData.purpose, '[Purpose of agreement]')}
          </Text>

          <Text style={styles.sectionTitle}>Effective Date</Text>
          <Text style={styles.text}>{formatDate(formData.effectiveDate)}</Text>

          {/* Document-specific fields */}
          {config.fields.map(field => {
            const value = (formData as unknown as Record<string, unknown>)[field.key] as string || '';
            return (
              <View key={field.key}>
                <Text style={styles.sectionTitle}>{field.label}</Text>
                <Text style={styles.text}>
                  {placeholder(value, `[${field.label}]`)}
                </Text>
              </View>
            );
          })}

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
          By signing below, each party agrees to enter into this {documentName} as of the Effective Date.
        </Text>

        {/* Signature Blocks */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureGrid}>
            <PartySignature party={formData.party1} label={config.party1Label} />
            <PartySignature party={formData.party2} label={config.party2Label} />
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            Common Paper {documentName} free to use under CC BY 4.0.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
