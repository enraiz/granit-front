/** Storage and validation type of a feature value. Mirrors `Granit.Features.ValueTypes.FeatureValueType`. */
export type FeatureValueType = 'Toggle' | 'Numeric' | 'Selection';

/** Min/max bounds for Numeric features. Mirrors `Granit.Features.ValueTypes.NumericConstraint`. */
export interface NumericConstraint {
  readonly min: number;
  readonly max: number;
}

/** Allowed values for Selection features. Mirrors `Granit.Features.ValueTypes.SelectionValues`. */
export interface SelectionValues {
  readonly allowedValues: readonly string[];
}

/** Static metadata for a feature. Mirrors `Granit.Features.Definitions.FeatureDefinition`. */
export interface FeatureDefinition {
  readonly name: string;
  readonly defaultValue: string;
  readonly valueType: FeatureValueType;
  readonly numericConstraint: NumericConstraint | null;
  readonly selectionValues: SelectionValues | null;
  readonly displayName: string | null;
  readonly description: string | null;
}

/** Grouped feature definitions. Mirrors `Granit.Features.Definitions.FeatureGroupDefinition`. */
export interface FeatureGroupDefinition {
  readonly name: string;
  readonly displayName: string | null;
  readonly features: readonly FeatureDefinition[];
}

/** Response for `GET /features/values` — all resolved feature values. */
export type FeatureValuesMap = Record<string, string>;

/** Response for `GET /features/values/{name}` — single resolved value. */
export interface FeatureValueResponse {
  readonly name: string;
  readonly value: string;
}

/** Request body for `PUT /features/overrides/{name}`. */
export interface SetFeatureOverrideRequest {
  readonly value: string;
}
