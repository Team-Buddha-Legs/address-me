import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ReportDisplay } from "@/components/report/ReportDisplay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getSession } from "@/lib/session";
import Logo from "@/components/ui/Logo";
import LanguageToggle from "@/components/ui/LanguageToggle";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  // Fetch the session and its generated summary
  const session = await getSession(id);

  if (!session) {
    notFound();
  }

  if (!session.summary) {
    // If no summary exists, redirect back to processing
    // This handles cases where user navigates directly to report URL
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Logo size="md" />
              <LanguageToggle />
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center px-4 py-8">
          <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-4">
            Report Not Ready
          </h1>
          <p className="text-neutral-600 mb-6">
            Your personalized summary is still being generated.
          </p>
          <a
            href={`/processing?sessionId=${id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Processing
          </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <ReportDisplay summary={session.summary} reportId={id} />
        </Suspense>
      </div>
    </div>
  );
}
