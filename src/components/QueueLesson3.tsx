import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Plus, Minus, Eye } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4';

interface QueueLesson3Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function QueueLesson3({ onNavigate, currentProgress, onProgressUpdate }: QueueLesson3Props) {
  const handleContinue = () => {
    onProgressUpdate(50);
    setTimeout(() => {
      onNavigate('queue-lesson-4');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('queue-lesson-2')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress}
            currentXP={Math.round(120 * currentProgress / 100)}
            totalXP={120}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full pt-24 pb-6">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5"
          >
            <h2 className="mb-4 text-[#4B4B4B] text-xl font-bold">Linear Queue Operations</h2>
            
            <div className="flex flex-col gap-4">
              
              {/* Enqueue Card */}
              <div className="bg-white border-2 border-[#E5E5E5] rounded-xl p-4 flex gap-4 items-center shadow-sm hover:border-[#1CB0F6] transition-colors group">
                 <div className="w-12 h-12 bg-[#DDF4FF] rounded-xl flex items-center justify-center text-[#1CB0F6] group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" strokeWidth={3} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#4B4B4B] text-lg">Enqueue</h3>
                    <p className="text-[#777] text-sm">Add an item to the <span className="font-bold text-[#FF9600]">Rear</span> (Back) of the queue.</p>
                 </div>
              </div>

              {/* Dequeue Card */}
              <div className="bg-white border-2 border-[#E5E5E5] rounded-xl p-4 flex gap-4 items-center shadow-sm hover:border-[#FF4B4B] transition-colors group">
                 <div className="w-12 h-12 bg-[#FFE5E5] rounded-xl flex items-center justify-center text-[#FF4B4B] group-hover:scale-110 transition-transform">
                    <Minus className="w-6 h-6" strokeWidth={3} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#4B4B4B] text-lg">Dequeue</h3>
                    <p className="text-[#777] text-sm">Remove an item from the <span className="font-bold text-[#1CB0F6]">Front</span> of the queue.</p>
                 </div>
              </div>

              {/* Peek Card */}
              <div className="bg-white border-2 border-[#E5E5E5] rounded-xl p-4 flex gap-4 items-center shadow-sm hover:border-[#FF9600] transition-colors group">
                 <div className="w-12 h-12 bg-[#FFF4CC] rounded-xl flex items-center justify-center text-[#FF9600] group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6" strokeWidth={3} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#4B4B4B] text-lg">Peek</h3>
                    <p className="text-[#777] text-sm">View the item at the <span className="font-bold text-[#1CB0F6]">Front</span> without removing it.</p>
                 </div>
              </div>

              {/* Info Box */}
              <div className="mt-2 bg-[#F7F7F7] p-4 rounded-xl border border-[#E5E5E5] flex flex-col gap-1 items-start text-left">
                 <strong className="text-[#4B4B4B] text-sm uppercase tracking-wide">Remember</strong>
                 <p className="text-[#777] text-sm leading-relaxed">
                    In a Linear Queue, once the Rear reaches the limit, you might run out of space even if you Dequeue items from the Front!
                 </p>
              </div>

            </div>
          </motion.div>
        </div>

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
