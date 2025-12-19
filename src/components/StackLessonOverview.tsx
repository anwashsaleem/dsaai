import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Layers, Star, Eye } from 'lucide-react';
import { StackAnimation } from './StackAnimation';

type LearningScreen = 'path' | 'stack-overview' | 'stack-visualizer';

interface StackLessonOverviewProps {
  onNavigate: (screen: LearningScreen) => void;
}

export function StackLessonOverview({ onNavigate }: StackLessonOverviewProps) {
  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Back Button - More Prominent */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onNavigate('path')}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-[#DDF4FF] border-2 border-[#1CB0F6] text-[#1CB0F6] font-bold hover:bg-[#1CB0F6] hover:text-white transition-all rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          Back
        </motion.button>

        {/* Lesson Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden mb-6"
        >
          {/* Header */}
          <div className="bg-[#58CC02] p-8 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-10">
              <Layers className="w-32 h-32" strokeWidth={1} />
            </div>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-[0_6px_0_#46A302]">
                  <Layers className="w-10 h-10" strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Star className="w-5 h-5 text-[#FFC800] fill-[#FFC800]" />
                  <span className="font-bold">110 XP</span>
                </div>
              </div>
              <h1 className="text-white mb-2 text-4xl">Stack</h1>
              <p className="text-[#D7FFB8] text-lg">Last In First Out (LIFO) Data Structure</p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Definition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="mb-4 text-[#4B4B4B] text-xl font-bold">What is a Stack?</h2>
              <p className="text-[#777] leading-relaxed text-lg">
                Stack is a linear data structure that follows <span className="text-[#58CC02] font-bold">Last In First Out</span> (LIFO) principle. 
                Think of it like a stack of plates - you can only add or remove plates from the top.
              </p>
            </motion.div>

            {/* Visual Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="mb-4 text-[#4B4B4B] text-xl font-bold">Visual Representation</h3>
              <StackAnimation />
            </motion.div>

            {/* Key Concepts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h3 className="mb-4 text-[#4B4B4B] text-xl font-bold">Key Operations</h3>
              <div className="grid gap-4">
                <div className="p-5 bg-[#D7FFB8] rounded-2xl border-2 border-[#58CC02]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#58CC02] rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <h4 className="text-[#58CC02] font-bold">Push</h4>
                  </div>
                  <p className="text-[#4B4B4B]">Add an element to the top of the stack</p>
                </div>
                <div className="p-5 bg-[#FFE8E8] rounded-2xl border-2 border-[#FF4B4B]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#FF4B4B] rounded-lg flex items-center justify-center">
                      <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <h4 className="text-[#FF4B4B] font-bold">Pop</h4>
                  </div>
                  <p className="text-[#4B4B4B]">Remove the top element from the stack</p>
                </div>
                <div className="p-5 bg-[#DDF4FF] rounded-2xl border-2 border-[#1CB0F6]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#1CB0F6] rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <h4 className="text-[#1CB0F6] font-bold">Peek</h4>
                  </div>
                  <p className="text-[#4B4B4B]">View the top element without removing it</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => onNavigate('stack-visualizer')}
                className="w-full py-5 bg-[#58CC02] text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_6px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#46A302] transition-all flex items-center justify-center gap-3"
              >
                Interact with Stack
                <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}