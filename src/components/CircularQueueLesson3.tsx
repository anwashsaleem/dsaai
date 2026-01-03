import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, RotateCw, Ban, Plus } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4' | 'circular-lesson-1' | 'circular-lesson-2' | 'circular-lesson-3' | 'circular-lesson-4';

interface CircularQueueLesson3Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function CircularQueueLesson3({ onNavigate, currentProgress, onProgressUpdate }: CircularQueueLesson3Props) {
  const handleContinue = () => {
    onProgressUpdate(75);
    setTimeout(() => {
      onNavigate('circular-lesson-4');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('circular-lesson-2')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border text-text-secondary dark:text-text-secondary hover:bg-border dark:hover:bg-border transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress}
            currentXP={Math.round(135 * currentProgress / 100)}
            totalXP={135}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full pt-24 pb-6">
        {/* Scrollable Content Area */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border p-6"
          >
            <h2 className="mb-4 text-text-primary dark:text-text-primary text-xl font-bold">Circular Queue Operations</h2>
            
            <div className="flex flex-col gap-4">
              
              {/* Enqueue Card */}
              <div className="space-y-4">
                <div className="p-5 bg-[#D7FFB8] dark:bg-[#2D4A1F] rounded-2xl border-2 border-[#58CC02] dark:border-[#58CC02]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#58CC02] rounded-lg flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                    <h3 className="text-[#58CC02] text-xl font-bold">Enqueue</h3>
                  </div>
                  <p className="text-text-primary dark:text-text-primary text-base mb-2">
                    Add an item to the <strong>Rear</strong> of the queue.
                  </p>
                  <div className="bg-card/60 dark:bg-card/60 p-2 rounded-lg font-mono text-sm text-[#58CC02] font-bold">
                    rear = (rear + 1) % size
                  </div>
                </div>
              </div>

              {/* Dequeue Card */}
              <div className="space-y-4">
                <div className="p-5 bg-[#FFE8E8] dark:bg-[#4A1F2D] rounded-2xl border-2 border-[#FF4B4B] dark:border-[#FF4B4B]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#FF4B4B] rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[#FF4B4B] text-xl font-bold">Dequeue</h3>
                  </div>
                  <p className="text-text-primary dark:text-text-primary text-base mb-2">
                    Remove an item from the <strong>Front</strong> of the queue.
                  </p>
                  <div className="bg-card/60 dark:bg-card/60 p-2 rounded-lg font-mono text-sm text-[#FF4B4B] font-bold">
                    front = (front + 1) % size
                  </div>
                </div>
              </div>

              {/* Full Condition */}
              <div className="space-y-4">
                <div className="p-5 bg-[#DDF4FF] dark:bg-[#1F2D4A] rounded-2xl border-2 border-[#1CB0F6] dark:border-[#1CB0F6]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#1CB0F6] rounded-lg flex items-center justify-center">
                      <Ban className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[#1CB0F6] text-xl font-bold">Is Full?</h3>
                  </div>
                  <p className="text-text-primary dark:text-text-primary text-base mb-2">
                    The queue is full if the next position for Rear is the Front.
                  </p>
                  <div className="bg-card/60 dark:bg-card/60 p-2 rounded-lg font-mono text-sm text-[#1CB0F6] font-bold">
                    (rear + 1) % size == front
                  </div>
                </div>
              </div>
            
              {/* Info Box */}
              <div className="mt-2 bg-hover-background dark:bg-hover-background p-4 rounded-xl border border-border dark:border-border flex flex-col gap-1 items-start text-left">
                 <strong className="text-text-primary dark:text-text-primary text-sm uppercase tracking-wide">Remember</strong>
                 <p className="text-text-secondary dark:text-text-secondary text-sm leading-relaxed">
                    Modulo operator (%) is the magic key to Circular Queues. It resets the index to 0 when it reaches the limit.
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