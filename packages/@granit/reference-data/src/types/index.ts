/** Country reference data entry. Mirrors Granit.ReferenceData.Country .NET. */
export interface Country {
  readonly code: string;
  readonly alpha3: string;
  readonly numericCode: string;
  readonly labelEn: string;
  readonly labelFr: string;
  readonly labelNl: string;
  readonly labelDe: string;
  readonly officialName: string;
  readonly nativeName: string;
  readonly region: string;
  readonly subRegion: string;
  readonly phoneCode: string;
  readonly sortOrder: number;
  readonly isActive: boolean;
  readonly validFrom: string | null;
  readonly validTo: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Parameters for listing countries. */
export interface CountriesListParams {
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
  readonly sortBy?: string;
  readonly desc?: boolean;
  readonly region?: string;
  readonly isActive?: boolean;
}
