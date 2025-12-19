import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { projectId } from '../utils/supabase/info';

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
        // Ensure we merge with default to handle any missing keys
        setProgress({
          xp: data.xp ?? 0,
          completedLessons: { ...defaultProgress.completedLessons, ...(data.completedLessons || {}) }
        });
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (newProgress: Partial<ProgressData>) => {
    // Optimistic update
    const updated = { ...progress, ...newProgress };
    if (newProgress.completedLessons) {
        updated.completedLessons = { ...progress.completedLessons, ...newProgress.completedLessons };
    }
    setProgress(updated);

    if (!session) return; // Can't save if not logged in

    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2ba06582/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated)
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      // Revert on error? For now, we keep optimistic UI
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProgress = async () => {
    if (session) {
      await fetchProgress(session.access_token);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, progress, updateProgress, signOut, refreshProgress }}>
      {children}
    </AuthContext.Provider>
  );
}
