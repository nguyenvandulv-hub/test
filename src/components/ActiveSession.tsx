import { useState, useEffect } from 'react';
import { X, Pause, Play, Check } from 'lucide-react';
import { useMeditationStore } from '../store/useMeditationStore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ActiveSessionProps {
  duration: number; // in minutes
  theme: string;
  onComplete: () => void;
  onCancel: () => void;
}

export function ActiveSession({ duration, theme, onComplete, onCancel }: ActiveSessionProps) {
  const addSession = useMeditationStore(state => state.addSession);
  
  const totalSeconds = duration * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isPaused || isDone) return;
    
    if (secondsLeft <= 0) {
      setIsDone(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isPaused, isDone]);

  const handleFinish = () => {
    // Save to store
    addSession({
      duration: duration, // we just record the planned duration for simplicity, or we could record Math.floor((totalSeconds - secondsLeft) / 60)
      theme: theme
    });
    onComplete();
  };

  const handleEarlyFinish = () => {
    const minCompleted = Math.floor((totalSeconds - secondsLeft) / 60);
    if (minCompleted > 0) {
      addSession({
        duration: minCompleted,
        theme: theme
      });
    }
    onComplete();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  // Let's pick a background based on theme
  let bgClasses = 'bg-slate-900';
  let glowClasses = 'shadow-slate-500/50';
  if (theme === 'calm') { bgClasses = 'bg-sky-900'; glowClasses = 'shadow-sky-500/30'; }
  if (theme === 'sleep') { bgClasses = 'bg-indigo-950'; glowClasses = 'shadow-indigo-500/30'; }
  if (theme === 'morning') { bgClasses = 'bg-amber-800'; glowClasses = 'shadow-amber-500/30'; }
  if (theme === 'focus') { bgClasses = 'bg-teal-900'; glowClasses = 'shadow-teal-500/30'; }

  return (
    <div className={cn("fixed inset-0 z-50 flex flex-col justify-between text-white transition-colors duration-1000", bgClasses)}>
      
      {/* Header */}
      <div className="p-6 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
        <button onClick={onCancel} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="text-sm font-medium tracking-widest uppercase">{theme}</div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <AnimatePresence mode="wait">
          {!isDone ? (
            <motion.div 
              key="timer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="relative flex items-center justify-center w-64 h-64"
            >
              {/* Pulsing background glow */}
              <motion.div 
                className={cn("absolute inset-0 rounded-full blur-3xl",glowClasses)}
                animate={{ 
                  scale: isPaused ? 1 : [1, 1.2, 1],
                  opacity: isPaused ? 0.3 : [0.3, 0.6, 0.3] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Circular progress track */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="50%" cy="50%" r="48%" 
                  className="stroke-white/10 fill-none" 
                  strokeWidth="4" 
                />
                <circle 
                  cx="50%" cy="50%" r="48%" 
                  className="stroke-white fill-none transition-all duration-1000 ease-linear" 
                  strokeWidth="4"
                  strokeDasharray={`${progress} 100`}
                  pathLength="100"
                />
              </svg>

              <div className="text-6xl font-light tabular-nums tracking-tighter relative z-10">
                {formatTime(secondsLeft)}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Session Complete</h2>
                <p className="text-white/70">You meditated for {duration} minutes.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="p-8 pb-safe flex justify-center items-center">
        {!isDone ? (
           <div className="flex items-center gap-6">
              {/* End Early Btn */}
              <button 
                onClick={handleEarlyFinish}
                className="px-6 py-3 rounded-full bg-white/10 text-white/90 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                End Early
              </button>

              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
              >
                {isPaused ? <Play className="w-6 h-6 fill-current ml-1" /> : <Pause className="w-6 h-6 fill-current" />}
              </button>
           </div>
        ) : (
           <button 
             onClick={handleFinish}
             className="w-full max-w-sm bg-white text-slate-900 p-4 rounded-xl font-bold shadow-xl hover:scale-[1.02] transition-transform"
           >
             Save Progress & Return
           </button>
        )}
      </div>

    </div>
  );
}
