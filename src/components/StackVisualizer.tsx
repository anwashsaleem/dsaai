import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Minus, Lightbulb, CheckCircle, AlertCircle, X, RotateCcw } from 'lucide-react';

type LearningScreen = 'path' | 'stack-overview' | 'stack-visualizer';

interface StackVisualizerProps {
  onNavigate: (screen: LearningScreen) => void;
}

type FeedbackType = 'success' | 'error';

interface Feedback {
  type: FeedbackType;
  message: string;
}

const MAX_CAPACITY = 4;

export function StackVisualizer({ onNavigate }: StackVisualizerProps) {
  const [stack, setStack] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [cardCounter, setCardCounter] = useState(1);
  const [showHint, setShowHint] = useState(true);

  const showFeedback = (type: FeedbackType, message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handlePush = () => {
    if (stack.length >= MAX_CAPACITY) {
      showFeedback('error', 'Stack Overflow! Maximum capacity reached.');
      return;
    }

    setStack([...stack, cardCounter]);
    setCardCounter(cardCounter + 1);
    showFeedback('success', `Card ${cardCounter} added successfully!`);
    setShowHint(false);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      showFeedback('error', 'Stack Underflow! No elements to remove.');
      return;
    }

    const removed = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    showFeedback('success', `Card ${removed} removed successfully!`);
    setShowHint(false);
  };

  const handleReset = () => {
    setStack([]);
    setCardCounter(1);
    setShowHint(true);
    setFeedback(null);
  };

  const progress = (stack.length / MAX_CAPACITY) * 100;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#58CC02]"
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <button
              onClick={() => onNavigate('stack-overview')}
              className="mb-4 inline-flex items-center gap-2 text-[#1CB0F6] font-bold hover:text-[#0D9FE8] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="mb-2 text-[#4B4B4B]">Stack Visualizer</h1>
            <p className="text-[#777] text-lg">Try Push and Pop operations</p>
          </div>
          
          <button
            onClick={handleReset}
            className="hidden md:flex items-center gap-2 px-4 py-3 bg-white border-2 border-[#E5E5E5] rounded-xl font-bold text-[#777] hover:border-[#1CB0F6] hover:text-[#1CB0F6] transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visual Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#4B4B4B]">Stack Container</h2>
              <div className="px-4 py-2 bg-[#F7F7F7] rounded-xl border-2 border-[#E5E5E5] font-bold text-[#4B4B4B]">
                {stack.length} / {MAX_CAPACITY}
              </div>
            </div>

            {/* Stack Visualization */}
            <div className="relative min-h-[400px] p-6 bg-gradient-to-b from-white to-[#F7F7F7] rounded-xl">
              {/* Empty State Guides */}
              <div className="flex flex-col gap-3">
                {[...Array(MAX_CAPACITY)].map((_, index) => (
                  <div
                    key={index}
                    className="w-full h-20 border-2 border-dashed border-[#E5E5E5] rounded-xl flex items-center justify-center transition-all"
                  >
                    {index === MAX_CAPACITY - 1 && stack.length === 0 && (
                      <span className="text-[#AFAFAF] font-bold text-sm">Add your first card</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Actual Stack Cards */}
              <div className="absolute inset-6 flex flex-col-reverse gap-3 pointer-events-none">
                <AnimatePresence initial={false}>
                  {stack.map((card, index) => (
                    <motion.div
                      key={card}
                      initial={{ opacity: 0, scale: 0.5, y: -50, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, x: 100, rotate: 10 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 25,
                        opacity: { duration: 0.2 }
                      }}
                      className={`w-full h-20 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                        index === stack.length - 1
                          ? 'bg-[#58CC02] text-white shadow-[0_6px_0_#46A302] scale-105'
                          : 'bg-[#89E219] text-white shadow-[0_4px_0_#58CC02]'
                      }`}
                    >
                      <span className="text-xl">Card {card}</span>
                      {index === stack.length - 1 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-3 px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-xs uppercase tracking-wider"
                        >
                          TOP
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-6 text-center">
              <motion.div
                animate={{
                  scale: stack.length === MAX_CAPACITY ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 0.5, repeat: stack.length === MAX_CAPACITY ? Infinity : 0 }}
                className={`inline-block px-6 py-3 rounded-xl font-bold border-2 ${
                  stack.length === MAX_CAPACITY
                    ? 'bg-[#FFE8E8] border-[#FF4B4B] text-[#FF4B4B]'
                    : stack.length === 0
                    ? 'bg-[#F7F7F7] border-[#E5E5E5] text-[#AFAFAF]'
                    : 'bg-[#D7FFB8] border-[#58CC02] text-[#58CC02]'
                }`}
              >
                {stack.length === MAX_CAPACITY
                  ? '⚠️ Stack Full'
                  : stack.length === 0
                  ? 'Empty Stack'
                  : '✓ Ready'}
              </motion.div>
            </div>
          </motion.div>

          {/* Controls & Feedback Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Controls */}
            <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 md:p-8">
              <h2 className="mb-6 text-[#4B4B4B]">Operations</h2>
              
              <div className="space-y-4">
                {/* Push Button */}
                <button
                  onClick={handlePush}
                  disabled={stack.length >= MAX_CAPACITY}
                  className={`w-full py-5 rounded-2xl font-bold text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
                    stack.length >= MAX_CAPACITY
                      ? 'bg-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed border-2 border-[#E5E5E5]'
                      : 'bg-[#58CC02] text-white shadow-[0_6px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#46A302]'
                  }`}
                >
                  <Plus className="w-6 h-6" strokeWidth={3} />
                  Push
                </button>

                {/* Pop Button */}
                <button
                  onClick={handlePop}
                  disabled={stack.length === 0}
                  className={`w-full py-5 rounded-2xl font-bold text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
                    stack.length === 0
                      ? 'bg-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed border-2 border-[#E5E5E5]'
                      : 'bg-[#FF4B4B] text-white shadow-[0_6px_0_#D93838] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#D93838]'
                  }`}
                >
                  <Minus className="w-6 h-6" strokeWidth={3} />
                  Pop
                </button>

                {/* Reset Button - Mobile */}
                <button
                  onClick={handleReset}
                  className="md:hidden w-full py-4 bg-white border-2 border-[#E5E5E5] text-[#777] rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Feedback Messages */}
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  key={feedback.message}
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className={`p-5 rounded-2xl flex items-start gap-4 border-2 ${
                    feedback.type === 'success'
                      ? 'bg-[#D7FFB8] border-[#58CC02]'
                      : 'bg-[#FFE8E8] border-[#FF4B4B]'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle className="w-7 h-7 text-[#58CC02] flex-shrink-0" strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <AlertCircle className="w-7 h-7 text-[#FF4B4B] flex-shrink-0" strokeWidth={2.5} />
                    </motion.div>
                  )}
                  <p className={`font-bold ${
                    feedback.type === 'success' ? 'text-[#58CC02]' : 'text-[#FF4B4B]'
                  }`}>
                    {feedback.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Learning Hints */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#FFF4CC] border-2 border-[#FFC800] rounded-2xl p-6 relative"
                >
                  <button
                    onClick={() => setShowHint(false)}
                    className="absolute top-4 right-4 text-[#FFC800] hover:text-[#FF9600] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-start gap-4 pr-8">
                    <Lightbulb className="w-7 h-7 text-[#FFC800] flex-shrink-0" strokeWidth={2.5} />
                    <div>
                      <h3 className="text-[#4B4B4B] mb-3">Quick Tips</h3>
                      <ul className="text-[#777] space-y-2">
                        <li>• <span className="text-[#4B4B4B] font-bold">Push</span> adds to the top</li>
                        <li>• <span className="text-[#4B4B4B] font-bold">Pop</span> removes from the top</li>
                        <li>• Max capacity: {MAX_CAPACITY} cards</li>
                        <li>• Top card is highlighted in green</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6">
              <h3 className="mb-4 text-[#4B4B4B]">Stack Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[#D7FFB8] rounded-xl border-2 border-[#58CC02]">
                  <div className="text-[#777] mb-2 text-sm">Elements</div>
                  <div className="text-3xl text-[#58CC02] font-bold">{stack.length}</div>
                </div>
                <div className="text-center p-4 bg-[#DDF4FF] rounded-xl border-2 border-[#1CB0F6]">
                  <div className="text-[#777] mb-2 text-sm">Available</div>
                  <div className="text-3xl text-[#1CB0F6] font-bold">{MAX_CAPACITY - stack.length}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
