import type { ReactNode } from 'react';
import { BookOpen, Home, BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
  currentView: 'dashboard' | 'analytics';
  onViewChange: (view: 'dashboard' | 'analytics') => void;
  onNewDecision: () => void;
}

export function Layout({ children, currentView, onViewChange, onNewDecision }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">ClarityLog</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={currentView === 'dashboard' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={currentView === 'analytics' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </nav>

          <Button onClick={onNewDecision} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Decision
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 fixed bottom-0 left-0 right-0 z-50">
        <div className="flex items-center justify-around py-3">
          <Button
            variant={currentView === 'dashboard' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('dashboard')}
            className="flex-col h-auto py-2"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Button>
          <Button
            onClick={onNewDecision}
            size="icon"
            className="rounded-full h-14 w-14 -mt-8"
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button
            variant={currentView === 'analytics' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('analytics')}
            className="flex-col h-auto py-2"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">Analytics</span>
          </Button>
        </div>
      </nav>

      {/* Add padding at bottom for mobile navigation */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
