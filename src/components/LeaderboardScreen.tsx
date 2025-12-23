import { motion } from 'motion/react';
import { Trophy, Medal, Crown, User, AlertCircle, Database, RefreshCw, EyeOff, Settings, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { TopBar } from './TopBar';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  name: string;
  xp: number;
  lessons_completed?: number;
  avatar_url?: string;
  rank?: number;
}

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&mouth=smile&clothing=hoodie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&mouth=smile&top=hijab',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow&mouth=smile&top=winterHat02',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Trouble&mouth=smile&top=cap',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Scooter&mouth=smile&top=hijab&clothing=blazerAndSweater',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&mouth=smile&clothing=hoodie&top=shortCurly',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zahra&mouth=smile&top=hijab&clothing=overall',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&mouth=smile&top=hat&clothing=collarAndSweater',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara&mouth=smile&top=hijab&accessories=glasses',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar&mouth=smile&top=shortFlat&clothing=hoodie',
];

interface LeaderboardScreenProps {
  onSignIn?: () => void;
}

export function LeaderboardScreen({ onSignIn }: LeaderboardScreenProps = {}) {
  const { user, progress } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);

  useEffect(() => {
    // Check visibility setting
    const visible = localStorage.getItem('leaderboardVisible') !== 'false';
    setLeaderboardVisible(visible);
    
    // Only fetch if visible
    if (visible) {
      fetchLeaderboard();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profiles with XP from Supabase
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('user_id, username, name, xp, lessons_completed, avatar_url')
        .order('xp', { ascending: false })
        .limit(100);

      if (fetchError) {
        console.error('Error fetching leaderboard:', fetchError);
        
        // Check if XP column is missing
        if (fetchError.message?.includes('column') && fetchError.message?.includes('xp')) {
          setError('xp_column_missing');
        } else {
          setError('error');
        }
        setLoading(false);
        return;
      }

      // Don't filter out current user anymore - show everyone
      const allData = data || [];

      // Add rank based on XP (already sorted by XP descending)
      const rankedData = allData.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

      console.log('Leaderboard data fetched:', rankedData.length, 'users');
      setLeaderboard(rankedData);
    } catch (err) {
      console.error('Leaderboard error:', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableVisibility = () => {
    localStorage.setItem('leaderboardVisible', 'true');
    setLeaderboardVisible(true);
    fetchLeaderboard();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-[#FFC800]" />;
      case 2:
        return <Medal className="w-6 h-6 text-[#AFAFAF]" />;
      case 3:
        return <Medal className="w-6 h-6 text-[#CD7F32]" />;
      default:
        return <span className="text-[#777] font-bold">{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-[#FFF4CC] border-[#FFC800]';
      case 2:
        return 'bg-[#F7F7F7] border-[#AFAFAF]';
      case 3:
        return 'bg-[#FFE8CC] border-[#CD7F32]';
      default:
        return 'bg-[#F7F7F7] border-[#E5E5E5]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58CC02]"></div>
      </div>
    );
  }

  // Guest Mode - Show blurred preview
  if (!user) {
    return (
      <div className="min-h-screen bg-white relative">
        {/* Header */}
        <TopBar
          title="Leaderboard"
          subLine="Top learners ranked by XP"
          icon={Trophy}
          iconColor="#FFC800"
        />

        {/* Blurred Background Content */}
        <div className="max-w-2xl mx-auto px-6 filter blur-sm opacity-50 pointer-events-none select-none pt-6">
            {/* Fake items to look like a leaderboard */}
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#E5E5E5] bg-white mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border-2 border-[#E5E5E5]" />
                    <div className="w-12 h-12 rounded-xl bg-[#F7F7F7]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[#F7F7F7] rounded w-32" />
                        <div className="h-3 bg-[#F7F7F7] rounded w-20" />
                    </div>
                    <div className="h-8 bg-[#F7F7F7] rounded w-16" />
                </div>
            ))}
        </div>

        {/* Overlay CTA */}
        <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
            <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-w-sm w-full text-center">
                <div className="w-20 h-20 bg-[#DDF4FF] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-[#1CB0F6]" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#4B4B4B] mb-3">Join the League</h2>
                <p className="text-[#777] mb-8 leading-relaxed">
                    Sign in to see where you rank against other learners and compete for the top spot!
                </p>
                <button 
                    onClick={onSignIn}
                    className="w-full h-14 bg-[#288CFF] text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_#2563EB] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#46A302] transition-all"
                >
                    Sign In to Compete
                </button>
            </div>
        </div>
      </div>
    );
  }

  // Show visibility off screen
  if (!leaderboardVisible) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <TopBar
          title="Leaderboard"
          subLine="Top learners ranked by XP"
          icon={Trophy}
          iconColor="#FFC800"
        />

        {/* Visibility Off Message */}
        <div className="max-w-2xl mx-auto px-6 pt-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-[#F7F7F7] rounded-full flex items-center justify-center mx-auto mb-4">
                <EyeOff className="w-10 h-10 text-[#AFAFAF]" />
              </div>
              
              <h2 className="font-extrabold text-xl text-[#4B4B4B] mb-2">
                Leaderboard Hidden
              </h2>
              
              <p className="text-sm text-[#777] mb-4">
                You've turned off leaderboard visibility in your settings.
              </p>
              
              <div className="bg-[#FFF4E6] border-2 border-[#FFC800] rounded-2xl p-4 mb-6">
                <p className="text-sm text-[#4B4B4B] mb-2">
                  <strong>Your profile is hidden</strong>
                </p>
                <p className="text-xs text-[#777]">
                  Other users cannot see you on the leaderboard when visibility is off.
                </p>
              </div>

              <button
                onClick={handleEnableVisibility}
                className="w-full px-6 py-3 bg-[#288CFF] text-white rounded-xl font-bold shadow-[0_4px_0_#2563EB] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Turn On Visibility
              </button>
              
              <p className="text-xs text-[#AFAFAF] mt-3">
                Turning on visibility will show you on the leaderboard and allow you to see rankings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Show database setup instructions if table doesn't exist
    if (error === 'database_not_setup') {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-lg mx-auto">
            <div className="bg-[#FFF4CC] border-2 border-[#FFC800] rounded-2xl p-6 text-center">
              <Database className="w-16 h-16 text-[#FFC800] mx-auto mb-4" />
              <h2 className="font-extrabold text-xl text-[#4B4B4B] mb-3">
                Database Setup Required
              </h2>
              <p className="text-sm text-[#777] mb-4">
                The <code className="bg-white px-2 py-1 rounded text-[#FF4B4B]">user_profiles</code> table hasn't been created yet in your Supabase database.
              </p>
              
              <div className="bg-white rounded-xl p-4 mb-4 text-left border-2 border-[#E5E5E5]">
                <p className="font-bold text-[#4B4B4B] mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#1CB0F6]" />
                  Quick Setup Steps:
                </p>
                <ol className="text-sm text-[#777] space-y-2 ml-7 list-decimal">
                  <li>Open your <strong>Supabase Dashboard</strong></li>
                  <li>Go to <strong>SQL Editor</strong> → New Query</li>
                  <li>Copy the SQL from <code className="bg-[#F7F7F7] px-1.5 py-0.5 rounded text-xs">SUPABASE_SETUP.md</code></li>
                  <li>Run the query to create the table</li>
                  <li>Come back and click "Refresh"</li>
                </ol>
              </div>

              <p className="text-xs text-[#AFAFAF] mb-4">
                This is a one-time setup to enable leaderboard, profiles, and XP tracking.
              </p>

              <button
                onClick={fetchLeaderboard}
                className="px-6 py-3 bg-[#288CFF] text-white rounded-xl font-bold shadow-[0_4px_0_#2563EB] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Refresh Leaderboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Show XP column missing error
    if (error === 'xp_column_missing') {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-lg mx-auto">
            <div className="bg-[#FFF4CC] border-2 border-[#FFC800] rounded-2xl p-6 text-center">
              <Database className="w-16 h-16 text-[#FFC800] mx-auto mb-4" />
              <h2 className="font-extrabold text-xl text-[#4B4B4B] mb-3">
                Database Column Missing
              </h2>
              <p className="text-sm text-[#777] mb-4">
                The <code className="bg-white px-2 py-1 rounded text-[#FF4B4B]">xp</code> column is missing from the <code className="bg-white px-2 py-1 rounded text-[#FF4B4B]">user_profiles</code> table in your Supabase database.
              </p>
              
              <div className="bg-white rounded-xl p-4 mb-4 text-left border-2 border-[#E5E5E5]">
                <p className="font-bold text-[#4B4B4B] mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#1CB0F6]" />
                  Quick Fix Steps:
                </p>
                <ol className="text-sm text-[#777] space-y-2 ml-7 list-decimal">
                  <li>Open your <strong>Supabase Dashboard</strong></li>
                  <li>Go to <strong>SQL Editor</strong> → New Query</li>
                  <li>Copy the SQL from <code className="bg-[#F7F7F7] px-1.5 py-0.5 rounded text-xs">FIX_XP_COLUMN.md</code></li>
                  <li>Run the query to add the column</li>
                  <li>Come back and click "Refresh"</li>
                </ol>
              </div>

              <p className="text-xs text-[#AFAFAF] mb-4">
                This is a one-time fix to enable XP tracking in the leaderboard.
              </p>

              <button
                onClick={fetchLeaderboard}
                className="px-6 py-3 bg-[#288CFF] text-white rounded-xl font-bold shadow-[0_4px_0_#2563EB] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Refresh Leaderboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Show generic error
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[#FF4B4B] mx-auto mb-4" />
          <p className="text-[#FF4B4B] font-bold mb-4">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="px-6 py-3 bg-[#288CFF] text-white rounded-xl font-bold shadow-[0_4px_0_#288CFF] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <TopBar
        title="Leaderboard"
        subLine="Top learners ranked by XP"
        icon={Trophy}
        iconColor="#FFC800"
      />

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-[#E5E5E5] mx-auto mb-4" />
            <p className="text-[#777] font-bold mb-2">No rankings yet</p>
            <p className="text-xs text-[#AFAFAF] mb-6">
              Complete lessons to appear on the leaderboard
            </p>
        
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {leaderboard.map((entry, index) => {
              const isCurrentUser = user && entry.user_id === user.id;
              const avatar = entry.avatar_url || AVATARS[index % AVATARS.length];
              
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    isCurrentUser
                      ? 'bg-[#DDF4FF] border-[#1CB0F6] shadow-sm'
                      : 'bg-white border-[#E5E5E5] hover:border-[#1CB0F6]'
                  }`}
                >
                  {/* Rank Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${getRankBadgeColor(
                      entry.rank!
                    )}`}
                  >
                    {getRankIcon(entry.rank!)}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] flex-shrink-0 overflow-hidden border-2 border-[#E5E5E5]">
                    <img src={avatar} alt={entry.name} className="w-full h-full object-cover" />
                  </div>

                  {/* User Info - NAME on top (bold), USERNAME below (small) */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#4B4B4B] truncate flex items-center gap-2">
                      {entry.name}
                      {isCurrentUser && (
                        <span className="text-[10px] bg-[#1CB0F6] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#777] truncate">@{entry.username}</p>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <div className="font-extrabold text-lg text-[#4B4B4B]">{entry.xp}</div>
                    <div className="text-[10px] text-[#777] uppercase tracking-wide font-bold">XP</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}