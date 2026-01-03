import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { useState } from 'react';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4' | 'circular-lesson-1' | 'circular-lesson-2' | 'circular-lesson-3' | 'circular-lesson-4';

interface CircularQueueLesson4Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
  onComplete: () => void;
}

const CARS = [
  { title: 'Red', color: '#FF4B4B', border: '#D93535' },
  { title: 'Blue', color: '#1CB0F6', border: '#0D9FE8' },
  { title: 'Green', color: '#58CC02', border: '#46A302' },
  { title: 'Purple', color: '#CE82FF', border: '#B565E8' },
  { title: 'Orange', color: '#FF9600', border: '#E07700' },
  { title: 'Yellow', color: '#FFC800', border: '#E5B800' },
  { title: 'Pink', color: '#FF80CC', border: '#E560B0' },
  { title: 'Cyan', color: '#00E0E0', border: '#00C0C0' },
];

const QUEUE_SIZE = 8;

export function CircularQueueLesson4({ onNavigate, currentProgress, onProgressUpdate, onComplete }: CircularQueueLesson4Props) {
  const [queueItems, setQueueItems] = useState<(typeof CARS[0] | null)[]>(Array(QUEUE_SIZE).fill(null));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [carIndex, setCarIndex] = useState(0);
  
  const [message, setMessage] = useState('Queue is empty');
  const [isError, setIsError] = useState(false);
  const [explanation, setExplanation] = useState("A Circular Queue connects the end to the start. Use Enqueue to add cars to the ring!");

  // Task Tracking
  const [enqueueCount, setEnqueueCount] = useState(0);
  const [dequeueCount, setDequeueCount] = useState(0);
  
  const TARGET_ENQUEUE = 5;
  const TARGET_DEQUEUE = 3;

  const isFull = (front === 0 && rear === QUEUE_SIZE - 1) || (front === rear + 1);
  const isEmpty = front === -1;

  const handleEnqueue = () => {
    if (isFull) {
      setMessage('Queue Full!');
      setExplanation("Queue Overflow! The next position for Rear is occupied by Front.");
      setIsError(true);
      return;
    }

    const nextCar = CARS[carIndex];
    let newRear;
    
    if (isEmpty) {
        setFront(0);
        newRear = 0;
        setExplanation(`Enqueued "${nextCar.title}". First item! Front and Rear set to 0.`);
    } else {
        newRear = (rear + 1) % QUEUE_SIZE;
        // Check wrap around
        if (newRear < rear) {
            setExplanation(`Enqueued "${nextCar.title}". Wrapped around! Rear moved from ${rear} to ${newRear}.`);
        } else {
            setExplanation(`Enqueued "${nextCar.title}". Rear moved to ${newRear}.`);
        }
    }

    const newItems = [...queueItems];
    newItems[newRear] = nextCar;
    setQueueItems(newItems);
    setRear(newRear);
    
    setCarIndex((prev) => (prev + 1) % CARS.length);
    setMessage(`Enqueued ${nextCar.title}`);
    setIsError(false);
    setEnqueueCount(prev => Math.min(prev + 1, TARGET_ENQUEUE));
  };

  const handleDequeue = () => {
    if (isEmpty) {
      setMessage('Queue Empty!');
      setExplanation("Queue Underflow! Nothing to remove.");
      setIsError(true);
      return;
    }

    const item = queueItems[front];
    const newItems = [...queueItems];
    newItems[front] = null;
    setQueueItems(newItems);

    setMessage(`Dequeued ${item?.title}`);
    setIsError(false);
    setDequeueCount(prev => Math.min(prev + 1, TARGET_DEQUEUE));

    if (front === rear) {
        // Last item removed
        setFront(-1);
        setRear(-1);
        setExplanation(`Dequeued "${item?.title}". Queue is now empty. Reset Front/Rear to -1.`);
    } else {
        const newFront = (front + 1) % QUEUE_SIZE;
        if (newFront < front) {
            setExplanation(`Dequeued "${item?.title}". Wrapped around! Front moved from ${front} to ${newFront}.`);
        } else {
            setExplanation(`Dequeued "${item?.title}". Front moved to ${newFront}.`);
        }
        setFront(newFront);
    }
  };

  const handleReset = () => {
    setQueueItems(Array(QUEUE_SIZE).fill(null));
    setFront(-1);
    setRear(-1);
    setCarIndex(0);
    setMessage('Reset');
    setExplanation("Queue Reset. Front and Rear are -1.");
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

  const canComplete = enqueueCount >= TARGET_ENQUEUE && dequeueCount >= TARGET_DEQUEUE;

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('circular-lesson-3')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border text-text-secondary dark:text-text-secondary hover:bg-border dark:hover:bg-border transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress}
            currentXP={Math.round(135 * currentProgress / 100)}
            totalXP={135}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full pt-24 pb-6">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border p-5"
          >
            <h2 className="mb-4 text-text-primary dark:text-text-primary text-xl font-bold">Interactive Circular Queue</h2>
            
            <div className="flex flex-col gap-6">
              {/* Circular Visualization */}
              <div className="relative w-full aspect-square max-w-[320px] mx-auto">
                 {/* Ring Background */}
                 <div className="absolute inset-4 rounded-full border-[20px] border-[#F9F0FF] border-dashed" />
                 
                 {/* Slots & Items */}
                 {[...Array(QUEUE_SIZE)].map((_, i) => {
                    const angle = (i * 360) / QUEUE_SIZE;
                    // Adjust radius to fit items within the ring
                    const radius = 110; 
                    const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                    const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
                    
                    const item = queueItems[i];
                    const isF = i === front;
                    const isR = i === rear;

                    return (
                        <div
                          key={i}
                          className="absolute w-14 h-14 flex items-center justify-center"
                          style={{
                            left: `calc(50% + ${x}px - 28px)`,
                            top: `calc(50% + ${y}px - 28px)`,
                          }}
                        >
                           {/* Slot Number */}
                           <div className="absolute -top-6 text-[10px] font-mono text-[#CECECE] font-bold">
                               {i}
                           </div>

                           {/* Slot Placeholder */}
                           <div className={`w-12 h-12 rounded-xl border-2 ${item ? 'border-transparent' : 'border-[#E5E5E5] border-dashed'} flex items-center justify-center bg-white z-10 relative`}>
                               <AnimatePresence>
                                   {item && (
                                       <motion.div
                                           initial={{ scale: 0 }}
                                           animate={{ scale: 1 }}
                                           exit={{ scale: 0 }}
                                           className="w-full h-full p-1"
                                       >
                                           {/* Mini Car SVG */}
                                           <div className="relative w-full h-full">
                                                <div 
                                                  className="absolute inset-0 rounded-lg border-2 shadow-sm"
                                                  style={{ 
                                                    backgroundColor: item.color, 
                                                    borderColor: item.border 
                                                  }}
                                                />
                                                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-[8px]">
                                                    {item.title}
                                                </span>
                                           </div>
                                       </motion.div>
                                   )}
                               </AnimatePresence>
                           </div>

                           {/* Indicators */}
                           {isF && (
                               <motion.div 
                                 layoutId="front-ind"
                                 className="absolute -left-8 bg-[#1CB0F6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm z-20"
                               >
                                   F
                               </motion.div>
                           )}
                           {isR && (
                               <motion.div 
                                 layoutId="rear-ind"
                                 className="absolute -right-8 bg-[#FF9600] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm z-20"
                               >
                                   R
                               </motion.div>
                           )}
                        </div>
                    );
                 })}

                 {/* Center Status */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="text-center">
                         <div className="text-2xl font-bold text-[#CE82FF]">
                             {isEmpty ? 'Empty' : isFull ? 'Full' : `${rear - front + 1 + (rear < front ? QUEUE_SIZE : 0)} Items`}
                         </div>
                     </div>
                 </div>
              </div>

              {/* Controls */}
              <div className="bg-hover-background dark:bg-hover-background p-3 rounded-xl border-2 border-border dark:border-border">
                 <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-bold uppercase ${isError ? 'text-[#FF4B4B]' : 'text-text-secondary dark:text-text-secondary'}`}>
                        {message}
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleEnqueue}
                      disabled={isFull}
                      className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none transition-all ${
                          isFull 
                          ? 'bg-border dark:bg-border text-text-secondary dark:text-text-secondary shadow-none cursor-not-allowed'
                          : 'bg-[#CE82FF] text-white shadow-[0_4px_0_#B565E8]'
                      }`}
                    >
                      ENQUEUE
                    </button>
                    <button
                      onClick={handleDequeue}
                      disabled={isEmpty}
                      className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none transition-all ${
                          isEmpty 
                          ? 'bg-border dark:bg-border text-text-secondary dark:text-text-secondary shadow-none cursor-not-allowed'
                          : 'bg-[#FF4B4B] text-white shadow-[0_4px_0_#CC3939]'
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
          <h4 className="font-bold text-text-secondary dark:text-text-secondary mb-2 text-xs uppercase tracking-wide">Explanation:</h4>
          <p className="text-sm text-text-primary dark:text-text-primary text-left leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Tasks */}
        <div className="mt-4 space-y-4">
           {(!canComplete) && (
             <div className="px-1">
               <h4 className="font-bold text-text-secondary dark:text-text-secondary mb-2 text-xs uppercase tracking-wide">Remaining Tasks:</h4>
               <div className="flex flex-wrap gap-2 text-xs font-bold">
                 {enqueueCount < TARGET_ENQUEUE && (
                   <span className="px-2 py-1 bg-hover-background dark:bg-hover-background text-text-primary dark:text-text-primary rounded-lg border border-border dark:border-border">
                     Enqueue {TARGET_ENQUEUE - enqueueCount}x
                   </span>
                 )}
                 {dequeueCount < TARGET_DEQUEUE && (
                    <span className="px-2 py-1 bg-hover-background dark:bg-hover-background text-text-primary dark:text-text-primary rounded-lg border border-border dark:border-border">
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
               ? 'bg-[#288CFF] text-white shadow-[0_4px_0_#2563EB] active:shadow-[0_2px_0_#2563EB]' 
               : 'bg-border dark:bg-border text-text-secondary dark:text-text-secondary shadow-none cursor-default'
            }`}
          >
            Complete Lesson
          </button>
        </div>
      </div>
    </div>
  );
}