import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Star, Zap, Coffee, Clock } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { useState } from 'react';

type LearningScreen = 'path' | 'stack-lesson-1' | 'priority-lesson-1' | 'priority-lesson-2' | 'priority-lesson-3' | 'priority-lesson-4';

interface PriorityQueueLesson4Props {
  onNavigate: (screen: string) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
  onComplete: () => void;
}

// Priorities: 3 = High, 2 = Medium, 1 = Low
const TASKS = [
  { id: 't1', title: 'System Crash', priority: 3, icon: Zap, color: '#FF4B4B', bg: '#FFE8E8' },
  { id: 't2', title: 'User Login', priority: 2, icon: Clock, color: '#FF9600', bg: '#FFE8CC' },
  { id: 't3', title: 'Email Sync', priority: 1, icon: Coffee, color: '#1CB0F6', bg: '#DDF4FF' },
  { id: 't4', title: 'Server Fire', priority: 3, icon: Zap, color: '#FF4B4B', bg: '#FFE8E8' },
  { id: 't5', title: 'Data Backup', priority: 1, icon: Coffee, color: '#1CB0F6', bg: '#DDF4FF' },
];

const MAX_CAPACITY = 5;

export function PriorityQueueLesson4({ onNavigate, currentProgress, onProgressUpdate, onComplete }: PriorityQueueLesson4Props) {
  const [queue, setQueue] = useState<typeof TASKS>([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [frontIndex, setFrontIndex] = useState(0);
  
  const [message, setMessage] = useState('Queue is empty');
  const [explanation, setExplanation] = useState("Enqueue tasks with different priorities. High Priority (Red) goes to the top!");
  
  const [enqueueCount, setEnqueueCount] = useState(0);
  const [dequeueCount, setDequeueCount] = useState(0);
  
  const TARGET_ENQUEUE = 5;
  const TARGET_DEQUEUE = 3;

  const handleEnqueue = () => {
    // Check if we have physical space (considering the shifting front)
    if (queue.length + frontIndex >= MAX_CAPACITY) {
        setMessage('Queue Full');
        setExplanation("Queue is full (Linear Queue limitation). The rear has hit the limit. Reset to clear space.");
        return;
    }

    const nextTask = { ...TASKS[taskIndex], uniqueId: Date.now() + Math.random() }; // Unique ID for animation key
    
    // Find insertion index in the active queue
    let insertIndex = queue.length;
    for (let i = 0; i < queue.length; i++) {
        if (nextTask.priority > queue[i].priority) {
            insertIndex = i;
            break;
        }
    }

    const newQueue = [...queue];
    newQueue.splice(insertIndex, 0, nextTask);
    
    setQueue(newQueue);
    setTaskIndex((prev) => (prev + 1) % TASKS.length);
    setMessage(`Enqueued ${nextTask.title}`);
    
    // Calculate visual index for explanation (0-based relative to front)
    // insertIndex is relative to queue start.
    // Visual position is frontIndex + insertIndex.
    
    if (insertIndex === 0) {
        setExplanation(`Enqueued "${nextTask.title}" (Priority ${nextTask.priority}). It jumped to the front of the line!`);
    } else {
        setExplanation(`Enqueued "${nextTask.title}" (Priority ${nextTask.priority}). It inserted based on priority.`);
    }

    setEnqueueCount(prev => Math.min(prev + 1, TARGET_ENQUEUE));
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
        setMessage('Queue Empty');
        setExplanation("Nothing to dequeue.");
        return;
    }

    const removedTask = queue[0];
    const newQueue = queue.slice(1);
    
    setQueue(newQueue);
    setFrontIndex(prev => prev + 1); // Move front pointer visually
    
    setMessage(`Dequeued ${removedTask.title}`);
    setExplanation(`Dequeued "${removedTask.title}". The Front pointer moves to the next item.`);
    
    setDequeueCount(prev => Math.min(prev + 1, TARGET_DEQUEUE));
  };

  const handleReset = () => {
    setQueue([]);
    setFrontIndex(0);
    setTaskIndex(0);
    setMessage('Reset');
    setExplanation("Queue cleared.");
  };

  const handleComplete = () => {
    if (!canComplete) return;
    if (navigator.vibrate) navigator.vibrate(200);
    onComplete();
  };

  const canComplete = enqueueCount >= TARGET_ENQUEUE && dequeueCount >= TARGET_DEQUEUE;

  // Next task preview
  const nextTask = TASKS[taskIndex];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('priority-lesson-3')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#777] hover:bg-[#E5E5E5] transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress}
            currentXP={Math.round(145 * currentProgress / 100)} 
            totalXP={145}
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
            <h2 className="mb-4 text-[#4B4B4B] text-xl font-bold">Interactive Priority Queue</h2>
            
            <div className="flex flex-col gap-6">
              {/* Queue Visualization (Fixed Height List) */}
              <div className="bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] p-4 flex flex-col relative">
                 
                 {/* Header Labels */}
                 <div className="flex justify-between text-[10px] font-bold text-[#AFAFAF] uppercase tracking-wide px-2 mb-2 pl-12">
                    <span className="w-8 text-center">Index</span>
                    <span className="flex-1 pl-4">Task Queue</span>
                    <span className="w-16 text-center">Priority</span>
                 </div>

                 <div className="flex flex-col gap-2 relative h-[360px]">
                    {Array.from({ length: MAX_CAPACITY }).map((_, slotIndex) => {
                        // Determine which task occupies this slot, if any
                        // A slot 'slotIndex' has a task if: slotIndex >= frontIndex AND slotIndex < frontIndex + queue.length
                        // The task index in the 'queue' array is: slotIndex - frontIndex
                        
                        const queueIndex = slotIndex - frontIndex;
                        const task = (queueIndex >= 0 && queueIndex < queue.length) ? queue[queueIndex] : null;
                        
                        // Check if this slot is the logical Front or Rear
                        const isFront = slotIndex === frontIndex && queue.length > 0;
                        const isRear = slotIndex === frontIndex + queue.length - 1 && queue.length > 0;

                        return (
                            <div key={slotIndex} className="w-full h-16 flex items-center gap-3 relative">
                                {/* Pointers Area (Left of Index) */}
                                <div className="absolute left-0 w-8 h-full flex items-center justify-center pointer-events-none">
                                    <AnimatePresence>
                                        {isFront && (
                                            <motion.div 
                                                key="front-pointer"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="bg-[#58CC02] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-20"
                                            >
                                                F
                                            </motion.div>
                                        )}
                                        {isRear && (
                                            <motion.div 
                                                key="rear-pointer"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className={`bg-[#FF9600] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-20 ${isFront ? 'absolute top-10' : ''}`} // Offset if pointing to same element
                                            >
                                                R
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Index Number */}
                                <div className="w-8 flex items-center justify-center pl-8">
                                    <span className="text-[#AFAFAF] font-mono font-bold text-sm">{slotIndex}</span>
                                </div>

                                {/* Task Slot */}
                                <div className="flex-1 h-full relative">
                                    {/* Empty Slot Placeholder */}
                                    <div className="absolute inset-0 rounded-xl border-2 border-dashed border-[#E5E5E5] bg-white/50" />

                                    {/* Animated Task Card */}
                                    <AnimatePresence mode='popLayout'>
                                        {task && (
                                            <motion.div
                                                key={task.uniqueId}
                                                layoutId={String(task.uniqueId)}
                                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                className="absolute inset-0 p-2 rounded-xl border-2 shadow-sm flex items-center justify-between bg-white overflow-hidden z-10"
                                                style={{ borderColor: task.color }}
                                            >
                                                {/* Priority Background Strip */}
                                                <div 
                                                  className="absolute left-0 top-0 bottom-0 w-2"
                                                  style={{ backgroundColor: task.color }}
                                                />

                                                <div className="flex items-center gap-3 pl-2 w-full overflow-hidden">
                                                    <div 
                                                      className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                                                      style={{ backgroundColor: task.bg }}
                                                    >
                                                        {task.icon && <task.icon className="w-4 h-4" style={{ color: task.color }} />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-[#4B4B4B] text-xs truncate">{task.title}</div>
                                                        <div 
                                                          className="text-[9px] font-bold uppercase truncate"
                                                          style={{ color: task.color }}
                                                        >
                                                            {task.priority === 3 ? 'High' : task.priority === 2 ? 'Med' : 'Low'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Priority Badge (Right Side) */}
                                <div className="w-16 flex justify-center">
                                    <AnimatePresence mode='popLayout'>
                                        {task && (
                                            <motion.div
                                                key={task.uniqueId}
                                                layoutId={`p-${task.uniqueId}`}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                                className="w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-sm bg-white"
                                                style={{ borderColor: task.color, color: task.color }}
                                            >
                                                {task.priority}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                 </div>
              </div>

              {/* Controls */}
              <div className="bg-[#F7F7F7] p-3 rounded-xl border-2 border-[#E5E5E5]">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase text-[#777]">
                        Next Task: <span style={{ color: nextTask.color }}>{nextTask.title} (P{nextTask.priority})</span>
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleEnqueue}
                      disabled={queue.length + frontIndex >= MAX_CAPACITY}
                      className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none transition-all ${
                          queue.length + frontIndex >= MAX_CAPACITY
                          ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none cursor-not-allowed'
                          : 'bg-[#FF9600] text-white shadow-[0_4px_0_#E07700]'
                      }`}
                    >
                      ENQUEUE
                    </button>
                    <button
                      onClick={handleDequeue}
                      disabled={queue.length === 0}
                      className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none transition-all ${
                          queue.length === 0
                          ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none cursor-not-allowed'
                          : 'bg-[#58CC02] text-white shadow-[0_4px_0_#46A302]'
                      }`}
                    >
                      DEQUEUE
                    </button>
                    <button
                      onClick={handleReset}
                      className="h-12 bg-[#777] text-white rounded-xl font-bold shadow-[0_4px_0_#4B4B4B] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                 </div>
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

        {/* Tasks */}
        <div className="mt-4 space-y-4">
           {(!canComplete) && (
             <div className="px-1">
               <h4 className="font-bold text-[#AFAFAF] mb-2 text-xs uppercase tracking-wide">Remaining Tasks:</h4>
               <div className="flex flex-wrap gap-2 text-xs font-bold">
                 {enqueueCount < TARGET_ENQUEUE && (
                   <span className="px-2 py-1 bg-[#F7F7F7] text-[#4B4B4B] rounded-lg border border-[#E5E5E5]">
                     Enqueue {TARGET_ENQUEUE - enqueueCount}x
                   </span>
                 )}
                 {dequeueCount < TARGET_DEQUEUE && (
                    <span className="px-2 py-1 bg-[#F7F7F7] text-[#4B4B4B] rounded-lg border border-[#E5E5E5]">
                     Dequeue {TARGET_DEQUEUE - dequeueCount}x
                   </span>
                 )}
               </div>
             </div>
           )}

          <button
            onClick={handleComplete}
            className={`w-full h-14 rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 ${
               canComplete 
               ? 'bg-[#58CC02] text-white shadow-[0_4px_0_#46A302] active:shadow-[0_2px_0_#46A302]' 
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
