import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'linked-list-lesson-1' | 'linked-list-lesson-2' | 'linked-list-lesson-3' | 'linked-list-lesson-4';

interface LinkedListLesson3Props {
  onNavigate: (screen: string) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function LinkedListLesson3({ onNavigate, currentProgress, onProgressUpdate }: LinkedListLesson3Props) {
  const handleContinue = () => {
    onProgressUpdate(75);
    setTimeout(() => {
      onNavigate('linked-list-lesson-4');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('linked-list-lesson-2')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress}
            currentXP={Math.round(150 * currentProgress / 100)} 
            totalXP={150}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full pt-24 pb-6">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6"
          >
            <h2 className="mb-6 text-[#4B4B4B] text-2xl font-bold">Key Operations</h2>
            
            <div className="grid gap-6">
              {/* Insertion */}
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#DDF4FF] flex items-center justify-center text-[#1CB0F6]">
                       <Plus className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-[#4B4B4B]">Insertion</h3>
                 </div>
                 <div className="bg-[#F7F7F7] rounded-xl border-2 border-[#E5E5E5] p-4 text-sm text-[#777] space-y-2">
                    <p><strong className="text-[#4B4B4B]">At Head:</strong> Create new node -&gt; Point it to Head -&gt; Update Head.</p>
                    <p><strong className="text-[#4B4B4B]">At Tail:</strong> Traverse to end -&gt; Point last node to new node.</p>
                 </div>
              </div>

              {/* Deletion */}
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFE8E8] flex items-center justify-center text-[#FF4B4B]">
                       <Trash2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-[#4B4B4B]">Deletion</h3>
                 </div>
                 <div className="bg-[#F7F7F7] rounded-xl border-2 border-[#E5E5E5] p-4 text-sm text-[#777] space-y-2">
                    <p><strong className="text-[#4B4B4B]">Delete Head:</strong> Move Head pointer to the next node.</p>
                    <p><strong className="text-[#4B4B4B]">Delete Value:</strong> Find node -&gt; Change previous node's pointer to skip it.</p>
                 </div>
              </div>

              {/* Diagrams - Conceptual Only */}
               <div className="mt-4 p-4 border-2 border-[#CE82FF] bg-[#F4DEFF] rounded-xl">
                  <h4 className="font-bold text-[#B565E8] text-sm uppercase mb-2 text-center">Pointer Magic</h4>
                  <div className="flex items-center justify-center gap-2">
                     <div className="w-8 h-8 border-2 border-[#CE82FF] bg-white rounded flex items-center justify-center text-xs font-bold">A</div>
                     <ArrowRight className="w-4 h-4 text-[#CE82FF]" />
                     <div className="w-8 h-8 border-2 border-dashed border-[#CE82FF] bg-white/50 rounded flex items-center justify-center text-xs text-[#CE82FF] font-bold">X</div>
                     <ArrowRight className="w-4 h-4 text-[#CE82FF]" />
                     <div className="w-8 h-8 border-2 border-[#CE82FF] bg-white rounded flex items-center justify-center text-xs font-bold">B</div>
                  </div>
                  <p className="text-center text-xs text-[#B565E8] mt-2 font-bold">
                     "To delete X, just point A directly to B!"
                  </p>
               </div>
            </div>
          </motion.div>
        </div>

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