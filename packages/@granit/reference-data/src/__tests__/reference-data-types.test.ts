import { describe, expectTypeOf, it } from 'vitest';

import type { CountriesListParams, Country } from '../index.js';

describe('@granit/reference-data types', () => {
  describe('Country', () => {
    it('should have ISO code fields', () => {
      expectTypeOf<Country>().toHaveProperty('code');
      expectTypeOf<Country['code']>().toBeString();
      expectTypeOf<Country>().toHaveProperty('alpha3');
      expectTypeOf<Country['alpha3']>().toBeString();
      expectTypeOf<Country>().toHaveProperty('numericCode');
      expectTypeOf<Country['numericCode']>().toBeString();
    });

    it('should have multilingual labels', () => {
      expectTypeOf<Country>().toHaveProperty('labelEn');
      expectTypeOf<Country>().toHaveProperty('labelFr');
      expectTypeOf<Country>().toHaveProperty('labelNl');
      expectTypeOf<Country>().toHaveProperty('labelDe');
    });

    it('should have geographic classification', () => {
      expectTypeOf<Country>().toHaveProperty('region');
      expectTypeOf<Country>().toHaveProperty('subRegion');
    });

    it('should have active status and validity period', () => {
      expectTypeOf<Country>().toHaveProperty('isActive');
      expectTypeOf<Country['isActive']>().toBeBoolean();
      expectTypeOf<Country>().toHaveProperty('validFrom');
      expectTypeOf<Country>().toHaveProperty('validTo');
    });

    it('should have audit timestamps', () => {
      expectTypeOf<Country>().toHaveProperty('createdAt');
      expectTypeOf<Country>().toHaveProperty('updatedAt');
    });
  });

  describe('CountriesListParams', () => {
    it('should have optional search and pagination', () => {
      expectTypeOf<CountriesListParams>().toHaveProperty('search');
      expectTypeOf<CountriesListParams>().toHaveProperty('page');
      expectTypeOf<CountriesListParams>().toHaveProperty('pageSize');
    });

    it('should have optional sorting', () => {
      expectTypeOf<CountriesListParams>().toHaveProperty('sortBy');
      expectTypeOf<CountriesListParams>().toHaveProperty('desc');
    });

    it('should have optional filtering', () => {
      expectTypeOf<CountriesListParams>().toHaveProperty('region');
      expectTypeOf<CountriesListParams>().toHaveProperty('isActive');
    });
  });
});
