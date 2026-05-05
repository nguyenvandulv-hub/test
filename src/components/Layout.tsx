import { ReactNode } from 'react';
import { Home, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { ViewState } from '../App';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-xl font-semibold tracking-tight">ZenTrack</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 p-2 pb-safe sticky bottom-0 z-10">
        <div className="max-w-md mx-auto flex justify-around">
          <button
            onClick={() => onViewChange('dashboard')}
            className={cn(
              "flex flex-col items-center p-2 rounded-xl transition-colors",
              currentView === 'dashboard' ? "text-teal-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => onViewChange('generate')}
            className={cn(
               "flex flex-col items-center p-2 rounded-xl transition-colors",
               currentView === 'generate' ? "text-teal-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            <Sparkles className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Generate</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
