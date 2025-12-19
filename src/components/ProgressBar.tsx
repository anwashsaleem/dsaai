import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface ProgressBarProps {
  currentProgress: number;
  currentXP: number;
  totalXP: number;
}

export function ProgressBar({ currentProgress, currentXP, totalXP }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex items-center justify-center flex-shrink-0">
        <Star className="w-6 h-6 text-[#FFC800] fill-[#FFC800]" strokeWidth={2.5} />
      </div>
      
      <div className="flex-1 relative">
        <div className="h-6 bg-[#E5E5E5] rounded-full overflow-hidden relative">
          <motion.div
            initial={false}
            animate={{ width: `${currentProgress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full bg-[#FFC800] rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-[#4B4B4B]">
              {currentXP} / {totalXP} XP
            </span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 min-w-[50px] text-right">
        <span className="text-sm font-extrabold text-[#58CC02]">{currentProgress}%</span>
      </div>
    </div>
  );
}
