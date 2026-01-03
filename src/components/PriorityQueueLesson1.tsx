import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'priority-lesson-1' | 'priority-lesson-2' | 'priority-lesson-3' | 'priority-lesson-4';

interface PriorityQueueLesson1Props {
  onNavigate: (screen: string) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function PriorityQueueLesson1({ onNavigate, currentProgress, onProgressUpdate }: PriorityQueueLesson1Props) {
  const handleContinue = () => {
    onProgressUpdate(25);
    setTimeout(() => {
      onNavigate('priority-lesson-2');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('path')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border text-text-secondary dark:text-text-secondary hover:bg-border dark:hover:bg-border transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress}
            currentXP={Math.round(145 * currentProgress / 100)} 
            totalXP={145}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full pt-24 pb-6">
        {/* Scrollable Content Area */}
        <div className="flex-1">
          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border mb-6 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#FF9600] p-5 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10">
                <Star className="w-24 h-24" strokeWidth={1} />
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-[0_4px_0_#E07700]">
                    <Star className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <Star className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                    <span className="font-bold text-sm">145 XP</span>
                  </div>
                </div>
                <h1 className="text-white mb-1 text-3xl font-bold">Priority Queue</h1>
                <p className="text-[#FFE8CC] text-sm font-bold">Ordered by Priority</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-text-primary dark:text-text-primary text-lg leading-relaxed">
                In a regular queue, it's "First Come, First Served." But in a <strong>Priority Queue</strong>, the "Most Important" gets served first!
              </p>
              
              <div className="bg-[#FFE8CC] dark:bg-[#4A3520] p-4 rounded-xl border-2 border-[#FF9600] dark:border-[#FF9600]">
                <p className="text-[#E07700] font-bold text-center">
                  "VIPs to the front!"
                </p>
              </div>

              <p className="text-text-primary dark:text-text-primary text-lg leading-relaxed">
                Elements are assigned a priority value. Elements with higher priority are dequeued before elements with lower priority, regardless of when they arrived.
              </p>
            </div>
          </motion.div>

          {/* Visual Representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border p-8 flex flex-col items-center justify-center min-h-[240px]"
          >
             <div className="flex flex-col items-center gap-8">
                <div className="flex items-end gap-4">
                  {/* Normal People Waiting */}
                  <div className="flex gap-2 opacity-50">
                      <div className="w-12 h-16 bg-border dark:bg-border rounded-t-lg rounded-b-md border-2 border-border dark:border-border flex items-center justify-center">
                         <span className="text-xl">😐</span>
                      </div>
                      <div className="w-12 h-16 bg-border dark:bg-border rounded-t-lg rounded-b-md border-2 border-border dark:border-border flex items-center justify-center">
                         <span className="text-xl">😐</span>
                      </div>
                  </div>

                  {/* VIP Cutting in */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8, type: "spring" }}
                    className="w-14 h-20 bg-[#FF9600] rounded-t-lg rounded-b-md border-b-4 border-[#E07700] flex flex-col items-center justify-center shadow-lg z-10 relative"
                  >
                     <div className="absolute -top-3">
                        <Star className="w-6 h-6 text-[#FFC800] fill-[#FFC800] drop-shadow-sm" />
                     </div>
                     <span className="text-2xl">😎</span>
                     <span className="text-white text-[10px] font-bold">VIP</span>
                  </motion.div>
                </div>
                
                <div className="text-center">
                   <p className="text-text-secondary dark:text-text-secondary text-xs font-bold uppercase">High Priority skips the line</p>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Continue Button */}
        <div className="mt-6">
          <button
            onClick={handleContinue}
            className="w-full h-14 bg-[#288CFF] text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_#2563EB] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#2563EB] transition-all flex items-center justify-center gap-3"
          >
            Continue
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}