import { motion } from 'motion/react';
import { Award, Star } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';

interface LessonCompletionScreenProps {
  onClaimXP: () => void;
  xpEarned: number;
}

export function LessonCompletionScreen({ onClaimXP, xpEarned }: LessonCompletionScreenProps) {
  const [displayedXP, setDisplayedXP] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Setup localized confetti
    const myConfetti = confetti.create(canvasRef.current!, {
      resize: true,
      useWorker: true
    });

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const random = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since we are using a custom canvas, origin x/y coordinates 
      // are relative to that canvas (0 to 1).
      myConfetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 }
      });
      myConfetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Animate XP Count
    let startTimestamp: number | null = null;
    const animateXP = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / 1500, 1);
      
      setDisplayedXP(Math.floor(progress * xpEarned));

      if (progress < 1) {
        requestAnimationFrame(animateXP);
      }
    };
    
    setTimeout(() => {
      requestAnimationFrame(animateXP);
    }, 500);

    return () => {
      clearInterval(interval);
      myConfetti.reset();
    };
  }, [xpEarned]);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden relative">
      {/* Confetti Canvas - Absolute Positioned to cover this container only */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* Background Rays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vmax] h-[200vmax] opacity-10 animate-[spin_20s_linear_infinite]">
           <div className="w-full h-full rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, #FFC800 20deg, transparent 40deg, #FFC800 60deg, transparent 80deg, #FFC800 100deg, transparent 120deg, #FFC800 140deg, transparent 160deg, #FFC800 180deg, transparent 200deg, #FFC800 220deg, transparent 240deg, #FFC800 260deg, transparent 280deg, #FFC800 300deg, transparent 320deg, #FFC800 340deg, transparent 360deg)' }}></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center w-full"
        >
          {/* Hero Image / Icon with Loop Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <motion.div 
               animate={{ 
                 scale: [1, 1.1, 1],
                 rotate: [0, 5, -5, 0]
               }}
               transition={{ 
                 duration: 3, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
               className="w-40 h-40 bg-[#FFC800] rounded-full flex items-center justify-center shadow-[0_8px_0_#E0B000]"
            >
              <Award className="w-20 h-20 text-white" strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[#FFC800] text-4xl font-extrabold mb-8 tracking-tight"
          >
            Lesson Complete!
          </motion.h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-3 mb-8 max-w-[200px] mx-auto">
            {/* Total XP - Yellow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#FFF4CC] border-2 border-[#FFC800] rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-xs font-bold text-[#DFA500] uppercase tracking-widest">Total XP</span>
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 text-[#FFC800] fill-[#FFC800]" />
                <span className="text-4xl font-extrabold text-[#4B4B4B]">{displayedXP}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Claim XP Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 max-w-3xl mx-auto w-full relative z-30"
      >
        <button
          onClick={onClaimXP}
          className="w-full h-14 bg-[#FFC800] text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0_#E0B000] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#E0B000] transition-all"
        >
          Claim XP
        </button>
      </motion.div>
    </div>
  );
}
