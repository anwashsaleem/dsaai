import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Ticket, Users } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4';

interface QueueLesson2Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function QueueLesson2({ onNavigate, currentProgress, onProgressUpdate }: QueueLesson2Props) {
  const handleContinue = () => {
    onProgressUpdate(50);
    setTimeout(() => {
      onNavigate('queue-lesson-3');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('queue-lesson-1')}
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
            <h2 className="mb-4 text-[#4B4B4B] text-xl font-bold">Real World Example</h2>
            
            <div className="flex flex-col gap-6">
              {/* Ticket Counter Visual */}
              <div className="bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] p-6 flex flex-col items-center">
                 <div className="w-full flex justify-between items-end h-32 relative">
                    
                    {/* Ticket Counter */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-white border-2 border-[#E5E5E5] rounded-xl flex flex-col items-center justify-center shadow-sm z-20">
                       <Ticket className="w-8 h-8 text-[#1CB0F6] mb-2" />
                       <span className="text-[10px] font-bold text-[#AFAFAF] uppercase text-center leading-tight">Ticket<br/>Counter</span>
                    </div>

                    {/* People in Queue */}
                    <div className="flex items-end gap-3 ml-28">
                       {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="flex flex-col items-center"
                          >
                             <div className={`w-12 h-16 rounded-t-full rounded-b-lg border-2 flex items-center justify-center relative ${
                                i === 0 ? 'bg-[#FF9600] border-[#E58600]' : 
                                i === 1 ? 'bg-[#CE82FF] border-[#B565E8]' : 
                                'bg-[#58CC02] border-[#46A302]'
                             }`}>
                                <Users className="w-6 h-6 text-white/90" />
                                {i === 0 && (
                                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF4B4B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                      Served Next
                                   </div>
                                )}
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="mt-4 text-center">
                    <p className="text-[#4B4B4B] font-medium text-sm">
                       Just like a ticket line: <br/>
                       New people join at the <strong>Back</strong> (Rear). <br/>
                       People get tickets from the <strong>Front</strong>.
                    </p>
                 </div>
              </div>

              {/* Analogy Text */}
              <div className="space-y-4">
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-[#DDF4FF] flex items-center justify-center flex-shrink-0 text-[#1CB0F6]">
                       <span className="font-bold text-lg">1</span>
                    </div>
                    <p className="text-[#777] text-sm leading-relaxed pt-1">
                       When you join a line, you don't cut in front. You stand at the end. This is called <strong className="text-[#4B4B4B]">Enqueue</strong>.
                    </p>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-[#DDF4FF] flex items-center justify-center flex-shrink-0 text-[#1CB0F6]">
                       <span className="font-bold text-lg">2</span>
                    </div>
                    <p className="text-[#777] text-sm leading-relaxed pt-1">
                       The person at the front leaves the line after being served. This is called <strong className="text-[#4B4B4B]">Dequeue</strong>.
                    </p>
                 </div>
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