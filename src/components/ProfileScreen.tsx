import { motion } from 'motion/react';
import { User, Mail, Star, Award, LogOut, Settings, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { TopBar } from './TopBar';

interface ProfileScreenProps {
  xp: number;
  completedLessonsCount: number;
  onSignIn?: () => void;
  onSettings?: () => void;
  onEditProfile?: () => void;
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

export function ProfileScreen({ xp, completedLessonsCount, onSignIn, onSettings, onEditProfile }: ProfileScreenProps) {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background dark:bg-background">
        <TopBar 
            title="Profile" 
            subLine="Personalize your experience" 
            icon={User} 
            iconColor="#288CFF" 
        />
        <div className="p-6 flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2">Guest Mode</h2>
            <p className="text-text-secondary dark:text-text-secondary mb-6">Sign in to save your progress and customize your profile.</p>
            <button 
                onClick={onSignIn}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-[0_4px_0] shadow-primary-shadow dark:shadow-primary-shadow active:translate-y-[2px] active:shadow-none transition-all"
            >
                Sign In / Sign Up
            </button>
        </div>
      </div>
    );
  }

  // Ensure we are reading metadata correctly.
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner';
  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'learner';
  const avatar = user.user_metadata?.avatar_url || AVATARS[Math.floor(Math.random() * AVATARS.length)];

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <TopBar 
        title="Profile" 
        subLine="Personalize your experience" 
        icon={User} 
        iconColor="#58CC02" 
      />
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card dark:bg-card rounded-3xl border-2 border-border dark:border-border overflow-hidden"
        >
          {/* Header / Banner */}
          <div className="h-32 bg-info-light dark:bg-active-background relative">
              <div className="absolute top-4 right-4">
                  <button 
                      onClick={onSettings}
                      className="p-2 bg-white/50 dark:bg-muted/50 hover:bg-white dark:hover:bg-muted rounded-full transition-colors"
                  >
                      <Settings className="w-5 h-5 text-secondary" />
                  </button>
              </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6 relative">
              {/* Avatar - Negative margin to pull it up */}
              <div className="relative -mt-16 mb-4 flex justify-between items-end">
                  <div className="w-32 h-32 rounded-3xl border-4 border-card dark:border-card bg-card dark:bg-card shadow-sm overflow-hidden flex items-center justify-center">
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button
                      onClick={onEditProfile}
                      className="mb-2 px-4 py-2 bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border rounded-xl font-bold text-sm text-text-primary dark:text-text-primary hover:bg-muted dark:hover:bg-muted transition-colors flex items-center gap-2"
                  >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                  </button>
              </div>

              <div className="mb-6">
                  <h1 className="text-2xl font-extrabold text-text-primary dark:text-text-primary">{displayName}</h1>
                  <div className="text-muted-foreground dark:text-muted-foreground font-bold text-sm mt-1">
                      @{username}
                  </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl border-2 border-border dark:border-border bg-hover-background dark:bg-hover-background">
                      <div className="flex items-center gap-2 mb-1 text-muted-foreground dark:text-muted-foreground text-xs font-bold uppercase tracking-wide">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          Total XP
                      </div>
                      <div className="text-3xl font-extrabold text-text-primary dark:text-text-primary">
                          {xp}
                      </div>
                  </div>
                  <div className="p-4 rounded-2xl border-2 border-border dark:border-border bg-hover-background dark:bg-hover-background">
                      <div className="flex items-center gap-2 mb-1 text-muted-foreground dark:text-muted-foreground text-xs font-bold uppercase tracking-wide">
                          <Award className="w-4 h-4 text-secondary" />
                          Lessons
                      </div>
                      <div className="text-3xl font-extrabold text-text-primary dark:text-text-primary">
                          {completedLessonsCount}
                      </div>
                  </div>
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}