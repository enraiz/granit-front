import type {
  ExtractOptions,
  FieldConstraint,
  OpenApiSchema,
  OpenApiSchemaProperty,
  OpenApiSchemaRef,
  OpenApiSpec,
  SchemaConstraints,
  SpecConstraints,
} from './types/index.js';

const MAX_REF_DEPTH = 10;

function resolveRef(
  ref: string,
  schemas: Readonly<Record<string, OpenApiSchema>>
): OpenApiSchema | undefined {
  const name = ref.replace('#/components/schemas/', '');
  return schemas[name];
}

interface ResolvedSchema {
  properties: Record<string, OpenApiSchemaProperty>;
  required: string[];
}

function mergeAllOf(
  schema: OpenApiSchema,
  schemas: Readonly<Record<string, OpenApiSchema>>,
  depth: number
): ResolvedSchema {
  const properties: Record<string, OpenApiSchemaProperty> = {};
  const required = new Set<string>();

  if (schema.required) {
    for (const r of schema.required) {
      required.add(r);
    }
  }

  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      properties[key] = value;
    }
  }

  if (schema.allOf && depth < MAX_REF_DEPTH) {
    for (const entry of schema.allOf) {
      const resolved: OpenApiSchemaRef = entry;

      if (entry.$ref) {
        const refSchema = resolveRef(entry.$ref, schemas);
        if (!refSchema) continue;
        const merged = mergeAllOf(refSchema, schemas, depth + 1);
        for (const [key, value] of Object.entries(merged.properties)) {
          properties[key] = value;
        }
        for (const r of merged.required) {
          required.add(r);
        }
        continue;
      }

      if (resolved.required) {
        for (const r of resolved.required) {
          required.add(r);
        }
      }

      if (resolved.properties) {
        for (const [key, value] of Object.entries(resolved.properties)) {
          properties[key] = value;
        }
      }
    }
  }

  return { properties, required: [...required] };
}

function buildFieldConstraint(prop: OpenApiSchemaProperty, isRequired: boolean): FieldConstraint {
  const constraint: Record<string, unknown> = {};

  if (isRequired) constraint['required'] = true;
  if (prop.maxLength !== undefined) constraint['maxLength'] = prop.maxLength;
  if (prop.minLength !== undefined) constraint['minLength'] = prop.minLength;
  if (prop.pattern !== undefined) constraint['pattern'] = prop.pattern;
  if (prop.format !== undefined) constraint['format'] = prop.format;
  if (prop.minimum !== undefined) constraint['minimum'] = prop.minimum;
  if (prop.maximum !== undefined) constraint['maximum'] = prop.maximum;
  if (prop.exclusiveMinimum !== undefined) constraint['exclusiveMinimum'] = prop.exclusiveMinimum;
  if (prop.exclusiveMaximum !== undefined) constraint['exclusiveMaximum'] = prop.exclusiveMaximum;
  if (prop['x-granit-validator'] !== undefined)
    constraint['granitValidator'] = prop['x-granit-validator'];

  return constraint as FieldConstraint;
}

/**
 * Extracts validation constraints from an OpenAPI spec.
 * Resolves `$ref` pointers and merges `allOf` compositions.
 */
export function extractConstraints(spec: OpenApiSpec, options?: ExtractOptions): SpecConstraints {
  const schemas = spec.components?.schemas ?? {};
  const result: Record<string, SchemaConstraints> = {};

  let schemaNames = Object.keys(schemas);

  if (options?.schemas) {
    const whitelist = new Set(options.schemas);
    schemaNames = schemaNames.filter((name) => whitelist.has(name));
  }

  if (options?.schemaPattern) {
    schemaNames = schemaNames.filter((name) => options.schemaPattern!.test(name));
  }

  for (const name of schemaNames) {
    const schema = schemas[name];
    const { properties, required } = mergeAllOf(schema, schemas, 0);
    const requiredSet = new Set(required);

    const fields: Record<string, FieldConstraint> = {};

    for (const [fieldName, prop] of Object.entries(properties)) {
      fields[fieldName] = buildFieldConstraint(prop, requiredSet.has(fieldName));
    }

    if (Object.keys(fields).length > 0) {
      result[name] = fields;
    }
  }

  return result;
}
