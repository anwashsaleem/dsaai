import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, GitBranch, Star } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'linked-list-lesson-1' | 'linked-list-lesson-2' | 'linked-list-lesson-3' | 'linked-list-lesson-4';

interface LinkedListLesson1Props {
  onNavigate: (screen: string) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function LinkedListLesson1({ onNavigate, currentProgress, onProgressUpdate }: LinkedListLesson1Props) {
  const handleContinue = () => {
    onProgressUpdate(25);
    setTimeout(() => {
      onNavigate('linked-list-lesson-2');
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
            currentXP={Math.round(170 * currentProgress / 100)} 
            totalXP={170}
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
            <div className="bg-[#CE82FF] p-5 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10">
                <GitBranch className="w-24 h-24" strokeWidth={1} />
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-[0_4px_0_#B565E8]">
                    <GitBranch className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <Star className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                    <span className="font-bold text-sm">150 XP</span>
                  </div>
                </div>
                <h1 className="text-white mb-1 text-3xl font-bold">Linked List</h1>
                <p className="text-[#F4DEFF] text-sm font-bold">Sequential Data Structure</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Definition */}
              <div className="mb-6">
                <h2 className="mb-2 text-text-primary dark:text-text-primary text-2xl font-bold">What is a Linked List?</h2>
                <p className="text-text-secondary dark:text-text-secondary leading-relaxed text-base">
                  A <span className="text-[#CE82FF] font-bold">Linked List</span> is a collection of nodes where each node contains a value and a pointer (reference) to the next node in the sequence.
                </p>
              </div>

              {/* Visual Preview */}
              <div>
                <h3 className="mb-2 text-text-primary dark:text-text-primary text-lg font-bold">Visual Representation</h3>
                <div className="bg-hover-background dark:bg-hover-background rounded-xl border-2 border-border dark:border-border p-6 py-10 flex items-center overflow-x-auto">
                    <div className="flex items-center gap-1 min-w-max mx-auto">
                        {/* Head Label */}
                        <div className="flex flex-col items-center mr-2">
                            <span className="text-text-secondary dark:text-text-secondary text-[10px] font-bold uppercase mb-1">Head</span>
                            <div className="w-0.5 h-4 bg-text-secondary dark:bg-text-secondary" />
                        </div>

                        {/* Nodes */}
                        {[10, 25, 40].map((val, idx) => (
                            <div key={idx} className="flex items-center">
                                {/* Node Box */}
                                <div className="flex border-2 border-[#CE82FF] dark:border-[#CE82FF] rounded-lg bg-card dark:bg-card overflow-hidden shadow-sm">
                                    <div className="w-10 h-10 flex items-center justify-center font-bold text-text-primary dark:text-text-primary border-r border-[#CE82FF] dark:border-[#CE82FF]">
                                        {val}
                                    </div>
                                    <div className="w-8 h-10 bg-[#F4DEFF] dark:bg-[#3A2A50] flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-[#CE82FF]" />
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="w-8 h-0.5 bg-[#CE82FF] relative mx-1">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-[#CE82FF] rotate-45 transform translate-x-[-2px]" />
                                </div>
                            </div>
                        ))}

                        {/* Null */}
                        <div className="flex flex-col items-center justify-center w-12 h-10 border-2 border-dashed border-border dark:border-border rounded-lg bg-border dark:bg-border">
                            <span className="text-[10px] font-bold text-text-secondary dark:text-text-secondary uppercase">Null</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-text-secondary dark:text-text-secondary mt-3 font-bold text-center">
                    Nodes are scattered in memory, connected by pointers.
                </p>
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