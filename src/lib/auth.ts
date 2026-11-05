
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Required environment variables
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "kindredacts_db";
const authSecret = process.env.BETTER_AUTH_SECRET;
const appUrl = process.env.BETTER_AUTH_URL;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing in environment variables.");
}

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is missing in environment variables.");
}

if (authSecret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters long.");
}

if (!appUrl) {
  throw new Error("BETTER_AUTH_URL is missing in environment variables.");
}

// Validate application URL
let productionOrigin: string;

try {
  productionOrigin = new URL(appUrl).origin;
} catch {
  throw new Error("BETTER_AUTH_URL must be a valid URL.");
}

// MongoDB connection reuse
declare global {
  // eslint-disable-next-line no-var
  var mongoClientInstance: MongoClient | undefined;
}

const client =
  global.mongoClientInstance ||
  new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  global.mongoClientInstance = client;
}

const db = client.db(dbName);

// Google OAuth credentials
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const socialProviders =
  googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : {};

if (!googleClientId || !googleClientSecret) {
  console.warn(
    "Google OAuth is not configured. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
  );
}

// Better Auth configuration
export const auth = betterAuth({
  appName: "KindredActs",

  baseURL: appUrl,

  secret: authSecret,

  database: mongodbAdapter(db),

  trustedOrigins: [
    productionOrigin,
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:3000"]
      : []),
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
  },

  socialProviders,
});
