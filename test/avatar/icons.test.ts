import { describe, it, expect } from 'vitest';
import {
  getGenderIcon,
  getTransportationIcons,
  getEducationIcon,
  getHealthIcons,
  getDistrictIcon,
  hasIcon,
  validateIconData,
  MaleIcon,
  FemaleIcon,
  NeutralIcon,
  BusIcon,
  MTRIcon,
  GraduationCapIcon,
  MedicalIcon,
  LocationIcon
} from '@/components/avatar/icons';

describe('Avatar Icon System', () => {
  describe('getGenderIcon', () => {
    it('should return correct icon for male', () => {
      const icon = getGenderIcon('male');
      expect(icon).toBe(MaleIcon);
    });

    it('should return correct icon for female', () => {
      const icon = getGenderIcon('female');
      expect(icon).toBe(FemaleIcon);
    });

    it('should return neutral icon for unknown gender', () => {
      const icon = getGenderIcon('unknown');
      expect(icon).toBe(NeutralIcon);
    });

    it('should return fallback for null/undefined', () => {
      expect(getGenderIcon(null)).toBe(NeutralIcon);
      expect(getGenderIcon(undefined)).toBe(NeutralIcon);
    });
  });

  describe('getTransportationIcons', () => {
    it('should return correct icons for transportation modes', () => {
      const icons = getTransportationIcons(['bus', 'mtr']);
      expect(icons).toHaveLength(2);
      expect(icons[0]).toBe(BusIcon);
      expect(icons[1]).toBe(MTRIcon);
    });

    it('should return empty array for null/undefined', () => {
      expect(getTransportationIcons(null)).toEqual([]);
      expect(getTransportationIcons(undefined)).toEqual([]);
      expect(getTransportationIcons([])).toEqual([]);
    });
  });

  describe('getEducationIcon', () => {
    it('should return graduation cap for bachelor degree', () => {
      const icon = getEducationIcon('bachelor');
      expect(icon).toBe(GraduationCapIcon);
    });
  });

  describe('getHealthIcons', () => {
    it('should return medical icon for diabetes', () => {
      const icons = getHealthIcons(['diabetes']);
      expect(icons).toHaveLength(1);
      expect(icons[0]).toBe(MedicalIcon);
    });
  });

  describe('getDistrictIcon', () => {
    it('should return location icon for islands district', () => {
      const icon = getDistrictIcon('islands');
      expect(icon).toBe(LocationIcon);
    });
  });

  describe('hasIcon', () => {
    it('should return true for existing icons', () => {
      expect(hasIcon('gender', 'male')).toBe(true);
      expect(hasIcon('transportation', 'bus')).toBe(true);
    });

    it('should return false for non-existing icons', () => {
      expect(hasIcon('gender', 'alien')).toBe(false);
      expect(hasIcon('transportation', 'spaceship')).toBe(false);
    });
  });

  describe('validateIconData', () => {
    it('should validate complete form data', () => {
      const formData = {
        gender: 'male',
        transportationMode: ['bus', 'mtr'],
        educationLevel: 'bachelor',
        healthConditions: ['diabetes'],
        district: 'central-western'
      };

      const result = validateIconData(formData);
      
      expect(result.gender).toBe(MaleIcon);
      expect(result.transportation).toHaveLength(2);
      expect(result.education).toBe(GraduationCapIcon);
      expect(result.health).toHaveLength(1);
      expect(result.district).toBeDefined();
    });

    it('should handle partial form data', () => {
      const formData = {
        gender: 'female'
      };

      const result = validateIconData(formData);
      
      expect(result.gender).toBe(FemaleIcon);
      expect(result.transportation).toEqual([]);
      expect(result.education).toBeNull();
      expect(result.health).toEqual([]);
      expect(result.district).toBeNull();
    });
  });
});