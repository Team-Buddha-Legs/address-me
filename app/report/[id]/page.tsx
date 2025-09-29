import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ReportDisplay } from "@/components/report/ReportDisplay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getSession } from "@/lib/session";

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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
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
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Suspense fallback={<LoadingSpinner />}>
        <ReportDisplay summary={session.summary} reportId={id} />
      </Suspense>
    </div>
  );
}
