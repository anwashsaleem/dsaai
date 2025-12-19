import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "X-Client-Info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
  }),
);

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Middleware to get user from Auth header
async function getUser(c: any) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
}

// Health check endpoint
app.get("/make-server-2ba06582/health", (c) => {
  return c.json({ status: "ok" });
});

// Server-side Signup (Bypasses email confirmation)
app.post("/make-server-2ba06582/signup", async (c) => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Server configuration error: Missing Supabase URL or Service Role Key");
    return c.json({ error: "Server configuration error. Please contact support." }, 500);
  }

  try {
    const body = await c.req.json();
    const { email, password, full_name, avatar_url } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Create user with auto-confirm
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { 
        full_name: full_name,
        avatar_url: avatar_url
      },
      email_confirm: true 
    });

    if (error) {
      console.error("Supabase createUser error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (err: any) {
    console.error("Unexpected signup error:", err);
    return c.json({ error: "Internal Server Error: " + (err.message || String(err)) }, 500);
  }
});

// Get User Progress
app.get("/make-server-2ba06582/progress", async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const key = `progress:${user.id}`;
    const data = await kv.get(key);
    // Return default structure if no data exists
    return c.json(data || { 
      xp: 0, 
      completedLessons: {
        stack: false,
        queue: false,
        circular: false,
        priority: false,
        linkedList: false
      } 
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Update User Progress
app.post("/make-server-2ba06582/progress", async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await c.req.json();
    const { xp, completedLessons } = body;
    
    // Validate input basic structure
    if (typeof xp !== 'number' || typeof completedLessons !== 'object') {
        return c.json({ error: "Invalid data format" }, 400);
    }

    const key = `progress:${user.id}`;
    const value = { xp, completedLessons, lastUpdated: new Date().toISOString() };
    
    await kv.set(key, value);
    return c.json({ success: true, data: value });
  } catch (error) {
    console.error("Error saving progress:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

Deno.serve(app.fetch);