import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Log startup to verify deployment
console.log("🚀 Edge Function v2.2.0 Loaded - Using user_profiles table (No KV)");

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Create storage bucket on startup
(async () => {
  try {
    if (supabaseUrl && supabaseServiceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
      const bucketName = 'make-2ba06582-avatars';
      
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        await supabaseAdmin.storage.createBucket(bucketName, {
          public: false,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
        });
        console.log(`✅ Created storage bucket: ${bucketName}`);
      } else {
        console.log(`✅ Storage bucket already exists: ${bucketName}`);
      }
    }
  } catch (err) {
    console.error('⚠️ Failed to create storage bucket:', err);
  }
})();

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

// XP Calculation - Single source of truth
const LESSON_XP_MAP = {
  stack: 110,
  queue: 120,
  circular: 135,
  priority: 145,
  linkedList: 170
};

function calculateXp(completedLessons: any): number {
  return (
    (completedLessons.stack ? LESSON_XP_MAP.stack : 0) +
    (completedLessons.queue ? LESSON_XP_MAP.queue : 0) +
    (completedLessons.circular ? LESSON_XP_MAP.circular : 0) +
    (completedLessons.priority ? LESSON_XP_MAP.priority : 0) +
    (completedLessons.linkedList ? LESSON_XP_MAP.linkedList : 0)
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
        // Use UPSERT to handle cases where profile already exists
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .upsert({
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
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });

        if (profileError) {
          console.error("Failed to create user profile:", profileError);
          
          // If it's not a duplicate error, delete the auth user to maintain consistency
          if (profileError.code !== '23505') {
            await supabaseAdmin.auth.admin.deleteUser(data.user.id);
          }
          
          return c.json({ error: "Failed to create user profile: " + profileError.message }, 500);
        }
        
        console.log(`✅ User profile created/updated for user: ${data.user.id}`);
      } catch (profileErr: any) {
        console.error("Exception while creating profile:", profileErr);
        
        // Only delete auth user if it's not a duplicate error
        if (profileErr.code !== '23505') {
          await supabaseAdmin.auth.admin.deleteUser(data.user.id);
        }
        
        return c.json({ error: "Failed to create user profile: " + (profileErr.message || String(profileErr)) }, 500);
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

// Upload Avatar - Handle image upload and return signed URL
app.post("/make-server-2ba06582/upload-avatar", async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return c.json({ error: "Server configuration error" }, 500);
  }

  try {
    const body = await c.req.json();
    const { imageData, fileName } = body;

    if (!imageData || !fileName) {
      return c.json({ error: "Image data and file name are required" }, 400);
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    const mimeType = fileExtension === 'png' ? 'image/png' :
                    fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'image/jpeg' :
                    fileExtension === 'gif' ? 'image/gif' :
                    fileExtension === 'webp' ? 'image/webp' : null;

    if (!mimeType || !validTypes.includes(mimeType)) {
      return c.json({ error: "Invalid file type. Only PNG, JPG, JPEG, GIF, and WebP are allowed." }, 400);
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    const bucketName = 'make-2ba06582-avatars';

    // Convert base64 to blob
    const base64Data = imageData.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Create unique file name
    const timestamp = Date.now();
    const uniqueFileName = `${user.id}/${timestamp}-${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(uniqueFileName, binaryData, {
        contentType: mimeType,
        upsert: true
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json({ error: "Failed to upload image: " + uploadError.message }, 500);
    }

    // Generate signed URL (valid for 10 years)
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from(bucketName)
      .createSignedUrl(uniqueFileName, 315360000); // 10 years in seconds

    if (signedUrlError || !signedUrlData) {
      console.error("Signed URL error:", signedUrlError);
      return c.json({ error: "Failed to generate signed URL" }, 500);
    }

    console.log(`Avatar uploaded for user ${user.id}: ${uniqueFileName}`);
    return c.json({ 
      success: true, 
      url: signedUrlData.signedUrl,
      fileName: uniqueFileName 
    });
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    return c.json({ error: "Internal Server Error: " + (error.message || String(error)) }, 500);
  }
});

// Delete Avatar - Remove uploaded avatar from storage
app.post("/make-server-2ba06582/delete-avatar", async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return c.json({ error: "Server configuration error" }, 500);
  }

  try {
    const body = await c.req.json();
    const { filePath } = body;

    if (!filePath) {
      return c.json({ error: "File path is required" }, 400);
    }

    // Ensure user can only delete their own files
    if (!filePath.startsWith(`${user.id}/`)) {
      return c.json({ error: "Unauthorized to delete this file" }, 403);
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    const bucketName = 'make-2ba06582-avatars';

    // Delete from Supabase Storage
    const { error: deleteError } = await supabaseAdmin.storage
      .from(bucketName)
      .remove([filePath]);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return c.json({ error: "Failed to delete image: " + deleteError.message }, 500);
    }

    console.log(`Avatar deleted for user ${user.id}: ${filePath}`);
    return c.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting avatar:", error);
    return c.json({ error: "Internal Server Error: " + (error.message || String(error)) }, 500);
  }
});

Deno.serve(app.fetch);