import AssessmentStepClient from "@/components/form/AssessmentStepClient";
import { formSteps } from "@/lib/form-steps";

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
    title: "Assessment - AddressMe",
    description:
      "Complete your profile assessment to receive personalized Policy Address insights",
  };
}
