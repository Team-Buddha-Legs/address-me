"use client";

import { useState } from "react";
import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import type { PersonalizedSummary } from "@/types";

interface ReportActionsProps {
  summary: PersonalizedSummary;
  reportId: string;
}

export function ReportActions({ summary, reportId }: ReportActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // TODO: Implement PDF download functionality
      console.log("Downloading PDF for report:", reportId);
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadText = async () => {
    setIsDownloading(true);
    try {
      // TODO: Implement text download functionality
      console.log("Downloading text for report:", reportId);
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error downloading text:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRetakeAssessment = () => {
    // TODO: Implement retake functionality
    console.log("Retaking assessment, clearing data...");
    // This would typically clear session data and redirect to the start
    window.location.href = "/";
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
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>{isDownloading ? "Generating..." : "Download PDF"}</span>
            </button>
            
            <button
              onClick={handleDownloadText}
              disabled={isDownloading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>{isDownloading ? "Generating..." : "Download Text"}</span>
            </button>
          </div>
        </div>

        {/* Retake Assessment */}
        <div className="border-t border-neutral-200 pt-4">
          <h4 className="font-medium text-neutral-900 mb-3">Update Your Profile</h4>
          <p className="text-sm text-neutral-600 mb-3">
            Has your situation changed? Retake the assessment to get an updated personalized summary.
          </p>
          
          {!showRetakeConfirm ? (
            <button
              onClick={() => setShowRetakeConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors duration-200"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Retake Assessment</span>
            </button>
          ) : (
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
              <p className="text-sm text-accent-dark mb-3">
                Are you sure you want to retake the assessment? This will clear your current results.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleRetakeAssessment}
                  className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-accent-dark transition-colors duration-200"
                >
                  Yes, Retake
                </button>
                <button
                  onClick={() => setShowRetakeConfirm(false)}
                  className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded text-sm hover:bg-neutral-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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