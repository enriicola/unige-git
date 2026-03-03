import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemasLocation = __dirname + '/../schemas';

export const jsonSchemas = [];
const files = await fs.readdir(schemasLocation, { recursive: true });
for (const file of files) {
  const filepath = schemasLocation + '/' + file;
  const stat = await fs.lstat(filepath);
  if (stat.isFile()) {
    const jsonTxt = await fs.readFile(filepath, 'utf8');
    jsonSchemas.push(JSON.parse(jsonTxt));
  }
}

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  schemas: jsonSchemas,
});

ajvErrors(ajv);
ajvFormats(ajv);
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

ajv.addKeyword({
  keyword: 'greaterOrEqualThanField',
  type: ['string'],
  schemaType: 'string',
  errors: true,
  validate: function greaterOrEqualThanField(
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

    if (Number.isNaN(a) || Number.isNaN(b) || a > b || a === b) return true;

    greaterOrEqualThanField.errors = [
      {
        instancePath: `${parentSchema.$ref}/${dataCtx.instancePath}`,
        keyword: 'greaterOrEqualThanField',
        message: `must be greater or equal than ${refField}`,
        params: { comparison: refField },
      },
    ];
    return false;
  },
});

export function getValidator(schemaId) {
  return ajv.getSchema(schemaId);
}

export default getValidator;
