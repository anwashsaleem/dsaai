import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'priority-lesson-1' | 'priority-lesson-2' | 'priority-lesson-3' | 'priority-lesson-4';

interface PriorityQueueLesson2Props {
  onNavigate: (screen: string) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function PriorityQueueLesson2({ onNavigate, currentProgress, onProgressUpdate }: PriorityQueueLesson2Props) {
  const handleContinue = () => {
    onProgressUpdate(50);
    setTimeout(() => {
      onNavigate('priority-lesson-3');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('priority-lesson-1')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
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
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-4 text-[#4B4B4B] text-xl font-bold">Real World Priority Queues</h2>
            
            <div className="grid gap-4">
              {/* Example 1: Hospital ER */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden bg-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#FF4B4B] hover:shadow-[0_4px_0_#D93535] transition-all cursor-default"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-24 h-24 bg-[#FF4B4B] rounded-full blur-2xl" />
                </div>
                <div className="p-5 flex items-start gap-4 relative z-10">
                  <div className="w-16 h-16 bg-[#FFE8E8] rounded-2xl flex items-center justify-center text-3xl shadow-sm border-b-4 border-[#FF4B4B]">
                    🏥
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#FF4B4B] text-xl font-bold mb-1">Emergency Room</h3>
                    <p className="text-[#777] text-sm leading-relaxed">
                      Patients with life-threatening conditions are treated first, regardless of when they arrived. A mild cough waits for the heart attack.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Example 2: Airport Boarding */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden bg-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#FF9600] hover:shadow-[0_4px_0_#E58600] transition-all cursor-default"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-24 h-24 bg-[#FF9600] rounded-full blur-2xl" />
                </div>
                <div className="p-5 flex items-start gap-4 relative z-10">
                  <div className="w-16 h-16 bg-[#FFE8CC] rounded-2xl flex items-center justify-center text-3xl shadow-sm border-b-4 border-[#FF9600]">
                    ✈️
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#FF9600] text-xl font-bold mb-1">Airline Boarding</h3>
                    <p className="text-[#777] text-sm leading-relaxed">
                      First Class and Frequent Flyers board before Economy, even if Economy passengers arrived at the gate earlier.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Example 3: OS Process Scheduling */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden bg-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#1CB0F6] hover:shadow-[0_4px_0_#0D9FE8] transition-all cursor-default"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-24 h-24 bg-[#1CB0F6] rounded-full blur-2xl" />
                </div>
                <div className="p-5 flex items-start gap-4 relative z-10">
                  <div className="w-16 h-16 bg-[#DDF4FF] rounded-2xl flex items-center justify-center text-3xl shadow-sm border-b-4 border-[#1CB0F6]">
                    ⚙️
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#1CB0F6] text-xl font-bold mb-1">System Tasks</h3>
                    <p className="text-[#777] text-sm leading-relaxed">
                      Your computer prioritizes critical system updates and mouse movements over background downloads to keep the interface responsive.
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
            className="w-full h-14 bg-[#58CC02] text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#46A302] transition-all flex items-center justify-center gap-3"
          >
            Continue
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
