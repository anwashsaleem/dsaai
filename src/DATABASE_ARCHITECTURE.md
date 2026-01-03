# Database Architecture - Single Source of Truth

## Overview
The app useS `user_profiles` table in Supabase.

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
