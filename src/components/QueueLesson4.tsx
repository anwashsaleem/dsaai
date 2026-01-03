import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { useState } from 'react';

type LearningScreen = 'path' | 'stack-lesson-1' | 'stack-lesson-2' | 'stack-lesson-3' | 'stack-lesson-4' | 'queue-lesson-1' | 'queue-lesson-2' | 'queue-lesson-3' | 'queue-lesson-4';

interface QueueLesson4Props {
  onNavigate: (screen: LearningScreen) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
  onComplete: () => void;
}

const CARS = [
  { title: 'Red Car', color: '#FF4B4B', border: '#D93535', detail: '#FF7676' },
  { title: 'Blue Car', color: '#1CB0F6', border: '#0D9FE8', detail: '#52C3F9' },
  { title: 'Green Car', color: '#58CC02', border: '#46A302', detail: '#89E219' },
  { title: 'Purple Car', color: '#CE82FF', border: '#B565E8', detail: '#DFA3FF' },
  { title: 'Orange Car', color: '#FF9600', border: '#E07700', detail: '#FFB347' },
];

const MAX_QUEUE_SIZE = 4;

export function QueueLesson4({ onNavigate, currentProgress, onProgressUpdate, onComplete }: QueueLesson4Props) {
  // Linear Queue State
  const [queueItems, setQueueItems] = useState<(typeof CARS[0] | null)[]>([null, null, null, null]);
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  
  const [carIndex, setCarIndex] = useState(0); // To cycle through car colors
  const [message, setMessage] = useState('Queue is empty');
  const [isError, setIsError] = useState(false);
  const [explanation, setExplanation] = useState("A Linear Queue follows the FIFO principle. Enqueue adds to Rear, Dequeue removes from Front.");
  
  // Task Tracking
  const [enqueueCount, setEnqueueCount] = useState(0);
  const [dequeueCount, setDequeueCount] = useState(0);
  const [peekCount, setPeekCount] = useState(0);

  const TARGET_ENQUEUE = 3;
  const TARGET_DEQUEUE = 3;
  const TARGET_PEEK = 1;

  // Derived state for full check
  const isFull = rear === MAX_QUEUE_SIZE - 1;
  const isEmpty = front === -1 && rear === -1;
  const isExhausted = rear === MAX_QUEUE_SIZE - 1 && front > rear; 

  const handleEnqueue = () => {
    if (rear === MAX_QUEUE_SIZE - 1) {
      setMessage('Queue Full / Rear Limit');
      setExplanation("The Rear index has reached the limit (Index 3). Even if there is space at the front, a Linear Queue cannot recycle indices. You must Reset.");
      setIsError(true);
      return;
    }
    
    const nextCar = CARS[carIndex];
    let newRear = rear + 1;
    let newFront = front;

    // Special case for first element
    if (front === -1 && rear === -1) {
        newFront = 0;
        newRear = 0;
    }
    
    const newItems = [...queueItems];
    newItems[newRear] = nextCar;
    setQueueItems(newItems);
    setRear(newRear);
    setFront(newFront);
    
    setCarIndex((prev) => (prev + 1) % CARS.length);
    setMessage(`Enqueued ${nextCar.title}`);
    setIsError(false);
    setEnqueueCount(prev => Math.min(prev + 1, TARGET_ENQUEUE));

    if (front === -1) {
        setExplanation(`Enqueued "${nextCar.title}". Both Front and Rear move from -1 to 0. The queue now has one item.`);
    } else {
        setExplanation(`Enqueued "${nextCar.title}". Rear moves to Index ${newRear}. Front stays at ${newFront}.`);
    }
  };

  const handleDequeue = () => {
    if (front === -1 || front > rear) {
      setMessage('Underflow! Queue is empty');
      setExplanation("Cannot Dequeue. The queue is empty.");
      setIsError(true);
      return;
    }
    
    const item = queueItems[front];
    // Visually remove
    const newItems = [...queueItems];
    newItems[front] = null; 
    setQueueItems(newItems);

    const newFront = front + 1;
    setFront(newFront);

    setMessage(item ? `Dequeued ${item.title}` : 'Dequeued');
    setIsError(false);
    setDequeueCount(prev => Math.min(prev + 1, TARGET_DEQUEUE));

    if (newFront > rear) {
       // Queue becomes empty
       setExplanation(`Dequeued "${item?.title}". Front moves to Index ${newFront}. Now Front > Rear, so the queue is empty (but indices are not reset!).`);
    } else {
       setExplanation(`Dequeued "${item?.title}". Front moves forward to Index ${newFront}.`);
    }
  };

  const handlePeek = () => {
    if (front === -1 || front > rear) {
      setMessage('Queue empty!');
      setExplanation("Nothing to Peek. Queue is empty.");
      setIsError(true);
      return;
    }
    
    const frontCar = queueItems[front];
    if (frontCar) {
        setMessage(`Front is ${frontCar.title}`);
        setExplanation(`Peeked at Index ${front} ("${frontCar.title}"). This is the next item to be Dequeued.`);
    }
    setIsError(false);
    setPeekCount(prev => Math.min(prev + 1, TARGET_PEEK));
  };

  const handleReset = () => {
    setQueueItems([null, null, null, null]);
    setFront(-1);
    setRear(-1);
    setCarIndex(0);
    setMessage('Queue reset');
    setExplanation("Queue Reset. Front is -1, Rear is -1.");
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

  const canComplete = enqueueCount >= TARGET_ENQUEUE && dequeueCount >= TARGET_DEQUEUE && peekCount >= TARGET_PEEK;

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('queue-lesson-3')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border text-text-secondary dark:text-text-secondary hover:bg-border dark:hover:bg-border transition-all rounded-xl"
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
        {/* Scrollable Content Area */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border p-5"
          >
            <h2 className="mb-4 text-text-primary dark:text-text-primary text-xl font-bold">Interactive Linear Queue</h2>
            
            <div className="flex flex-col gap-4">
              {/* Queue Container Area */}
              <div className="w-full">
                
                {/* Visual Queue - Fixed Slots */}
                <div className="p-4 bg-hover-background dark:bg-hover-background rounded-2xl border-2 border-border dark:border-border w-full shadow-sm relative h-[220px] flex items-center justify-center overflow-hidden">
                   
                   {/* Slots Background */}
                   <div className="flex gap-2">
                       {[0, 1, 2, 3].map((index) => (
                           <div key={index} className="w-20 h-28 border-2 border-dashed border-border dark:border-border rounded-xl flex items-center justify-center relative bg-card/50 dark:bg-card/50">
                               <span className="absolute bottom-2 text-text-secondary dark:text-text-secondary font-mono font-bold text-xs">[{index}]</span>
                           </div>
                       ))}
                   </div>

                   {/* Queue Items Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
                       {/* This matches the slots spacing */}
                       <AnimatePresence>
                           {queueItems.map((car, index) => (
                               <div key={index} className="w-20 h-28 flex items-center justify-center relative">
                                   {car && (
                                       <motion.div
                                           initial={{ x: 300, opacity: 0 }} // Drive in from right
                                           animate={{ x: 0, opacity: 1 }}
                                           exit={{ x: -300, opacity: 0 }} // Drive away left
                                           transition={{ 
                                             type: "spring",
                                             stiffness: 120,
                                             damping: 14
                                           }}
                                           className="w-16 h-24 relative z-10 flex flex-col items-center justify-center"
                                       >
                                           {/* Car SVG Representation (Top View) */}
                                           <div className="relative w-full h-full">
                                              {/* Shadow */}
                                              <div className="absolute bottom-1 left-1 right-1 h-3 bg-black/20 rounded-full blur-sm" />
                                              
                                              {/* Body */}
                                              <div 
                                                className="absolute inset-x-1 top-2 bottom-3 rounded-xl border-2 shadow-sm"
                                                style={{ 
                                                  backgroundColor: car.color, 
                                                  borderColor: car.border 
                                                }}
                                              >
                                                {/* Windshield */}
                                                <div className="absolute top-4 left-2 right-2 h-4 bg-black/20 rounded-sm" />
                                                
                                                {/* Roof */}
                                                <div className="absolute top-9 left-2 right-2 bottom-6 bg-black/5 rounded-sm border border-black/5" />

                                                {/* Rear Window */}
                                                <div className="absolute bottom-3 left-2 right-2 h-2 bg-black/20 rounded-sm" />

                                                {/* Headlights */}
                                                <div className="absolute top-0 left-1 w-2 h-1 bg-yellow-200 rounded-b-sm" />
                                                <div className="absolute top-0 right-1 w-2 h-1 bg-yellow-200 rounded-b-sm" />
                                              </div>

                                              {/* Text Label */}
                                              <div className="absolute inset-0 flex items-center justify-center z-20 pt-4">
                                                  <span className="text-white font-bold text-[10px] text-center leading-tight drop-shadow-md px-1">
                                                      {car.title}
                                                  </span>
                                              </div>
                                           </div>
                                       </motion.div>
                                   )}

                                    {/* Front Indicator */}
                                    {/* Only show if index matches front AND front is within array range */}
                                    {index === front && front >= 0 && front <= 3 && (
                                        <motion.div 
                                            layoutId="front-indicator"
                                            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1CB0F6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-20 shadow-sm"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        >
                                            FRONT
                                        </motion.div>
                                    )}

                                    {/* Rear Indicator */}
                                    {/* Only show if index matches rear AND rear is within array range */}
                                    {index === rear && rear >= 0 && rear <= 3 && (
                                        <motion.div 
                                            layoutId="rear-indicator"
                                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#FF9600] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-20 shadow-sm"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        >
                                            REAR
                                        </motion.div>
                                    )}
                               </div>
                           ))}
                       </AnimatePresence>
                   </div>
                   
                   {/* Off-canvas Indicators for -1 State */}
                   {front === -1 && rear === -1 && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-8">
                          <div className="bg-[#1CB0F6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm text-center">
                              FRONT
                          </div>
                          <div className="bg-[#FF9600] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm text-center">
                              REAR
                          </div>
                      </div>
                   )}

                   {/* Exhausted State Overlay */}
                   {/* Shows when we can't enqueue anymore and list is effectively empty or front > rear */}
                   {(isExhausted || (front > 3 && rear === 3)) && (
                       <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-30 backdrop-blur-[1px]">
                           <div className="bg-white border-2 border-[#FF4B4B] rounded-xl p-4 shadow-lg text-center transform rotate-[-5deg]">
                               <h3 className="text-[#FF4B4B] font-bold text-lg mb-1">Queue Exhausted!</h3>
                               <p className="text-[#777] text-xs">Rear reached limit.<br/>Must Reset.</p>
                           </div>
                       </div>
                   )}

                </div>
              </div>

              {/* Combined Status Bar */}
              <div className={`flex items-center justify-between p-3 rounded-xl border-2 transition-colors ${
                isError 
                  ? 'bg-[#FFF4F4] border-[#FF4B4B]' 
                  : 'bg-[#DDF4FF] border-[#1CB0F6]'
              }`}>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">
                    {isError ? 'Error' : 'Action'}
                  </span>
                  <span className={`font-bold text-sm ${isError ? 'text-[#FF4B4B]' : 'text-[#1CB0F6]'}`}>
                    {message}
                  </span>
                </div>
                
                {/* Indices Display */}
                <div className="flex gap-4 border-l-2 border-black/5 pl-4 ml-2">
                    <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wide opacity-60 text-[#1CB0F6]">Front</span>
                        <div className="font-bold text-[#4B4B4B] text-sm font-mono">
                            {front}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wide opacity-60 text-[#FF9600]">Rear</span>
                        <div className="font-bold text-[#4B4B4B] text-sm font-mono">
                            {rear}
                        </div>
                    </div>
                </div>
              </div>

              {/* Operations Controls */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={handleEnqueue}
                  disabled={rear === MAX_QUEUE_SIZE - 1} // Disabled if rear hit limit
                  className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all active:translate-y-[2px] active:shadow-none ${
                    rear === MAX_QUEUE_SIZE - 1
                      ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none cursor-not-allowed'
                      : 'bg-[#1CB0F6] text-white shadow-[0_4px_0_#0D9FE8] hover:brightness-105 active:shadow-[0_2px_0_#0D9FE8]'
                  }`}
                >
                  ENQUEUE
                </button>
                <button
                  onClick={handleDequeue}
                  disabled={front === -1 || front > rear}
                  className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all active:translate-y-[2px] active:shadow-none ${
                    front === -1 || front > rear 
                      ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none cursor-not-allowed'
                      : 'bg-[#FF4B4B] text-white shadow-[0_4px_0_#CC3939] hover:brightness-105 active:shadow-[0_2px_0_#CC3939]'
                  }`}
                >
                  DEQUEUE
                </button>
                <button
                  onClick={handlePeek}
                  disabled={front === -1 || front > rear}
                  className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all active:translate-y-[2px] active:shadow-none ${
                     front === -1 || front > rear
                      ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none cursor-not-allowed'
                      : 'bg-[#FF9600] text-white shadow-[0_4px_0_#E58600] hover:brightness-105 active:shadow-[0_2px_0_#E58600]'
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
          <h4 className="font-bold text-text-secondary dark:text-text-secondary mb-2 text-xs uppercase tracking-wide">Explanation:</h4>
          <p className="text-sm text-text-primary dark:text-text-primary text-left leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Bottom Section: Tasks and Complete Button */}
        <div className="mt-4 space-y-4">
           {/* Task Instructions */}
           {(!canComplete) && (
             <div className="px-1">
               <h4 className="font-bold text-text-secondary dark:text-text-secondary mb-2 text-xs uppercase tracking-wide">Remaining Tasks:</h4>
               <div className="flex flex-wrap gap-2 text-xs font-bold">
                 {enqueueCount < TARGET_ENQUEUE && (
                   <span className="px-2 py-1 bg-hover-background dark:bg-hover-background text-text-primary dark:text-text-primary rounded-lg border border-border dark:border-border">
                     Enqueue {TARGET_ENQUEUE - enqueueCount}x
                   </span>
                 )}
                 {peekCount < TARGET_PEEK && (
                    <span className="px-2 py-1 bg-hover-background dark:bg-hover-background text-text-primary dark:text-text-primary rounded-lg border border-border dark:border-border">
                     Peek {TARGET_PEEK - peekCount}x
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