import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Decision, DecisionStats, BiasInsight } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DecisionContextType {
  decisions: Decision[];
  addDecision: (decision: Omit<Decision, 'id' | 'createdAt' | 'status'>) => void;
  updateDecision: (id: string, decision: Partial<Decision>) => void;
  deleteDecision: (id: string) => void;
  getDecisionById: (id: string) => Decision | undefined;
  getStats: () => DecisionStats;
  getBiasInsights: () => BiasInsight[];
}

const DecisionContext = createContext<DecisionContextType | undefined>(undefined);

export function DecisionProvider({ children }: { children: ReactNode }) {
  const [decisions, setDecisions] = useLocalStorage<Decision[]>('claritylog-decisions', []);

  const addDecision = (decision: Omit<Decision, 'id' | 'createdAt' | 'status'>) => {
    const newDecision: Decision = {
      ...decision,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setDecisions([...decisions, newDecision]);
  };

  const updateDecision = (id: string, updatedFields: Partial<Decision>) => {
    setDecisions(
      decisions.map((decision) =>
        decision.id === id ? { ...decision, ...updatedFields } : decision
      )
    );
  };

  const deleteDecision = (id: string) => {
    setDecisions(decisions.filter((decision) => decision.id !== id));
  };

  const getDecisionById = (id: string) => {
    return decisions.find((decision) => decision.id === id);
  };

  const getStats = (): DecisionStats => {
    const resolvedDecisions = decisions.filter((d) => d.status === 'resolved');
    const totalRating = resolvedDecisions.reduce((sum, d) => sum + (d.outcomeRating || 0), 0);
    const averageRating = resolvedDecisions.length > 0 ? totalRating / resolvedDecisions.length : 0;

    const categoryBreakdown = decisions.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate accuracy rate (decisions rated 4 or 5 vs total resolved)
    const goodDecisions = resolvedDecisions.filter((d) => (d.outcomeRating || 0) >= 4).length;
    const accuracyRate = resolvedDecisions.length > 0 ? (goodDecisions / resolvedDecisions.length) * 100 : 0;

    return {
      totalDecisions: decisions.length,
      resolvedDecisions: resolvedDecisions.length,
      pendingDecisions: decisions.length - resolvedDecisions.length,
      averageRating,
      categoryBreakdown: categoryBreakdown as any,
      accuracyRate,
    };
  };

  const getBiasInsights = (): BiasInsight[] => {
    const insights: BiasInsight[] = [];
    const resolvedDecisions = decisions.filter((d) => d.status === 'resolved');

    if (resolvedDecisions.length < 3) {
      return insights;
    }

    // Confirmation bias: Check if reasoning often matches expected outcome
    const confirmationBias = resolvedDecisions.filter((d) => {
      const expectedPositive = d.expectedOutcome.toLowerCase().includes('success') ||
                               d.expectedOutcome.toLowerCase().includes('good') ||
                               d.expectedOutcome.toLowerCase().includes('positive');
      const actualPositive = (d.outcomeRating || 0) >= 4;
      return expectedPositive && !actualPositive;
    }).length;

    if (confirmationBias > resolvedDecisions.length * 0.3) {
      insights.push({
        type: 'Confirmation Bias',
        description: 'You may be overestimating positive outcomes. Consider more critical analysis.',
        occurrence: confirmationBias,
      });
    }

    // Recency bias: Check if recent decisions are rated differently
    const recentDecisions = [...resolvedDecisions].sort((a, b) =>
      new Date(b.resolvedAt || '').getTime() - new Date(a.resolvedAt || '').getTime()
    ).slice(0, 5);

    const recentAvg = recentDecisions.reduce((sum, d) => sum + (d.outcomeRating || 0), 0) / recentDecisions.length;
    const overallAvg = resolvedDecisions.reduce((sum, d) => sum + (d.outcomeRating || 0), 0) / resolvedDecisions.length;

    if (Math.abs(recentAvg - overallAvg) > 1) {
      insights.push({
        type: 'Recency Effect',
        description: 'Your recent decisions are rated differently than your overall average. Be mindful of recent experiences affecting judgment.',
        occurrence: recentDecisions.length,
      });
    }

    // Sunk cost fallacy: Check for decisions with many options but low ratings
    const complexLowRated = resolvedDecisions.filter((d) =>
      d.options.length > 3 && (d.outcomeRating || 0) < 3
    ).length;

    if (complexLowRated > resolvedDecisions.length * 0.25) {
      insights.push({
        type: 'Analysis Paralysis',
        description: 'Complex decisions with many options tend to have poorer outcomes. Consider simplifying your decision framework.',
        occurrence: complexLowRated,
      });
    }

    return insights;
  };

  return (
    <DecisionContext.Provider
      value={{
        decisions,
        addDecision,
        updateDecision,
        deleteDecision,
        getDecisionById,
        getStats,
        getBiasInsights,
      }}
    >
      {children}
    </DecisionContext.Provider>
  );
}

export function useDecisions() {
  const context = useContext(DecisionContext);
  if (!context) {
    throw new Error('useDecisions must be used within a DecisionProvider');
  }
  return context;
}
