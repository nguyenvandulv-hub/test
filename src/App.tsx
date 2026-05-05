import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { SessionGenerator } from './components/SessionGenerator';
import { ActiveSession } from './components/ActiveSession';
import { Layout } from './components/Layout';

export type ViewState = 'dashboard' | 'generate' | 'active';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [activeSessionConfig, setActiveSessionConfig] = useState<{ duration: number; theme: string } | null>(null);

  const handleStartSession = (duration: number, theme: string) => {
    setActiveSessionConfig({ duration, theme });
    setCurrentView('active');
  };

  const handleEndSession = () => {
    setActiveSessionConfig(null);
    setCurrentView('dashboard');
  };

  if (currentView === 'active' && activeSessionConfig) {
    return (
      <ActiveSession 
        duration={activeSessionConfig.duration} 
        theme={activeSessionConfig.theme} 
        onComplete={handleEndSession}
        onCancel={handleEndSession}
      />
    );
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'dashboard' ? (
        <Dashboard onStartGenerate={() => setCurrentView('generate')} />
      ) : (
        <SessionGenerator onStart={handleStartSession} />
      )}
    </Layout>
  );
}
