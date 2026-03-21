import { z } from 'zod';

const inputSchema = z.object({
  text: z.string().min(1, 'Input text is required').max(5000, 'Text too long'),
});

export function validateInput(req, res, next) {
  try {
    inputSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors[0].message });
  }
}
