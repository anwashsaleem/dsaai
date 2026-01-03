import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Star, ChevronDown } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'priority-lesson-1' | 'priority-lesson-2' | 'priority-lesson-3' | 'priority-lesson-4';

interface PriorityQueueLesson3Props {
  onNavigate: (screen: string) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function PriorityQueueLesson3({ onNavigate, currentProgress, onProgressUpdate }: PriorityQueueLesson3Props) {
  const handleContinue = () => {
    onProgressUpdate(75);
    setTimeout(() => {
      onNavigate('priority-lesson-4');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('priority-lesson-2')}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border p-6"
          >
            <h2 className="mb-4 text-text-primary dark:text-text-primary text-xl font-bold">Priority Operations</h2>
            <div className="space-y-4">
              
              {/* Enqueue Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 bg-[#FFE8CC] dark:bg-[#4A3520] rounded-2xl border-2 border-[#FF9600] dark:border-[#FF9600]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#FF9600] rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" strokeWidth={2.5} fill="white" />
                  </div>
                  <h3 className="text-[#E07700] text-xl font-bold">Enqueue (Insert)</h3>
                </div>
                <p className="text-text-primary dark:text-text-primary text-base mb-2">
                    Add an item with a priority value. It moves ahead of lower priority items.
                </p>
                <div className="bg-card/60 dark:bg-card/60 p-2 rounded-lg font-mono text-sm text-[#E07700] font-bold">
                    Insert item at correct position...
                </div>
              </motion.div>

              {/* Dequeue Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 bg-[#D7FFB8] dark:bg-[#2D4A1F] rounded-2xl border-2 border-[#58CC02] dark:border-[#58CC02]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#58CC02] rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[#46A302] text-xl font-bold">Dequeue (Max)</h3>
                </div>
                <p className="text-text-primary dark:text-text-primary text-base mb-2">
                    Remove the item from the front. This is always the Highest Priority item available.
                </p>
                <div className="bg-card/60 dark:bg-card/60 p-2 rounded-lg font-mono text-sm text-[#46A302] font-bold">
                    return queue.shift()
                </div>
              </motion.div>
            
              {/* Info Box */}
              <div className="mt-2 bg-hover-background dark:bg-hover-background p-4 rounded-xl border border-border dark:border-border flex flex-col gap-1 items-start text-left">
                 <strong className="text-text-primary dark:text-text-primary text-sm uppercase tracking-wide">Behind the Scenes</strong>
                 <p className="text-text-secondary dark:text-text-secondary text-sm leading-relaxed">
                    While we visualize it as a sorted list, real-world systems often use a <strong>Binary Heap</strong> data structure to make this super fast!
                 </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <button
            onClick={handleContinue}
            className="w-full h-14 bg-[#288CFF] text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_#2563EB] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#2563EB] transition-all flex items-center justify-center gap-3"
          >
            Continue
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}