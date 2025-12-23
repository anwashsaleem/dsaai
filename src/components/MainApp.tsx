import { useState, useRef, useEffect } from 'react';
import { BookOpen, User as UserIcon, Star, Award, Info, ChevronLeft, ChevronRight, Menu, Trophy, LogOut, Settings } from 'lucide-react';
import { LearningPath } from './LearningPath';
import { AboutScreen } from './AboutScreen';
import { StackLesson1 } from './StackLesson1';
import { StackLesson2 } from './StackLesson2';
import { StackLesson3 } from './StackLesson3';
import { StackLesson4 } from './StackLesson4';
import { QueueLesson1 } from './QueueLesson1';
import { QueueLesson2 } from './QueueLesson2';
import { QueueLesson3 } from './QueueLesson3';
import { QueueLesson4 } from './QueueLesson4';
import { CircularQueueLesson1 } from './CircularQueueLesson1';
import { CircularQueueLesson2 } from './CircularQueueLesson2';
import { CircularQueueLesson3 } from './CircularQueueLesson3';
import { CircularQueueLesson4 } from './CircularQueueLesson4';
import { PriorityQueueLesson1 } from './PriorityQueueLesson1';
import { PriorityQueueLesson2 } from './PriorityQueueLesson2';
import { PriorityQueueLesson3 } from './PriorityQueueLesson3';
import { PriorityQueueLesson4 } from './PriorityQueueLesson4';
import { LinkedListLesson1 } from './LinkedListLesson1';
import { LinkedListLesson2 } from './LinkedListLesson2';
import { LinkedListLesson3 } from './LinkedListLesson3';
import { LinkedListLesson4 } from './LinkedListLesson4';
import { LessonCompletionScreen } from './LessonCompletionScreen';
import { ProfileScreen } from './ProfileScreen';
import { LeaderboardScreen } from './LeaderboardScreen';
import { SettingsScreen } from './SettingsScreen';
import { EditProfileScreen } from './EditProfileScreen';
import { AuthModal } from './AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { AnimatePresence } from 'motion/react';
import { TopBar } from './TopBar';

type Tab = 'learn' | 'leaderboard' | 'profile' | 'about';
type ProfileScreen = 'main' | 'settings' | 'edit';
type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4' | 'circular-lesson-1' | 'circular-lesson-2' | 'circular-lesson-3' | 'circular-lesson-4' | 'priority-lesson-1' | 'priority-lesson-2' | 'priority-lesson-3' | 'priority-lesson-4' | 'linked-list-lesson-1' | 'linked-list-lesson-2' | 'linked-list-lesson-3' | 'linked-list-lesson-4' | 'completion';

export function MainApp() {
  const { user, progress, updateProgress, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [profileScreen, setProfileScreen] = useState<ProfileScreen>('main');
  const [learningScreen, setLearningScreen] = useState<LearningScreen>('path');
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);

  // Sync completed count
  useEffect(() => {
    if (progress?.completedLessons) {
      const count = Object.values(progress.completedLessons).filter(Boolean).length;
      setCompletedLessonsCount(count);
    }
  }, [progress]);
  
  const [justClaimed, setJustClaimed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lastCompletedLesson, setLastCompletedLesson] = useState<LearningScreen | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const TOTAL_LESSONS = 19;

  // Logic to determine if we are in "Lesson Mode" (Full screen, no sidebar)
  const isLessonMode = activeTab === 'learn' && learningScreen !== 'path' && learningScreen !== 'completion';

  // Reset profile screen when changing tabs
  useEffect(() => {
    if (activeTab !== 'profile') {
      setProfileScreen('main');
    }
  }, [activeTab]);

  // Scroll to top whenever screen changes
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [learningScreen, activeTab, profileScreen]);

  useEffect(() => {
    if (justClaimed) {
      const timer = setTimeout(() => {
        setJustClaimed(false);
      }, 3000); // Reset after animation duration
      return () => clearTimeout(timer);
    }
  }, [justClaimed]);

  const navigateToLesson = (screen: LearningScreen) => {
    setLearningScreen(screen);
    if (screen === 'stack-lesson-1' || screen === 'queue-lesson-1' || screen === 'circular-lesson-1' || screen === 'priority-lesson-1' || screen === 'linked-list-lesson-1') {
      setLessonProgress(0);
    }
  };

  const handleLessonComplete = () => {
    setLastCompletedLesson(learningScreen);
    setLearningScreen('completion');
  };

  const handleClaimXP = async () => {
    let newCompletedState = {};

    if (lastCompletedLesson === 'stack-lesson-4') {
      if (!progress.completedLessons.stack) {
          newCompletedState = { stack: true };
      }
    } else if (lastCompletedLesson === 'queue-lesson-4') {
      if (!progress.completedLessons.queue) {
          newCompletedState = { queue: true };
      }
    } else if (lastCompletedLesson === 'circular-lesson-4') {
      if (!progress.completedLessons.circular) {
          newCompletedState = { circular: true };
      }
    } else if (lastCompletedLesson === 'priority-lesson-4') {
      if (!progress.completedLessons.priority) {
          newCompletedState = { priority: true };
      }
    } else if (lastCompletedLesson === 'linked-list-lesson-4') {
      if (!progress.completedLessons.linkedList) {
          newCompletedState = { linkedList: true };
      }
    }
    
    // Only update if there's actually a new completion
    // XP will be calculated automatically by updateProgress
    if (Object.keys(newCompletedState).length > 0) {
        await updateProgress({
            completedLessons: newCompletedState
        });
    }
    
    setLearningScreen('path');
    setActiveTab('learn');
    setJustClaimed(true);
  };

  const showMobileNav = activeTab === 'leaderboard' || activeTab === 'profile' || (activeTab === 'learn' && learningScreen === 'path') || activeTab === 'about';

  if (loading) {
      return (
          <div className="min-h-screen bg-white flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#288CFF]"></div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop Sidebar - Sticky and Collapsible */}
      {!isLessonMode && (
        <div 
          className={`hidden md:flex flex-col border-r-2 border-[#E5E5E5] bg-white h-screen sticky top-0 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="p-5 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <h2 className="text-2xl font-extrabold text-[#288CFF] tracking-tight">dsaai</h2>
            )}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-[#F7F7F7] text-[#AFAFAF] transition-colors"
            >
              {isSidebarCollapsed ? <Menu className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
          </div>
          
          <nav className="flex-1 px-3 space-y-1.5">
            <button
              onClick={() => setActiveTab('learn')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'learn'
                  ? 'bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#1CB0F6]'
                  : 'text-[#777] hover:bg-[#F7F7F7] border-2 border-transparent'
              } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <BookOpen className="w-6 h-6" strokeWidth={2.5} />
              {!isSidebarCollapsed && <span className="uppercase text-sm tracking-wide">Lessons</span>}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#1CB0F6]'
                  : 'text-[#777] hover:bg-[#F7F7F7] border-2 border-transparent'
              } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Trophy className="w-6 h-6" strokeWidth={2.5} />
              {!isSidebarCollapsed && <span className="uppercase text-sm tracking-wide">Leaderboard</span>}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#1CB0F6]'
                  : 'text-[#777] hover:bg-[#F7F7F7] border-2 border-transparent'
              } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <UserIcon className="w-6 h-6" strokeWidth={2.5} />
              {!isSidebarCollapsed && <span className="uppercase text-sm tracking-wide">Profile</span>}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'about'
                  ? 'bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#1CB0F6]'
                  : 'text-[#777] hover:bg-[#F7F7F7] border-2 border-transparent'
              } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Info className="w-6 h-6" strokeWidth={2.5} />
              {!isSidebarCollapsed && <span className="uppercase text-sm tracking-wide">About</span>}
            </button>
          </nav>

          {/* User Profile Mini-View in Sidebar */}
          {!user && !isSidebarCollapsed && (
             <div className="p-4 border-t-2 border-[#E5E5E5]">
                 <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full py-3 bg-[#288CFF] text-white rounded-xl font-bold shadow-[0_4px_0_#2563EB] hover:brightness-105 active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-wider text-sm"
                 >
                     Sign In
                 </button>
             </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content Area */}
        <div 
          ref={scrollRef}
          className={`flex-1 overflow-y-auto ${showMobileNav ? 'pb-20' : ''} md:pb-0`}
        >
          {activeTab === 'learn' && (
            <>
              {learningScreen === 'path' && (
                <LearningPath 
                  onNavigate={navigateToLesson} 
                  stackCompleted={progress.completedLessons.stack}
                  queueCompleted={progress.completedLessons.queue}
                  circularCompleted={progress.completedLessons.circular}
                  priorityCompleted={progress.completedLessons.priority}
                  linkedListCompleted={progress.completedLessons.linkedList}
                  totalXP={progress.xp}
                  completedLessons={completedLessonsCount}
                  totalLessons={TOTAL_LESSONS}
                  justClaimed={justClaimed}
                />
              )}
              {learningScreen === 'stack-lesson-1' && (
                <StackLesson1 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'stack-lesson-2' && (
                <StackLesson2 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'stack-lesson-3' && (
                <StackLesson3 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'stack-lesson-4' && (
                <StackLesson4 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                  onComplete={handleLessonComplete}
                />
              )}
              {learningScreen === 'queue-lesson-1' && (
                <QueueLesson1 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'queue-lesson-2' && (
                <QueueLesson2 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'queue-lesson-3' && (
                <QueueLesson3 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'queue-lesson-4' && (
                <QueueLesson4 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                  onComplete={handleLessonComplete}
                />
              )}
              {learningScreen === 'circular-lesson-1' && (
                <CircularQueueLesson1 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'circular-lesson-2' && (
                <CircularQueueLesson2 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'circular-lesson-3' && (
                <CircularQueueLesson3 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'circular-lesson-4' && (
                <CircularQueueLesson4 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                  onComplete={handleLessonComplete}
                />
              )}
              {learningScreen === 'priority-lesson-1' && (
                <PriorityQueueLesson1 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'priority-lesson-2' && (
                <PriorityQueueLesson2 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'priority-lesson-3' && (
                <PriorityQueueLesson3 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'priority-lesson-4' && (
                <PriorityQueueLesson4 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                  onComplete={handleLessonComplete}
                />
              )}
              {learningScreen === 'linked-list-lesson-1' && (
                <LinkedListLesson1 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'linked-list-lesson-2' && (
                <LinkedListLesson2 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'linked-list-lesson-3' && (
                <LinkedListLesson3 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                />
              )}
              {learningScreen === 'linked-list-lesson-4' && (
                <LinkedListLesson4 
                  onNavigate={navigateToLesson} 
                  currentProgress={lessonProgress}
                  onProgressUpdate={setLessonProgress}
                  onComplete={handleLessonComplete}
                />
              )}
              {learningScreen === 'completion' && (
                <LessonCompletionScreen 
                  onClaimXP={handleClaimXP}
                  xpEarned={110}
                />
              )}
            </>
          )}
          {activeTab === 'leaderboard' && <LeaderboardScreen onSignIn={() => setIsAuthModalOpen(true)} />}
          {activeTab === 'profile' && (
             <>
               {profileScreen === 'main' && (
                 <ProfileScreen 
                    xp={progress.xp} 
                    completedLessonsCount={completedLessonsCount}
                    onSignIn={() => setIsAuthModalOpen(true)}
                    onSettings={() => setProfileScreen('settings')}
                    onEditProfile={() => setProfileScreen('edit')}
                 />
               )}
               {profileScreen === 'settings' && (
                 <SettingsScreen
                   onBack={() => setProfileScreen('main')}
                 />
               )}
               {profileScreen === 'edit' && (
                 <EditProfileScreen
                   onBack={() => setProfileScreen('main')}
                 />
               )}
             </>
          )}
          {activeTab === 'about' && (
            <div className="min-h-screen bg-white">
              <AboutScreen />
            </div>
          )}
        </div>

        {/* Mobile Tabs - Bottom */}
        {showMobileNav && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#E5E5E5] z-10 pb-safe">
            <div className="grid grid-cols-4 gap-1 p-1.5">
              <button
                onClick={() => setActiveTab('learn')}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === 'learn'
                    ? 'bg-[#DBEAFE] text-[#288CFF]'
                    : 'bg-transparent text-[#777]'
                }`}
              >
                <BookOpen className="w-6 h-6" strokeWidth={2.5} />
                <span className="text-[9px] uppercase tracking-wide">Lessons</span>
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === 'leaderboard'
                    ? 'bg-[#DBEAFE] text-[#288CFF]'
                    : 'bg-transparent text-[#777]'
                }`}
              >
                <Trophy className="w-6 h-6" strokeWidth={2.5} />
                <span className="text-[9px] uppercase tracking-wide">Board</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#DBEAFE] text-[#288CFF]'
                    : 'bg-transparent text-[#777]'
                }`}
              >
                <UserIcon className="w-6 h-6" strokeWidth={2.5} />
                <span className="text-[9px] uppercase tracking-wide">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === 'about'
                    ? 'bg-[#DBEAFE] text-[#288CFF]'
                    : 'bg-transparent text-[#777]'
                }`}
              >
                <Info className="w-6 h-6" strokeWidth={2.5} />
                <span className="text-[9px] uppercase tracking-wide">About</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAuthModalOpen && (
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                onSuccess={() => {
                    // Logic to handle success (e.g. redirect to profile or learning)
                    setActiveTab('learn');
                }}
            />
        )}
      </AnimatePresence>
    </div>
  );
}