"use client";

import { useState } from "react";
import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { downloadPDF, downloadTextReport } from "@/lib/pdf";
import { SessionManager } from "@/lib/session";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import type { PersonalizedSummary } from "@/types";

interface ReportActionsProps {
  summary: PersonalizedSummary;
  reportId: string;
}

export function ReportActions({ summary, reportId }: ReportActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await downloadPDF(summary, reportId);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setDownloadError("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadText = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      downloadTextReport(summary, reportId);
    } catch (error) {
      console.error("Error downloading text:", error);
      setDownloadError("Failed to generate text file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRetakeAssessment = () => {
    try {
      // Clear all assessment data from session
      SessionManager.clearAssessmentData();
      
      // Redirect to the start of the assessment
      window.location.href = "/";
    } catch (error) {
      console.error("Error clearing assessment data:", error);
      // Fallback: still redirect but log the error
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        What would you like to do next?
      </h3>
      
      <div className="space-y-4">
        {/* Download Options */}
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">Download Your Report</h4>
          
          {/* Error Display */}
          {downloadError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{downloadError}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>{isDownloading ? "Generating PDF..." : "Download PDF"}</span>
            </button>
            
            <button
              onClick={handleDownloadText}
              disabled={isDownloading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>{isDownloading ? "Generating Text..." : "Download Text"}</span>
            </button>
          </div>
          
          <p className="text-xs text-neutral-500 mt-2">
            Files will be saved with the format: policy-summary-{reportId}-YYYY-MM-DD.pdf/txt
          </p>
        </div>

        {/* Retake Assessment */}
        <div className="border-t border-neutral-200 pt-4">
          <h4 className="font-medium text-neutral-900 mb-3">Update Your Profile</h4>
          <p className="text-sm text-neutral-600 mb-3">
            Has your situation changed? Retake the assessment to get an updated personalized summary.
          </p>
          
          <button
            onClick={() => setShowRetakeConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors duration-200"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Retake Assessment</span>
          </button>

          {/* Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={showRetakeConfirm}
            onClose={() => setShowRetakeConfirm(false)}
            onConfirm={handleRetakeAssessment}
            title="Retake Assessment?"
            message="Are you sure you want to retake the assessment? This will clear your current results and you'll need to fill out the form again. Your personalized summary will be lost."
            confirmText="Yes, Retake"
            cancelText="Keep Current Results"
            variant="warning"
          />
        </div>

        {/* Additional Info */}
        <div className="border-t border-neutral-200 pt-4">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h5 className="font-medium text-primary-dark mb-2">💡 Pro Tip</h5>
            <p className="text-sm text-primary-dark leading-relaxed">
              Bookmark this page or download your report to reference your personalized recommendations later. 
              Policy implementations may take time, so check back periodically for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}