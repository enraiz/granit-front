import { createQueryWrapper } from '@granit/react-testing';
import { axiosResponse, createMockClient } from '@granit/testing';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  useCreateCountry,
  useDeactivateCountry,
  useReactivateCountry,
  useUpdateCountry,
} from '../hooks/use-country-mutations.js';

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

describe('useCreateCountry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends a POST request to the admin endpoint', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockResolvedValue(axiosResponse(mockCountry));

    const { result } = renderHook(() => useCreateCountry({ client }), {
      wrapper: createQueryWrapper(),
    });

    const payload = {
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
    };

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.post).toHaveBeenCalledWith('/api/v1/reference-data/countries', payload);
    expect(result.current.data).toEqual(mockCountry);
  });

  it('uses a custom basePath when provided', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockResolvedValue(axiosResponse(mockCountry));

    const { result } = renderHook(
      () => useCreateCountry({ client, basePath: '/api/v2/admin/countries' }),
      { wrapper: createQueryWrapper() }
    );

    act(() => {
      result.current.mutate({ ...mockCountry });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.post).toHaveBeenCalledWith('/api/v2/admin/countries', expect.anything());
  });

  it('exposes error state on failure', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockRejectedValue(new Error('Forbidden'));

    const { result } = renderHook(() => useCreateCountry({ client }), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.mutate({ ...mockCountry });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Forbidden');
  });
});

describe('useUpdateCountry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends a PUT request with code and data', async () => {
    const client = createMockClient();
    const updated = { ...mockCountry, labelFr: 'Belgique (MAJ)' };
    vi.mocked(client.put).mockResolvedValue(axiosResponse(updated));

    const { result } = renderHook(() => useUpdateCountry({ client }), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.mutate({ code: 'BE', data: { labelFr: 'Belgique (MAJ)' } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.put).toHaveBeenCalledWith('/api/v1/reference-data/countries/BE', {
      labelFr: 'Belgique (MAJ)',
    });
    expect(result.current.data?.labelFr).toBe('Belgique (MAJ)');
  });

  it('exposes error state on failure', async () => {
    const client = createMockClient();
    vi.mocked(client.put).mockRejectedValue(new Error('Conflict'));

    const { result } = renderHook(() => useUpdateCountry({ client }), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.mutate({ code: 'BE', data: { labelFr: 'Updated' } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Conflict');
  });
});

describe('useDeactivateCountry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends a DELETE request for the given code', async () => {
    const client = createMockClient();
    vi.mocked(client.delete).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useDeactivateCountry({ client }), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.mutate('BE');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.delete).toHaveBeenCalledWith('/api/v1/reference-data/countries/BE');
  });

  it('exposes error state on failure', async () => {
    const client = createMockClient();
    vi.mocked(client.delete).mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useDeactivateCountry({ client }), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.mutate('XX');
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Not found');
  });
});

describe('useReactivateCountry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends a PUT request with isActive: true', async () => {
    const client = createMockClient();
    const reactivated = { ...mockCountry, isActive: true };
    vi.mocked(client.put).mockResolvedValue(axiosResponse(reactivated));

    const { result } = renderHook(() => useReactivateCountry({ client }), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.mutate('BE');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.put).toHaveBeenCalledWith('/api/v1/reference-data/countries/BE', {
      isActive: true,
    });
    expect(result.current.data?.isActive).toBe(true);
  });

  it('exposes error state on failure', async () => {
    const client = createMockClient();
    vi.mocked(client.put).mockRejectedValue(new Error('Unprocessable'));

    const { result } = renderHook(() => useReactivateCountry({ client }), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.mutate('BE');
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Unprocessable');
  });
});
