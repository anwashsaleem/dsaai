import { motion } from 'motion/react';
import { Layers, GitBranch, Network, Lock, Star, Award, LayoutList, RotateCw, Zap, ArrowUpDown, ArrowDownUp, ArrowUp, BarChart3, Shuffle, Grid3x3, BoxSelect, SplitSquareHorizontal, Binary, BookOpen } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { TopBar } from './TopBar';

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

export function LearningPath({ onNavigate, stackCompleted, queueCompleted, circularCompleted, priorityCompleted, linkedListCompleted, totalXP, completedLessons, totalLessons = 19, justClaimed }: LearningPathProps) {
  const [displayedXP, setDisplayedXP] = useState(justClaimed ? (totalXP ? totalXP - 110 : 0) : (totalXP || 0));
  const [displayedLessons, setDisplayedLessons] = useState(justClaimed ? (completedLessons ? completedLessons - 1 : 0) : (completedLessons || 0));

  // Dynamic lessons array based on completion status
  const lessons = useMemo(() => {
    const dataStructures = [
      {
        id: 'stack',
        title: 'Stack',
        description: 'Last In First Out (LIFO)',
        icon: Layers,
        color: '#58cc02', // Green
        colorLight: '#D1FAE5',
        shadowColor: '#46A302',
        completed: stackCompleted || false,
        xp: 110,
        comingSoon: false,
        category: 'data-structures'
      },
      {
        id: 'linear-queue',
        title: 'Queue Linear',
        description: 'First In First Out (FIFO)',
        icon: LayoutList,
        color: '#1cb0f6', // Blue
        colorLight: '#E0F2FE',
        shadowColor: '#168DC5',
        completed: queueCompleted || false,
        xp: 120,
        comingSoon: false,
        category: 'data-structures'
      },
      {
        id: 'circular-queue',
        title: 'Circular Queue',
        description: 'Ring Buffer Implementation',
        icon: RotateCw,
        color: '#9059ff', // purple
        colorLight: '#FFF7ED',
        shadowColor: '#7347CC',
        completed: circularCompleted || false,
        xp: 135,
        comingSoon: false,
        category: 'data-structures'
      },
      {
        id: 'priority-queue',
        title: 'Priority Queue',
        description: 'Ordered by priority',
        icon: Star,
        color: '#ff9600', // orange
        colorLight: '#FAF5FF',
        shadowColor: '#CC7800',
        completed: priorityCompleted || false,
        xp: 145,
        comingSoon: false,
        category: 'data-structures'
      },
      {
        id: 'linked-list',
        title: 'Linked List',
        description: 'Sequential elements',
        icon: GitBranch,
        color: '#ce82ff', // lavender
        colorLight: '#F0FDFA',
        shadowColor: '#A568CC',
        completed: linkedListCompleted || false,
        xp: 170,
        comingSoon: false,
        category: 'data-structures'
      },
      {
        id: 'binary-tree',
        title: 'Binary Tree',
        description: 'Hierarchical structure',
        icon: Network,
        color: '#2E8B57', // Forest Green
        colorLight: '#F0FDF4',
        shadowColor: '#15803D',
        completed: false,
        xp: 185,
        comingSoon: true,
        category: 'data-structures'
      },
      {
        id: 'binary-search-tree',
        title: 'Binary Search Tree',
        description: 'Sorted hierarchical data',
        icon: Network,
        color: '#6E5EFF', // Blue Violet
        colorLight: '#EEF2FF',
        shadowColor: '#4F46E5',
        completed: false,
        xp: 200,
        comingSoon: true,
        category: 'data-structures'
      },
      {
        id: 'm-way-tree',
        title: 'M Way Tree',
        description: 'Multi-branch tree structure',
        icon: Network,
        color: '#008B8B', // Dark Cyan
        colorLight: '#ECFEFF',
        shadowColor: '#0891B2',
        completed: false,
        xp: 215,
        comingSoon: true,
        category: 'data-structures'
      },
      {
        id: 'm-way-search-tree',
        title: 'M Way Search Tree',
        description: 'Sorted multi-branch tree',
        icon: Network,
        color: '#FF7A00', // Dark Orange
        colorLight: '#FFF7ED',
        shadowColor: '#C2410C',
        completed: false,
        xp: 230,
        comingSoon: true,
        category: 'data-structures'
      }
    ];

    const algorithms = [
      {
        id: 'bubble-sort',
        title: 'Bubble Sort',
        description: 'Simple comparison-based sorting',
        icon: ArrowUpDown,
        color: '#FF6FAE', // Light Pink
        colorLight: '#FDF2F8',
        shadowColor: '#DB2777',
        completed: false,
        xp: 245,
        comingSoon: true,
        category: 'algorithms'
      },
      {
        id: 'selection-sort',
        title: 'Selection Sort',
        description: 'In-place comparison sorting',
        icon: ArrowDownUp,
        color: '#FFD60A', // Golden Yellow
        colorLight: '#FEFCE8',
        shadowColor: '#CA8A04',
        completed: false,
        xp: 260,
        comingSoon: true,
        category: 'algorithms'
      },
      {
        id: 'insertion-sort',
        title: 'Insertion Sort',
        description: 'Builds sorted array gradually',
        icon: ArrowUp,
        color: '#4682B4', // Steel Blue
        colorLight: '#F0F9FF',
        shadowColor: '#0284C7',
        completed: false,
        xp: 275,
        comingSoon: true,
        category: 'algorithms'
      },
      {
        id: 'heap-sort',
        title: 'Heap Sort',
        description: 'Heap-based sorting algorithm',
        icon: BarChart3,
        color: '#C0392B', // Brick Red
        colorLight: '#FEF2F2',
        shadowColor: '#B91C1C',
        completed: false,
        xp: 290,
        comingSoon: true,
        category: 'algorithms'
      },
      {
        id: 'radix-sort',
        title: 'Radix Sort',
        description: 'Non-comparative integer sorting',
        icon: Grid3x3,
        color: '#98FF98', // Mint Green
        colorLight: '#F0FDF4',
        shadowColor: '#16A34A',
        completed: false,
        xp: 305,
        comingSoon: true,
        category: 'algorithms'
      },
      {
        id: 'shell-sort',
        title: 'Shell Sort',
        description: 'Gap-based insertion sort',
        icon: Shuffle,
        color: '#B57EDC', // Lavender
        colorLight: '#F3E8FF',
        shadowColor: '#9333EA',
        completed: false,
        xp: 320,
        comingSoon: true,
        category: 'algorithms'
      },
      {
        id: 'bucket-sort',
        title: 'Bucket Sort',
        description: 'Distribution-based sorting',
        icon: BoxSelect,
        color: '#40E0D0', // Turquoise
        colorLight: '#F0FDFA',
        shadowColor: '#0D9488',
        completed: false,
        xp: 335,
        comingSoon: true,
        category: 'algorithms'
      },
      {
        id: 'merge-sort',
        title: 'Merge Sort',
        description: 'Divide and conquer sorting',
        icon: SplitSquareHorizontal,
        color: '#4B0082', // Indigo
        colorLight: '#EEF2FF',
        shadowColor: '#4338CA',
        completed: false,
        xp: 350,
        comingSoon: true,
        category: 'algorithms'
      },
      {
        id: 'quick-sort',
        title: 'Quick Sort',
        description: 'Pivot-based sorting',
        icon: Zap,
        color: '#DC143C', // Crimson
        colorLight: '#FEF2F2',
        shadowColor: '#BE123C',
        completed: false,
        xp: 365,
        comingSoon: true,
        category: 'algorithms'
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        description: 'Divide and conquer search',
        icon: Binary,
        color: '#001F54', // Navy
        colorLight: '#EFF6FF',
        shadowColor: '#1E40AF',
        completed: false,
        xp: 380,
        comingSoon: true,
        category: 'algorithms'
      }
    ];

    return { dataStructures, algorithms };
  }, [stackCompleted, queueCompleted, circularCompleted, priorityCompleted, linkedListCompleted]);

  // Find the next lesson (first non-completed lesson that's not coming soon)
  const nextLessonId = useMemo(() => {
    const allLessons = [...lessons.dataStructures, ...lessons.algorithms];
    const nextLesson = allLessons.find(lesson => !lesson.completed && !lesson.comingSoon);
    return nextLesson?.id || null;
  }, [lessons]);

  // Animation for XP counting
  useEffect(() => {
    if (justClaimed && totalXP) {
       const duration = 2000;
       const startTimestamp = performance.now();
       const startValue = displayedXP;
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
  }, [justClaimed, totalXP]);

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

  const handleLessonClick = (lessonId: string, comingSoon: boolean) => {
      if (comingSoon) return;
      
      if (lessonId === 'stack') {
          onNavigate('stack-lesson-1');
      } else if (lessonId === 'linear-queue') {
          onNavigate('queue-lesson-1');
      } else if (lessonId === 'circular-queue') {
          onNavigate('circular-lesson-1');
      } else if (lessonId === 'priority-queue') {
          onNavigate('priority-lesson-1');
      } else if (lessonId === 'linked-list') {
          onNavigate('linked-list-lesson-1');
      }
  };

  const renderLesson = (lesson: any, index: number) => {
    const Icon = lesson.icon;
    const isCompleted = lesson.completed;
    const isNext = lesson.id === nextLessonId;
    const isComingSoon = lesson.comingSoon;

    // Determine visual state
    let cardStyles: React.CSSProperties = {};
    let borderClass = 'border-2';
    let iconBgColor = lesson.color;
    let iconColorClass = 'text-white';
    let textColorClass = 'text-[#4B4B4B]';
    let descColorClass = 'text-[#777]';
    let hoverClass = 'hover:border-[#58CC02] hover:shadow-lg';
    let cursorClass = 'cursor-pointer';
    let shadowClass = '';

    if (isCompleted) {
      // Completed: filled background
      cardStyles = { backgroundColor: lesson.color, borderColor: lesson.shadowColor };
      borderClass = 'border-2';
      iconBgColor = 'white';
      iconColorClass = '';
      textColorClass = 'text-white';
      descColorClass = 'text-white/90';
      shadowClass = '';
    } else if (isNext) {
      // Next lesson: stroke/outline
      cardStyles = { borderColor: lesson.color, borderWidth: '4px' };
      borderClass = '';
      shadowClass = '';
    } else if (isComingSoon) {
      // Coming soon: grey/black and white
      cardStyles = { backgroundColor: '#F0F0F0', borderColor: '#D0D0D0' };
      borderClass = 'border-2';
      iconBgColor = '#8E8E8E';
      iconColorClass = 'text-white';
      textColorClass = 'text-[#8E8E8E]';
      descColorClass = 'text-[#AFAFAF]';
      hoverClass = '';
      cursorClass = 'cursor-not-allowed';
      shadowClass = '';
    } else {
      // Default: not completed, not next
      cardStyles = { borderColor: '#E5E5E5' };
      shadowClass = `shadow-[0_4px_0_${lesson.shadowColor}]`;
    }

    return (
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + index * 0.05 }}
      >
        <button
          onClick={() => handleLessonClick(lesson.id, isComingSoon)}
          disabled={isComingSoon}
          style={cardStyles}
          className={`w-full text-left p-5 rounded-2xl bg-white ${borderClass} ${hoverClass} ${cursorClass} transition-all duration-300`}
        >
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${shadowClass}`}
              style={{ backgroundColor: iconBgColor }}
            >
              <Icon 
                className={`w-8 h-8 ${iconColorClass}`} 
                strokeWidth={2.5} 
                style={{ color: isCompleted ? lesson.color : undefined }} 
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className={`${textColorClass} transition-colors duration-300`}>
                  {lesson.title}
                </h3>
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                    isCompleted 
                      ? 'bg-white/20 border-2 border-white/40' 
                      : isComingSoon
                      ? 'bg-[#E5E5E5] border-2 border-[#D0D0D0]'
                      : 'bg-[#FFF4CC] border-2 border-[#FFC800]'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isCompleted ? 'text-white fill-white' : isComingSoon ? 'text-[#AFAFAF] fill-[#AFAFAF]' : 'text-[#FFC800] fill-[#FFC800]'}`} />
                  <span className={`text-xs ${isCompleted ? 'text-white' : isComingSoon ? 'text-[#AFAFAF]' : 'text-[#4B4B4B]'}`}>{lesson.xp} XP</span>
                </motion.div>
              </div>
              <p className={`text-sm ${descColorClass} transition-colors duration-300`}>
                {lesson.description}
              </p>
              {isComingSoon && (
                <p className="text-xs text-[#AFAFAF] mt-1">Coming Soon</p>
              )}
            </div>
          </div>
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar 
        title="Lessons" 
        subLine="Explore all topics in DSAAI" 
        icon={BookOpen} 
        iconColor="#58CC02" 
        maxWidth="max-w-3xl"
      />
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Sticky Progress Overview */}
        <div className="sticky top-[94px] z-10 bg-white pt-6 pb-4 border-b-2 border-transparent">
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
                      scale: [1, 1.4, 0.8, 1.1, 1]
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
        <div className="space-y-6 pt-6 pb-8">
          {/* Data Structures Category */}
          <div>
            <h2 className="text-xl font-bold text-[#AFAFAF] uppercase tracking-wider pl-1 mb-4">Data Structures</h2>
            <div className="space-y-4">
              {lessons.dataStructures.map((lesson, index) => renderLesson(lesson, index))}
            </div>
          </div>

          {/* Algorithms Category */}
          <div>
            <h2 className="text-xl font-bold text-[#AFAFAF] uppercase tracking-wider pl-1 mb-4">Algorithms</h2>
            <div className="space-y-4">
              {lessons.algorithms.map((lesson, index) => renderLesson(lesson, index + lessons.dataStructures.length))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}