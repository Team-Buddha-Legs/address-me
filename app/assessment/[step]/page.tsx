import { formSteps } from "@/lib/form-steps";
import AssessmentStepClient from "@/components/form/AssessmentStepClient";

export async function generateStaticParams() {
  return formSteps.map((step) => ({
    step: step.id,
  }));
}

export default function AssessmentStepPage() {
  return <AssessmentStepClient />;
}

export function generateMetadata() {
  return {
    title: "Assessment - Address Me",
    description: "Complete your profile assessment to receive personalized Policy Address insights",
  };
}