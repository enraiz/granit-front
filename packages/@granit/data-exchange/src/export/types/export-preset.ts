/**
 * Response DTO for a saved export preset.
 * Mirrors `Granit.DataExchange.Endpoints.Dtos.Export.ExportPresetResponse`.
 */
export interface ExportPresetResponse {
  readonly definitionName: string;
  readonly presetName: string;
  readonly selectedFields: readonly string[];
  readonly format: string;
  readonly includeIdForImport: boolean;
}

/**
 * Request DTO for saving an export preset.
 * Mirrors `Granit.DataExchange.Endpoints.Dtos.Export.SaveExportPresetRequest`.
 */
export interface SaveExportPresetRequest {
  readonly definitionName: string;
  readonly presetName: string;
  readonly selectedFields: readonly string[];
  readonly format: string;
  readonly includeIdForImport: boolean;
}
