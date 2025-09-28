import { Suspense } from "react";
import { ReportDisplay } from "@/components/report/ReportDisplay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { PersonalizedSummary } from "@/types";

// Mock data for development - will be replaced with actual data fetching
const mockSummary: PersonalizedSummary = {
  overallScore: 85,
  relevantAreas: [
    {
      category: "housing",
      title: "Housing Initiatives",
      relevanceScore: 92,
      summary:
        "New public housing developments and rental assistance programs that directly benefit your profile.",
      details:
        "Based on your housing type and income range, you qualify for several new housing initiatives including the Enhanced Rental Assistance Scheme and priority allocation for new public housing units in your district.",
      actionItems: [
        "Apply for Enhanced Rental Assistance by March 2025",
        "Register for priority housing allocation in your district",
        "Attend housing information sessions in your area",
      ],
      impact: "high",
    },
    {
      category: "transportation",
      title: "Transport Improvements",
      relevanceScore: 78,
      summary:
        "New MTR extensions and bus route improvements affecting your daily commute.",
      details:
        "The new MTR line extension will reduce your commute time by approximately 15 minutes daily. Additional bus routes in your district will provide more flexible transportation options.",
      actionItems: [
        "Plan new commute routes when MTR extension opens",
        "Consider monthly transport pass savings",
        "Explore new bus routes for backup transportation",
      ],
      impact: "medium",
    },
    {
      category: "healthcare",
      title: "Healthcare Services",
      relevanceScore: 71,
      summary: "Expanded healthcare services and digital health initiatives.",
      details:
        "New community health centers and telemedicine services will improve healthcare accessibility in your district. Enhanced elderly care services may benefit family members.",
      actionItems: [
        "Register for new community health center",
        "Download government health app",
        "Schedule preventive health screenings",
      ],
      impact: "medium",
    },
  ],
  majorUpdates: [
    {
      id: "northern-metropolis",
      title: "Northern Metropolis Development",
      description:
        "Major urban development project creating new residential and commercial areas.",
      relevanceToUser:
        "May provide new housing and employment opportunities within commuting distance.",
      timeline: "2025-2030",
      impact: "medium",
    },
    {
      id: "smart-city-initiative",
      title: "Smart City Digital Infrastructure",
      description:
        "City-wide digital transformation including 5G networks and smart traffic systems.",
      relevanceToUser:
        "Will improve digital services and reduce traffic congestion in your area.",
      timeline: "2024-2026",
      impact: "low",
    },
  ],
  recommendations: [
    {
      id: "housing-application",
      title: "Apply for Housing Assistance",
      description:
        "Take advantage of new rental assistance programs that match your income bracket.",
      actionSteps: [
        "Gather required income documentation",
        "Submit online application before deadline",
        "Attend follow-up interview if selected",
      ],
      priority: "high",
      category: "housing",
    },
    {
      id: "transport-optimization",
      title: "Optimize Transportation Costs",
      description:
        "Review and update your transportation methods to take advantage of new routes and discounts.",
      actionSteps: [
        "Calculate potential savings with new routes",
        "Apply for transportation subsidies if eligible",
        "Consider switching to monthly passes",
      ],
      priority: "medium",
      category: "transportation",
    },
  ],
  generatedAt: new Date(),
};

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  // TODO: Replace with actual data fetching based on report ID
  // const summary = await fetchReportById(id);
  const summary = mockSummary;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Suspense fallback={<LoadingSpinner />}>
        <ReportDisplay summary={summary} reportId={id} />
      </Suspense>
    </div>
  );
}
