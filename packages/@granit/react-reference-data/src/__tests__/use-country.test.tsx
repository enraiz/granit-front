import { createQueryWrapper } from '@granit/react-testing';
import { axiosResponse, createMockClient } from '@granit/testing';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCountries, useCountry } from '../hooks/use-country.js';

import type { Country } from '@granit/reference-data';

const mockCountry: Country = {
  code: 'BE',
  alpha3: 'BEL',
  numericCode: '056',
  labelEn: 'Belgium',
  labelFr: 'Belgique',
  labelNl: 'België',
  labelDe: 'Belgien',
  officialName: 'Kingdom of Belgium',
  nativeName: 'België',
  region: 'Europe',
  subRegion: 'Western Europe',
  phoneCode: '+32',
  sortOrder: 1,
  isActive: true,
  validFrom: null,
  validTo: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('useCountry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches a country with the correct URL', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(mockCountry));

    const { result } = renderHook(() => useCountry('BE', { client }), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/api/v1/reference-data/countries/BE');
    expect(result.current.data).toEqual(mockCountry);
  });

  it('uses a custom basePath when provided', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(mockCountry));

    const { result } = renderHook(
      () => useCountry('BE', { client, basePath: '/api/v2/ref/countries' }),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/api/v2/ref/countries/BE');
  });

  it('does not fetch when enabled is false', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useCountry('BE', { client, enabled: false }), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(client.get).not.toHaveBeenCalled();
  });

  it('does not fetch when code is empty', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useCountry('', { client }), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(client.get).not.toHaveBeenCalled();
  });

  it('exposes error state on fetch failure', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useCountry('XX', { client }), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Not found');
  });
});

describe('useCountries', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the country list with default path', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse([mockCountry]));

    const { result } = renderHook(() => useCountries({ client }), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith(
      '/api/v1/reference-data/countries',
      expect.objectContaining({ params: undefined })
    );
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].code).toBe('BE');
  });

  it('passes query params to the request', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse([mockCountry]));

    const { result } = renderHook(
      () => useCountries({ client, params: { region: 'Europe', isActive: true } }),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith(
      '/api/v1/reference-data/countries',
      expect.objectContaining({ params: { region: 'Europe', isActive: true } })
    );
  });

  it('does not fetch when enabled is false', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useCountries({ client, enabled: false }), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(client.get).not.toHaveBeenCalled();
  });
});
