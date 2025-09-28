import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import type { PersonalizedSummary, PolicyArea, CityPlan, Recommendation } from '@/types';

// Register fonts for better typography
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 600 },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 11,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #1e40af',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#1e40af',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 12,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 4,
  },
  scoreContainer: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    border: '1px solid #bfdbfe',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e40af',
    textAlign: 'center',
  },
  policyArea: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
  },
  policyTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 6,
  },
  policyScore: {
    fontSize: 11,
    color: '#059669',
    marginBottom: 8,
  },
  policyContent: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 1.5,
  },
  actionItems: {
    marginTop: 8,
  },
  actionItem: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 3,
    paddingLeft: 10,
  },
  recommendation: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    border: '1px solid #fbbf24',
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#92400e',
    marginBottom: 4,
  },
  recommendationContent: {
    fontSize: 10,
    color: '#78350f',
    marginBottom: 6,
  },
  majorUpdate: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 4,
    border: '1px solid #3b82f6',
  },
  majorUpdateTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1e40af',
    marginBottom: 4,
  },
  majorUpdateContent: {
    fontSize: 10,
    color: '#1e3a8a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
});

interface PDFDocumentProps {
  summary: PersonalizedSummary;
  reportId: string;
}

const PDFDocument = ({ summary, reportId }: PDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Personalized Policy Summary</Text>
        <Text style={styles.subtitle}>
          Generated on {summary.generatedAt.toLocaleDateString('en-HK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={styles.subtitle}>Report ID: {reportId}</Text>
      </View>

      {/* Overall Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>
          Overall Policy Relevance Score: {summary.overallScore}%
        </Text>
      </View>

      {/* Policy Areas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relevant Policy Areas</Text>
        {summary.relevantAreas.map((area, index) => (
          <View key={index} style={styles.policyArea}>
            <Text style={styles.policyTitle}>{area.title}</Text>
            <Text style={styles.policyScore}>
              Relevance Score: {area.relevanceScore}% | Impact: {area.impact.toUpperCase()}
            </Text>
            <Text style={styles.policyContent}>{area.summary}</Text>
            <Text style={styles.policyContent}>{area.details}</Text>
            {area.actionItems.length > 0 && (
              <View style={styles.actionItems}>
                <Text style={[styles.policyContent, { fontWeight: 600, marginBottom: 4 }]}>
                  Action Items:
                </Text>
                {area.actionItems.map((item, itemIndex) => (
                  <Text key={itemIndex} style={styles.actionItem}>
                    • {item}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Major Updates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Major City Updates</Text>
        {summary.majorUpdates.map((update, index) => (
          <View key={index} style={styles.majorUpdate}>
            <Text style={styles.majorUpdateTitle}>{update.title}</Text>
            <Text style={styles.majorUpdateContent}>{update.description}</Text>
            <Text style={styles.majorUpdateContent}>
              Relevance: {update.relevanceToUser}
            </Text>
            <Text style={styles.majorUpdateContent}>
              Timeline: {update.timeline} | Impact: {update.impact.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
        {summary.recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendation}>
            <Text style={styles.recommendationTitle}>
              {rec.title} (Priority: {rec.priority.toUpperCase()})
            </Text>
            <Text style={styles.recommendationContent}>{rec.description}</Text>
            {rec.actionSteps.length > 0 && (
              <View>
                <Text style={[styles.recommendationContent, { fontWeight: 600, marginBottom: 4 }]}>
                  Action Steps:
                </Text>
                {rec.actionSteps.map((step, stepIndex) => (
                  <Text key={stepIndex} style={styles.actionItem}>
                    {stepIndex + 1}. {step}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        This personalized summary is based on your profile information and the Hong Kong Policy Address 2025-2026.
        {'\n'}For the most up-to-date information, please refer to official government sources.
      </Text>
    </Page>
  </Document>
);

export async function generatePDF(summary: PersonalizedSummary, reportId: string): Promise<Blob> {
  try {
    const doc = <PDFDocument summary={summary} reportId={reportId} />;
    const pdfBlob = await pdf(doc).toBlob();
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
}

export function generateFileName(summary: PersonalizedSummary, reportId: string): string {
  const date = summary.generatedAt.toISOString().split('T')[0];
  return `policy-summary-${reportId}-${date}.pdf`;
}

export async function downloadPDF(summary: PersonalizedSummary, reportId: string): Promise<void> {
  try {
    const pdfBlob = await generatePDF(summary, reportId);
    const fileName = generateFileName(summary, reportId);
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}