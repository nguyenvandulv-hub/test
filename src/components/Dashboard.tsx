import { Flame, Clock, Calendar, CheckCircle2, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useMeditationStore } from '../store/useMeditationStore';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

export function Dashboard({ onStartGenerate }: { onStartGenerate: () => void }) {
  const { totalTime, streak, sessionsCompleted, dailyGoal, history, setGoal } = useMeditationStore();

  // Calculate daily time for the last 7 days chart
  const calculateWeeklyData = () => {
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = subDays(today, i);
      const formattedDateStr = format(targetDate, 'yyyy-MM-dd');
      
      const daySessions = history.filter(s => {
        return format(parseISO(s.date), 'yyyy-MM-dd') === formattedDateStr;
      });
      
      const dayTotal = daySessions.reduce((sum, s) => sum + s.duration, 0);
      data.push({
        name: format(targetDate, 'eee'), // Mon, Tue, etc
        minutes: dayTotal,
      });
    }
    return data;
  };

  const weeklyData = calculateWeeklyData();
  const todayMinutes = weeklyData[weeklyData.length - 1].minutes;
  const goalProgress = Math.min(100, (todayMinutes / dailyGoal) * 100);

  return (
    <div className="flex flex-col gap-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Daily Goal Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Trophy className="w-32 h-32" />
        </div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-medium text-slate-500">Today's Goal</h2>
          <button 
            onClick={() => {
              const newGoal = prompt('Set new daily goal (minutes):', dailyGoal.toString());
              if (newGoal && !isNaN(Number(newGoal))) {
                setGoal(Number(newGoal));
              }
            }}
            className="text-xs text-teal-600 font-medium hover:text-teal-700 bg-teal-50 px-2 py-1 rounded-md"
          >
            Edit
          </button>
        </div>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-bold text-slate-800">{todayMinutes}</span>
          <span className="text-slate-500 mb-1">/ {dailyGoal} min</span>
        </div>
        
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-teal-500 transition-all duration-1000 ease-out"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
        {goalProgress >= 100 && (
          <p className="text-sm text-teal-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Goal met! Great job.
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{streak}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Day Streak</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {totalTime > 60 ? `${(totalTime / 60).toFixed(1)}h` : `${totalTime}m`}
            </div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Time</div>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          Last 7 Days
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="minutes" radius={[4, 4, 4, 4]}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? '#14b8a6' : '#e2e8f0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CTA */}
      <button 
        onClick={onStartGenerate}
        className="w-full mt-2 bg-slate-900 text-white p-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5 text-teal-400" />
        Generate New Session
        <ArrowRight className="w-5 h-5" />
      </button>

    </div>
  );
}
