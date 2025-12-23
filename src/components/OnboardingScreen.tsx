import { motion } from 'motion/react';
import { Layers, BookOpen, Zap, Target } from 'lucide-react';

interface OnboardingScreenProps {
  onStart: () => void;
}

export function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-white">
      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        
        {/* App Name & Tagline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-left mb-12"
        >
          <h1 className="text-[#288CFF] text-5xl font-extrabold mb-3 tracking-tight">dsaai</h1>
          <p className="text-[#777] text-xl font-medium">Visualize, Interact, and Learn</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-8 w-full pl-2"
        >
          <div className="flex items-center gap-5">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-[#DEF5CC] rounded-2xl flex items-center justify-center border-2 border-[#58CC02]"
            >
              <BookOpen className="w-8 h-8 text-[#58CC02]" strokeWidth={2.5} />
            </motion.div>
            <div>
              <h3 className="text-[#111827] font-bold text-lg">Interactive Lessons</h3>
              <p className="text-[#777]">Learn by doing, not just reading</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="w-16 h-16 bg-[#DDF4FF] rounded-2xl flex items-center justify-center border-2 border-[#1CB0F6]"
            >
              <Zap className="w-8 h-8 text-[#1CB0F6]" strokeWidth={2.5} />
            </motion.div>
            <div>
              <h3 className="text-[#111827] font-bold text-lg">Visual Learning</h3>
              <p className="text-[#777]">See how data structures & algorithm work</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="w-16 h-16 bg-[#FFF4CC] rounded-2xl flex items-center justify-center border-2 border-[#FFC800]"
            >
              <Target className="w-8 h-8 text-[#FFC800]" strokeWidth={2.5} />
            </motion.div>
            <div>
              <h3 className="text-[#111827] font-bold text-lg">Track Progress</h3>
              <p className="text-[#777]">Master concepts step by step</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-md mx-auto pb-6 space-y-3"
      >
        <button
          onClick={onStart}
          className="w-full h-14 bg-[#288CFF] text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_#2563EB] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#2563EB] transition-all"
        >
          Start Learning
        </button>
        
        <button
          onClick={onStart}
          className="w-full h-12 bg-transparent text-[#1cb0f6] rounded-2xl font-bold text-base border-2 border-[#1cb0f6] hover:border-[#288CFF] hover:text-[#288CFF] active:scale-95 transition-all"
        >
          Continue as Guest
        </button>
      </motion.div>
    </div>
  );
}