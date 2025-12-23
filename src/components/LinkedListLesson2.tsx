import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Music, Map, Train } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'linked-list-lesson-1' | 'linked-list-lesson-2' | 'linked-list-lesson-3' | 'linked-list-lesson-4';

interface LinkedListLesson2Props {
  onNavigate: (screen: string) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function LinkedListLesson2({ onNavigate, currentProgress, onProgressUpdate }: LinkedListLesson2Props) {
  const handleContinue = () => {
    onProgressUpdate(50);
    setTimeout(() => {
      onNavigate('linked-list-lesson-3');
    }, 300);
  };

  const examples = [
    {
      icon: Music,
      title: "Music Playlist",
      desc: "Each song knows which song comes next. You can easily insert a song into the queue without rewriting the whole list.",
      color: "#FF9600",
      bg: "#FFE8CC"
    },
    {
      icon: Map,
      title: "Treasure Hunt",
      desc: "Clue #1 leads to Clue #2. You don't know where Clue #3 is until you find Clue #2.",
      color: "#1CB0F6",
      bg: "#DDF4FF"
    },
    {
      icon: Train,
      title: "Train Cars",
      desc: "Each car is connected to the next. You can decouple a car and insert a new one in the middle.",
      color: "#FF4B4B",
      bg: "#FFE8E8"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('linked-list-lesson-1')}
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
            <h2 className="mb-6 text-[#4B4B4B] text-2xl font-bold">Real World Examples</h2>
            
            <div className="space-y-4">
              {examples.map((ex, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl border-2 border-[#E5E5E5] bg-white"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: ex.bg }}
                  >
                    <ex.icon className="w-6 h-6" style={{ color: ex.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4B4B4B] mb-1">{ex.title}</h3>
                    <p className="text-sm text-[#777] leading-relaxed">
                      {ex.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#F4DEFF] rounded-xl border-2 border-[#CE82FF]">
               <p className="text-[#B565E8] font-bold text-sm text-center">
                 "It's all about the connection!"
               </p>
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