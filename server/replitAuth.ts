import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";

// ⚠️ DEVELOPMENT-ONLY AUTHENTICATION BYPASS ⚠️
// This file completely disables authentication for rapid development/testing
// DO NOT USE IN PRODUCTION - This would give everyone admin access
// Replace with proper OAuth before any production deployment

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEPLOYED = process.env.REPL_DEPLOYMENT === 'true';

// Block authentication bypass in production or deployed environments
if (IS_PRODUCTION || IS_DEPLOYED) {
  throw new Error(
    '\n\n' +
    '⛔ AUTHENTICATION BYPASS BLOCKED IN PRODUCTION ⛔\n' +
    'This authentication setup is for DEVELOPMENT ONLY.\n' +
    'Current environment: ' + (IS_PRODUCTION ? 'PRODUCTION' : 'DEPLOYED') + '\n' +
    'You must implement proper OAuth authentication before deploying.\n' +
    'See server/replitAuth.ts for OAuth implementation guide.\n'
  );
}

console.log("[AUTH] ⚠️  DEVELOPMENT MODE: Universal auto-login enabled");
console.log("[AUTH] ⚠️  WARNING: All users have admin access with NO authentication");
console.log("[AUTH] ⚠️  This will be blocked in production/deployed environments");

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow both HTTP and HTTPS
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  console.log("[AUTH] Setting up universal auto-login (no OAuth required)");
  
  // Use simple session management
  app.use(getSession());
  
  // All auth routes just redirect to home (no OAuth flow)
  app.get("/api/login", (req, res) => {
    console.log("[AUTH] Login request - redirecting to home (auto-authenticated)");
    res.redirect("/");
  });
  
  app.get("/api/callback", (req, res) => {
    console.log("[AUTH] Callback request - redirecting to home");
    res.redirect("/");
  });
  
  app.get("/api/logout", (req, res) => {
    console.log("[AUTH] Logout request - redirecting to home");
    res.redirect("/");
  });
  
  console.log("[AUTH] ✅ Auth setup complete - all users auto-authenticated");
}

// Universal authentication: All requests are automatically authenticated
// No token checks, no OAuth validation, everyone gets through
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // Everyone is authenticated - just continue
  return next();
};
