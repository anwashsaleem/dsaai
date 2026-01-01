import { motion } from 'motion/react';
import { BookOpen, Zap, Target } from 'lucide-react';
import FullLogo from '../imports/FullLogo';

interface OnboardingScreenProps {
  onStart: () => void;
  onGuestMode?: () => void;
}

export function OnboardingScreen({ onStart, onGuestMode }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          {/* App Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-3"
          >
            <div className="w-full max-w-[200px]">
              <FullLogo />
            </div>
          </motion.div>
        
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <p className="text-text-secondary dark:text-text-secondary text-xl font-medium">Visualize, Interact, and Learn</p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8 w-full"
          >
            <FeatureItem 
              icon={<BookOpen className="w-8 h-8 text-success" strokeWidth={2.5} />}
              bg="bg-success-light dark:bg-success-light"
              border="border-success"
              title="Interactive Lessons"
              desc="Learn by doing, not just reading"
              delay={0}
            />
            <FeatureItem 
              icon={<Zap className="w-8 h-8 text-secondary" strokeWidth={2.5} />}
              bg="bg-info-light dark:bg-info-light"
              border="border-secondary"
              title="Visual Learning"
              desc="See how data structures & algorithm work"
              delay={0.5}
            />
            <FeatureItem 
              icon={<Target className="w-8 h-8 text-accent" strokeWidth={2.5} />}
              bg="bg-warning-light dark:bg-warning-light"
              border="border-accent"
              title="Track Progress"
              desc="Master concepts step by step"
              delay={1}
            />
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-md mx-auto pb-6 space-y-3"
        >
          <button
            onClick={onStart}
            className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0] shadow-primary-shadow dark:shadow-primary-shadow hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0] active:shadow-primary-shadow transition-all"
          >
            Start Learning
          </button>
          
          <button
            onClick={onGuestMode}
            className="w-full h-12 bg-transparent text-secondary rounded-2xl font-bold text-base border-2 border-secondary hover:border-primary hover:text-primary active:scale-95 transition-all"
          >
            Continue as Guest
          </button>
        </motion.div>
      </div>

      {/* Desktop Layout - Split Screen */}
      <div className="hidden md:flex min-h-screen">
        {/* Left Side - Hero */}
        <div className="flex-1 flex flex-col justify-center items-center p-12 lg:p-24 bg-background dark:bg-background">
          <div className="max-w-xl w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <div className="w-full max-w-[400px]">
                <FullLogo />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl lg:text-5xl font-extrabold text-text-primary dark:text-text-primary mb-4 tracking-tight"
            >
              Visualize, Interact, and Learn
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-text-secondary dark:text-text-secondary mb-12 max-w-lg font-medium"
            >
              The best way to master Data Structures and Algorithms through interactive visualizations and gamified lessons.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 w-full max-w-md"
            >
              <button
                onClick={onStart}
                className="flex-1 h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_0] shadow-primary-shadow dark:shadow-primary-shadow hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0] active:shadow-primary-shadow transition-all"
              >
                Start Learning
              </button>
              <button
                onClick={onGuestMode}
                className="flex-1 h-14 bg-card dark:bg-card text-primary rounded-2xl font-bold text-lg uppercase tracking-wider border-2 border-border dark:border-border hover:bg-hover-background dark:hover:bg-hover-background hover:border-primary active:scale-95 transition-all"
              >
                Guest Mode
              </button>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Features / Visuals */}
        <div className="flex-1 bg-hover-background dark:bg-hover-background flex flex-col justify-center p-12 lg:p-24 border-l-2 border-border dark:border-border">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-card dark:bg-card p-6 rounded-3xl border-2 border-border dark:border-border shadow-sm hover:shadow-md transition-all cursor-default">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-success-light dark:bg-success-light rounded-2xl flex items-center justify-center border-2 border-success flex-shrink-0">
                  <BookOpen className="w-10 h-10 text-success" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-text-primary dark:text-text-primary font-bold text-xl mb-1">Interactive Lessons</h3>
                  <p className="text-text-secondary dark:text-text-secondary font-medium">Learn by doing with step-by-step interactive guides.</p>
                </div>
              </div>
            </div>

            <div className="bg-card dark:bg-card p-6 rounded-3xl border-2 border-border dark:border-border shadow-sm hover:shadow-md transition-all cursor-default">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-info-light dark:bg-info-light rounded-2xl flex items-center justify-center border-2 border-secondary flex-shrink-0">
                  <Zap className="w-10 h-10 text-secondary" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-text-primary dark:text-text-primary font-bold text-xl mb-1">Visual Learning</h3>
                  <p className="text-text-secondary dark:text-text-secondary font-medium">Watch algorithms come to life with real-time animations.</p>
                </div>
              </div>
            </div>

            <div className="bg-card dark:bg-card p-6 rounded-3xl border-2 border-border dark:border-border shadow-sm hover:shadow-md transition-all cursor-default">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-warning-light dark:bg-warning-light rounded-2xl flex items-center justify-center border-2 border-accent flex-shrink-0">
                  <Target className="w-10 h-10 text-accent" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-text-primary dark:text-text-primary font-bold text-xl mb-1">Track Progress</h3>
                  <p className="text-text-secondary dark:text-text-secondary font-medium">Earn XP, climb the leaderboard, and master every topic.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, bg, border, title, desc, delay }: { icon: React.ReactNode, bg: string, border: string, title: string, desc: string, delay: number }) {
  return (
    <div className="flex items-center gap-5">
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: delay === 0.5 ? [0, 5, -5, 0] : 0,
          y: delay === 1 ? [0, -5, 0] : 0
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay }}
        className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center border-2 ${border} flex-shrink-0`}
      >
        {icon}
      </motion.div>
      <div>
        <h3 className="text-text-primary dark:text-text-primary font-bold text-lg">{title}</h3>
        <p className="text-text-secondary dark:text-text-secondary">{desc}</p>
      </div>
    </div>
  );
}