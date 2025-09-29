import { readFile } from 'fs/promises';
import { join } from 'path';
import { parsePolicyMarkdown } from './parser';
import type { PolicyContent } from './types';

/**
 * Load and parse the real policy data from markdown file
 */
export async function loadPolicyData(): Promise<PolicyContent> {
  try {
    // Load the raw policy markdown file
    const policyPath = join(process.cwd(), 'vendor', 'policy_address_2025_summary.md');
    const rawContent = await readFile(policyPath, 'utf-8');
    
    // Parse the markdown into structured data
    const policyContent = parsePolicyMarkdown(rawContent);
    
    console.log(`Loaded ${policyContent.sections.length} policy sections from real data`);
    
    return policyContent;
  } catch (error) {
    console.error('Failed to load real policy data, falling back to mock data:', error);
    
    // Fallback to mock data if real data fails to load
    const { mockPolicyContent } = await import('./mock-data');
    return mockPolicyContent;
  }
}

/**
 * Cache for loaded policy data to avoid re-parsing
 */
let cachedPolicyData: PolicyContent | null = null;

/**
 * Get policy data with caching
 */
export async function getPolicyData(): Promise<PolicyContent> {
  if (!cachedPolicyData) {
    cachedPolicyData = await loadPolicyData();
  }
  return cachedPolicyData;
}

/**
 * Clear the cache (useful for testing or when data updates)
 */
export function clearPolicyCache(): void {
  cachedPolicyData = null;
}