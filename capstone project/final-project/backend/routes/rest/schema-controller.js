import { Router } from 'express';
import { jsonSchemas } from '#root/services/validator.js';

const router = Router();

router.get('/schemas/:schemaId', (req, res) => {
  const { schemaId } = req.params;
  const schema = jsonSchemas.find((s) => s.$id === schemaId);
  if (!schema) {
    return res.status(404).json({ message: `Schema "${schemaId}" not found` });
  }
  res.json(schema);
});

export default router;
