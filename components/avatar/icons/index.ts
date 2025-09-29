// Person Icons
export { MaleIcon, FemaleIcon, NeutralIcon } from './PersonIcons';

// Family Icons
export { ChildIcon, SpouseIcon } from './FamilyIcons';

// Transportation Icons
export { 
  BusIcon, 
  MTRIcon, 
  MinibusIcon, 
  TaxiIcon, 
  CarIcon, 
  BikeIcon, 
  WalkingIcon 
} from './TransportationIcons';

// Lifestyle Icons
export { 
  GraduationCapIcon, 
  BookIcon, 
  DiplomaIcon, 
  MedicalIcon, 
  AccessibilityIcon, 
  LocationIcon, 
  BuildingIcon 
} from './LifestyleIcons';

// Mappings and utilities
export { ICON_MAPPINGS, FALLBACK_ICONS } from './mappings';
export type { 
  GenderKey, 
  TransportationKey, 
  EducationKey, 
  HealthKey, 
  DistrictKey, 
  IconCategory 
} from './mappings';

export {
  getIcon,
  getGenderIcon,
  getTransportationIcons,
  getEducationIcon,
  getHealthIcons,
  getDistrictIcon,
  hasIcon,
  getAvailableKeys,
  validateIconData,
  getIconSafely
} from './utils';

export type { FormDataForIcons } from './utils';

// Types
export type { IconProps, PersonIconProps, FamilyIconProps } from './types';