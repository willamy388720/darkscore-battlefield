import { z } from "zod";

const envSchema = z.object({
  WEB_ENV: z.enum(["dev", "production", "test"]),
  API_KEY: z.string(),
  AUTH_DOMAIN: z.string(),
  PROJECT_ID: z.string(),
  STORAGE_BUCKET: z.string(),
  MESSAGING_SENDER_ID: z.string(),
  API_ID: z.string(),
  MEASUREMENT_ID: z.string(),
  DATABASE_URL_DEVELOPMENT: z.string(),
  DATABASE_URL_PRODUCTION: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables!", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;