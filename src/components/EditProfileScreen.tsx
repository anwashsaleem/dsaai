import { motion } from 'motion/react';
import { ArrowLeft, User, AtSign, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'sonner@2.0.3';

interface EditProfileScreenProps {
  onBack: () => void;
}

const PREDEFINED_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Trouble',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Scooter',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Missy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
];

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
      setUsername(user.user_metadata?.username || '');
      setSelectedAvatar(user.user_metadata?.avatar_url || PREDEFINED_AVATARS[0]);
    }
  }, [user]);

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      return false;
    }

    try {
      // Check if username is already taken
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', usernameToCheck)
        .neq('user_id', user?.id)
        .single();

      // If table doesn't exist, assume username is available
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
        return true; // Username is "available" since table doesn't exist yet
      }

      return !data; // Available if no data found
    } catch (err) {
      console.error('Error checking username:', err);
      return true; // Assume available on error
    }
  };

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    setUsernameError('');

    // Basic validation
    if (value.length > 0 && value.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    if (value.length > 20) {
      setUsernameError('Username must be less than 20 characters');
      return;
    }

    // Check for valid characters (alphanumeric and underscores only)
    if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError('Only letters, numbers, and underscores allowed');
      return;
    }

    // Check availability
    if (value.length >= 3) {
      setCheckingUsername(true);
      const isAvailable = await checkUsernameAvailability(value);
      setCheckingUsername(false);

      if (!isAvailable) {
        setUsernameError('Username already taken');
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }

    if (usernameError) {
      toast.error('Please fix errors before saving');
      return;
    }

    setSaving(true);

    try {
      const avatarToSave = customAvatarUrl.trim() || selectedAvatar;

      // Update user metadata in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          username: username,
          avatar_url: avatarToSave,
        },
      });

      if (authError) throw authError;

      // Update user profile in database (skip if table doesn't exist)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          name: name,
          username: username,
          avatar_url: avatarToSave,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      // Only throw error if it's not a missing table error
      if (profileError && profileError.code !== 'PGRST205' && !profileError.message?.includes('Could not find the table')) {
        throw profileError;
      }

      // Update local context
      await updateUserProfile({
        full_name: name,
        username: username,
        avatar_url: avatarToSave,
      });

      toast.success('Profile updated successfully!');
      
      // Show warning if database table doesn't exist
      if (profileError?.code === 'PGRST205' || profileError?.message?.includes('Could not find the table')) {
        toast('Note: Database table not set up yet. Some features may be limited.', {
          duration: 4000,
        });
      }
      
      // Vibrate on success
      if (navigator.vibrate && localStorage.getItem('hapticsEnabled') !== 'false') {
        navigator.vibrate(200);
      }

      setTimeout(() => {
        onBack();
      }, 500);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <h1 className="text-xl font-extrabold text-[#4B4B4B]">Edit Profile</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !!usernameError || checkingUsername}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
              saving || usernameError || checkingUsername
                ? 'bg-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed'
                : 'bg-[#288CFF] text-white shadow-[0_4px_0_#2563EB] active:translate-y-[2px] active:shadow-none'
            }`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Avatar Selection */}
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5">
            <h2 className="font-bold text-[#4B4B4B] mb-4 text-sm uppercase tracking-wide">
              Choose Avatar
            </h2>

            {/* Predefined Avatars */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              {PREDEFINED_AVATARS.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setCustomAvatarUrl('');
                  }}
                  className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedAvatar === avatar && !customAvatarUrl
                      ? 'border-[#288CFF] ring-2 ring-[#288CFF] ring-offset-2'
                      : 'border-[#E5E5E5] hover:border-[#1CB0F6]'
                  }`}
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  {selectedAvatar === avatar && !customAvatarUrl && (
                    <div className="absolute inset-0 bg-[#288CFF]/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-[#288CFF]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Avatar URL */}
            <div>
              <label className="block text-xs font-bold text-[#777] mb-2 uppercase tracking-wide">
                Or use custom URL
              </label>
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value);
                  if (e.target.value.trim()) {
                    setSelectedAvatar('');
                  }
                }}
                placeholder="https://example.com/avatar.jpg"
                className="w-full h-12 px-4 rounded-xl border-2 border-[#E5E5E5] focus:border-[#1CB0F6] focus:outline-none transition-colors"
              />
              {customAvatarUrl && (
                <div className="mt-3 w-20 h-20 rounded-xl overflow-hidden border-2 border-[#288CFF] ring-2 ring-[#288CFF] ring-offset-2">
                  <img
                    src={customAvatarUrl}
                    alt="Custom avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = PREDEFINED_AVATARS[0];
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5">
            <h2 className="font-bold text-[#4B4B4B] mb-4 text-sm uppercase tracking-wide">Name</h2>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-[#E5E5E5] focus:border-[#1CB0F6] focus:outline-none transition-colors font-bold"
              />
            </div>
            <p className="text-xs text-[#777] mt-2">This can be changed anytime</p>
          </div>

          {/* Username Field */}
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5">
            <h2 className="font-bold text-[#4B4B4B] mb-4 text-sm uppercase tracking-wide">
              Username (Unique)
            </h2>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="your_username"
                className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 focus:outline-none transition-colors font-bold ${
                  usernameError
                    ? 'border-[#FF4B4B] focus:border-[#FF4B4B]'
                    : 'border-[#E5E5E5] focus:border-[#1CB0F6]'
                }`}
              />
            </div>
            {checkingUsername && (
              <p className="text-xs text-[#1CB0F6] mt-2 flex items-center gap-1">
                <span className="animate-spin">⏳</span> Checking availability...
              </p>
            )}
            {usernameError && (
              <p className="text-xs text-[#FF4B4B] mt-2 font-bold">⚠️ {usernameError}</p>
            )}
            {!usernameError && username.length >= 3 && !checkingUsername && (
              <p className="text-xs text-[#58CC02] mt-2 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Username available
              </p>
            )}
            <p className="text-xs text-[#777] mt-2">
              Used for leaderboard. Only letters, numbers, and underscores.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}