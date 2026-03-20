import { describe, expect, it } from 'vitest';

import { BlobStatus } from '../types/index.js';

describe('BlobStatus', () => {
  it('should match .NET enum values', () => {
    expect(BlobStatus.Pending).toBe(0);
    expect(BlobStatus.Uploading).toBe(1);
    expect(BlobStatus.Valid).toBe(2);
    expect(BlobStatus.Rejected).toBe(3);
    expect(BlobStatus.Deleted).toBe(4);
  });

  it('should have exactly 5 members', () => {
    expect(Object.keys(BlobStatus)).toHaveLength(5);
  });
});
