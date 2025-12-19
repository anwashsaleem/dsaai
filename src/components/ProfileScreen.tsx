import { motion } from 'motion/react';
import { User, Mail, Star, Award, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileScreenProps {
  xp: number;
  completedLessonsCount: number;
  onSignIn?: () => void;
}

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Trouble',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Scooter',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
];

export function ProfileScreen({ xp, completedLessonsCount, onSignIn }: ProfileScreenProps) {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
        <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-bold text-[#4B4B4B] mb-2">Guest Mode</h2>
            <p className="text-[#777] mb-6">Sign in to save your progress and customize your profile.</p>
            <button 
                onClick={onSignIn}
                className="px-6 py-3 bg-[#58CC02] text-white rounded-xl font-bold shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-none transition-all"
            >
                Sign In / Sign Up
            </button>
        </div>
    );
  }

  // Ensure we are reading metadata correctly.
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner';
  const email = user.email || '';
  const avatar = user.user_metadata?.avatar_url || AVATARS[Math.floor(Math.random() * AVATARS.length)];

  return (
    <div className="p-6 max-w-2xl mx-auto w-full pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden"
      >
        {/* Header / Banner */}
        <div className="h-32 bg-[#DDF4FF] relative">
            <div className="absolute top-4 right-4">
                <button className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                    <Settings className="w-5 h-5 text-[#1CB0F6]" />
                </button>
            </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 relative">
            {/* Avatar - Negative margin to pull it up */}
            <div className="relative -mt-16 mb-4 flex justify-between items-end">
                <div className="w-32 h-32 rounded-3xl border-4 border-white bg-white shadow-sm overflow-hidden flex items-center justify-center bg-[#F7F7F7]">
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-[#4B4B4B]">{displayName}</h1>
                <div className="flex items-center gap-2 text-[#AFAFAF] font-bold text-sm">
                    <Mail className="w-4 h-4" />
                    {email}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F7F7]">
                    <div className="flex items-center gap-2 mb-1 text-[#AFAFAF] text-xs font-bold uppercase tracking-wide">
                        <Star className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                        Total XP
                    </div>
                    <div className="text-3xl font-extrabold text-[#4B4B4B]">
                        {xp}
                    </div>
                </div>
                <div className="p-4 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F7F7]">
                    <div className="flex items-center gap-2 mb-1 text-[#AFAFAF] text-xs font-bold uppercase tracking-wide">
                        <Award className="w-4 h-4 text-[#CE82FF]" />
                        Lessons
                    </div>
                    <div className="text-3xl font-extrabold text-[#4B4B4B]">
                        {completedLessonsCount}
                    </div>
                </div>
            </div>

            {/* Account Actions */}
            <div className="border-t-2 border-[#E5E5E5] pt-6">
                <button 
                    onClick={signOut}
                    className="w-full h-12 flex items-center justify-center gap-2 text-[#FF4B4B] font-bold hover:bg-[#FFF4F4] rounded-xl transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
