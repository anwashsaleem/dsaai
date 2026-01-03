import { motion } from 'motion/react';
import { ArrowLeft, User, AtSign, CheckCircle, Upload, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { PREDEFINED_AVATARS } from '../utils/avatars';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'sonner';

interface EditProfileScreenProps {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState(''); // Track uploaded avatar separately
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [customAvatarError, setCustomAvatarError] = useState(false);
  const [customAvatarLoading, setCustomAvatarLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
      setUsername(user.user_metadata?.username || '');
      
      const currentAvatar = user.user_metadata?.avatar_url || PREDEFINED_AVATARS[0];
      
      // Check if current avatar is a predefined one
      if (PREDEFINED_AVATARS.includes(currentAvatar)) {
        setSelectedAvatar(currentAvatar);
        setUploadedAvatarUrl('');
      } else {
        // It's an uploaded/custom avatar
        setSelectedAvatar('');
        setUploadedAvatarUrl(currentAvatar);
      }
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

  const validateImageUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    
    // Check if it's a valid URL
    try {
      new URL(url);
    } catch {
      return false;
    }

    // Check if it ends with common image extensions
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    const urlLower = url.toLowerCase();
    const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext));
    
    // Also accept URLs that might be image URLs without extensions (like some CDN URLs)
    const isLikelyImageUrl = urlLower.includes('image') || 
                             urlLower.includes('avatar') || 
                             urlLower.includes('photo') ||
                             urlLower.includes('img') ||
                             hasImageExtension;

    return isLikelyImageUrl;
  };

  const handleCustomUrlChange = (url: string) => {
    setCustomAvatarUrl(url);
    setCustomAvatarError(false);
    
    if (url.trim()) {
      setSelectedAvatar('');
      setCustomAvatarLoading(true);
      
      // Validate image URL format
      if (!validateImageUrl(url)) {
        setCustomAvatarError(true);
        setCustomAvatarLoading(false);
      }
    } else {
      setCustomAvatarLoading(false);
    }
  };

  const handleImageLoad = () => {
    setCustomAvatarLoading(false);
    setCustomAvatarError(false);
  };

  const handleImageError = () => {
    setCustomAvatarLoading(false);
    setCustomAvatarError(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PNG, JPG, JPEG, GIF, or WebP image');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingFile(true);
    toast('Uploading image...', { duration: 2000 });

    try {
      // Get access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to upload images');
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;

        try {
          // Upload to server
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2ba06582/upload-avatar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              imageData,
              fileName: file.name
            })
          });

          const data = await response.json();

          if (!response.ok || data.error) {
            throw new Error(data.error || 'Failed to upload image');
          }

          // Set the uploaded image
          setUploadedAvatarUrl(data.url);
          setSelectedAvatar('');
          setCustomAvatarUrl('');
          setCustomAvatarError(false);
          toast.success('Image uploaded successfully!');
        } catch (error: any) {
          console.error('Upload error:', error);
          toast.error(error.message || 'Failed to upload image');
        } finally {
          setUploadingFile(false);
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read image file');
        setUploadingFile(false);
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('File upload error:', error);
      toast.error('Failed to upload image');
      setUploadingFile(false);
    }
  };

  const handleRemoveUploadedAvatar = async () => {
    if (!uploadedAvatarUrl) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Extract the file path from the signed URL
      const urlMatch = uploadedAvatarUrl.match(/make-2ba06582-avatars\/(.+?)\?/);
      if (urlMatch && urlMatch[1]) {
        const filePath = urlMatch[1];

        // Delete from storage
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2ba06582/delete-avatar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ filePath })
        });
      }

      // Clear uploaded avatar and select first predefined avatar
      setUploadedAvatarUrl('');
      setSelectedAvatar(PREDEFINED_AVATARS[0]);
      toast.success('Uploaded image removed');
    } catch (error) {
      console.error('Error removing uploaded avatar:', error);
      toast.error('Failed to remove image');
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
      const avatarToSave = customAvatarUrl.trim() || selectedAvatar || uploadedAvatarUrl;

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
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border text-text-secondary dark:text-text-secondary hover:bg-muted dark:hover:bg-muted transition-all rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <h1 className="text-xl font-extrabold text-text-primary dark:text-text-primary">Edit Profile</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !!usernameError || checkingUsername}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
              saving || usernameError || checkingUsername
                ? 'bg-muted dark:bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground shadow-[0_4px_0] shadow-primary-shadow active:translate-y-[2px] active:shadow-[0_2px_0] active:shadow-primary-shadow'
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
          <div className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border p-5">
            <h2 className="font-bold text-text-primary dark:text-text-primary mb-4 text-sm uppercase tracking-wide">
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
                    setUploadedAvatarUrl('');
                  }}
                  className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedAvatar === avatar && !uploadedAvatarUrl
                      ? 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-background'
                      : 'border-border dark:border-border hover:border-secondary'
                  }`}
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  {selectedAvatar === avatar && !uploadedAvatarUrl && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Uploaded Avatar Display */}
            {uploadedAvatarUrl && (
              <div className="mb-4 p-4 bg-hover-background dark:bg-hover-background rounded-xl border-2 border-primary">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-primary ring-2 ring-primary">
                    <img src={uploadedAvatarUrl} alt="Uploaded avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-text-primary dark:text-text-primary text-sm">Your Uploaded Image</p>
                    <p className="text-xs text-text-secondary dark:text-text-secondary">Currently selected</p>
                  </div>
                  <button
                    onClick={handleRemoveUploadedAvatar}
                    className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                    title="Remove uploaded image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Upload Avatar */}
            <div>
              <label className="block text-xs font-bold text-text-secondary dark:text-text-secondary mb-2 uppercase tracking-wide">
                Or upload an image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                  id="avatar-upload"
                />
                <button
                  type="button"
                  disabled={uploadingFile}
                  className={`w-full h-12 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${
                    uploadingFile
                      ? 'bg-primary/50 text-primary-foreground border-primary cursor-not-allowed'
                      : 'bg-primary text-primary-foreground border-primary shadow-[0_4px_0] shadow-primary-shadow hover:shadow-[0_2px_0] hover:shadow-primary-shadow hover:translate-y-[2px]'
                  }`}
                >
                  {uploadingFile ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload Image</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-text-secondary dark:text-text-secondary mt-2">
                PNG, JPG, JPEG, GIF, or WebP • Max 5MB
              </p>
            </div>
          </div>

          {/* Name Field */}
          <div className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border p-5">
            <h2 className="font-bold text-text-primary dark:text-text-primary mb-4 text-sm uppercase tracking-wide">Name</h2>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border dark:border-border bg-input-background dark:bg-input-background text-text-primary dark:text-text-primary focus:border-secondary focus:outline-none transition-colors font-bold"
              />
            </div>
            <p className="text-xs text-text-secondary dark:text-text-secondary mt-2">This can be changed anytime</p>
          </div>

          {/* Username Field */}
          <div className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border p-5">
            <h2 className="font-bold text-text-primary dark:text-text-primary mb-4 text-sm uppercase tracking-wide">
              Username (Unique)
            </h2>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="your_username"
                className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 focus:outline-none transition-colors font-bold bg-input-background dark:bg-input-background text-text-primary dark:text-text-primary ${
                  usernameError
                    ? 'border-destructive focus:border-destructive'
                    : 'border-border dark:border-border focus:border-secondary'
                }`}
              />
            </div>
            {checkingUsername && (
              <p className="text-xs text-secondary mt-2 flex items-center gap-1">
                <span className="animate-spin">⏳</span> Checking availability...
              </p>
            )}
            {usernameError && (
              <p className="text-xs text-destructive mt-2 font-bold">⚠️ {usernameError}</p>
            )}
            {!usernameError && username.length >= 3 && !checkingUsername && (
              <p className="text-xs text-success mt-2 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Username available
              </p>
            )}
            <p className="text-xs text-text-secondary dark:text-text-secondary mt-2">
              Used for leaderboard. Only letters, numbers, and underscores.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}