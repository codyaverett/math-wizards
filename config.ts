// Application configuration
// Loads environment variables and exports configuration object

import { load } from "$std/dotenv/mod.ts";

await load({ export: true, allowEmptyValues: true });

export const config = {
  // Application
  port: parseInt(Deno.env.get("PORT") || "8000"),
  env: Deno.env.get("DENO_ENV") || "development",
  logLevel: Deno.env.get("LOG_LEVEL") || "info",

  // Database
  database: {
    path: Deno.env.get("DATABASE_PATH") || "./data/maths-wizards.db",
  },

  // Security
  security: {
    allowedOrigins: Deno.env.get("ALLOWED_ORIGINS")?.split(",") || ["http://localhost:8000"],
    sessionSecret: Deno.env.get("SESSION_SECRET") || "dev-secret",
    maxCodeExecutionTime: parseInt(Deno.env.get("MAX_CODE_EXECUTION_TIME") || "5000"),
  },

  // Features
  features: {
    enableTIBasic: Deno.env.get("ENABLE_TI_BASIC") === "true",
    enableAssembly: Deno.env.get("ENABLE_ASSEMBLY") === "true",
  },

  // Ads
  ads: {
    googleAdsenseId: Deno.env.get("GOOGLE_ADSENSE_ID"),
  },

  // Email (future)
  email: {
    smtpHost: Deno.env.get("SMTP_HOST"),
    smtpPort: parseInt(Deno.env.get("SMTP_PORT") || "587"),
    smtpUser: Deno.env.get("SMTP_USER"),
    smtpPass: Deno.env.get("SMTP_PASS"),
  },
};

// Helper to check if we're in development mode
export const isDev = () => config.env === "development";
export const isProd = () => config.env === "production";
