import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, RotateCw, Star } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4' | 'circular-lesson-1' | 'circular-lesson-2' | 'circular-lesson-3' | 'circular-lesson-4';

interface CircularQueueLesson1Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function CircularQueueLesson1({ onNavigate, currentProgress, onProgressUpdate }: CircularQueueLesson1Props) {
  const handleContinue = () => {
    onProgressUpdate(25);
    setTimeout(() => {
      onNavigate('circular-lesson-2');
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-[#E5E5E5] mb-6 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#9059FF] p-5 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10">
                <RotateCw className="w-24 h-24" strokeWidth={1} />
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-[0_4px_0_#7E46E5]">
                    <RotateCw className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <Star className="w-4 h-4 text-[#FFC800] fill-[#FFC800]" />
                    <span className="font-bold text-sm">135 XP</span>
                  </div>
                </div>
                <h1 className="text-white mb-1 text-3xl font-bold">Circular Queue</h1>
                <p className="text-[#F4DEFF] text-sm font-bold">Ring Buffer Implementation</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-[#4B4B4B] text-lg leading-relaxed">
                Imagine a queue that connects its end back to its start, forming a circle. This is a <strong>Circular Queue</strong> (or Ring Buffer).
              </p>
              
              <div className="bg-[#F4DEFF] p-4 rounded-xl border-2 border-[#9059FF]">
                <p className="text-[#7E46E5] font-bold text-center">
                  "Waste not, want not!"
                </p>
              </div>

              <p className="text-[#4B4B4B] text-lg leading-relaxed">
                Unlike a Linear Queue, where space is wasted as you dequeue items, a Circular Queue reuses the empty slots at the beginning. It's highly efficient!
              </p>
            </div>
          </motion.div>

          {/* Visual Representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-8 flex flex-col items-center justify-center min-h-[300px]"
          >
             <div className="relative w-64 h-64">
                {/* Connecting Ring */}
                <div className="absolute inset-0 rounded-full border-[12px] border-[#F4DEFF] border-dashed" />
                
                {/* Slots */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const angle = (i * 360) / 8; // 8 slots
                  const radius = 120; // Distance from center
                  const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                  const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="absolute w-12 h-12 bg-white border-2 border-[#CE82FF] rounded-full flex items-center justify-center shadow-sm z-10"
                      style={{
                        left: `calc(50% + ${x}px - 24px)`,
                        top: `calc(50% + ${y}px - 24px)`,
                      }}
                    >
                      <span className="text-[#CE82FF] font-bold font-mono">{i}</span>
                    </motion.div>
                  );
                })}

                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-center">
                      <span className="text-4xl">🔄</span>
                      <p className="text-[#AFAFAF] text-xs font-bold uppercase mt-2">Ring Buffer</p>
                   </div>
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