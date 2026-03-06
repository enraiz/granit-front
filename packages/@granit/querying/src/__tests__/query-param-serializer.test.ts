import { describe, expect, it } from 'vitest';

import { parseQueryParams, serializeQueryParams } from '../api/query-param-serializer.js';

import type { QueryParams } from '../types/query-params.js';

describe('serializeQueryParams', () => {
  it('serializes empty params to empty string', () => {
    expect(serializeQueryParams({})).toBe('');
  });

  it('serializes page and pageSize', () => {
    const result = serializeQueryParams({ page: 2, pageSize: 50 });
    expect(result).toContain('page=2');
    expect(result).toContain('pageSize=50');
  });

  it('serializes search', () => {
    const result = serializeQueryParams({ search: 'Dupont' });
    expect(result).toContain('search=Dupont');
  });

  it('serializes cursor', () => {
    const result = serializeQueryParams({ cursor: 'abc123' });
    expect(result).toContain('cursor=abc123');
  });

  it('serializes filters with field.operator syntax', () => {
    const result = serializeQueryParams({
      filters: [
        { field: 'status', operator: 'Eq', value: 'active' },
        { field: 'age', operator: 'Gte', value: '18' },
      ],
    });
    const params = new URLSearchParams(result);
    expect(params.get('filter[status.Eq]')).toBe('active');
    expect(params.get('filter[age.Gte]')).toBe('18');
  });

  it('serializes sort with descending prefix', () => {
    const result = serializeQueryParams({
      sort: [
        { field: 'createdAt', direction: 'desc' },
        { field: 'lastName', direction: 'asc' },
      ],
    });
    expect(result).toContain('sort=-createdAt%2ClastName');
  });

  it('serializes presets by group', () => {
    const result = serializeQueryParams({
      presets: { status: ['Active', 'Pending'] },
    });
    const params = new URLSearchParams(result);
    expect(params.get('presets[status]')).toBe('Active,Pending');
  });

  it('skips empty preset groups', () => {
    const result = serializeQueryParams({
      presets: { status: [] },
    });
    expect(result).not.toContain('presets');
  });

  it('serializes quickFilters as comma-separated', () => {
    const result = serializeQueryParams({
      quickFilters: ['MyItems', 'Unread'],
    });
    expect(result).toContain('quickFilters=MyItems%2CUnread');
  });

  it('serializes groupBy', () => {
    const result = serializeQueryParams({ groupBy: 'status' });
    expect(result).toContain('groupBy=status');
  });

  it('serializes a full query', () => {
    const params: QueryParams = {
      page: 1,
      pageSize: 20,
      search: 'test',
      filters: [{ field: 'name', operator: 'Contains', value: 'John' }],
      sort: [{ field: 'createdAt', direction: 'desc' }],
      presets: { category: ['Electronics'] },
      quickFilters: ['MyItems'],
      groupBy: 'status',
    };
    const result = serializeQueryParams(params);
    const urlParams = new URLSearchParams(result);
    expect(urlParams.get('page')).toBe('1');
    expect(urlParams.get('pageSize')).toBe('20');
    expect(urlParams.get('search')).toBe('test');
    expect(urlParams.get('filter[name.Contains]')).toBe('John');
    expect(urlParams.get('sort')).toBe('-createdAt');
    expect(urlParams.get('presets[category]')).toBe('Electronics');
    expect(urlParams.get('quickFilters')).toBe('MyItems');
    expect(urlParams.get('groupBy')).toBe('status');
  });
});

describe('parseQueryParams', () => {
  it('parses empty string', () => {
    const result = parseQueryParams('');
    expect(result).toEqual({});
  });

  it('parses page and pageSize', () => {
    const result = parseQueryParams('page=2&pageSize=50');
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(50);
  });

  it('parses search', () => {
    const result = parseQueryParams('search=Dupont');
    expect(result.search).toBe('Dupont');
  });

  it('parses cursor', () => {
    const result = parseQueryParams('cursor=abc123');
    expect(result.cursor).toBe('abc123');
  });

  it('parses filters', () => {
    const result = parseQueryParams('filter[status.Eq]=active&filter[age.Gte]=18');
    expect(result.filters).toEqual([
      { field: 'status', operator: 'Eq', value: 'active' },
      { field: 'age', operator: 'Gte', value: '18' },
    ]);
  });

  it('parses sort with descending prefix', () => {
    const result = parseQueryParams('sort=-createdAt,lastName');
    expect(result.sort).toEqual([
      { field: 'createdAt', direction: 'desc' },
      { field: 'lastName', direction: 'asc' },
    ]);
  });

  it('parses presets', () => {
    const result = parseQueryParams('presets[status]=Active,Pending');
    expect(result.presets).toEqual({ status: ['Active', 'Pending'] });
  });

  it('parses quickFilters', () => {
    const result = parseQueryParams('quickFilters=MyItems,Unread');
    expect(result.quickFilters).toEqual(['MyItems', 'Unread']);
  });

  it('parses groupBy', () => {
    const result = parseQueryParams('groupBy=status');
    expect(result.groupBy).toBe('status');
  });

  it('round-trips a full query', () => {
    const original: QueryParams = {
      page: 1,
      pageSize: 20,
      search: 'test',
      filters: [{ field: 'name', operator: 'Contains', value: 'John' }],
      sort: [{ field: 'createdAt', direction: 'desc' }],
      presets: { category: ['Electronics'] },
      quickFilters: ['MyItems'],
      groupBy: 'status',
    };
    const serialized = serializeQueryParams(original);
    const parsed = parseQueryParams(serialized);
    expect(parsed.page).toBe(original.page);
    expect(parsed.pageSize).toBe(original.pageSize);
    expect(parsed.search).toBe(original.search);
    expect(parsed.filters).toEqual(original.filters);
    expect(parsed.sort).toEqual(original.sort);
    expect(parsed.presets).toEqual(original.presets);
    expect(parsed.quickFilters).toEqual(original.quickFilters);
    expect(parsed.groupBy).toBe(original.groupBy);
  });
});
