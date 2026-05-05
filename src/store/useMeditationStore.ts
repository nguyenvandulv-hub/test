import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isToday, isYesterday, parseISO } from 'date-fns';

export interface MeditationSession {
  id: string;
  date: string; // ISO string
  duration: number; // minutes
  theme: string;
}

interface MeditationState {
  totalTime: number;
  streak: number;
  lastMeditationDate: string | null;
  sessionsCompleted: number;
  dailyGoal: number; // in minutes
  history: MeditationSession[];
  setGoal: (minutes: number) => void;
  addSession: (session: Omit<MeditationSession, 'id' | 'date'>) => void;
}

export const useMeditationStore = create<MeditationState>()(
  persist(
    (set, get) => ({
      totalTime: 0,
      streak: 0,
      lastMeditationDate: null,
      sessionsCompleted: 0,
      dailyGoal: 10,
      history: [],
      setGoal: (minutes) => set({ dailyGoal: minutes }),
      addSession: (sessionPayload) => {
        const now = new Date();
        const todayStr = now.toISOString();
        const { lastMeditationDate, streak, totalTime, sessionsCompleted, history } = get();
        
        let newStreak = streak;
        
        if (lastMeditationDate) {
          const lastDate = parseISO(lastMeditationDate);
          if (isYesterday(lastDate)) {
            newStreak += 1;
          } else if (!isToday(lastDate)) {
            newStreak = 1; // Reset streak if missed a day
          }
          // If it's today, streak stays the same
        } else {
          newStreak = 1; // First session
        }

        const newSession: MeditationSession = {
          id: crypto.randomUUID(),
          date: todayStr,
          ...sessionPayload,
        };

        set({
          totalTime: totalTime + sessionPayload.duration,
          streak: newStreak,
          lastMeditationDate: todayStr,
          sessionsCompleted: sessionsCompleted + 1,
          history: [...history, newSession],
        });
      },
    }),
    {
      name: 'zen-track-storage',
    }
  )
);
