/**
 * Metadata about a single exportable field.
 * Mirrors `Granit.DataExchange.Endpoints.Dtos.Export.ExportFieldResponse`.
 */
export interface ExportField {
  readonly propertyPath: string;
  readonly clrTypeName: string;
  readonly header: string | null;
  readonly format: string | null;
  readonly order: number;
  readonly isNavigation: boolean;
}

/**
 * Summary of a registered export definition.
 * Mirrors `Granit.DataExchange.Endpoints.Dtos.Export.ExportDefinitionResponse`.
 */
export interface ExportDefinitionResponse {
  readonly name: string;
  readonly entityType: string;
  readonly supportedFormats: readonly string[];
}
