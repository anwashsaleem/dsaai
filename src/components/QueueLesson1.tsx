import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, LayoutList, Star } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4';

interface QueueLesson1Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function QueueLesson1({ onNavigate, currentProgress, onProgressUpdate }: QueueLesson1Props) {
  const handleContinue = () => {
    onProgressUpdate(25);
    setTimeout(() => {
      onNavigate('queue-lesson-2');
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
            currentXP={currentProgress === 0 ? 5 : Math.round(120 * currentProgress / 100)}
            totalXP={120}
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
            <div className="bg-[#1CB0F6] p-5 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10">
                <LayoutList className="w-24 h-24" strokeWidth={1} />
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-[0_4px_0_#0D9FE8]">
                    <LayoutList className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <Star className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                    <span className="font-bold text-sm">120 XP</span>
                  </div>
                </div>
                <h1 className="text-white mb-1 text-3xl font-bold">Linear Queue</h1>
                <p className="text-[#DDF4FF] text-sm font-bold">First In First Out (FIFO)</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Definition */}
              <div className="mb-6">
                <h2 className="mb-2 text-[#4B4B4B] text-2xl font-bold">What is a Queue?</h2>
                <p className="text-[#777] leading-relaxed text-base">
                  A Queue is a linear data structure that follows the <span className="text-[#1CB0F6] font-bold">First In First Out</span> (FIFO) principle.
                  It works just like a real-life queue or line. The first person to join the line is the first one to be served.
                </p>
              </div>

              {/* Simple Visual */}
              <div>
                <h3 className="mb-2 text-[#4B4B4B] text-lg font-bold">Visual Representation</h3>
                <div className="bg-[#F7F7F7] rounded-xl border-2 border-[#E5E5E5] p-6 h-40 flex items-center justify-center relative overflow-hidden">
                   {/* Track */}
                   <div className="absolute inset-x-4 h-0.5 bg-[#E5E5E5] border-t-2 border-dashed border-[#E5E5E5]" />
                   
                   {/* Items */}
                   <div className="flex gap-4 relative z-10">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-[0_4px_0_rgba(0,0,0,0.1)] ${
                              i === 1 ? 'bg-[#FF9600]' : i === 2 ? 'bg-[#58CC02]' : 'bg-[#CE82FF]'
                           }`}>
                              {i}
                           </div>
                           <span className="text-[10px] text-[#AFAFAF] font-bold uppercase tracking-wide">
                              {i === 1 ? 'Front' : i === 3 ? 'Rear' : ''}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>
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
