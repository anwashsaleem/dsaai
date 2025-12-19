import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, RotateCw, Ban } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('circular-lesson-2')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
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
          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6"
          >
            <h2 className="mb-4 text-[#4B4B4B] text-xl font-bold">Circular Operations</h2>
            <div className="space-y-4">
              
              {/* Enqueue Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 bg-[#D7FFB8] rounded-2xl border-2 border-[#58CC02]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#58CC02] rounded-lg flex items-center justify-center">
                    <RotateCw className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[#58CC02] text-xl font-bold">Enqueue (Wrap)</h3>
                </div>
                <p className="text-[#4B4B4B] text-base mb-2">
                    Move Rear forward. If it hits the end, wrap around to 0!
                </p>
                <div className="bg-white/60 p-2 rounded-lg font-mono text-sm text-[#58CC02] font-bold">
                    Rear = (Rear + 1) % Size
                </div>
              </motion.div>

              {/* Dequeue Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 bg-[#FFE8E8] rounded-2xl border-2 border-[#FF4B4B]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#FF4B4B] rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[#FF4B4B] text-xl font-bold">Dequeue</h3>
                </div>
                <p className="text-[#4B4B4B] text-base mb-2">
                    Move Front forward. It also wraps around to 0.
                </p>
                <div className="bg-white/60 p-2 rounded-lg font-mono text-sm text-[#FF4B4B] font-bold">
                    Front = (Front + 1) % Size
                </div>
              </motion.div>

              {/* Full Condition */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="p-5 bg-[#DDF4FF] rounded-2xl border-2 border-[#1CB0F6]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#1CB0F6] rounded-lg flex items-center justify-center">
                    <Ban className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[#1CB0F6] text-xl font-bold">Is Full?</h3>
                </div>
                <p className="text-[#4B4B4B] text-base mb-2">
                    The queue is full if the next position for Rear is the Front.
                </p>
                <div className="bg-white/60 p-2 rounded-lg font-mono text-sm text-[#1CB0F6] font-bold">
                    (Rear + 1) % Size == Front
                </div>
              </motion.div>
            
              {/* Info Box */}
              <div className="mt-2 bg-[#F7F7F7] p-4 rounded-xl border border-[#E5E5E5] flex flex-col gap-1 items-start text-left">
                 <strong className="text-[#4B4B4B] text-sm uppercase tracking-wide">Remember</strong>
                 <p className="text-[#777] text-sm leading-relaxed">
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
            className="w-full h-14 bg-[#58CC02] text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#46A302] transition-all flex items-center justify-center gap-3"
          >
            Continue
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
