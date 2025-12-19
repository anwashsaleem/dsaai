import { motion } from 'motion/react';
import { Layers, List, GitBranch, Network, Lock, Star, Award, LayoutList, RotateCw } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { StackLessonCard } from './StackLessonCard';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson';

interface LearningPathProps {
  onNavigate: (screen: LearningScreen) => void;
  stackCompleted?: boolean;
  queueCompleted?: boolean;
  circularCompleted?: boolean;
  priorityCompleted?: boolean;
  linkedListCompleted?: boolean;
  totalXP?: number;
  completedLessons?: number;
  totalLessons?: number;
  justClaimed?: boolean;
}

export function LearningPath({ onNavigate, stackCompleted, queueCompleted, circularCompleted, priorityCompleted, linkedListCompleted, totalXP, completedLessons, totalLessons = 7, justClaimed }: LearningPathProps) {
  const [displayedXP, setDisplayedXP] = useState(justClaimed ? (totalXP ? totalXP - 110 : 0) : (totalXP || 0)); // Start from previous if claimed? simplified logic below
  const [displayedLessons, setDisplayedLessons] = useState(justClaimed ? (completedLessons ? completedLessons - 1 : 0) : (completedLessons || 0));

  // Dynamic lessons array based on completion status
  const lessons = useMemo(() => [
    {
      id: 'stack',
      title: 'Stack',
      description: 'Last In First Out (LIFO)',
      icon: Layers,
      color: '#58CC02',
      colorLight: '#D7FFB8',
      shadowColor: '#46A302',
      unlocked: true,
      progress: stackCompleted ? 100 : 0,
      xp: 110,
      currentXP: stackCompleted ? 110 : 0,
      totalXP: 110,
    },
    {
      id: 'linear-queue',
      title: 'Linear Queue',
      description: 'First In First Out (FIFO)',
      icon: LayoutList,
      color: '#1CB0F6',
      colorLight: '#DDF4FF',
      shadowColor: '#0D9FE8',
      unlocked: true, // Always unlocked
      progress: queueCompleted ? 100 : 0,
      xp: 120,
    },
    {
      id: 'circular-queue',
      title: 'Circular Queue',
      description: 'Ring Buffer Implementation',
      icon: RotateCw,
      color: '#9059FF',
      colorLight: '#F4DEFF',
      shadowColor: '#7E46E5',
      unlocked: true, // Always unlocked
      progress: circularCompleted ? 100 : 0, // Should be passed as prop
      xp: 135,
    },
    {
      id: 'priority-queue',
      title: 'Priority Queue',
      description: 'Ordered by priority',
      icon: Star,
      color: '#FF9600',
      colorLight: '#FFE8CC',
      shadowColor: '#E07700',
      unlocked: true, // Always unlocked
      progress: priorityCompleted ? 100 : 0,
      xp: 145,
    },
    {
      id: 'linked-list',
      title: 'Linked List',
      description: 'Sequential elements',
      icon: GitBranch,
      color: '#CE82FF',
      colorLight: '#FFE8FF',
      shadowColor: '#B565E8',
      unlocked: true, // Always unlocked
      progress: linkedListCompleted ? 100 : 0,
      xp: 150,
    },
    {
      id: 'binary-tree',
      title: 'Binary Tree',
      description: 'Hierarchical structure',
      icon: Network,
      color: '#FF4B4B',
      colorLight: '#FFE8E8',
      shadowColor: '#D93535',
      unlocked: true, // Always unlocked
      progress: 0,
      xp: 200,
    },
    {
      id: 'binary-search-tree',
      title: 'Binary Search Tree',
      description: 'Sorted hierarchical data',
      icon: Network,
      color: '#FF4B4B',
      colorLight: '#FFE8E8',
      shadowColor: '#D93535',
      unlocked: true, // Always unlocked
      progress: 0,
      xp: 220,
    },
  ], [stackCompleted, queueCompleted, circularCompleted, priorityCompleted]);

  // Animation for XP counting
  useEffect(() => {
    // If justClaimed, we want to animate from (Total - LastLessonXP) to Total
    // But since we don't know exactly which lesson was claimed here easily without more props,
    // we'll stick to the simpler animation or try to infer.
    // The previous logic animated from 0. Let's keep it simple or animate from previous value if possible.
    
    if (justClaimed && totalXP) {
       const duration = 2000;
       const startTimestamp = performance.now();
       const startValue = displayedXP; // Start from current displayed? Or 0?
       // If we just claimed, displayedXP was initialized to (Total - 110) roughly in state init if valid
       // Let's animate from whatever it is to totalXP
       const endValue = totalXP;

       const step = (timestamp: number) => {
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          
          setDisplayedXP(Math.floor(startValue + (endValue - startValue) * easeOutQuart));
          
          if (progress < 1) {
             requestAnimationFrame(step);
          }
       };
       requestAnimationFrame(step);
    } else {
        setDisplayedXP(totalXP || 0);
    }
  }, [justClaimed, totalXP]); // Remove displayedXP from deps to avoid loop

  // Animation for Lesson counting
  useEffect(() => {
    if (justClaimed && completedLessons) {
       const duration = 1000;
       const startTimestamp = performance.now();
       const startValue = displayedLessons; 
       const endValue = completedLessons;

       const step = (timestamp: number) => {
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          
          setDisplayedLessons(Math.floor(startValue + (endValue - startValue) * easeOutQuart));
          
          if (progress < 1) {
             requestAnimationFrame(step);
          }
       };
       requestAnimationFrame(step);
    } else {
        setDisplayedLessons(completedLessons || 0);
    }
  }, [justClaimed, completedLessons]);

  const handleLessonOneClick = () => {
      onNavigate('stack-lesson-1');
  };

  const handleLessonClick = (lessonId: string) => {
      if (lessonId === 'linear-queue') {
          onNavigate('queue-lesson-1');
      } else if (lessonId === 'circular-queue') {
          onNavigate('circular-lesson-1');
      } else if (lessonId === 'priority-queue') {
          onNavigate('priority-lesson-1');
      } else if (lessonId === 'linked-list') {
          onNavigate('linked-list-lesson-1');
      }
      // Future lessons...
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Sticky Progress Overview */}
        <div className="sticky top-0 z-10 bg-white pt-6 pb-4 border-b-2 border-transparent">
          <div className="grid grid-cols-2 gap-4">
              {/* Total XP - Yellow */}
              <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 flex flex-col justify-between h-full">
                <h3 className="text-[#AFAFAF] text-xs font-bold uppercase tracking-wider mb-2">Total XP</h3>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={justClaimed ? { 
                      rotate: [0, 20, -20, 20, 0],
                      scale: [1, 1.2, 1],
                      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                    } : {}}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                    <Star className="w-6 h-6 text-[#FFC800] fill-[#FFC800]" />
                  </motion.div>
                  <motion.span 
                    className="text-2xl font-bold text-[#4B4B4B]"
                  >
                    {displayedXP}
                  </motion.span>
                </div>
              </div>

              {/* Lessons - Blue */}
              <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 flex flex-col justify-between h-full">
                <h3 className="text-[#AFAFAF] text-xs font-bold uppercase tracking-wider mb-2">Lessons</h3>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-[#1CB0F6] flex items-center justify-center"
                    animate={justClaimed ? { 
                      scale: [1, 1.4, 0.8, 1.1, 1] // Scale Up -> Scale Down -> Settle
                    } : {}}
                    transition={{ duration: 0.8, ease: "anticipate" }}
                  >
                    <Award className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </motion.div>
                  <span className="text-2xl font-bold text-[#4B4B4B]">
                    <motion.span>
                      {displayedLessons}
                    </motion.span> 
                    <span className="text-[#AFAFAF] text-lg">/ {totalLessons}</span>
                  </span>
                </div>
              </div>
          </div>
          {/* Divider */}
          <div className="w-full h-0.5 bg-[#E5E5E5] mt-6" />
        </div>

        {/* Lesson Cards */}
        <div className="space-y-4 pt-4 pb-8">
          {lessons.map((lesson, index) => {
            const Icon = lesson.icon;
            const isUnlocked = lesson.unlocked;

            // Use custom Stack card for the first lesson
            if (lesson.id === 'stack') {
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <StackLessonCard
                    onClick={handleLessonOneClick}
                    progress={lesson.progress}
                    currentXP={lesson.currentXP}
                    totalXP={lesson.totalXP}
                  />
                </motion.div>
              );
            }

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <button
                  onClick={() => isUnlocked && handleLessonClick(lesson.id)}
                  disabled={!isUnlocked}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-500 ${
                    isUnlocked
                      ? 'bg-white border-[#E5E5E5] hover:border-[#58CC02] hover:shadow-lg cursor-pointer'
                      : 'bg-[#F7F7F7] border-[#E5E5E5] cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                        isUnlocked ? 'shadow-[0_4px_0_' + lesson.shadowColor + ']' : ''
                      }`}
                      style={{ backgroundColor: isUnlocked ? lesson.color : '#E5E5E5' }}
                    >
                      {/* Unlock Animation Wrapper */}
                      <motion.div
                         initial={false}
                         animate={isUnlocked ? { scale: [0.8, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                         transition={{ duration: 0.5 }}
                      >
                        {isUnlocked ? (
                            <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                        ) : (
                            <Lock className="w-7 h-7 text-[#AFAFAF]" strokeWidth={2.5} />
                        )}
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-bold text-lg transition-colors duration-500 ${isUnlocked ? 'text-[#4B4B4B]' : 'text-[#AFAFAF]'}`}>
                          {lesson.title}
                        </h3>
                        {isUnlocked && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1 px-2.5 py-0.5 bg-[#FFF4CC] rounded-full border-2 border-[#FFC800]"
                          >
                            <Star className="w-3.5 h-3.5 text-[#FFC800] fill-[#FFC800]" />
                            <span className="text-xs font-bold text-[#4B4B4B]">{lesson.xp} XP</span>
                          </motion.div>
                        )}
                      </div>
                      <p className={`text-sm mb-2 transition-colors duration-500 ${isUnlocked ? 'text-[#777]' : 'text-[#AFAFAF]'}`}>
                        {lesson.description}
                      </p>

                      {/* Progress */}
                      {isUnlocked && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                        >
                          <div className="flex items-center justify-between text-xs text-[#777] mb-1">
                            <span>Progress</span>
                            <span>{lesson.progress}%</span>
                          </div>
                          <div className="w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{ 
                                width: `${lesson.progress}%`,
                                backgroundColor: lesson.color
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
