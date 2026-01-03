import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

type LearningScreen = 'path' | 'linked-list-lesson-1' | 'linked-list-lesson-2' | 'linked-list-lesson-3' | 'linked-list-lesson-4';

interface LinkedListLesson3Props {
  onNavigate: (screen: string) => void;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
}

export function LinkedListLesson3({ onNavigate, currentProgress, onProgressUpdate }: LinkedListLesson3Props) {
  const handleContinue = () => {
    onProgressUpdate(75);
    setTimeout(() => {
      onNavigate('linked-list-lesson-4');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card dark:bg-card border-b-2 border-border dark:border-border px-6 py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => onNavigate('linked-list-lesson-2')}
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
        {/* Scrollable Content Area */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card dark:bg-card rounded-2xl border-2 border-border dark:border-border p-6"
          >
            <h2 className="mb-4 text-text-primary dark:text-text-primary text-xl font-bold">Linked List Operations</h2>
            
            <div className="flex flex-col gap-4">
              
              {/* Insert Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 bg-[#D7FFB8] dark:bg-[#2D4A1F] rounded-2xl border-2 border-[#58CC02] dark:border-[#58CC02]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#58CC02] rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[#46A302] text-xl font-bold">Insert Node</h3>
                </div>
                <p className="text-text-primary dark:text-text-primary text-base mb-2">
                    Create a new node, point it to the next node, update the previous node's pointer.
                </p>
                <div className="bg-card/60 dark:bg-card/60 p-2 rounded-lg font-mono text-sm text-[#46A302] font-bold">
                    newNode.next = current.next
                </div>
              </motion.div>

              {/* Delete Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 bg-[#FFE8E8] dark:bg-[#4A2020] rounded-2xl border-2 border-[#FF4B4B] dark:border-[#FF4B4B]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#FF4B4B] rounded-lg flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[#D93535] text-xl font-bold">Delete Node</h3>
                </div>
                <p className="text-text-primary dark:text-text-primary text-base mb-2">
                    Update the previous node's pointer to skip the current node, effectively deleting it.
                </p>
                <div className="bg-card/60 dark:bg-card/60 p-2 rounded-lg font-mono text-sm text-[#D93535] font-bold">
                    prev.next = current.next
                </div>
              </motion.div>

              {/* Traversal Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 bg-[#DDF4FF] dark:bg-[#1A3A4A] rounded-2xl border-2 border-[#1CB0F6] dark:border-[#1CB0F6]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#1CB0F6] rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[#0D9FE8] text-xl font-bold">Traverse</h3>
                </div>
                <p className="text-text-primary dark:text-text-primary text-base mb-2">
                    Visit each node by following the "next" pointer until you reach null.
                </p>
                <div className="bg-card/60 dark:bg-card/60 p-2 rounded-lg font-mono text-sm text-[#0D9FE8] font-bold">
                    while (current != null) {'{...}'}
                </div>
              </motion.div>

              {/* Info Box */}
              <div className="mt-2 bg-hover-background dark:bg-hover-background p-4 rounded-xl border border-border dark:border-border flex flex-col gap-1 items-start text-left">
                 <strong className="text-text-primary dark:text-text-primary text-sm uppercase tracking-wide">Key Point</strong>
                 <p className="text-text-secondary dark:text-text-secondary text-sm leading-relaxed">
                    Unlike arrays, Linked Lists don't need contiguous memory. Nodes can be scattered anywhere, connected by pointers!
                 </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleContinue}
            className="w-full h-14 bg-[#288CFF] text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_#2563EB] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#2563EB] transition-all flex items-center justify-center gap-3"
          >
            Continue
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}