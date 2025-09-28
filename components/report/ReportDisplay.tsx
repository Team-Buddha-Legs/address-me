"use client";

import { useState } from "react";
import { OverallScoreDisplay } from "./OverallScoreDisplay";
import { PolicyAreaSection } from "./PolicyAreaSection";
import { MajorUpdatesSection } from "./MajorUpdatesSection";
import { RecommendationsSection } from "./RecommendationsSection";
import { ReportActions } from "./ReportActions";
import { Typography, Caption } from "./Typography";
import { Section, VerticalStack } from "./Spacing";
import type { PersonalizedSummary } from "@/types";

interface ReportDisplayProps {
  summary: PersonalizedSummary;
  reportId: string;
}

export function ReportDisplay({ summary, reportId }: ReportDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["policy-areas", "major-updates", "recommendations"])
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <VerticalStack size="lg">
        {/* Header */}
        <Section>
          <Typography variant="h1" className="mb-3">
            Your Personalized Policy Summary
          </Typography>
          <Caption>
            Generated on {summary.generatedAt.toLocaleDateString("en-HK", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Caption>
        </Section>

        {/* Overall Score */}
        <Section>
          <OverallScoreDisplay score={summary.overallScore} />
        </Section>

        {/* Policy Areas */}
        <Section>
          <PolicyAreaSection
            areas={summary.relevantAreas}
            isExpanded={expandedSections.has("policy-areas")}
            onToggle={() => toggleSection("policy-areas")}
          />
        </Section>

        {/* Major Updates */}
        <Section>
          <MajorUpdatesSection
            updates={summary.majorUpdates}
            isExpanded={expandedSections.has("major-updates")}
            onToggle={() => toggleSection("major-updates")}
          />
        </Section>

        {/* Recommendations */}
        <Section>
          <RecommendationsSection
            recommendations={summary.recommendations}
            isExpanded={expandedSections.has("recommendations")}
            onToggle={() => toggleSection("recommendations")}
          />
        </Section>

        {/* Actions */}
        <Section className="mt-4">
          <ReportActions summary={summary} reportId={reportId} />
        </Section>
      </VerticalStack>
    </div>
  );
}