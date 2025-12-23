import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { projectId } from '../utils/supabase/info';
import { calculateXp } from '../utils/calculateXp';

interface ProgressData {
  xp: number;
  completedLessons: {
    stack: boolean;
    queue: boolean;
    circular: boolean;
    priority: boolean;
    linkedList: boolean;
  };
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  progress: ProgressData;
  updateProgress: (newProgress: Partial<ProgressData>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProgress: () => Promise<void>;
  updateUserProfile: (metadata: any) => Promise<void>;
  deleteAccount: (username: string) => Promise<{ success: boolean; error?: string }>;
}

const defaultProgress: ProgressData = {
  xp: 0,
  completedLessons: {
    stack: false,
    queue: false,
    circular: false,
    priority: false,
    linkedList: false
  }
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  progress: defaultProgress,
  updateProgress: async () => {},
  signOut: async () => {},
  refreshProgress: async () => {},
  updateUserProfile: async () => {},
  deleteAccount: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProgress(session.access_token);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProgress(session.access_token);
      } else {
        setProgress(defaultProgress);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProgress = async (token: string) => {
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2ba06582/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Fetched progress from database:', data);
        // Ensure we merge with default to handle any missing keys
        setProgress({
          xp: data.xp ?? 0,
          completedLessons: { ...defaultProgress.completedLessons, ...(data.completedLessons || {}) }
        });
      } else {
        const errorText = await res.text();
        console.error('❌ Failed to fetch progress:', res.status, errorText);
        
        // If it's a 404 or 500, the user_profiles row might not exist yet
        // The Edge Function will create it, so we'll just use defaults for now
        console.log('Using default progress. User profile will be created on next update.');
        setProgress(defaultProgress);
      }
    } catch (error) {
      console.error('❌ Error fetching progress:', error);
      setProgress(defaultProgress);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (newProgress: Partial<ProgressData>) => {
    // Calculate XP from completed lessons to ensure consistency
    let updated = { ...progress, ...newProgress };
    if (newProgress.completedLessons) {
        updated.completedLessons = { ...progress.completedLessons, ...newProgress.completedLessons };
    }
    
    // Always calculate XP from completed lessons (110 XP per lesson)
    const calculatedXp = calculateXp(updated.completedLessons);
    
    updated.xp = calculatedXp;
    
    // Optimistic update
    setProgress(updated);

    if (!session) {
      console.log('⚠️ Not logged in - progress will not be saved to database');
      return;
    }

    try {
      console.log('📤 Updating progress in database:', {
        xp: calculatedXp,
        completedLessons: updated.completedLessons
      });
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2ba06582/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to update progress:', response.status, errorText);
        // Don't throw - keep optimistic UI
      } else {
        const result = await response.json();
        console.log('✅ Progress saved successfully:', result);
      }
    } catch (error) {
      console.error('❌ Error saving progress:', error);
      // Keep optimistic UI even on error
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProgress(defaultProgress);
  };

  const refreshProgress = async () => {
    if (session) {
      await fetchProgress(session.access_token);
    }
  };

  const updateUserProfile = async (metadata: any) => {
    if (!session) return; // Can't update if not logged in

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      });
      
      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      } else if (data?.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const deleteAccount = async (username: string): Promise<{ success: boolean; error?: string }> => {
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2ba06582/delete-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to delete account' };
      }

      // Sign out after successful deletion
      await supabase.auth.signOut();
      setProgress(defaultProgress);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, progress, updateProgress, signOut, refreshProgress, updateUserProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}