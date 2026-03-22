import { describe, expectTypeOf, it } from 'vitest';

import type {
  ReferenceDataCreateRequest,
  ReferenceDataEntry,
  ReferenceDataQuery,
  ReferenceDataUpdateRequest,
} from '../index.js';

describe('@granit/reference-data types', () => {
  describe('ReferenceDataEntry', () => {
    it('should have a code business key', () => {
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('code');
      expectTypeOf<ReferenceDataEntry['code']>().toBeString();
    });

    it('should have all 14 multilingual labels', () => {
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelEn');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelFr');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelNl');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelDe');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelEs');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelIt');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelPt');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelZh');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelJa');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelPl');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelTr');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelKo');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelSv');
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('labelCs');
    });

    it('should have a server-computed label', () => {
      expectTypeOf<ReferenceDataEntry>().toHaveProperty('label');
      expectTypeOf<ReferenceDataEntry['label']>().toBeString();
    });

    it('should have active status, sort order, and validity period', () => {
      expectTypeOf<ReferenceDataEntry['isActive']>().toBeBoolean();
      expectTypeOf<ReferenceDataEntry['sortOrder']>().toBeNumber();
      expectTypeOf<ReferenceDataEntry['validFrom']>().toEqualTypeOf<string | null>();
      expectTypeOf<ReferenceDataEntry['validTo']>().toEqualTypeOf<string | null>();
    });

    it('should have audit trail fields', () => {
      expectTypeOf<ReferenceDataEntry['createdAt']>().toBeString();
      expectTypeOf<ReferenceDataEntry['createdBy']>().toBeString();
      expectTypeOf<ReferenceDataEntry['modifiedAt']>().toEqualTypeOf<string | null>();
      expectTypeOf<ReferenceDataEntry['modifiedBy']>().toEqualTypeOf<string | null>();
    });

    it('should be extensible by concrete entity types', () => {
      interface Country extends ReferenceDataEntry {
        readonly alpha3: string;
        readonly region: string;
      }

      expectTypeOf<Country>().toMatchTypeOf<ReferenceDataEntry>();
      expectTypeOf<Country>().toHaveProperty('alpha3');
      expectTypeOf<Country>().toHaveProperty('code');
    });
  });

  describe('ReferenceDataCreateRequest', () => {
    it('should require code and labelEn', () => {
      expectTypeOf<ReferenceDataCreateRequest>().toHaveProperty('code');
      expectTypeOf<ReferenceDataCreateRequest['code']>().toBeString();
      expectTypeOf<ReferenceDataCreateRequest>().toHaveProperty('labelEn');
      expectTypeOf<ReferenceDataCreateRequest['labelEn']>().toBeString();
    });

    it('should have optional secondary labels', () => {
      expectTypeOf<ReferenceDataCreateRequest['labelFr']>().toEqualTypeOf<string | undefined>();
      expectTypeOf<ReferenceDataCreateRequest['labelNl']>().toEqualTypeOf<string | undefined>();
    });

    it('should have optional sortOrder and validity dates', () => {
      expectTypeOf<ReferenceDataCreateRequest['sortOrder']>().toEqualTypeOf<number | undefined>();
      expectTypeOf<ReferenceDataCreateRequest['validFrom']>().toEqualTypeOf<
        string | null | undefined
      >();
    });

    it('should not have isActive (always true on creation)', () => {
      expectTypeOf<ReferenceDataCreateRequest>().not.toHaveProperty('isActive');
    });
  });

  describe('ReferenceDataUpdateRequest', () => {
    it('should require labelEn', () => {
      expectTypeOf<ReferenceDataUpdateRequest['labelEn']>().toBeString();
    });

    it('should not have code (immutable, passed as path param)', () => {
      expectTypeOf<ReferenceDataUpdateRequest>().not.toHaveProperty('code');
    });

    it('should have optional isActive for reactivation', () => {
      expectTypeOf<ReferenceDataUpdateRequest['isActive']>().toEqualTypeOf<boolean | undefined>();
    });
  });

  describe('ReferenceDataQuery', () => {
    it('should have all optional query parameters', () => {
      expectTypeOf<ReferenceDataQuery['activeOnly']>().toEqualTypeOf<boolean | undefined>();
      expectTypeOf<ReferenceDataQuery['search']>().toEqualTypeOf<string | undefined>();
      expectTypeOf<ReferenceDataQuery['sortBy']>().toEqualTypeOf<string | undefined>();
      expectTypeOf<ReferenceDataQuery['descending']>().toEqualTypeOf<boolean | undefined>();
      expectTypeOf<ReferenceDataQuery['page']>().toEqualTypeOf<number | undefined>();
      expectTypeOf<ReferenceDataQuery['pageSize']>().toEqualTypeOf<number | undefined>();
    });
  });
});
