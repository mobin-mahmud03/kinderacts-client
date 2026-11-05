
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// MongoDB configuration
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const dbName = process.env.DB_NAME || "kindredacts_db";

// MongoDB client
const client = new MongoClient(mongoUri);
const db = client.db(dbName);

// Application URL
const appUrl =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

// Trusted origins
const trustedOrigins = [
  "http://localhost:3000",
  appUrl,
  process.env.NEXT_PUBLIC_APP_URL,
].filter((origin): origin is string => Boolean(origin));

// Better Auth configuration
export const auth = betterAuth({
  appName: "KinderActs",

  baseURL: appUrl,

  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db),

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

});
