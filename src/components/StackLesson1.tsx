import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Layers, Star } from 'lucide-react';
import { StackAnimation } from './StackAnimation';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4';

interface StackLesson1Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function StackLesson1({ onNavigate, currentProgress, onProgressUpdate }: StackLesson1Props) {
  const handleContinue = () => {
    onProgressUpdate(25);
    setTimeout(() => {
      onNavigate('stack-lesson-2');
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
            currentXP={currentProgress === 0 ? 5 : Math.round(110 * currentProgress / 100)}
            totalXP={110}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full pt-24 pb-6">
        {/* Scrollable Content Area */}
        <div className="flex-1">
          {/* Lesson Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#58CC02] p-5 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10">
                <Layers className="w-24 h-24" strokeWidth={1} />
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-[0_4px_0_#46A302]">
                    <Layers className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <Star className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                    <span className="font-bold text-sm">110 XP</span>
                  </div>
                </div>
                <h1 className="text-white mb-1 text-3xl font-bold">Stack</h1>
                <p className="text-[#D7FFB8] text-sm font-bold">Last In First Out (LIFO)</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Definition */}
              <div className="mb-6">
                <h2 className="mb-2 text-[#4B4B4B] text-2xl font-bold">What is a Stack?</h2>
                <p className="text-[#777] leading-relaxed text-base">
                  Stack is a linear data structure that follows <span className="text-[#58CC02] font-bold">Last In First Out</span> (LIFO) principle. 
                  Think of it like a stack of plates - you can only add or remove plates from the top.
                </p>
              </div>

              {/* Visual Preview */}
              <div>
                <h3 className="mb-2 text-[#4B4B4B] text-lg font-bold">Visual Representation</h3>
                <StackAnimation />
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