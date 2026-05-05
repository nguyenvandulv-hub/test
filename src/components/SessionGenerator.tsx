import { useState } from 'react';
import { Play, Sparkles, Wind, Droplets, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { useMeditationStore } from '../store/useMeditationStore';

interface SessionGeneratorProps {
  onStart: (duration: number, theme: string) => void;
}

const THEMES = [
  { id: 'calm', name: 'Calm Mind', icon: Wind, color: 'text-sky-500', bg: 'bg-sky-50 border-sky-100 hover:border-sky-200' },
  { id: 'sleep', name: 'Deep Sleep', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100 hover:border-indigo-200' },
  { id: 'morning', name: 'Morning Refresh', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100 hover:border-amber-200' },
  { id: 'focus', name: 'Deep Focus', icon: Droplets, color: 'text-teal-500', bg: 'bg-teal-50 border-teal-100 hover:border-teal-200' },
];

const DURATIONS = [3, 5, 10, 15, 20, 30];

export function SessionGenerator({ onStart }: SessionGeneratorProps) {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].id);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [aiPrompt, setAiPrompt] = useState('');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Create Session</h2>
        <p className="text-sm text-slate-500">Personalize your meditation experience</p>
      </div>

      {/* Themes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 block">Select a Theme</h3>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map(theme => {
            const Icon = theme.icon;
            const isSelected = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-xl border text-sm transition-all",
                  theme.bg,
                  isSelected ? `ring-2 ring-offset-2 ring-[${theme.color}] border-transparent` : "opacity-80"
                )}
              >
                <Icon className={cn("w-6 h-6", theme.color)} />
                <span className="font-medium text-slate-800">{theme.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Duration */}
      <div>
         <h3 className="text-sm font-semibold text-slate-700 mb-3 block">Duration (minutes)</h3>
         <div className="flex flex-wrap gap-2">
            {DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDuration(d)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
                  selectedDuration === d 
                    ? "bg-slate-800 text-white" 
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                {d} min
              </button>
            ))}
         </div>
      </div>

      {/* AI Prompt override */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI Custom Prompt (Optional)
        </label>
        <textarea
           value={aiPrompt}
           onChange={(e) => setAiPrompt(e.target.value)}
           placeholder="e.g. A meditation focused on letting go of work stress, featuring sounds of a gentle stream..."
           className="w-full text-sm p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors resize-none h-24"
        />
      </div>

      <div className="mt-4">
        <button
          onClick={() => onStart(selectedDuration, selectedTheme)}
          className="w-full bg-teal-600 text-white p-4 rounded-xl font-medium shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Session • {selectedDuration} min
        </button>
      </div>
    </div>
  );
}
