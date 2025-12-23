import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { useState } from 'react';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4';

interface StackLesson4Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
  onComplete: () => void;
}

const BOOKS = [
  { title: 'Physics', color: '#FF4B4B', border: '#D93535', spine: '#FF7676' },
  { title: 'History', color: '#FF9600', border: '#E58600', spine: '#FFAD33' },
  { title: 'Math', color: '#1CB0F6', border: '#0D9FE8', spine: '#52C3F9' },
  { title: 'Chemistry', color: '#CE82FF', border: '#B565E8', spine: '#DFA3FF' },
];

const MAX_STACK_SIZE = 4;

export function StackLesson4({ onNavigate, currentProgress, onProgressUpdate, onComplete }: StackLesson4Props) {
  const [stack, setStack] = useState<typeof BOOKS[0][]>([]);
  const [bookIndex, setBookIndex] = useState(0);
  const [message, setMessage] = useState('Stack is empty');
  const [isError, setIsError] = useState(false);
  const [explanation, setExplanation] = useState("A Stack follows the LIFO (Last-In, First-Out) principle. You can only add (Push) or remove (Pop) items from the Top. The first item goes to Index 0.");
  
  // Task Tracking
  const [pushCount, setPushCount] = useState(0);
  const [popCount, setPopCount] = useState(0);
  const [peekCount, setPeekCount] = useState(0);

  const TARGET_PUSH = 3;
  const TARGET_POP = 3;
  const TARGET_PEEK = 1;

  const handlePush = () => {
    if (stack.length >= MAX_STACK_SIZE) {
      setMessage('Overflow! Stack is full');
      setExplanation("Stack Overflow! The fixed capacity is 4. You cannot Push more items until you Pop some to make space.");
      setIsError(true);
      return;
    }
    
    const nextBook = BOOKS[bookIndex];
    setStack([...stack, nextBook]);
    setBookIndex((prev) => (prev + 1) % BOOKS.length);
    setMessage(`Pushed ${nextBook.title} Book`);
    setIsError(false);
    setPushCount(prev => Math.min(prev + 1, TARGET_PUSH));

    if (stack.length === 0) {
      setExplanation(`Great start! You Pushed "${nextBook.title}". The Top index moved from -1 to 0. Why 0? Because array indices start at 0, so the first item always goes to Index 0.`);
    } else {
      setExplanation(`Pushed "${nextBook.title}". The Top index increased from ${stack.length - 1} to ${stack.length}. The new book is placed on top of the previous one.`);
    }
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage('Underflow! Stack is empty');
      setExplanation("Stack Underflow! The stack is already empty (Top index is -1). You cannot Pop or Peek when there is nothing there.");
      setIsError(true);
      return;
    }
    
    const poppedBook = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setMessage(`Popped ${poppedBook.title} Book`);
    setIsError(false);
    setPopCount(prev => Math.min(prev + 1, TARGET_POP));

    const prevTop = stack.length - 1;
    const newTop = stack.length - 2;
    setExplanation(`Popped "${poppedBook.title}". We removed the item at Index ${prevTop}. The Top index decreases from ${prevTop} to ${newTop}. The stack shrinks by one.`);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setMessage('Stack empty! Top = -1');
      setExplanation("Stack empty! cannot peek. The Top index is -1, meaning there are no elements to inspect.");
      setIsError(true);
      return;
    }
    
    const topBook = stack[stack.length - 1];
    setMessage(`Top is ${topBook.title} (Index ${stack.length - 1})`);
    setIsError(false);
    setPeekCount(prev => Math.min(prev + 1, TARGET_PEEK));

    setExplanation(`Peeked at "${topBook.title}". This operation simply checks the item at the Top (Index ${stack.length - 1}) without removing it. The Stack structure remains unchanged.`);
  };

  const handleReset = () => {
    setStack([]);
    setBookIndex(0);
    setMessage('Stack reset');
    setExplanation("Stack Reset. We are back to an empty stack. Top index is -1. Ready to Push new items starting at Index 0.");
    setIsError(false);
  };

  const handleComplete = () => {
    if (!canComplete) {
      setMessage('Complete tasks first!');
      setIsError(true);
      return;
    }
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
    onComplete();
  };

  const topIndex = stack.length - 1;
  const canComplete = pushCount >= TARGET_PUSH && popCount >= TARGET_POP && peekCount >= TARGET_PEEK;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('stack-lesson-3')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress}
            currentXP={Math.round(110 * currentProgress / 100)}
            totalXP={110}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full pt-24 pb-6">
        {/* Scrollable Content Area */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5"
          >
            <h2 className="mb-4 text-[#4B4B4B] text-xl font-bold">Interactive Stack</h2>
            
            <div className="flex flex-col gap-4">
              {/* Stack Container Area */}
              <div className="w-full grid grid-cols-[40px_1fr] gap-4">
                {/* Index Column */}
                <div className="flex flex-col-reverse pb-[22px] gap-2 items-center h-[240px] p-[0px]">
                   {[0, 1, 2, 3].map((index) => (
                     <div key={`idx-${index}`} className="h-12 w-full flex items-center justify-start relative">
                        <span className={`font-bold font-mono text-lg transition-colors ${index <= topIndex ? 'text-[#58CC02]' : 'text-[#E5E5E5]'}`}>
                          [{index}]
                        </span>
                        {/* Top Indicator */}
                        {index === topIndex && (
                           <motion.div 
                             layoutId="top-indicator"
                             className="absolute left-10 top-1/2 -translate-y-1/2 bg-[#58CC02] text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-30"
                           >
                             TOP
                           </motion.div>
                        )}
                     </div>
                   ))}
                </div>

                {/* Visual Stack */}
                <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] w-full shadow-sm relative min-h-[240px] flex flex-col justify-end items-center overflow-hidden">
                  
                  {/* Base */}
                  <div className="w-full h-2 bg-[#E5E5E5] rounded-full mb-1" />
                  
                  {/* Stack Items */}
                  <div className="absolute bottom-4 flex flex-col-reverse items-center gap-2 w-full px-8 pb-1">
                     <AnimatePresence mode="popLayout">
                       {stack.map((book, index) => (
                         <motion.div
                           key={`${book.title}-${index}`}
                           layout
                           initial={{ opacity: 0, y: -200, scale: 0.8 }} // Changed animation to drop from top
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           exit={{ opacity: 0, y: -200, scale: 0.8 }} // Changed animation to fly up
                           transition={{ 
                             type: "spring",
                             stiffness: 150,
                             damping: 18
                           }}
                           className="w-full h-12 relative z-20"
                           style={{ zIndex: index + 20 }}
                         >
                           {/* Book SVG Representation */}
                           <div className="w-full h-full relative group">
                              {/* Spine (Side view) */}
                              <div 
                                className="absolute inset-0 rounded-l-md rounded-r-sm shadow-md flex items-center px-4 border-b-2 border-r-2"
                                style={{ 
                                  backgroundColor: book.color,
                                  borderColor: book.border,
                                  borderRightColor: book.border,
                                  borderBottomColor: book.border
                                }}
                              >
                                {/* Spine Detail - Lines */}
                                <div className="absolute left-2 top-0 bottom-0 w-6 border-l border-r border-black/10 flex flex-col justify-between py-2">
                                   <div className="w-full h-[1px] bg-black/10" />
                                   <div className="w-full h-[1px] bg-black/10" />
                                </div>

                                {/* Title */}
                                <span className="text-white font-bold text-sm tracking-wide drop-shadow-md ml-6 truncate">
                                  {book.title}
                                </span>

                                {/* Pages look on the right edge */}
                                <div className="absolute right-0 top-1 bottom-1 w-3 bg-white/90 rounded-l-sm border-l border-black/5 flex flex-col justify-evenly">
                                   <div className="w-full h-[1px] bg-black/5" />
                                   <div className="w-full h-[1px] bg-black/5" />
                                   <div className="w-full h-[1px] bg-black/5" />
                                </div>
                              </div>
                           </div>
                         </motion.div>
                       ))}
                     </AnimatePresence>
                  </div>

                  {/* Empty State */}
                  {stack.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-[#AFAFAF] font-medium pointer-events-none">
                       Stack is Empty
                    </div>
                  )}
                </div>
              </div>

              {/* Combined Status & Message Bar */}
              <div className={`flex items-center justify-between p-3 rounded-xl border-2 transition-colors ${
                isError 
                  ? 'bg-[#FFF4F4] border-[#FF4B4B]' 
                  : 'bg-[#DDF4FF] border-[#1CB0F6]'
              }`}>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">
                    {isError ? 'Error' : 'Action'}
                  </span>
                  <span className={`font-bold text-sm ${isError ? 'text-[#FF4B4B]' : 'text-[#1CB0F6]'}`}>
                    {message}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">Top Index</span>
                  <div className="font-bold text-[#4B4B4B] text-sm">
                    {topIndex === -1 ? '-1' : topIndex}
                  </div>
                </div>
              </div>

              {/* Operations Controls */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={handlePush}
                  className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all active:translate-y-[2px] active:shadow-none ${
                    stack.length >= MAX_STACK_SIZE 
                      ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none'
                      : 'bg-[#58CC02] text-white shadow-[0_4px_0_#46A302] hover:brightness-105 active:shadow-[0_2px_0_#46A302]'
                  }`}
                >
                  PUSH
                </button>
                <button
                  onClick={handlePop}
                  className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all active:translate-y-[2px] active:shadow-none ${
                    stack.length === 0 
                      ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none'
                      : 'bg-[#FF4B4B] text-white shadow-[0_4px_0_#CC3939] hover:brightness-105 active:shadow-[0_2px_0_#CC3939]'
                  }`}
                >
                  POP
                </button>
                <button
                  onClick={handlePeek}
                  className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all active:translate-y-[2px] active:shadow-none ${
                    stack.length === 0 
                      ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none'
                      : 'bg-[#1CB0F6] text-white shadow-[0_4px_0_#0D9FE8] hover:brightness-105 active:shadow-[0_2px_0_#0D9FE8]'
                  }`}
                >
                  PEEK
                </button>
                <button
                  onClick={handleReset}
                  className="h-12 bg-[#777] text-white rounded-xl font-bold shadow-[0_4px_0_#4B4B4B] hover:brightness-105 active:translate-y-[2px] active:shadow-[0_2px_0_#4B4B4B] transition-all flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Explainer */}
        <div className="mt-4 mb-2 px-1">
          <h4 className="font-bold text-[#AFAFAF] mb-2 text-xs uppercase tracking-wide">Explanation:</h4>
          <p className="text-sm text-[#4B4B4B] text-left leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Bottom Section: Tasks and Complete Button */}
        <div className="mt-4 space-y-4">
           {/* Task Instructions */}
           {(!canComplete) && (
             <div className="px-1">
               <h4 className="font-bold text-[#AFAFAF] mb-2 text-xs uppercase tracking-wide">Remaining Tasks:</h4>
               <div className="flex flex-wrap gap-2 text-xs font-bold">
                 {pushCount < TARGET_PUSH && (
                   <span className="px-2 py-1 bg-[#F7F7F7] text-[#4B4B4B] rounded-lg border border-[#E5E5E5]">
                     Push {TARGET_PUSH - pushCount}x
                   </span>
                 )}
                 {peekCount < TARGET_PEEK && (
                    <span className="px-2 py-1 bg-[#F7F7F7] text-[#4B4B4B] rounded-lg border border-[#E5E5E5]">
                     Peek {TARGET_PEEK - peekCount}x
                   </span>
                 )}
                 {popCount < TARGET_POP && (
                    <span className="px-2 py-1 bg-[#F7F7F7] text-[#4B4B4B] rounded-lg border border-[#E5E5E5]">
                     Pop {TARGET_POP - popCount}x
                   </span>
                 )}
               </div>
             </div>
           )}

          <button
            onClick={handleComplete}
            className={`w-full h-14 rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 ${
               canComplete 
               ? 'bg-[#288CFF] text-white shadow-[0_4px_0_#2563EB] active:shadow-[0_2px_0_#2563EB]' 
               : 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none cursor-default'
            }`}
          >
            Complete Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
