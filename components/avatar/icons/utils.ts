import { ComponentType } from 'react';
import { 
  ICON_MAPPINGS, 
  FALLBACK_ICONS, 
  IconCategory,
  GenderKey,
  TransportationKey,
  EducationKey,
  HealthKey,
  DistrictKey
} from './mappings';
import { IconProps } from './types';

/**
 * Get an icon component for a specific category and key
 */
export function getIcon<T extends IconCategory>(
  category: T,
  key: string
): ComponentType<IconProps> {
  const categoryMappings = ICON_MAPPINGS[category];
  const normalizedKey = key?.toLowerCase().replace(/\s+/g, '-') || '';
  
  // Try exact match first
  if (normalizedKey in categoryMappings) {
    return (categoryMappings as any)[normalizedKey];
  }
  
  // Try partial matches for flexibility
  const partialMatch = Object.keys(categoryMappings).find(mappingKey => 
    mappingKey.includes(normalizedKey) || normalizedKey.includes(mappingKey)
  );
  
  if (partialMatch) {
    return (categoryMappings as any)[partialMatch];
  }
  
  // Return fallback icon
  return FALLBACK_ICONS[category];
}

/**
 * Get gender icon component
 */
export function getGenderIcon(gender: string | null | undefined): ComponentType<IconProps> {
  if (!gender) return FALLBACK_ICONS.gender;
  return getIcon('gender', gender);
}

/**
 * Get transportation icons for multiple modes
 */
export function getTransportationIcons(modes: string[] | null | undefined): ComponentType<IconProps>[] {
  if (!modes || modes.length === 0) return [];
  
  return modes.map(mode => getIcon('transportation', mode));
}

/**
 * Get education icon component
 */
export function getEducationIcon(level: string | null | undefined): ComponentType<IconProps> {
  if (!level) return FALLBACK_ICONS.education;
  return getIcon('education', level);
}

/**
 * Get health icons for multiple conditions
 */
export function getHealthIcons(conditions: string[] | null | undefined): ComponentType<IconProps>[] {
  if (!conditions || conditions.length === 0) return [];
  
  return conditions.map(condition => getIcon('health', condition));
}

/**
 * Get district icon component
 */
export function getDistrictIcon(district: string | null | undefined): ComponentType<IconProps> {
  if (!district) return FALLBACK_ICONS.district;
  return getIcon('district', district);
}

/**
 * Check if an icon exists for a given category and key
 */
export function hasIcon(category: IconCategory, key: string): boolean {
  const categoryMappings = ICON_MAPPINGS[category];
  const normalizedKey = key?.toLowerCase().replace(/\s+/g, '-') || '';
  
  return normalizedKey in categoryMappings || 
         Object.keys(categoryMappings).some(mappingKey => 
           mappingKey.includes(normalizedKey) || normalizedKey.includes(mappingKey)
         );
}

/**
 * Get all available keys for a category
 */
export function getAvailableKeys(category: IconCategory): string[] {
  return Object.keys(ICON_MAPPINGS[category]);
}

/**
 * Validate and normalize form data for icon selection
 */
export interface FormDataForIcons {
  gender?: string | null;
  transportationMode?: string[] | null;
  educationLevel?: string | null;
  healthConditions?: string[] | null;
  district?: string | null;
}

export function validateIconData(formData: FormDataForIcons): {
  gender: ComponentType<IconProps> | null;
  transportation: ComponentType<IconProps>[];
  education: ComponentType<IconProps> | null;
  health: ComponentType<IconProps>[];
  district: ComponentType<IconProps> | null;
} {
  return {
    gender: formData.gender ? getGenderIcon(formData.gender) : null,
    transportation: getTransportationIcons(formData.transportationMode),
    education: formData.educationLevel ? getEducationIcon(formData.educationLevel) : null,
    health: getHealthIcons(formData.healthConditions),
    district: formData.district ? getDistrictIcon(formData.district) : null,
  };
}

/**
 * Get icon with error handling and logging
 */
export function getIconSafely<T extends IconCategory>(
  category: T,
  key: string,
  context?: string
): ComponentType<IconProps> {
  try {
    const icon = getIcon(category, key);
    return icon;
  } catch (error) {
    console.warn(`Failed to get ${category} icon for key "${key}"${context ? ` in ${context}` : ''}:`, error);
    return FALLBACK_ICONS[category];
  }
}