import type { PolicyContent, PolicySection } from "./types";

/**
 * Mock Hong Kong Policy Address 2025-2026 content
 * This represents pre-digested policy content that would be processed from the actual Policy Address
 */

const mockPolicySections: PolicySection[] = [
  {
    id: "housing-001",
    category: "housing",
    title: "Public Housing Development Initiative",
    content:
      "The government will accelerate public housing construction with a target of 30,000 new units annually. Priority will be given to families with children and elderly residents. New developments will include smart home features and community facilities.",
    summary:
      "Accelerated public housing construction targeting 30,000 units annually with smart features",
    targetDemographics: ["families", "low-income", "middle-income", "elderly"],
    impactLevel: "high",
    implementationTimeline: "2025-2028",
    budgetAllocation: 50000000000, // 50 billion HKD
    keyBenefits: [
      "Reduced waiting time for public housing",
      "Modern smart home features",
      "Integrated community facilities",
      "Priority allocation for families with children",
    ],
    eligibilityCriteria: [
      "Hong Kong permanent resident",
      "Household income below specified limits",
      "No property ownership",
      "Minimum 2-year residency requirement",
    ],
  },
  {
    id: "housing-002",
    category: "housing",
    title: "First-Time Home Buyer Support Scheme",
    content:
      "Enhanced mortgage assistance and down payment support for first-time buyers under 40. Government will provide up to 20% down payment assistance for properties under HK$8 million.",
    summary: "Down payment assistance up to 20% for first-time buyers under 40",
    targetDemographics: ["young-adults", "professionals", "middle-income"],
    impactLevel: "high",
    implementationTimeline: "2025-2026",
    budgetAllocation: 10000000000, // 10 billion HKD
    keyBenefits: [
      "Up to 20% down payment assistance",
      "Reduced mortgage interest rates",
      "Extended repayment periods",
      "Priority access to new developments",
    ],
    eligibilityCriteria: [
      "First-time home buyer",
      "Age under 40",
      "Property value under HK$8 million",
      "Stable employment for 2+ years",
    ],
  },
  {
    id: "transport-001",
    category: "transportation",
    title: "MTR Network Expansion",
    content:
      "Three new MTR lines will be constructed connecting New Territories to urban areas. The expansion includes smart ticketing integration and improved accessibility features for elderly and disabled passengers.",
    summary:
      "Three new MTR lines with smart ticketing and accessibility improvements",
    targetDemographics: ["professionals", "families", "elderly", "disabled"],
    impactLevel: "high",
    implementationTimeline: "2025-2030",
    budgetAllocation: 80000000000, // 80 billion HKD
    keyBenefits: [
      "Reduced commute times",
      "Better connectivity to New Territories",
      "Enhanced accessibility features",
      "Smart payment integration",
    ],
  },
  {
    id: "transport-002",
    category: "transportation",
    title: "Electric Bus Fleet Initiative",
    content:
      "All public buses will be converted to electric by 2028. New charging infrastructure will be built across all districts with priority routes serving residential areas.",
    summary:
      "Complete electric bus conversion by 2028 with new charging infrastructure",
    targetDemographics: ["families", "elderly", "low-income", "middle-income"],
    impactLevel: "medium",
    implementationTimeline: "2025-2028",
    budgetAllocation: 15000000000, // 15 billion HKD
    keyBenefits: [
      "Reduced air pollution",
      "Quieter public transport",
      "Lower operating costs",
      "Modern fleet with better amenities",
    ],
  },
  {
    id: "healthcare-001",
    category: "healthcare",
    title: "Digital Health Platform",
    content:
      "Launch of comprehensive digital health platform allowing online consultations, prescription management, and health record access. Special focus on elderly care and chronic disease management.",
    summary:
      "Digital health platform with online consultations and health record management",
    targetDemographics: ["elderly", "families", "professionals", "disabled"],
    impactLevel: "high",
    implementationTimeline: "2025-2026",
    budgetAllocation: 5000000000, // 5 billion HKD
    keyBenefits: [
      "Online medical consultations",
      "Digital prescription management",
      "Centralized health records",
      "Reduced waiting times",
    ],
  },
  {
    id: "education-001",
    category: "education",
    title: "STEM Education Enhancement",
    content:
      "Major investment in STEM education with new laboratories, coding programs, and AI literacy courses. Partnership with tech companies for internship programs.",
    summary:
      "Enhanced STEM education with new labs, coding programs, and industry partnerships",
    targetDemographics: ["students", "young-adults", "families"],
    impactLevel: "medium",
    implementationTimeline: "2025-2027",
    budgetAllocation: 8000000000, // 8 billion HKD
    keyBenefits: [
      "Modern STEM facilities",
      "Industry-relevant skills training",
      "Internship opportunities",
      "AI and coding literacy",
    ],
  },
  {
    id: "employment-001",
    category: "employment",
    title: "Green Jobs Initiative",
    content:
      "Creation of 50,000 green jobs in renewable energy, waste management, and environmental conservation. Retraining programs for traditional industries.",
    summary: "50,000 green jobs creation with retraining programs",
    targetDemographics: ["young-adults", "professionals", "unemployed"],
    impactLevel: "high",
    implementationTimeline: "2025-2028",
    budgetAllocation: 12000000000, // 12 billion HKD
    keyBenefits: [
      "50,000 new job opportunities",
      "Skills retraining programs",
      "Sustainable career paths",
      "Competitive salaries in green sectors",
    ],
  },
  {
    id: "social-welfare-001",
    category: "social-welfare",
    title: "Enhanced Elderly Care Services",
    content:
      "Expansion of community care services for elderly with 24/7 support hotlines, home care services, and subsidized meal programs. New elderly centers in every district.",
    summary:
      "Expanded elderly care with 24/7 support, home care, and meal programs",
    targetDemographics: ["elderly", "families"],
    impactLevel: "high",
    implementationTimeline: "2025-2027",
    budgetAllocation: 20000000000, // 20 billion HKD
    keyBenefits: [
      "24/7 elderly support hotline",
      "Subsidized home care services",
      "Community meal programs",
      "New elderly centers in all districts",
    ],
  },
];

export const mockPolicyContent: PolicyContent = {
  year: "2025-2026",
  title: "Hong Kong Policy Address 2025-2026: Building a Sustainable Future",
  sections: mockPolicySections,
  lastUpdated: new Date("2024-10-15"),
  totalBudget: 200000000000, // 200 billion HKD
};

export function getPolicyContentById(id: string): PolicySection | undefined {
  return mockPolicyContent.sections.find((section) => section.id === id);
}

export function getPolicyContentByCategory(category: string): PolicySection[] {
  return mockPolicyContent.sections.filter(
    (section) => section.category === category,
  );
}
