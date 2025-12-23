import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Log startup to verify deployment
console.log("🚀 Edge Function v2.2.0 Loaded - Using user_profiles table (No KV)");

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

// XP Calculation - Single source of truth
const XP_PER_LESSON = 110;

function calculateXp(completedLessons: any): number {
  return (
    (completedLessons.stack ? XP_PER_LESSON : 0) +
    (completedLessons.queue ? XP_PER_LESSON : 0) +
    (completedLessons.circular ? XP_PER_LESSON : 0) +
    (completedLessons.priority ? XP_PER_LESSON : 0) +
    (completedLessons.linkedList ? XP_PER_LESSON : 0)
  );
}

function calculateLessonsCompleted(completedLessons: any): number {
  return (
    (completedLessons.stack ? 1 : 0) +
    (completedLessons.queue ? 1 : 0) +
    (completedLessons.circular ? 1 : 0) +
    (completedLessons.priority ? 1 : 0) +
    (completedLessons.linkedList ? 1 : 0)
  );
}

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
  return c.json({ status: "ok", version: "2.2.0" });
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

    // Generate a default username from email
    const defaultUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');

    // Create user with auto-confirm
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { 
        full_name: full_name || email.split('@')[0],
        username: defaultUsername,
        avatar_url: avatar_url
      },
      email_confirm: true 
    });

    if (error) {
      console.error("Supabase createUser error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in database table with completed_lessons field
    if (data.user) {
      try {
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            email: email,
            name: full_name || email.split('@')[0],
            username: defaultUsername,
            avatar_url: avatar_url,
            xp: 0,
            lessons_completed: 0,
            completed_lessons: {
              stack: false,
              queue: false,
              circular: false,
              priority: false,
              linkedList: false
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error("Failed to create user profile:", profileError);
          // If profile creation fails, delete the auth user to maintain consistency
          await supabaseAdmin.auth.admin.deleteUser(data.user.id);
          return c.json({ error: "Failed to create user profile" }, 500);
        }
      } catch (profileErr) {
        console.error("Exception while creating profile:", profileErr);
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
        return c.json({ error: "Failed to create user profile" }, 500);
      }
    }

    return c.json({ success: true, user: data.user });
  } catch (err: any) {
    console.error("Unexpected signup error:", err);
    return c.json({ error: "Internal Server Error: " + (err.message || String(err)) }, 500);
  }
});

// Get User Progress - Fetch from user_profiles table only
app.get("/make-server-2ba06582/progress", async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return c.json({ error: "Server configuration error" }, 500);
  }

  const defaultLessons = {
    stack: false,
    queue: false,
    circular: false,
    priority: false,
    linkedList: false
  };

  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Try to fetch user profile from database
    // Use * to get all columns, then handle what we get
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    // If no profile exists, create one
    if (error || !profile) {
      console.log(`No profile found for user ${user.id}, creating...`);
      const defaultUsername = user.email?.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_') || 'user';
      
      try {
        const { data: newProfile, error: insertError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner',
            username: user.user_metadata?.username || defaultUsername,
            avatar_url: user.user_metadata?.avatar_url,
            xp: 0,
            lessons_completed: 0,
            completed_lessons: defaultLessons,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('*')
          .single();
        
        if (insertError) {
          console.error("Failed to create profile:", insertError);
          // Return default progress even if DB insert fails
          return c.json({
            xp: 0,
            completedLessons: defaultLessons
          });
        }
        
        console.log(`Created profile for user ${user.id}`);
        return c.json({
          xp: newProfile?.xp || 0,
          completedLessons: newProfile?.completed_lessons || defaultLessons
        });
      } catch (insertErr) {
        console.error("Exception creating profile:", insertErr);
        // Return default if creation fails
        return c.json({
          xp: 0,
          completedLessons: defaultLessons
        });
      }
    }
    
    // Profile exists - extract data safely
    const completedLessons = profile.completed_lessons || defaultLessons;
    
    // Calculate XP from completed lessons if xp column missing or 0
    let xp = 0;
    if ('xp' in profile && profile.xp !== undefined && profile.xp !== null) {
      xp = profile.xp;
    } else {
      // XP column might not exist yet - calculate from lessons
      xp = calculateXp(completedLessons);
      console.log(`XP column missing for user ${user.id}, calculated: ${xp}`);
    }
    
    // Return existing profile data
    return c.json({
      xp: xp,
      completedLessons: completedLessons
    });
  } catch (error: any) {
    console.error("Error fetching progress:", error);
    console.error("Error details:", error.message, error.stack);
    
    // Return default progress on error instead of 500
    return c.json({
      xp: 0,
      completedLessons: defaultLessons
    });
  }
});

// Update User Progress - Save to user_profiles table only
app.post("/make-server-2ba06582/progress", async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return c.json({ error: "Server configuration error" }, 500);
  }

  try {
    const body = await c.req.json();
    const { xp, completedLessons } = body;
    
    // Validate input basic structure
    if (typeof completedLessons !== 'object') {
        return c.json({ error: "Invalid data format" }, 400);
    }

    // Calculate XP from completed lessons to ensure consistency
    const calculatedXp = calculateXp(completedLessons);
    const calculatedLessonsCompleted = calculateLessonsCompleted(completedLessons);

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Try to update with all columns first
    let updateData: any = {
      completed_lessons: completedLessons,
      updated_at: new Date().toISOString()
    };
    
    // Try to add xp and lessons_completed if columns exist
    try {
      updateData.xp = calculatedXp;
      updateData.lessons_completed = calculatedLessonsCompleted;
      
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) {
        // Check if error is due to missing column
        if (error.message?.includes('column') && (error.message?.includes('xp') || error.message?.includes('lessons_completed'))) {
          console.warn(`Missing xp or lessons_completed column for user ${user.id}. Update /FIX_XP_TRACKING_NOW.sql`);
          
          // Retry without xp and lessons_completed columns
          const { error: retryError } = await supabaseAdmin
            .from('user_profiles')
            .update({
              completed_lessons: completedLessons,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
          
          if (retryError) {
            console.error("Failed to update profile (retry):", retryError);
            return c.json({ error: "Failed to update progress" }, 500);
          }
          
          console.log(`Updated progress for user ${user.id} (without XP column)`);
          return c.json({ 
            success: true, 
            data: { xp: calculatedXp, completedLessons },
            warning: "XP column missing - run /FIX_XP_TRACKING_NOW.sql to add it"
          });
        } else {
          console.error("Failed to update profile:", error);
          return c.json({ error: "Failed to update progress" }, 500);
        }
      }

      console.log(`Updated progress for user ${user.id}: XP=${calculatedXp}, Lessons=${calculatedLessonsCompleted}`);
      return c.json({ success: true, data: { xp: calculatedXp, completedLessons } });
    } catch (updateErr: any) {
      console.error("Exception updating progress:", updateErr);
      return c.json({ error: "Failed to update progress" }, 500);
    }
  } catch (error: any) {
    console.error("Error saving progress:", error);
    console.error("Error details:", error.message, error.stack);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Delete User Account - Verify username and delete
app.post("/make-server-2ba06582/delete-account", async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return c.json({ error: "Server configuration error" }, 500);
  }

  try {
    const body = await c.req.json();
    const { username } = body;

    if (!username) {
      return c.json({ error: "Username is required" }, 400);
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Fetch user profile to verify username
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('username')
      .eq('user_id', user.id)
      .single();

    if (fetchError || !profile) {
      return c.json({ error: "User profile not found" }, 404);
    }

    // Verify username matches
    if (profile.username !== username) {
      return c.json({ error: "Username does not match" }, 400);
    }

    // Delete user profile from database
    const { error: deleteProfileError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('user_id', user.id);

    if (deleteProfileError) {
      console.error("Failed to delete profile:", deleteProfileError);
      return c.json({ error: "Failed to delete profile" }, 500);
    }

    // Delete user from auth
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteAuthError) {
      console.error("Failed to delete auth user:", deleteAuthError);
      return c.json({ error: "Failed to delete account" }, 500);
    }

    console.log(`Deleted account for user ${user.id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

Deno.serve(app.fetch);