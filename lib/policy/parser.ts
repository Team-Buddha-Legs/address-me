import type { PolicyContent, PolicySection, PolicyCategory, ImpactLevel, TargetDemographic } from "./types";

/**
 * Parse raw policy markdown content into structured PolicyContent
 */
export function parsePolicyMarkdown(markdownContent: string): PolicyContent {
  const lines = markdownContent.split('\n');
  const sections: PolicySection[] = [];
  
  let currentSection: Partial<PolicySection> | null = null;
  let currentContent: string[] = [];
  let sectionCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and table of contents
    if (!line || line.startsWith('- [') || line.startsWith('**(')) {
      continue;
    }

    // Detect chapter/section headers
    if (line.startsWith('## Chapter') || line.startsWith('# ')) {
      // Save previous section if exists
      if (currentSection && currentSection.title) {
        const section = finalizePolicySection(currentSection, currentContent, ++sectionCounter);
        if (section) {
          sections.push(section);
        }
      }

      // Start new section
      currentSection = {
        title: extractTitle(line),
      };
      currentContent = [];
    }
    // Detect subsection headers
    else if (line.startsWith('**(') && line.endsWith(')**')) {
      // Save previous section if exists
      if (currentSection && currentSection.title) {
        const section = finalizePolicySection(currentSection, currentContent, ++sectionCounter);
        if (section) {
          sections.push(section);
        }
      }

      // Start new subsection
      currentSection = {
        title: line.replace(/\*\*\(([^)]+)\)\*\*/, '$1'),
      };
      currentContent = [];
    }
    // Collect content
    else if (currentSection && line.length > 20) {
      currentContent.push(line);
    }
  }

  // Don't forget the last section
  if (currentSection && currentSection.title) {
    const section = finalizePolicySection(currentSection, currentContent, ++sectionCounter);
    if (section) {
      sections.push(section);
    }
  }

  return {
    year: "2025",
    title: "Hong Kong Policy Address 2025: Deepening Reforms for Our People",
    sections: sections.filter(s => s.content.length > 100), // Filter out very short sections
    lastUpdated: new Date(),
    totalBudget: 500000000000, // 500 billion HKD estimated
  };
}

/**
 * Finalize a policy section with categorization and analysis
 */
function finalizePolicySection(
  section: Partial<PolicySection>, 
  contentLines: string[], 
  id: number
): PolicySection | null {
  if (!section.title || contentLines.length === 0) {
    return null;
  }

  const content = contentLines.join(' ').replace(/\s+/g, ' ').trim();
  
  // Skip very short content
  if (content.length < 100) {
    return null;
  }

  const category = categorizeSection(section.title, content);
  const targetDemographics = identifyTargetDemographics(section.title, content);
  const impactLevel = assessImpactLevel(section.title, content);
  const keyBenefits = extractKeyBenefits(content);
  const timeline = extractTimeline(content);

  return {
    id: `policy-${id.toString().padStart(3, '0')}`,
    category,
    title: section.title,
    content,
    summary: generateSummary(content),
    targetDemographics,
    impactLevel,
    implementationTimeline: timeline,
    budgetAllocation: extractBudget(content),
    keyBenefits,
    eligibilityCriteria: extractEligibilityCriteria(content),
  };
}

/**
 * Extract clean title from header line
 */
function extractTitle(line: string): string {
  return line
    .replace(/^#+\s*/, '')
    .replace(/^Chapter\s+[IVX]+\s*/, '')
    .replace(/^\d+\s*[-–]\s*\d+\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

/**
 * Categorize section based on title and content
 */
function categorizeSection(title: string, content: string): PolicyCategory {
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  
  if (titleLower.includes('housing') || titleLower.includes('land') || 
      contentLower.includes('public housing') || contentLower.includes('home buyer')) {
    return 'housing';
  }
  
  if (titleLower.includes('transport') || titleLower.includes('mtr') || 
      contentLower.includes('transport') || contentLower.includes('railway')) {
    return 'transportation';
  }
  
  if (titleLower.includes('health') || titleLower.includes('medical') || 
      contentLower.includes('healthcare') || contentLower.includes('hospital')) {
    return 'healthcare';
  }
  
  if (titleLower.includes('education') || titleLower.includes('school') || 
      contentLower.includes('student') || contentLower.includes('university')) {
    return 'education';
  }
  
  if (titleLower.includes('employment') || titleLower.includes('job') || 
      contentLower.includes('employment') || contentLower.includes('worker')) {
    return 'employment';
  }
  
  if (titleLower.includes('welfare') || titleLower.includes('elderly') || 
      contentLower.includes('social welfare') || contentLower.includes('care')) {
    return 'social-welfare';
  }
  
  if (titleLower.includes('environment') || titleLower.includes('green') || 
      contentLower.includes('environmental') || contentLower.includes('carbon')) {
    return 'environment';
  }
  
  if (titleLower.includes('technology') || titleLower.includes('innovation') || 
      contentLower.includes('ai ') || contentLower.includes('digital')) {
    return 'technology';
  }
  
  if (titleLower.includes('economic') || titleLower.includes('financial') || 
      contentLower.includes('economy') || contentLower.includes('business')) {
    return 'economy';
  }
  
  return 'economy'; // Default category
}

/**
 * Identify target demographics from content
 */
function identifyTargetDemographics(title: string, content: string): TargetDemographic[] {
  const demographics: TargetDemographic[] = [];
  const text = (title + ' ' + content).toLowerCase();
  
  if (text.includes('young') || text.includes('youth') || text.includes('under 35') || text.includes('under 40')) {
    demographics.push('young-adults');
  }
  
  if (text.includes('family') || text.includes('families') || text.includes('children') || text.includes('parent')) {
    demographics.push('families');
  }
  
  if (text.includes('elderly') || text.includes('senior') || text.includes('aged') || text.includes('over 65')) {
    demographics.push('elderly');
  }
  
  if (text.includes('student') || text.includes('school') || text.includes('university') || text.includes('education')) {
    demographics.push('students');
  }
  
  if (text.includes('professional') || text.includes('worker') || text.includes('employee') || text.includes('talent')) {
    demographics.push('professionals');
  }
  
  if (text.includes('low income') || text.includes('low-income') || text.includes('poverty') || text.includes('disadvantaged')) {
    demographics.push('low-income');
  }
  
  if (text.includes('middle class') || text.includes('middle-income') || text.includes('middle income')) {
    demographics.push('middle-income');
  }
  
  if (text.includes('disabled') || text.includes('disability') || text.includes('rehabilitation') || text.includes('special needs')) {
    demographics.push('disabled');
  }
  
  if (text.includes('unemployed') || text.includes('job seeker') || text.includes('retraining')) {
    demographics.push('unemployed');
  }
  
  // Default demographics if none identified
  if (demographics.length === 0) {
    demographics.push('professionals', 'families');
  }
  
  return demographics;
}

/**
 * Assess impact level based on content indicators
 */
function assessImpactLevel(title: string, content: string): ImpactLevel {
  const text = (title + ' ' + content).toLowerCase();
  
  // High impact indicators
  if (text.includes('billion') || text.includes('major') || text.includes('significant') || 
      text.includes('comprehensive') || text.includes('large-scale') || text.includes('citywide')) {
    return 'high';
  }
  
  // Low impact indicators
  if (text.includes('pilot') || text.includes('trial') || text.includes('small-scale') || 
      text.includes('limited') || text.includes('specific')) {
    return 'low';
  }
  
  return 'medium';
}

/**
 * Extract key benefits from content
 */
function extractKeyBenefits(content: string): string[] {
  const benefits: string[] = [];
  
  // Look for benefit patterns
  const benefitPatterns = [
    /provide[s]?\s+([^.]+)/gi,
    /offer[s]?\s+([^.]+)/gi,
    /enable[s]?\s+([^.]+)/gi,
    /improve[s]?\s+([^.]+)/gi,
    /enhance[s]?\s+([^.]+)/gi,
    /support[s]?\s+([^.]+)/gi,
  ];
  
  for (const pattern of benefitPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      benefits.push(...matches.slice(0, 2).map(m => m.replace(pattern, '$1').trim()));
    }
  }
  
  // Default benefits if none found
  if (benefits.length === 0) {
    benefits.push('Improved public services', 'Enhanced quality of life');
  }
  
  return benefits.slice(0, 4); // Limit to 4 benefits
}

/**
 * Extract implementation timeline
 */
function extractTimeline(content: string): string {
  const timelineMatch = content.match(/20\d{2}[-–]20\d{2}|20\d{2}/);
  return timelineMatch ? timelineMatch[0] : '2025-2027';
}

/**
 * Extract budget allocation if mentioned
 */
function extractBudget(content: string): number | undefined {
  const budgetMatch = content.match(/(\d+(?:\.\d+)?)\s*billion/i);
  if (budgetMatch) {
    return parseFloat(budgetMatch[1]) * 1000000000; // Convert to actual number
  }
  
  const millionMatch = content.match(/(\d+(?:\.\d+)?)\s*million/i);
  if (millionMatch) {
    return parseFloat(millionMatch[1]) * 1000000;
  }
  
  return undefined;
}

/**
 * Extract eligibility criteria
 */
function extractEligibilityCriteria(content: string): string[] | undefined {
  const criteria: string[] = [];
  
  if (content.toLowerCase().includes('eligib')) {
    criteria.push('Meet specified eligibility requirements');
  }
  
  if (content.toLowerCase().includes('resident')) {
    criteria.push('Hong Kong permanent resident');
  }
  
  if (content.toLowerCase().includes('income')) {
    criteria.push('Income within specified limits');
  }
  
  return criteria.length > 0 ? criteria : undefined;
}

/**
 * Generate a concise summary from content
 */
function generateSummary(content: string): string {
  // Take first sentence or first 150 characters
  const firstSentence = content.split('.')[0];
  if (firstSentence.length > 20 && firstSentence.length < 200) {
    return firstSentence + '.';
  }
  
  return content.substring(0, 150) + '...';
}