import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Plus, Trash2, ArrowRight, CheckCircle, Circle, MousePointerClick, X } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { useState } from 'react';

type LearningScreen = 'path' | 'linked-list-lesson-1' | 'linked-list-lesson-2' | 'linked-list-lesson-3' | 'linked-list-lesson-4';

interface LinkedListLesson4Props {
  onNavigate: (screen: string) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
  onComplete: () => void;
}

interface ListNode {
  id: string;
  value: number;
  color: string;
}

export function LinkedListLesson4({ onNavigate, currentProgress, onProgressUpdate, onComplete }: LinkedListLesson4Props) {
  const [nodes, setNodes] = useState<ListNode[]>([
    { id: 'n1', value: 10, color: '#FF9600' },
    { id: 'n2', value: 25, color: '#1CB0F6' },
    { id: 'n3', value: 40, color: '#FF4B4B' }
  ]);
  
  const [message, setMessage] = useState('Linked List is ready.');
  const [isError, setIsError] = useState(false);
  const [explanation, setExplanation] = useState("Try adding or removing nodes to see how pointers change.");
  
  // Tasks for the guide
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  // Interactive modes
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  
  const tasks = [
    { id: 'insert-head', label: 'Insert a node at the Head' },
    { id: 'insert-tail', label: 'Insert a node at the Tail' },
    { id: 'delete-node', label: 'Delete a node (Head or Value)' }
  ];

  const MAX_NODES = 6;

  const markTaskComplete = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks(prev => [...prev, taskId]);
    }
  };

  const generateValue = () => Math.floor(Math.random() * 90) + 10;
  const generateColor = () => {
      const colors = ['#FF9600', '#1CB0F6', '#FF4B4B', '#58CC02', '#CE82FF'];
      return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleInsertHead = () => {
    if (isDeleteMode) setIsDeleteMode(false);
    if (nodes.length >= MAX_NODES) return;
    
    const newNode: ListNode = {
        id: (Date.now() + Math.random()).toString(),
        value: generateValue(),
        color: generateColor()
    };
    
    setNodes([newNode, ...nodes]);
    setMessage(`Inserted ${newNode.value} at Head`);
    setExplanation("New node becomes the Head. Its pointer now points to the old Head.");
    setIsError(false);
    markTaskComplete('insert-head');
  };

  const handleInsertTail = () => {
    if (isDeleteMode) setIsDeleteMode(false);
    if (nodes.length >= MAX_NODES) return;

    const newNode: ListNode = {
        id: (Date.now() + Math.random()).toString(),
        value: generateValue(),
        color: generateColor()
    };
    
    setNodes([...nodes, newNode]);
    setMessage(`Inserted ${newNode.value} at Tail`);
    setExplanation("Traversed to the end. The last node's null pointer is updated to point to this new node.");
    setIsError(false);
    markTaskComplete('insert-tail');
  };

  const handleDeleteHead = () => {
    if (isDeleteMode) setIsDeleteMode(false);
    if (nodes.length === 0) return;
    
    const removed = nodes[0];
    setNodes(nodes.slice(1));
    setMessage(`Deleted Head (${removed.value})`);
    setExplanation("The Head pointer simply moves to the second node. The first node is lost (garbage collected).");
    setIsError(false);
    markTaskComplete('delete-node');
  };

  const handleToggleDeleteMode = () => {
    if (nodes.length === 0) return;
    
    if (isDeleteMode) {
        setIsDeleteMode(false);
        setMessage('Cancelled delete');
        setExplanation('Select an operation.');
        setIsError(false);
    } else {
        setIsDeleteMode(true);
        setMessage('Select a node to delete');
        setExplanation('Tap on any node to remove it from the list.');
        setIsError(false);
    }
  };

  const handleNodeClick = (node: ListNode) => {
    if (!isDeleteMode) return;

    const newNodes = nodes.filter(n => n.id !== node.id);
    setNodes(newNodes);
    setMessage(`Deleted Value ${node.value}`);
    setExplanation(`Found ${node.value}. Rerouted the previous node's pointer to skip it.`);
    setIsError(false);
    markTaskComplete('delete-node');
    setIsDeleteMode(false);
  };

  const handleReset = () => {
    setNodes([
        { id: 'n1', value: 10, color: '#FF9600' },
        { id: 'n2', value: 25, color: '#1CB0F6' },
        { id: 'n3', value: 40, color: '#FF4B4B' }
    ]);
    setIsDeleteMode(false);
    setMessage('Reset');
    setExplanation("Back to start.");
    setIsError(false);
  };

  const handleComplete = () => {
    if (completedTasks.length < tasks.length) return;
    if (navigator.vibrate) navigator.vibrate(200);
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('linked-list-lesson-3')}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-hover-background dark:bg-hover-background border-2 border-border dark:border-border text-text-secondary dark:text-text-secondary hover:bg-border dark:hover:bg-border transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <ProgressBar 
            currentProgress={currentProgress}
            currentXP={Math.round(170 * currentProgress / 100)}
            totalXP={170}
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
            <h2 className="mb-4 text-text-primary dark:text-text-primary text-xl font-bold">Interactive Linked List</h2>
            
            <div className="flex flex-col gap-6">
              {/* Visualization Area */}
              <div className={`rounded-2xl border-2 p-4 h-[280px] md:h-[260px] flex items-center justify-start overflow-x-auto relative transition-colors ${
                  isDeleteMode ? 'bg-[#FFF4F4] dark:bg-[#4A2020] border-[#FF4B4B] dark:border-[#FF4B4B] border-dashed' : 'bg-hover-background dark:bg-hover-background border-border dark:border-border'
              }`}>
                  
                  {isDeleteMode && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#FF4B4B] text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse z-30 shadow-sm whitespace-nowrap">
                          Tap a node to delete
                      </div>
                  )}

                  {/* Nodes Container */}
                  <div className="flex items-center flex-nowrap gap-2 pt-4 w-max mx-auto px-4">
                     <AnimatePresence mode='popLayout'>
                        {/* HEAD Label */}
                        <motion.div 
                            key="head-label"
                            layout
                            className="flex flex-col items-center mr-2 z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <span className="text-[#AFAFAF] text-[10px] font-bold uppercase mb-1">Head</span>
                            <div className="w-0.5 h-4 bg-[#AFAFAF]" />
                        </motion.div>

                        {nodes.map((node, index) => {
                            const isLast = index === nodes.length - 1;
                            
                            return (
                            <motion.div
                                key={node.id}
                                layoutId={node.id}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1, 
                                    y: 0,
                                    filter: isDeleteMode ? 'brightness(1.05)' : 'none'
                                }}
                                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={`flex items-center group relative ${isDeleteMode ? 'cursor-pointer' : ''}`}
                                onClick={() => handleNodeClick(node)}
                                whileHover={isDeleteMode ? { scale: 1.05, rotate: [-1, 1, -1] } : {}}
                            >
                                {/* The Node */}
                                <div 
                                    className={`flex border-2 rounded-lg bg-white overflow-hidden shadow-sm relative z-20 transition-all ${
                                        isDeleteMode 
                                            ? 'border-[#FF4B4B] shadow-[0_0_15px_rgba(255,75,75,0.3)]' 
                                            : ''
                                    }`}
                                    style={{ borderColor: isDeleteMode ? '#FF4B4B' : node.color }}
                                >
                                    <div 
                                        className="w-12 h-12 flex items-center justify-center font-bold text-lg border-r transition-colors" 
                                        style={{ 
                                            borderColor: isDeleteMode ? '#FF4B4B' : node.color,
                                            color: isDeleteMode ? '#FF4B4B' : '#4B4B4B'
                                        }}
                                    >
                                        {isDeleteMode ? (
                                            <div className="flex flex-col items-center justify-center">
                                                <Trash2 className="w-4 h-4" />
                                                <span className="text-[10px] mt-0.5">{node.value}</span>
                                            </div>
                                        ) : (
                                            node.value
                                        )}
                                    </div>
                                    <div 
                                        className="w-8 h-12 flex items-center justify-center transition-colors" 
                                        style={{ backgroundColor: isDeleteMode ? '#FFF4F4' : `${node.color}20` }}
                                    >
                                        <div 
                                            className="w-2.5 h-2.5 rounded-full transition-colors" 
                                            style={{ backgroundColor: isDeleteMode ? '#FF4B4B' : node.color }} 
                                        />
                                    </div>
                                </div>

                                {/* TAIL Label - Attached to last node */}
                                {isLast && (
                                    <motion.div
                                        layoutId="tail-label"
                                        className="absolute -bottom-10 left-0 right-8 flex flex-col items-center justify-start z-30 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                         <div className="w-0.5 h-3 bg-[#FF9600] mb-1" />
                                         <span className="text-[#FF9600] text-[10px] font-bold uppercase bg-[#FFF4E5] px-1.5 py-0.5 rounded-md">Tail</span>
                                    </motion.div>
                                )}

                                {/* The Arrow (Visual only, attached to right of node) */}
                                <div className="w-8 h-0.5 bg-[#E5E5E5] relative mx-1 z-0">
                                     <ArrowRight className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5E5E5]" />
                                </div>
                            </motion.div>
                        )})}

                        {/* NULL */}
                        <motion.div 
                            key="null-label"
                            layout
                            className="flex flex-col items-center justify-center w-12 h-12 border-2 border-dashed border-[#AFAFAF] rounded-lg bg-[#E5E5E5] z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <span className="text-[10px] font-bold text-[#777] uppercase">Null</span>
                        </motion.div>
                     </AnimatePresence>
                  </div>
              </div>

               {/* Combined Status & Message Bar (Consistent with other lessons) */}
               <div className={`flex items-center justify-between p-3 rounded-xl border-2 transition-colors ${
                 isError 
                   ? 'bg-[#FFF4F4] border-[#FF4B4B]' 
                   : isDeleteMode
                     ? 'bg-[#FFF4F4] border-[#FF4B4B]'
                     : 'bg-[#DDF4FF] border-[#1CB0F6]'
               }`}>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">
                     {isError ? 'Error' : isDeleteMode ? 'Action Required' : 'Status'}
                   </span>
                   <span className={`font-bold text-sm ${
                       isError ? 'text-[#FF4B4B]' : isDeleteMode ? 'text-[#FF4B4B]' : 'text-[#1CB0F6]'
                   }`}>
                     {message}
                   </span>
                 </div>
                 <div className="text-right">
                   <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">Items</span>
                   <div className="font-bold text-[#4B4B4B] text-sm">
                     {nodes.length} / {MAX_NODES}
                   </div>
                 </div>
               </div>

              {/* Controls */}
              <div className="bg-hover-background dark:bg-hover-background p-3 rounded-xl border-2 border-border dark:border-border">
                 <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      onClick={handleInsertHead}
                      disabled={nodes.length >= MAX_NODES || isDeleteMode}
                      className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 ${
                          nodes.length >= MAX_NODES || isDeleteMode
                          ? 'bg-border dark:bg-border text-text-secondary dark:text-text-secondary shadow-none cursor-not-allowed'
                          : 'bg-[#1CB0F6] text-white shadow-[0_4px_0_#0D9FE8]'
                      }`}
                    >
                      <Plus className="w-4 h-4" /> Insert Head
                    </button>
                    <button
                      onClick={handleInsertTail}
                      disabled={nodes.length >= MAX_NODES || isDeleteMode}
                      className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 ${
                          nodes.length >= MAX_NODES || isDeleteMode
                          ? 'bg-border dark:bg-border text-text-secondary dark:text-text-secondary shadow-none cursor-not-allowed'
                          : 'bg-[#1CB0F6] text-white shadow-[0_4px_0_#0D9FE8]'
                      }`}
                    >
                      <Plus className="w-4 h-4" /> Insert Tail
                    </button>
                    <button
                      onClick={handleDeleteHead}
                      disabled={nodes.length === 0 || isDeleteMode}
                      className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 ${
                          nodes.length === 0 || isDeleteMode
                          ? 'bg-border dark:bg-border text-text-secondary dark:text-text-secondary shadow-none cursor-not-allowed'
                          : 'bg-[#FF4B4B] text-white shadow-[0_4px_0_#D93535]'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" /> Delete Head
                    </button>
                    <button
                      onClick={handleToggleDeleteMode}
                      disabled={nodes.length === 0}
                      className={`h-12 rounded-xl font-bold text-sm shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 ${
                          nodes.length === 0
                          ? 'bg-border dark:bg-border text-text-secondary dark:text-text-secondary shadow-none cursor-not-allowed'
                          : isDeleteMode
                            ? 'bg-[#777] text-white shadow-[0_4px_0_#4B4B4B]'
                            : 'bg-[#FF4B4B] text-white shadow-[0_4px_0_#D93535]'
                      }`}
                    >
                      {isDeleteMode ? <X className="w-4 h-4" /> : <MousePointerClick className="w-4 h-4" />}
                      {isDeleteMode ? 'Cancel' : 'Delete Value'}
                    </button>
                 </div>
                 
                 <button
                    onClick={handleReset}
                    className="w-full h-10 bg-[#777] text-white rounded-xl font-bold shadow-[0_4px_0_#4B4B4B] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-all"
                 >
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
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

        {/* Task List / Guide */}
        <div className="mt-4">
           {completedTasks.length < tasks.length && (
             <div className="mb-4 bg-hover-background dark:bg-hover-background p-4 rounded-xl border-2 border-border dark:border-border">
               <h3 className="font-bold text-text-secondary dark:text-text-secondary text-xs uppercase tracking-wide mb-3">Your Task</h3>
               <div className="space-y-3">
                 {tasks.map(task => {
                   const isCompleted = completedTasks.includes(task.id);
                   if (isCompleted) return null;
                   return (
                     <div key={task.id} className="flex items-center gap-3">
                       <Circle className="w-5 h-5 text-border dark:text-border" />
                       <span className="text-sm font-bold text-text-secondary dark:text-text-secondary">
                         {task.label}
                       </span>
                     </div>
                   );
                 })}
               </div>
             </div>
           )}

          <button
            onClick={handleComplete}
            disabled={completedTasks.length < tasks.length}
            className={`w-full h-14 rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 ${
               completedTasks.length >= tasks.length 
               ? 'bg-[#288CFF] text-white shadow-[0_4px_0_#2563EB] active:shadow-[0_2px_0_#2563EB] cursor-pointer' 
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