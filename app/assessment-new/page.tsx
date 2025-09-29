import AssessmentFlow from "@/components/form/AssessmentFlow";

export default function NewAssessmentPage() {
  return <AssessmentFlow />;
}

export function generateMetadata() {
  return {
    title: "Assessment - Address Me",
    description:
      "Complete your profile assessment to receive personalized Policy Address insights",
  };
}