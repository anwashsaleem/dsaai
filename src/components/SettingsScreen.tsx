import { motion } from 'motion/react';
import { ArrowLeft, Moon, Sun, Vibrate, Eye, EyeOff, Info, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Switch } from './ui/switch';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { haptics } from '../utils/haptics';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { user, signOut, deleteAccount } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load user profile to get username
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data) {
          setUserProfile(data);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // Load settings from localStorage and apply dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedHaptics = localStorage.getItem('hapticsEnabled') !== 'false';
    const savedLeaderboard = localStorage.getItem('leaderboardVisible') !== 'false';
    
    setDarkMode(savedDarkMode);
    setHapticsEnabled(savedHaptics);
    setLeaderboardVisible(savedLeaderboard);
    
    // Apply dark mode to document
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('darkMode', String(enabled));
    
    // Apply or remove dark mode class
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    haptics.light();
  };

  const handleHapticsToggle = (enabled: boolean) => {
    setHapticsEnabled(enabled);
    localStorage.setItem('hapticsEnabled', String(enabled));
    if (enabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleLeaderboardToggle = (enabled: boolean) => {
    setLeaderboardVisible(enabled);
    localStorage.setItem('leaderboardVisible', String(enabled));
    haptics.light();
  };

  const handleLogout = () => {
    haptics.warning();
    setShowLogoutConfirm(true);
  };

  const handleDeleteAccount = async () => {
    if (!userProfile || deleteUsername !== userProfile.username) {
      setDeleteError('Username does not match');
      haptics.error();
      return;
    }

    setIsDeleting(true);
    setDeleteError('');
    haptics.warning();

    const result = await deleteAccount(userProfile.username);
    
    if (!result.success) {
      setDeleteError(result.error || 'Failed to delete account');
      setIsDeleting(false);
      haptics.error();
    } else {
      haptics.success();
      setShowDeleteConfirm(false);
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-[#111827] border-b-2 border-[#E5E5E5] dark:border-[#374151] px-6 py-4">
        <div className="max-w-2xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] dark:bg-[#374151] border-2 border-[#E5E5E5] dark:border-[#4B5563] text-[#777] dark:text-[#9CA3AF] hover:bg-[#E5E5E5] dark:hover:bg-[#4B5563] transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Appearance */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border-2 border-[#E5E5E5] dark:border-[#374151] p-5">
            <h2 className="font-bold text-[#4B4B4B] dark:text-white mb-4 text-sm uppercase tracking-wide">Appearance</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] dark:bg-[#374151] flex items-center justify-center">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-[#4B4B4B] dark:text-[#FFC800]" />
                  ) : (
                    <Sun className="w-5 h-5 text-[#FFC800]" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#4B4B4B] dark:text-white">Dark Mode</h3>
                  <p className="text-xs text-[#777] dark:text-[#9CA3AF]">Change app theme</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </div>

          {/* Interactions */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border-2 border-[#E5E5E5] dark:border-[#374151] p-5">
            <h2 className="font-bold text-[#4B4B4B] dark:text-white mb-4 text-sm uppercase tracking-wide">Interactions</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DDF4FF] dark:bg-[#1e3a52] flex items-center justify-center">
                  <Vibrate className="w-5 h-5 text-[#1CB0F6]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4B4B4B] dark:text-white">Haptic Feedback</h3>
                  <p className="text-xs text-[#777] dark:text-[#9CA3AF]">Vibrate on actions</p>
                </div>
              </div>
              <Switch
                checked={hapticsEnabled}
                onCheckedChange={handleHapticsToggle}
              />
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border-2 border-[#E5E5E5] dark:border-[#374151] p-5">
            <h2 className="font-bold text-[#4B4B4B] dark:text-white mb-4 text-sm uppercase tracking-wide">Privacy</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4DEFF] dark:bg-[#3d2952] flex items-center justify-center">
                  {leaderboardVisible ? (
                    <Eye className="w-5 h-5 text-[#CE82FF]" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-[#CE82FF]" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#4B4B4B] dark:text-white">Leaderboard Visibility</h3>
                  <p className="text-xs text-[#777] dark:text-[#9CA3AF]">Show me on leaderboard</p>
                </div>
              </div>
              <Switch
                checked={leaderboardVisible}
                onCheckedChange={handleLeaderboardToggle}
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border-2 border-[#FF4D4D] p-5">
            <h2 className="font-bold text-[#FF4D4D] mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
              Danger Zone
            </h2>
            
            <div className="space-y-3">
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full p-4 flex items-center gap-3 hover:bg-[#FFF4F4] dark:hover:bg-[#2d1a1a] transition-colors rounded-xl border-2 border-[#FFD1D1] dark:border-[#4a2828]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFD1D1] dark:bg-[#4a2828] flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5 text-[#FF4D4D]" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-[#4B4B4B] dark:text-white">Logout</h3>
                  <p className="text-xs text-[#777] dark:text-[#9CA3AF]">Sign out of your account</p>
                </div>
              </button>

              {/* Delete Account */}
              {user && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-[#FFF4F4] dark:hover:bg-[#2d1a1a] transition-colors rounded-xl border-2 border-[#FFD1D1] dark:border-[#4a2828]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFD1D1] dark:bg-[#4a2828] flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-[#FF4D4D]" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-[#FF4D4D]">Delete Account</h3>
                    <p className="text-xs text-[#777] dark:text-[#9CA3AF]">Permanently delete all your data</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={() => setShowLogoutConfirm(false)}
        >
          {/* Blur Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          {/* Modal - Bottom sheet on mobile, centered on desktop */}
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card dark:bg-card rounded-t-3xl md:rounded-3xl p-6 w-full md:w-96 md:max-w-md shadow-2xl"
          >
            <div className="w-12 h-1 bg-border dark:bg-border rounded-full mx-auto mb-4 md:hidden" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-error-light dark:bg-error-light flex items-center justify-center">
                <LogOut className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 className="font-extrabold text-text-primary dark:text-text-primary">Logout?</h2>
                <p className="text-xs text-text-secondary dark:text-text-secondary">You can always sign back in</p>
              </div>
            </div>
            
            <p className="text-sm text-text-secondary dark:text-text-secondary mb-6">
              Are you sure you want to logout from your account?
            </p>
            
            <div className="flex flex-col-reverse md:flex-row gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-3 bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border text-text-primary dark:text-text-primary rounded-xl font-bold hover:bg-muted dark:hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await signOut();
                  setShowLogoutConfirm(false);
                  onBack();
                }}
                className="flex-1 px-6 py-3 bg-destructive text-white rounded-xl font-bold shadow-[0_4px_0] shadow-destructive-hover active:translate-y-[2px] active:shadow-none transition-all"
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeleteUsername('');
            setDeleteError('');
          }}
        >
          {/* Blur Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          {/* Modal - Bottom sheet on mobile, centered on desktop */}
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card dark:bg-card rounded-t-3xl md:rounded-3xl p-6 w-full md:w-96 md:max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-border dark:bg-border rounded-full mx-auto mb-4 md:hidden" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-error-light dark:bg-error-light flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 className="font-extrabold text-destructive">Delete Account?</h2>
                <p className="text-xs text-text-secondary dark:text-text-secondary">This action is irreversible</p>
              </div>
            </div>
            
            <div className="bg-error-light dark:bg-error-light border-2 border-destructive rounded-xl p-4 mb-4">
              <p className="text-sm text-text-primary dark:text-text-primary font-bold mb-1">
                Warning
              </p>
              <p className="text-xs text-text-secondary dark:text-text-secondary">
                Deleting your account will permanently remove all your data including progress, XP, and achievements. This cannot be undone.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-bold text-text-primary dark:text-text-primary mb-2 block">
                Enter your username to confirm:
              </label>
              <input
                type="text"
                value={deleteUsername}
                onChange={(e) => {
                  setDeleteUsername(e.target.value);
                  setDeleteError('');
                }}
                placeholder={userProfile?.username || 'your_username'}
                className="border-2 border-border dark:border-border bg-input-background dark:bg-input-background text-text-primary dark:text-text-primary rounded-xl px-4 py-3 w-full text-sm focus:outline-none focus:border-destructive transition-colors"
              />
              {deleteError && (
                <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {deleteError}
                </p>
              )}
            </div>
            
            <div className="flex flex-col-reverse md:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteUsername('');
                  setDeleteError('');
                }}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border text-text-primary dark:text-text-primary rounded-xl font-bold hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-destructive text-white rounded-xl font-bold shadow-[0_4px_0] shadow-destructive-hover active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}