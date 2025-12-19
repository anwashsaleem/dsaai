import { motion } from 'motion/react';
import { Layers, Star } from 'lucide-react';

interface StackLessonCardProps {
  onClick: () => void;
  progress: number;
  currentXP: number;
  totalXP: number;
}

export function StackLessonCard({ onClick, progress, currentXP, totalXP }: StackLessonCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border-[#E5E5E5] border-2 rounded-2xl hover:border-[#58CC02] hover:shadow-lg cursor-pointer transition-all p-5"
    >
      <div className="flex items-center gap-4">
        {/* Icon Container */}
        <div className="bg-[#58CC02] relative rounded-2xl shadow-[0_4px_0_#46A302] shrink-0 w-16 h-16 flex items-center justify-center">
          <Layers className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>

        {/* Content Container */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* Title and XP Badge */}
          <div className="flex items-start justify-between">
            <h3 className="font-extrabold text-[#4B4B4B] text-lg">Stack</h3>
            <div className="bg-[#FFF4CC] rounded-full border-[1.18px] border-[#FFC800] px-2.5 py-0.5 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#FFC800] fill-[#FFC800]" strokeWidth={2.5} />
              <span className="font-extrabold text-[#4B4B4B] text-xs">{totalXP} XP</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#777] text-sm mb-1">Last In First Out (LIFO)</p>

          {/* Progress Section */}
          <div className="flex flex-col gap-1 w-full mt-1">
            <div className="flex items-center justify-between">
              <span className="text-[#777] text-xs">Progress</span>
              <span className="text-[#777] text-xs">{progress}%</span>
            </div>
            <div className="bg-[#E5E5E5] h-3 rounded-full overflow-hidden w-full">
              <div
                className="bg-[#58CC02] h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
