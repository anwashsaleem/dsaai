import { motion } from 'motion/react';
import { ArrowLeft, Moon, Sun, Vibrate, Eye, EyeOff, Info, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Switch } from './ui/switch';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

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

  // Load settings from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedHaptics = localStorage.getItem('hapticsEnabled') !== 'false';
    const savedLeaderboard = localStorage.getItem('leaderboardVisible') !== 'false';
    
    setDarkMode(savedDarkMode);
    setHapticsEnabled(savedHaptics);
    setLeaderboardVisible(savedLeaderboard);
  }, []);

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('darkMode', String(enabled));
    // TODO: Implement dark mode theme switching
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
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleDeleteAccount = async () => {
    if (!userProfile || deleteUsername !== userProfile.username) {
      setDeleteError('Username does not match');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    const result = await deleteAccount(userProfile.username);
    
    if (!result.success) {
      setDeleteError(result.error || 'Failed to delete account');
      setIsDeleting(false);
    } else {
      setShowDeleteConfirm(false);
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-2xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-[#4B4B4B]">Settings</h1>
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
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5">
            <h2 className="font-bold text-[#4B4B4B] mb-4 text-sm uppercase tracking-wide">Appearance</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] flex items-center justify-center">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-[#4B4B4B]" />
                  ) : (
                    <Sun className="w-5 h-5 text-[#FFC800]" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#4B4B4B]">Dark Mode</h3>
                  <p className="text-xs text-[#777]">Change app theme</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </div>

          {/* Interactions */}
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5">
            <h2 className="font-bold text-[#4B4B4B] mb-4 text-sm uppercase tracking-wide">Interactions</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DDF4FF] flex items-center justify-center">
                  <Vibrate className="w-5 h-5 text-[#1CB0F6]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4B4B4B]">Haptic Feedback</h3>
                  <p className="text-xs text-[#777]">Vibrate on actions</p>
                </div>
              </div>
              <Switch
                checked={hapticsEnabled}
                onCheckedChange={handleHapticsToggle}
              />
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5">
            <h2 className="font-bold text-[#4B4B4B] mb-4 text-sm uppercase tracking-wide">Privacy</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4DEFF] flex items-center justify-center">
                  {leaderboardVisible ? (
                    <Eye className="w-5 h-5 text-[#CE82FF]" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-[#CE82FF]" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#4B4B4B]">Leaderboard Visibility</h3>
                  <p className="text-xs text-[#777]">Show me on leaderboard</p>
                </div>
              </div>
              <Switch
                checked={leaderboardVisible}
                onCheckedChange={handleLeaderboardToggle}
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border-2 border-[#FF4D4D] p-5">
            <h2 className="font-bold text-[#FF4D4D] mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
              Danger Zone
            </h2>
            
            <div className="space-y-3">
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full p-4 flex items-center gap-3 hover:bg-[#FFF4F4] transition-colors rounded-xl border-2 border-[#FFD1D1]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFD1D1] flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5 text-[#FF4D4D]" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-[#4B4B4B]">Logout</h3>
                  <p className="text-xs text-[#777]">Sign out of your account</p>
                </div>
              </button>

              {/* Delete Account */}
              {user && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-[#FFF4F4] transition-colors rounded-xl border-2 border-[#FFD1D1]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFD1D1] flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-[#FF4D4D]" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-[#FF4D4D]">Delete Account</h3>
                    <p className="text-xs text-[#777]">Permanently delete all your data</p>
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
            className="relative bg-white rounded-t-3xl md:rounded-3xl p-6 w-full md:w-96 md:max-w-md shadow-2xl"
          >
            <div className="w-12 h-1 bg-[#E5E5E5] rounded-full mx-auto mb-4 md:hidden" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD1D1] flex items-center justify-center">
                <LogOut className="w-6 h-6 text-[#FF4D4D]" />
              </div>
              <div>
                <h2 className="font-extrabold text-[#4B4B4B]">Logout?</h2>
                <p className="text-xs text-[#777]">You can always sign back in</p>
              </div>
            </div>
            
            <p className="text-sm text-[#777] mb-6">
              Are you sure you want to logout from your account?
            </p>
            
            <div className="flex flex-col-reverse md:flex-row gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-3 bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#4B4B4B] rounded-xl font-bold hover:bg-[#E5E5E5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await signOut();
                  setShowLogoutConfirm(false);
                  onBack();
                }}
                className="flex-1 px-6 py-3 bg-[#FF4D4D] text-white rounded-xl font-bold shadow-[0_4px_0_#CC0000] active:translate-y-[2px] active:shadow-none transition-all"
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
            className="relative bg-white rounded-t-3xl md:rounded-3xl p-6 w-full md:w-96 md:max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-[#E5E5E5] rounded-full mx-auto mb-4 md:hidden" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD1D1] flex items-center justify-center">
              </div>
              <div>
                <h2 className="font-extrabold text-[#FF4D4D]">Delete Account?</h2>
                <p className="text-xs text-[#777]">This action is irreversible</p>
              </div>
            </div>
            
            <div className="bg-[#FFF4F4] border-2 border-[#FFD1D1] rounded-xl p-4 mb-4">
              <p className="text-sm text-[#4B4B4B] font-bold mb-1">
                Warning
              </p>
              <p className="text-xs text-[#777]">
                Deleting your account will permanently remove all your data including progress, XP, and achievements. This cannot be undone.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-bold text-[#4B4B4B] mb-2 block">
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
                className="border-2 border-[#E5E5E5] rounded-xl px-4 py-3 w-full text-sm focus:outline-none focus:border-[#FF4D4D] transition-colors"
              />
              {deleteError && (
                <p className="text-xs text-[#FF4D4D] mt-2 flex items-center gap-1">
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
                className="flex-1 px-6 py-3 bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#4B4B4B] rounded-xl font-bold hover:bg-[#E5E5E5] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-[#FF4D4D] text-white rounded-xl font-bold shadow-[0_4px_0_#CC0000] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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