import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4';

interface StackLesson2Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function StackLesson2({ onNavigate, currentProgress, onProgressUpdate }: StackLesson2Props) {
  const handleContinue = () => {
    onProgressUpdate(50);
    setTimeout(() => {
      onNavigate('stack-lesson-3');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('stack-lesson-1')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border text-text-secondary dark:text-text-secondary hover:bg-border dark:hover:bg-border transition-all rounded-xl"
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h2 className="mb-4 text-text-primary dark:text-text-primary text-xl font-bold">Real World Stacks</h2>
              
              <div className="grid gap-4">
                {/* Example 1: Pringles/Chips */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="group relative overflow-hidden bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border hover:border-[#58CC02] dark:hover:border-[#58CC02] hover:shadow-[0_4px_0_#46A302] dark:hover:shadow-[0_4px_0_#46A302] transition-all cursor-default"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="w-24 h-24 bg-[#58CC02] rounded-full blur-2xl" />
                  </div>
                  <div className="p-5 flex items-start gap-4 relative z-10">
                    <div className="w-16 h-16 bg-[#D7FFB8] dark:bg-[#2D4A1F] rounded-2xl flex items-center justify-center text-3xl shadow-sm border-b-4 border-[#58CC02] dark:border-[#58CC02]">
                      🍟
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#58CC02] text-xl font-bold mb-1">Tube of Chips</h3>
                      <p className="text-text-secondary dark:text-text-secondary text-sm leading-relaxed">
                        Hungry? You can only eat the <strong>top chip</strong>! To get to the bottom one, you have to eat all the chips above it first.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Example 2: Browser History */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="group relative overflow-hidden bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border hover:border-[#1CB0F6] dark:hover:border-[#1CB0F6] hover:shadow-[0_4px_0_#0D9FE8] dark:hover:shadow-[0_4px_0_#0D9FE8] transition-all cursor-default"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="w-24 h-24 bg-[#1CB0F6] rounded-full blur-2xl" />
                  </div>
                  <div className="p-5 flex items-start gap-4 relative z-10">
                    <div className="w-16 h-16 bg-[#DDF4FF] dark:bg-[#1A3A4A] rounded-2xl flex items-center justify-center text-3xl shadow-sm border-b-4 border-[#1CB0F6] dark:border-[#1CB0F6]">
                      🔙
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#1CB0F6] text-xl font-bold mb-1">Browser Back Button</h3>
                      <p className="text-text-secondary dark:text-text-secondary text-sm leading-relaxed">
                        Your browser remembers where you've been. Clicking <strong>Back</strong> pops the current site off the stack to show you the previous one!
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Example 3: Undo Action */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="group relative overflow-hidden bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border hover:border-[#FF9600] dark:hover:border-[#FF9600] hover:shadow-[0_4px_0_#E58600] dark:hover:shadow-[0_4px_0_#E58600] transition-all cursor-default"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="w-24 h-24 bg-[#FF9600] rounded-full blur-2xl" />
                  </div>
                  <div className="p-5 flex items-start gap-4 relative z-10">
                    <div className="w-16 h-16 bg-[#FFE8CC] dark:bg-[#4A3520] rounded-2xl flex items-center justify-center text-3xl shadow-sm border-b-4 border-[#FF9600] dark:border-[#FF9600]">
                      ↩️
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#FF9600] text-xl font-bold mb-1">Ctrl + Z (Undo)</h3>
                      <p className="text-text-secondary dark:text-text-secondary text-sm leading-relaxed">
                        Made a mistake? The computer remembers your actions in a stack. <strong>Undo</strong> pops the last action you did!
                      </p>
                    </div>
                  </div>
                </motion.div>
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