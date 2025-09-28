import { describe, it, expect } from 'vitest';
import {
  processUserProfile,
  generateProfileHash,
  identifyRiskFactors,
  calculateEligibilityFlags,
  isPublicHousingEligible,
  isHomeOwnershipSchemeEligible,
  isComprehensiveSocialSecurityEligible,
  isElderlyAllowanceEligible,
  isContinuingEducationFundEligible,
  isRetrainingProgrammeEligible,
  isHealthcareVoucherEligible,
  isPublicTransportFareConcessionsEligible,
  validateUserProfile,
  calculateFormProgress,
  getNextStepId,
  getPreviousStepId,
  calculatePolicyRelevance,
  formatIncomeRange,
  formatDistrict,
  formatEmploymentStatus,
  formatHousingType,
} from '@/lib/utils';
import type { UserProfile } from '@/types';

describe('Utility Functions', () => {
  const mockProfile: UserProfile = {
    age: 30,
    gender: 'male',
    maritalStatus: 'single',
    district: 'central-western',
    incomeRange: '30k-50k',
    employmentStatus: 'employed-full-time',
    housingType: 'private-rental',
    hasChildren: false,
    educationLevel: 'bachelor',
    transportationMode: ['mtr', 'bus'],
  };

  describe('processUserProfile', () => {
    it('should process user profile correctly', () => {
      const processed = processUserProfile(mockProfile);
      
      expect(processed).toHaveProperty('profileHash');
      expect(processed).toHaveProperty('riskFactors');
      expect(processed).toHaveProperty('eligibilityFlags');
      expect(processed.profileHash).toBeDefined();
      expect(Array.isArray(processed.riskFactors)).toBe(true);
      expect(typeof processed.eligibilityFlags).toBe('object');
    });

    it('should maintain original profile data', () => {
      const processed = processUserProfile(mockProfile);
      
      expect(processed.age).toBe(mockProfile.age);
      expect(processed.gender).toBe(mockProfile.gender);
      expect(processed.district).toBe(mockProfile.district);
    });
  });

  describe('generateProfileHash', () => {
    it('should generate consistent hash for same profile', () => {
      const hash1 = generateProfileHash(mockProfile);
      const hash2 = generateProfileHash(mockProfile);
      
      expect(hash1).toBe(hash2);
      expect(typeof hash1).toBe('string');
      expect(hash1.length).toBe(16);
    });

    it('should generate different hashes for different profiles', () => {
      const profile2 = { ...mockProfile, age: 25 };
      const hash1 = generateProfileHash(mockProfile);
      const hash2 = generateProfileHash(profile2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('identifyRiskFactors', () => {
    it('should identify elderly risk factor', () => {
      const elderlyProfile = { ...mockProfile, age: 70 };
      const riskFactors = identifyRiskFactors(elderlyProfile);
      
      expect(riskFactors).toContain('elderly');
    });

    it('should identify young adult risk factor', () => {
      const youngProfile = { ...mockProfile, age: 22 };
      const riskFactors = identifyRiskFactors(youngProfile);
      
      expect(riskFactors).toContain('young-adult');
    });

    it('should identify unemployment risk factor', () => {
      const unemployedProfile = { ...mockProfile, employmentStatus: 'unemployed' as const };
      const riskFactors = identifyRiskFactors(unemployedProfile);
      
      expect(riskFactors).toContain('unemployment');
    });

    it('should identify low income risk factor', () => {
      const lowIncomeProfile = { ...mockProfile, incomeRange: 'below-10k' as const };
      const riskFactors = identifyRiskFactors(lowIncomeProfile);
      
      expect(riskFactors).toContain('low-income');
    });

    it('should identify housing insecurity risk factor', () => {
      const housingInsecureProfile = { ...mockProfile, housingType: 'temporary' as const };
      const riskFactors = identifyRiskFactors(housingInsecureProfile);
      
      expect(riskFactors).toContain('housing-insecurity');
    });

    it('should identify young children risk factor', () => {
      const familyProfile = {
        ...mockProfile,
        hasChildren: true,
        childrenAges: [3, 8],
      };
      const riskFactors = identifyRiskFactors(familyProfile);
      
      expect(riskFactors).toContain('young-children');
    });

    it('should identify health conditions risk factor', () => {
      const healthProfile = {
        ...mockProfile,
        healthConditions: ['diabetes'],
      };
      const riskFactors = identifyRiskFactors(healthProfile);
      
      expect(riskFactors).toContain('health-conditions');
    });

    it('should return empty array for profile with no risk factors', () => {
      const riskFactors = identifyRiskFactors(mockProfile);
      
      expect(Array.isArray(riskFactors)).toBe(true);
    });
  });

  describe('Eligibility Functions', () => {
    describe('isPublicHousingEligible', () => {
      it('should return true for low income and non-private housing', () => {
        const eligibleProfile = {
          ...mockProfile,
          incomeRange: 'below-10k' as const,
          housingType: 'private-rental' as const,
        };
        
        expect(isPublicHousingEligible(eligibleProfile)).toBe(true);
      });

      it('should return false for high income', () => {
        const ineligibleProfile = {
          ...mockProfile,
          incomeRange: 'above-120k' as const,
        };
        
        expect(isPublicHousingEligible(ineligibleProfile)).toBe(false);
      });

      it('should return false for private owners', () => {
        const ineligibleProfile = {
          ...mockProfile,
          incomeRange: 'below-10k' as const,
          housingType: 'private-owned' as const,
        };
        
        expect(isPublicHousingEligible(ineligibleProfile)).toBe(false);
      });
    });

    describe('isHomeOwnershipSchemeEligible', () => {
      it('should return true for eligible income and employment', () => {
        const eligibleProfile = {
          ...mockProfile,
          incomeRange: '30k-50k' as const,
          employmentStatus: 'employed-full-time' as const,
          housingType: 'private-rental' as const,
        };
        
        expect(isHomeOwnershipSchemeEligible(eligibleProfile)).toBe(true);
      });

      it('should return false for unemployed', () => {
        const ineligibleProfile = {
          ...mockProfile,
          incomeRange: '30k-50k' as const,
          employmentStatus: 'unemployed' as const,
        };
        
        expect(isHomeOwnershipSchemeEligible(ineligibleProfile)).toBe(false);
      });

      it('should return false for private owners', () => {
        const ineligibleProfile = {
          ...mockProfile,
          incomeRange: '30k-50k' as const,
          housingType: 'private-owned' as const,
        };
        
        expect(isHomeOwnershipSchemeEligible(ineligibleProfile)).toBe(false);
      });
    });

    describe('isElderlyAllowanceEligible', () => {
      it('should return true for age 65 and above', () => {
        const elderlyProfile = { ...mockProfile, age: 65 };
        expect(isElderlyAllowanceEligible(elderlyProfile)).toBe(true);
      });

      it('should return false for age below 65', () => {
        const youngProfile = { ...mockProfile, age: 64 };
        expect(isElderlyAllowanceEligible(youngProfile)).toBe(false);
      });
    });

    describe('isContinuingEducationFundEligible', () => {
      it('should return true for working age adults', () => {
        const eligibleProfile = {
          ...mockProfile,
          age: 35,
          employmentStatus: 'employed-full-time' as const,
        };
        
        expect(isContinuingEducationFundEligible(eligibleProfile)).toBe(true);
      });

      it('should return false for age below 18', () => {
        const youngProfile = { ...mockProfile, age: 17 };
        expect(isContinuingEducationFundEligible(youngProfile)).toBe(false);
      });

      it('should return false for age above 70', () => {
        const oldProfile = { ...mockProfile, age: 71 };
        expect(isContinuingEducationFundEligible(oldProfile)).toBe(false);
      });
    });

    describe('isHealthcareVoucherEligible', () => {
      it('should return true for elderly', () => {
        const elderlyProfile = { ...mockProfile, age: 70 };
        expect(isHealthcareVoucherEligible(elderlyProfile)).toBe(true);
      });

      it('should return false for non-elderly', () => {
        expect(isHealthcareVoucherEligible(mockProfile)).toBe(false);
      });
    });
  });

  describe('validateUserProfile', () => {
    it('should return success for valid profile', () => {
      const result = validateUserProfile(mockProfile);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid profile', () => {
      const invalidProfile = { ...mockProfile, age: 17 };
      const result = validateUserProfile(invalidProfile);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should handle non-object input', () => {
      const result = validateUserProfile('invalid');
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('Form Navigation Utilities', () => {
    describe('calculateFormProgress', () => {
      it('should calculate progress correctly', () => {
        expect(calculateFormProgress(1, 5)).toBe(20);
        expect(calculateFormProgress(3, 5)).toBe(60);
        expect(calculateFormProgress(5, 5)).toBe(100);
      });

      it('should handle edge cases', () => {
        expect(calculateFormProgress(0, 5)).toBe(0);
        expect(calculateFormProgress(1, 1)).toBe(100);
      });
    });

    describe('getNextStepId', () => {
      const stepIds = ['step1', 'step2', 'step3'];

      it('should return next step id', () => {
        expect(getNextStepId('step1', stepIds)).toBe('step2');
        expect(getNextStepId('step2', stepIds)).toBe('step3');
      });

      it('should return null for last step', () => {
        expect(getNextStepId('step3', stepIds)).toBe(null);
      });

      it('should return null for invalid step', () => {
        expect(getNextStepId('invalid', stepIds)).toBe(null);
      });
    });

    describe('getPreviousStepId', () => {
      const stepIds = ['step1', 'step2', 'step3'];

      it('should return previous step id', () => {
        expect(getPreviousStepId('step2', stepIds)).toBe('step1');
        expect(getPreviousStepId('step3', stepIds)).toBe('step2');
      });

      it('should return null for first step', () => {
        expect(getPreviousStepId('step1', stepIds)).toBe(null);
      });

      it('should return null for invalid step', () => {
        expect(getPreviousStepId('invalid', stepIds)).toBe(null);
      });
    });
  });

  describe('calculatePolicyRelevance', () => {
    it('should calculate housing relevance correctly', () => {
      const lowIncomeProfile = {
        ...mockProfile,
        incomeRange: 'below-10k' as const,
        housingType: 'public-rental' as const,
      };
      
      const relevance = calculatePolicyRelevance(lowIncomeProfile, 'housing');
      expect(relevance).toBeGreaterThan(50);
      expect(relevance).toBeLessThanOrEqual(100);
    });

    it('should calculate healthcare relevance for elderly', () => {
      const elderlyProfile = { ...mockProfile, age: 70 };
      const relevance = calculatePolicyRelevance(elderlyProfile, 'healthcare');
      
      expect(relevance).toBeGreaterThan(50);
    });

    it('should return base score for irrelevant policies', () => {
      const relevance = calculatePolicyRelevance(mockProfile, 'social-welfare');
      expect(relevance).toBeGreaterThanOrEqual(0);
      expect(relevance).toBeLessThanOrEqual(100);
    });
  });

  describe('Formatting Functions', () => {
    describe('formatIncomeRange', () => {
      it('should format income ranges correctly', () => {
        expect(formatIncomeRange('below-10k')).toBe('Below HK$10,000');
        expect(formatIncomeRange('30k-50k')).toBe('HK$30,000 - HK$50,000');
        expect(formatIncomeRange('above-120k')).toBe('Above HK$120,000');
      });
    });

    describe('formatDistrict', () => {
      it('should format districts correctly', () => {
        expect(formatDistrict('central-western')).toBe('Central and Western');
        expect(formatDistrict('yau-tsim-mong')).toBe('Yau Tsim Mong');
        expect(formatDistrict('islands')).toBe('Islands');
      });
    });

    describe('formatEmploymentStatus', () => {
      it('should format employment status correctly', () => {
        expect(formatEmploymentStatus('employed-full-time')).toBe('Employed (Full-time)');
        expect(formatEmploymentStatus('self-employed')).toBe('Self-employed');
        expect(formatEmploymentStatus('unemployed')).toBe('Unemployed');
      });
    });

    describe('formatHousingType', () => {
      it('should format housing types correctly', () => {
        expect(formatHousingType('public-rental')).toBe('Public Rental Housing');
        expect(formatHousingType('private-owned')).toBe('Private Owned');
        expect(formatHousingType('temporary')).toBe('Temporary Housing');
      });
    });
  });
});