const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  gnewsApiKey: process.env.GNEWS_API_KEY,
  openAiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkApiUrl: process.env.CLERK_API_URL || 'https://api.clerk.com',
  clerkJwksUrl: process.env.CLERK_JWKS_URL,
  clerkJwksPublicKey: process.env.CLERK_JWKS_PUBLIC_KEY
    ? process.env.CLERK_JWKS_PUBLIC_KEY.replace(/\\n/g, '\n')
    : undefined,
  aiProvider: process.env.AI_PROVIDER || 'openai',
  gnewsCountry: process.env.GNEWS_COUNTRY || 'in',
  gnewsLanguage: process.env.GNEWS_LANGUAGE || 'en',
  gnewsMaxPerTopic: Number(process.env.GNEWS_MAX_PER_TOPIC || 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  adminEmails: String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
};
