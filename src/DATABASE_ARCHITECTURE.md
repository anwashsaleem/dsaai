# Database Architecture - Single Source of Truth

## Overview
The app now uses **ONLY** the `user_profiles` table in Supabase. KV store has been completely removed.

## Database Schema

### user_profiles Table

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | UUID | Primary key, references auth.users |
| `email` | TEXT | User's email address |
| `name` | TEXT | Display name |
| `username` | TEXT | Unique username |
| `avatar_url` | TEXT | Profile picture URL |
| `xp` | INTEGER | Total experience points |
| `completed_lessons` | JSONB | Lesson completion status |
| `created_at` | TIMESTAMP | Account creation time |
| `updated_at` | TIMESTAMP | Last update time |

### completed_lessons Structure (JSONB)
```json
{
  "stack": false,
  "queue": false,
  "circular": false,
  "priority": false,
  "linkedList": false
}
```

## Data Flow

### 1. User Sign Up
1. User submits email/password
2. Server creates auth user
3. Server creates user_profiles row with default values (xp=0, all lessons=false)
4. If profile creation fails, auth user is deleted (consistency)

### 2. User Login
1. User authenticates
2. Client calls GET /progress
3. Server fetches user_profiles row
4. If no profile exists, creates one with defaults
5. Returns { xp, completedLessons }

### 3. Lesson Completion
1. User completes lesson in frontend
2. Frontend calculates new XP (old XP + lesson XP)
3. Frontend calls POST /progress with { xp: newXP, completedLessons: {...} }
4. Server updates user_profiles table
5. Changes are immediately visible in:
   - Profile page (from context)
   - Leaderboard (from user_profiles query)
   - Learning path (from context)

### 4. Profile Updates
1. User edits profile (name, username, avatar)
2. Frontend calls Supabase Auth update for user_metadata
3. Frontend calls Supabase update for user_profiles table
4. Both must succeed for consistency

### 5. Account Deletion
1. User enters username in confirmation dialog
2. Frontend calls POST /delete-account with username
3. Server verifies username matches user_profiles.username
4. Server deletes user_profiles row
5. Server deletes auth user
6. User is logged out

## API Endpoints

### GET /make-server-2ba06582/progress
**Auth:** Required (Bearer token)
**Returns:** `{ xp: number, completedLessons: {...} }`
**Purpose:** Fetch user progress from user_profiles table

### POST /make-server-2ba06582/progress
**Auth:** Required (Bearer token)
**Body:** `{ xp: number, completedLessons: {...} }`
**Returns:** `{ success: true, data: {...} }`
**Purpose:** Update user progress in user_profiles table

### POST /make-server-2ba06582/signup
**Auth:** None
**Body:** `{ email, password, full_name?, avatar_url? }`
**Returns:** `{ success: true, user: {...} }`
**Purpose:** Create auth user and user_profiles row

### POST /make-server-2ba06582/delete-account
**Auth:** Required (Bearer token)
**Body:** `{ username: string }`
**Returns:** `{ success: true }` or `{ error: string }`
**Purpose:** Verify username and delete account

## Frontend State Management

### AuthContext
- Fetches progress on login
- Stores progress in React state (optimistic updates)
- Syncs to database on every update
- Single source of truth for XP and completed lessons

### Components
- **Profile**: Reads XP from AuthContext
- **Leaderboard**: Reads XP from user_profiles table directly
- **Learning Path**: Reads XP and completed lessons from AuthContext
- **Settings**: Reads username from user_profiles for delete confirmation

## Consistency Guarantees

1. **XP is always from user_profiles.xp**
   - No duplicate storage
   - No sync issues
   - Profile, Leaderboard, and Learn all show same value

2. **Completed lessons from user_profiles.completed_lessons**
   - Stored as JSONB
   - Updated atomically with XP
   - No stale data

3. **Account deletion is atomic**
   - Username verification prevents accidents
   - Both profile and auth deleted together
   - User logged out immediately

## Migration Steps

1. Run `/SUPABASE_MIGRATION.sql` to add `completed_lessons` column
2. Deploy updated Edge Function (removes KV store logic)
3. Existing users will have profiles auto-created on next login
4. XP values will be initialized to 0 (users may need to re-complete lessons)

## Benefits of Single Source

✅ **No sync issues** - One table, one truth
✅ **Simpler debugging** - Check user_profiles table only
✅ **Better performance** - No KV store latency
✅ **Atomic updates** - XP and lessons update together
✅ **Real-time leaderboard** - Direct query, no stale data
✅ **Easier backups** - Standard Postgres backups work
✅ **Better analytics** - SQL queries on structured data

## Common Operations

### Check user's XP
```sql
SELECT username, xp FROM user_profiles WHERE user_id = '<user-id>';
```

### View leaderboard
```sql
SELECT username, xp FROM user_profiles ORDER BY xp DESC LIMIT 100;
```

### See lesson progress
```sql
SELECT username, completed_lessons FROM user_profiles WHERE user_id = '<user-id>';
```

### Reset user progress (for testing)
```sql
UPDATE user_profiles 
SET xp = 0, 
    completed_lessons = '{"stack": false, "queue": false, "circular": false, "priority": false, "linkedList": false}'::jsonb
WHERE user_id = '<user-id>';
```
