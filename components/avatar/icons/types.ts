export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}

export interface PersonIconProps extends IconProps {
  variant?: 'default' | 'outline' | 'filled';
}

export interface FamilyIconProps extends IconProps {
  age?: 'child' | 'adult';
  relationship?: 'spouse' | 'child' | 'parent';
}