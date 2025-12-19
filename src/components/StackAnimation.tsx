import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function StackAnimation() {
  const [stackItems, setStackItems] = useState<number[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // Reset to empty
      setStackItems([]);
      setStep(0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add Card 1
      setStackItems([1]);
      setStep(1);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add Card 2
      setStackItems([1, 2]);
      setStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add Card 3
      setStackItems([1, 2, 3]);
      setStep(3);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Loop back
      setStep(0);
    };

    sequence();
    const interval = setInterval(sequence, 7500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative p-8 bg-gradient-to-b from-[#F0FBE8] to-[#D7FFB8] rounded-2xl border-2 border-[#58CC02] min-h-[300px]">
      <div className="flex justify-center items-end min-h-[250px]">
        <div className="flex flex-col-reverse gap-3">
          <AnimatePresence mode="sync">
            {stackItems.map((item, index) => {
              const isTop = index === stackItems.length - 1;
              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  className="w-40 h-16 bg-white border-2 border-[#58CC02] rounded-xl flex items-center justify-center shadow-[0_4px_0_#46A302] relative"
                >
                  <span className="text-[#4B4B4B] font-bold">Card {item}</span>
                  {isTop && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -right-12 top-1/2 -translate-y-1/2"
                    >
                      <div className="px-3 py-1 bg-[#58CC02] text-white text-xs font-bold rounded-full whitespace-nowrap">
                        TOP ←
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Empty state message */}
      {stackItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <p className="text-[#58CC02] font-bold text-lg">Empty Stack</p>
        </motion.div>
      )}
    </div>
  );
}
