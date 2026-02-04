import { NDAFormData, PartyInfo, defaultFormData } from '@/types/nda';

describe('NDAFormData types and defaults', () => {
  describe('defaultFormData', () => {
    it('has correct default purpose', () => {
      expect(defaultFormData.purpose).toBe(
        'Evaluating whether to enter into a business relationship with the other party.'
      );
    });

    it('has effective date set to today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(defaultFormData.effectiveDate).toBe(today);
    });

    it('has expires as default MNDA term type', () => {
      expect(defaultFormData.mndaTermType).toBe('expires');
    });

    it('has 1 year as default MNDA term years', () => {
      expect(defaultFormData.mndaTermYears).toBe(1);
    });

    it('has years as default confidentiality term type', () => {
      expect(defaultFormData.confidentialityTermType).toBe('years');
    });

    it('has 1 year as default confidentiality term years', () => {
      expect(defaultFormData.confidentialityTermYears).toBe(1);
    });

    it('has empty governing law', () => {
      expect(defaultFormData.governingLaw).toBe('');
    });

    it('has empty jurisdiction', () => {
      expect(defaultFormData.jurisdiction).toBe('');
    });

    it('has empty modifications', () => {
      expect(defaultFormData.modifications).toBe('');
    });

    it('has empty party1 fields', () => {
      expect(defaultFormData.party1).toEqual({
        name: '',
        title: '',
        company: '',
        noticeAddress: '',
        date: '',
      });
    });

    it('has empty party2 fields', () => {
      expect(defaultFormData.party2).toEqual({
        name: '',
        title: '',
        company: '',
        noticeAddress: '',
        date: '',
      });
    });
  });

  describe('type structure', () => {
    it('NDAFormData has all required fields', () => {
      const formData: NDAFormData = defaultFormData;

      // These type assertions verify the structure at compile time
      expect(typeof formData.purpose).toBe('string');
      expect(typeof formData.effectiveDate).toBe('string');
      expect(formData.mndaTermType === 'expires' || formData.mndaTermType === 'continues').toBe(true);
      expect(typeof formData.mndaTermYears).toBe('number');
      expect(
        formData.confidentialityTermType === 'years' || formData.confidentialityTermType === 'perpetuity'
      ).toBe(true);
      expect(typeof formData.confidentialityTermYears).toBe('number');
      expect(typeof formData.governingLaw).toBe('string');
      expect(typeof formData.jurisdiction).toBe('string');
      expect(typeof formData.modifications).toBe('string');
      expect(typeof formData.party1).toBe('object');
      expect(typeof formData.party2).toBe('object');
    });

    it('PartyInfo has all required fields', () => {
      const party: PartyInfo = defaultFormData.party1;

      expect(typeof party.name).toBe('string');
      expect(typeof party.title).toBe('string');
      expect(typeof party.company).toBe('string');
      expect(typeof party.noticeAddress).toBe('string');
      expect(typeof party.date).toBe('string');
    });
  });
});
