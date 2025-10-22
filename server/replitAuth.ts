import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";

// Universal auto-login: Everyone is automatically authenticated as mock admin
// No OAuth, no popups, works on any URL
console.log("[AUTH] 🔓 Universal auto-login enabled - all users authenticated as mock admin");

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
