import { motion } from 'motion/react';
import { ArrowLeft, ArrowDown, ArrowUp, ArrowRight, Eye } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4';

interface StackLesson3Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function StackLesson3({ onNavigate, currentProgress, onProgressUpdate }: StackLesson3Props) {
  const handleContinue = () => {
    onProgressUpdate(75);
    setTimeout(() => {
      onNavigate('stack-lesson-4');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('stack-lesson-2')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress}
            currentXP={Math.round(110 * currentProgress / 100)}
            totalXP={110}
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
            {/* Key Operations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-4 text-[#4B4B4B] text-xl font-bold">Stack Operations</h2>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 bg-[#D7FFB8] rounded-2xl border-2 border-[#58CC02]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#58CC02] rounded-lg flex items-center justify-center">
                      <ArrowDown className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[#58CC02] text-xl font-bold">Push</h3>
                  </div>
                  <p className="text-[#4B4B4B] text-base">Add an element to the top of the stack</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-5 bg-[#FFE8E8] rounded-2xl border-2 border-[#FF4B4B]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#FF4B4B] rounded-lg flex items-center justify-center">
                      <ArrowUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[#FF4B4B] text-xl font-bold">Pop</h3>
                  </div>
                  <p className="text-[#4B4B4B] text-base">Remove the top element from the stack</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-5 bg-[#DDF4FF] rounded-2xl border-2 border-[#1CB0F6]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#1CB0F6] rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[#1CB0F6] text-xl font-bold">Peek</h3>
                  </div>
                  <p className="text-[#4B4B4B] text-base">View the top element without removing it</p>
                </motion.div>
              </div>
            </motion.div>
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