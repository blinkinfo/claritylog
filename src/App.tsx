import { useState } from 'react';
import { DecisionProvider } from './contexts/DecisionContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { DecisionForm } from './components/DecisionForm';
import { DecisionDetail } from './components/DecisionDetail';
import { Toaster } from './components/ui/sonner';
import type { Decision } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const handleViewDecision = (decision: Decision) => {
    setSelectedDecision(decision);
  };

  const handleCloseDetail = () => {
    setSelectedDecision(null);
  };

  return (
    <DecisionProvider>
      <Layout
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewDecision={() => setIsFormOpen(true)}
      >
        {currentView === 'dashboard' ? (
          <Dashboard onViewDecision={handleViewDecision} />
        ) : (
          <Analytics />
        )}
      </Layout>

      <DecisionForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />

      <DecisionDetail
        decision={selectedDecision}
        open={selectedDecision !== null}
        onClose={handleCloseDetail}
      />

      <Toaster />
    </DecisionProvider>
  );
}

export default App;
