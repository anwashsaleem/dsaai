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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('path')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress === 0 ? 3 : currentProgress}
            currentXP={currentProgress === 0 ? 5 : Math.round(150 * currentProgress / 100)}
            totalXP={150}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full pt-24 pb-6">
        <div className="flex-1">
          {/* Lesson Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden"
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
                <h2 className="mb-2 text-[#4B4B4B] text-2xl font-bold">What is a Linked List?</h2>
                <p className="text-[#777] leading-relaxed text-base">
                  A <span className="text-[#CE82FF] font-bold">Linked List</span> is a collection of nodes where each node contains a value and a pointer (reference) to the next node in the sequence.
                </p>
              </div>

              {/* Visual Preview */}
              <div>
                <h3 className="mb-2 text-[#4B4B4B] text-lg font-bold">Visual Representation</h3>
                <div className="bg-[#F7F7F7] rounded-xl border-2 border-[#E5E5E5] p-6 py-10 flex items-center justify-center overflow-x-auto">
                    <div className="flex items-center gap-1 min-w-max">
                        {/* Head Label */}
                        <div className="flex flex-col items-center mr-2">
                            <span className="text-[#AFAFAF] text-[10px] font-bold uppercase mb-1">Head</span>
                            <div className="w-0.5 h-4 bg-[#AFAFAF]" />
                        </div>

                        {/* Nodes */}
                        {[10, 25, 40].map((val, idx) => (
                            <div key={idx} className="flex items-center">
                                {/* Node Box */}
                                <div className="flex border-2 border-[#CE82FF] rounded-lg bg-white overflow-hidden shadow-sm">
                                    <div className="w-10 h-10 flex items-center justify-center font-bold text-[#4B4B4B] border-r border-[#CE82FF]">
                                        {val}
                                    </div>
                                    <div className="w-8 h-10 bg-[#F4DEFF] flex items-center justify-center">
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
                        <div className="flex flex-col items-center justify-center w-12 h-10 border-2 border-dashed border-[#AFAFAF] rounded-lg bg-[#E5E5E5]">
                            <span className="text-[10px] font-bold text-[#777] uppercase">Null</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-[#AFAFAF] mt-3 font-bold text-center">
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
