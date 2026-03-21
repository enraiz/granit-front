import {
  createCountry as createCountryApi,
  updateCountry as updateCountryApi,
  deactivateCountry as deactivateCountryApi,
  reactivateCountry as reactivateCountryApi,
} from '@granit/reference-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { countryKeys } from './use-country.js';

import type { Country } from '@granit/reference-data';
import type { UseMutationResult } from '@tanstack/react-query';
import type { AxiosInstance } from 'axios';

/** Options for mutation hooks. */
export interface ReferenceDataMutationOptions {
  /** Axios instance used for HTTP requests. */
  client: AxiosInstance;
  /** Base path for country admin endpoints. Defaults to '/api/v1/reference-data/countries'. */
  basePath?: string;
}

const DEFAULT_ADMIN_BASE_PATH = '/api/v1/reference-data/countries';

/** Payload for creating a country. */
export type CreateCountryPayload = Omit<Country, 'createdAt' | 'updatedAt'>;

/** Payload for updating a country. */
export interface UpdateCountryPayload {
  code: string;
  data: Partial<Omit<Country, 'code' | 'createdAt' | 'updatedAt'>>;
}

/**
 * Mutation to create a new country.
 *
 * Invalidates the country list on success.
 *
 * @example
 * ```tsx
 * const { mutate: createCountry } = useCreateCountry({ client });
 * createCountry({ code: 'BE', labelFr: 'Belgique', ... });
 * ```
 */
export function useCreateCountry(
  options: ReferenceDataMutationOptions
): UseMutationResult<Country, Error, CreateCountryPayload> {
  const { client, basePath = DEFAULT_ADMIN_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCountryPayload) =>
      createCountryApi(client, basePath, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all }).catch(() => undefined);
    },
  });
}

/**
 * Mutation to update an existing country.
 *
 * Invalidates both the list and the individual country on success.
 *
 * @example
 * ```tsx
 * const { mutate: updateCountry } = useUpdateCountry({ client });
 * updateCountry({ code: 'BE', data: { labelFr: 'Belgique (mis à jour)' } });
 * ```
 */
export function useUpdateCountry(
  options: ReferenceDataMutationOptions
): UseMutationResult<Country, Error, UpdateCountryPayload> {
  const { client, basePath = DEFAULT_ADMIN_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, data }: UpdateCountryPayload) =>
      updateCountryApi(client, basePath, code, data),
    onSuccess: (_data, { code }) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all }).catch(() => undefined);
      queryClient.invalidateQueries({ queryKey: countryKeys.detail(code) }).catch(() => undefined);
    },
  });
}

/**
 * Mutation to deactivate a country (soft delete).
 *
 * Invalidates both the list and the individual country on success.
 *
 * @example
 * ```tsx
 * const { mutate: deactivateCountry } = useDeactivateCountry({ client });
 * deactivateCountry('BE');
 * ```
 */
export function useDeactivateCountry(
  options: ReferenceDataMutationOptions
): UseMutationResult<void, Error, string> {
  const { client, basePath = DEFAULT_ADMIN_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => deactivateCountryApi(client, basePath, code),
    onSuccess: (_data, code) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all }).catch(() => undefined);
      queryClient.invalidateQueries({ queryKey: countryKeys.detail(code) }).catch(() => undefined);
    },
  });
}

/**
 * Mutation to reactivate a previously deactivated country.
 *
 * Invalidates both the list and the individual country on success.
 *
 * @example
 * ```tsx
 * const { mutate: reactivateCountry } = useReactivateCountry({ client });
 * reactivateCountry('BE');
 * ```
 */
export function useReactivateCountry(
  options: ReferenceDataMutationOptions
): UseMutationResult<Country, Error, string> {
  const { client, basePath = DEFAULT_ADMIN_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => reactivateCountryApi(client, basePath, code),
    onSuccess: (_data, code) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all }).catch(() => undefined);
      queryClient.invalidateQueries({ queryKey: countryKeys.detail(code) }).catch(() => undefined);
    },
  });
}
