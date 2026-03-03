'use client';

import { useCallback } from 'react';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';
import useFetchData from '#js/useFetchData';
import { API_REST_BASE } from '#js/constants';

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  strict: false,
});
addErrors(ajv);
addFormats(ajv);

ajv.addKeyword({
  keyword: 'greaterThanField',
  type: ['string'],
  schemaType: 'string',
  errors: true,
  validate: function greaterThanField(
    refField,
    dataValue,
    parentSchema,
    dataCtx
  ) {
    if (dataValue == null) return true;

    const otherRaw = dataCtx.parentData?.[refField];
    if (otherRaw == null) return true;

    const a =
      typeof dataValue === 'string' ? parseInt(dataValue, 10) : dataValue;
    const b = typeof otherRaw === 'string' ? parseInt(otherRaw, 10) : otherRaw;

    if (Number.isNaN(a) || Number.isNaN(b) || a > b) {
      return true;
    }

    greaterThanField.errors = [
      {
        instancePath: `${parentSchema.$ref}/${dataCtx.instancePath}`,
        keyword: 'greaterThanField',
        message: `must be greater than ${refField}`,
        params: { comparison: refField },
      },
    ];
    return false;
  },
});

const schemaCache = {};
const validatorCache = {};
const loadPromises = {};

export default function useJsonSchema() {
  const { fetchData, loading } = useFetchData();

  const loadSchema = useCallback(
    async (id) => {
      if (validatorCache[id]) {
        return validatorCache[id];
      }
      if (loadPromises[id]) {
        return loadPromises[id];
      }

      loadPromises[id] = (async () => {
        let fn = ajv.getSchema(id);
        if (!fn) {
          const schema = await fetchData(`${API_REST_BASE}/schemas/${id}`);
          if (schema instanceof Error) {
            throw schema;
          }

          if (!ajv.getSchema(schema.$id)) {
            ajv.addSchema(schema, schema.$id);
          }
          fn = ajv.getSchema(schema.$id);
          schemaCache[id] = schema;
        }

        validatorCache[id] = fn;
        return fn;
      })();

      return loadPromises[id];
    },
    [fetchData]
  );

  const validate = useCallback(
    async ({ itemTypeData, data, kind = 'draft' }) => {
      let schemaId = itemTypeData.type;
      if (schemaId === 'accomplishment')
        schemaId = `${itemTypeData.type}_${itemTypeData.key}`;

      await loadSchema('shared-definitions');
      const validateFn = await loadSchema(schemaId);

      const toValidate = { ...data, kind };
      const valid = validateFn(toValidate);

      const ajvErrors = validateFn.errors || [];
      const errors = ajvErrors.map((e) =>
        e.keyword === 'required'
          ? `${e.instancePath}/${e.params.missingProperty} ${e.message}`
          : `${e.instancePath} ${e.message}`
      );
      const fields = Array.from(
        new Set(
          ajvErrors.map((e) =>
            e.keyword === 'required'
              ? String(e.params.missingProperty)
              : e.instancePath.replace(/^\//, '')
          )
        )
      ).filter(Boolean);

      return { valid: Boolean(valid), errors, fields };
    },
    [loadSchema]
  );

  return { validate, loading };
}
