import { 
  MaleIcon, 
  FemaleIcon, 
  NeutralIcon,
  BusIcon,
  MTRIcon,
  MinibusIcon,
  TaxiIcon,
  CarIcon,
  BikeIcon,
  WalkingIcon,
  GraduationCapIcon,
  BookIcon,
  DiplomaIcon,
  MedicalIcon,
  AccessibilityIcon,
  LocationIcon,
  BuildingIcon
} from './index';

// Icon mapping constants
export const ICON_MAPPINGS = {
  gender: {
    male: MaleIcon,
    female: FemaleIcon,
    other: NeutralIcon,
    'prefer-not-to-say': NeutralIcon,
    neutral: NeutralIcon,
  },
  transportation: {
    mtr: MTRIcon,
    bus: BusIcon,
    minibus: MinibusIcon,
    taxi: TaxiIcon,
    'private-car': CarIcon,
    car: CarIcon,
    bicycle: BikeIcon,
    bike: BikeIcon,
    walking: WalkingIcon,
    walk: WalkingIcon,
  },
  education: {
    'no-formal-education': BookIcon,
    'primary': BookIcon,
    'secondary': BookIcon,
    'post-secondary': DiplomaIcon,
    'bachelor': GraduationCapIcon,
    'master': GraduationCapIcon,
    'doctorate': GraduationCapIcon,
    'professional': GraduationCapIcon,
  },
  health: {
    diabetes: MedicalIcon,
    'mobility-issues': AccessibilityIcon,
    'chronic-illness': MedicalIcon,
    'heart-disease': MedicalIcon,
    'mental-health': MedicalIcon,
    disability: AccessibilityIcon,
  },
  district: {
    'central-western': BuildingIcon,
    'wan-chai': BuildingIcon,
    'eastern': BuildingIcon,
    'southern': BuildingIcon,
    'yau-tsim-mong': BuildingIcon,
    'sham-shui-po': BuildingIcon,
    'kowloon-city': BuildingIcon,
    'wong-tai-sin': BuildingIcon,
    'kwun-tong': BuildingIcon,
    'tsuen-wan': BuildingIcon,
    'tuen-mun': BuildingIcon,
    'yuen-long': BuildingIcon,
    'north': BuildingIcon,
    'tai-po': BuildingIcon,
    'sha-tin': BuildingIcon,
    'sai-kung': BuildingIcon,
    'kwai-tsing': BuildingIcon,
    'islands': LocationIcon,
  },
} as const;

// Fallback icons for each category
export const FALLBACK_ICONS = {
  gender: NeutralIcon,
  transportation: WalkingIcon,
  education: BookIcon,
  health: MedicalIcon,
  district: LocationIcon,
} as const;

// Type definitions for the mappings
export type GenderKey = keyof typeof ICON_MAPPINGS.gender;
export type TransportationKey = keyof typeof ICON_MAPPINGS.transportation;
export type EducationKey = keyof typeof ICON_MAPPINGS.education;
export type HealthKey = keyof typeof ICON_MAPPINGS.health;
export type DistrictKey = keyof typeof ICON_MAPPINGS.district;
export type IconCategory = keyof typeof ICON_MAPPINGS;