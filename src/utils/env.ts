import { z } from 'zod';

const rawEnvSchema = z.object({
  APP_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development'),
  SERVER_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: 'SERVER_PORT must be a number' })
    .default('5000'),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
});

const parsed = rawEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = {
  ...parsed.data,
  BASE_URL: parsed.data.NEXT_PUBLIC_BASE_URL,
};
