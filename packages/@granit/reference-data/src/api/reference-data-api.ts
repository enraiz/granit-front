import type { Country, CountriesListParams } from '../types/index.js';
import type { AxiosInstance } from 'axios';

/**
 * Fetch all countries with optional filters.
 *
 * `GET {basePath}?search=&region=&isActive=`
 */
export async function fetchCountries(
  client: AxiosInstance,
  basePath: string,
  params?: CountriesListParams
): Promise<Country[]> {
  const { data } = await client.get<Country[]>(basePath, { params });
  return data;
}

/**
 * Fetch a single country by its ISO 3166-1 alpha-2 code.
 *
 * `GET {basePath}/{code}`
 */
export async function fetchCountry(
  client: AxiosInstance,
  basePath: string,
  code: string
): Promise<Country> {
  const { data } = await client.get<Country>(`${basePath}/${encodeURIComponent(code)}`);
  return data;
}

/**
 * Create a new country.
 *
 * `POST {basePath}`
 */
export async function createCountry(
  client: AxiosInstance,
  basePath: string,
  payload: Omit<Country, 'createdAt' | 'updatedAt'>
): Promise<Country> {
  const { data } = await client.post<Country>(basePath, payload);
  return data;
}

/**
 * Update an existing country.
 *
 * `PUT {basePath}/{code}`
 */
export async function updateCountry(
  client: AxiosInstance,
  basePath: string,
  code: string,
  payload: Partial<Omit<Country, 'code' | 'createdAt' | 'updatedAt'>>
): Promise<Country> {
  const { data } = await client.put<Country>(`${basePath}/${encodeURIComponent(code)}`, payload);
  return data;
}

/**
 * Deactivate a country (soft delete).
 *
 * `DELETE {basePath}/{code}`
 */
export async function deactivateCountry(
  client: AxiosInstance,
  basePath: string,
  code: string
): Promise<void> {
  await client.delete(`${basePath}/${encodeURIComponent(code)}`);
}

/**
 * Reactivate a previously deactivated country.
 *
 * `PUT {basePath}/{code}`
 */
export async function reactivateCountry(
  client: AxiosInstance,
  basePath: string,
  code: string
): Promise<Country> {
  const { data } = await client.put<Country>(`${basePath}/${encodeURIComponent(code)}`, {
    isActive: true,
  });
  return data;
}
