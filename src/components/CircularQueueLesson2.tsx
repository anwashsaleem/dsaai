import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4' | 'circular-lesson-1' | 'circular-lesson-2' | 'circular-lesson-3' | 'circular-lesson-4';

interface CircularQueueLesson2Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function CircularQueueLesson2({ onNavigate, currentProgress, onProgressUpdate }: CircularQueueLesson2Props) {
  const handleContinue = () => {
    onProgressUpdate(50);
    setTimeout(() => {
      onNavigate('circular-lesson-3');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('circular-lesson-1')}
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
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-4 text-[#4B4B4B] text-xl font-bold">Real World Circular Queues</h2>
            
            <div className="grid gap-4">
              {/* Example 1: Traffic Lights */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden bg-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#CE82FF] hover:shadow-[0_4px_0_#B565E8] transition-all cursor-default"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-24 h-24 bg-[#CE82FF] rounded-full blur-2xl" />
                </div>
                <div className="p-5 flex items-start gap-4 relative z-10">
                  <div className="w-16 h-16 bg-[#F4DEFF] rounded-2xl flex items-center justify-center text-3xl shadow-sm border-b-4 border-[#CE82FF]">
                    🚦
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#CE82FF] text-xl font-bold mb-1">Traffic Lights</h3>
                    <p className="text-[#777] text-sm leading-relaxed">
                      Red → Green → Yellow → Red. The cycle repeats endlessly. It's a circular queue of states!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Example 2: Streaming Buffer */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden bg-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#1CB0F6] hover:shadow-[0_4px_0_#0D9FE8] transition-all cursor-default"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-24 h-24 bg-[#1CB0F6] rounded-full blur-2xl" />
                </div>
                <div className="p-5 flex items-start gap-4 relative z-10">
                  <div className="w-16 h-16 bg-[#DDF4FF] rounded-2xl flex items-center justify-center text-3xl shadow-sm border-b-4 border-[#1CB0F6]">
                    📺
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#1CB0F6] text-xl font-bold mb-1">Video Buffering</h3>
                    <p className="text-[#777] text-sm leading-relaxed">
                      When you watch a video, your device buffers a few seconds ahead. As you watch (dequeue), it loads new data (enqueue) into the freed space.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Example 3: CPU Scheduling */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden bg-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#FF9600] hover:shadow-[0_4px_0_#E58600] transition-all cursor-default"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-24 h-24 bg-[#FF9600] rounded-full blur-2xl" />
                </div>
                <div className="p-5 flex items-start gap-4 relative z-10">
                  <div className="w-16 h-16 bg-[#FFE8CC] rounded-2xl flex items-center justify-center text-3xl shadow-sm border-b-4 border-[#FF9600]">
                    💻
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#FF9600] text-xl font-bold mb-1">Round Robin Scheduling</h3>
                    <p className="text-[#777] text-sm leading-relaxed">
                      The CPU gives every app a tiny slice of time in a circle. App A → App B → App C → App A. Fair and square!
                    </p>
                  </div>
                </div>
              </motion.div>
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