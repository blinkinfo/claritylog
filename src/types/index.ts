export type DecisionCategory =
  | 'career'
  | 'business'
  | 'personal'
  | 'financial'
  | 'health'
  | 'relationships'
  | 'other';

export type DecisionStatus = 'pending' | 'resolved';

export type OutcomeRating = 1 | 2 | 3 | 4 | 5;

export interface DecisionOption {
  id: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface Decision {
  id: string;
  title: string;
  category: DecisionCategory;
  context: string;
  options: DecisionOption[];
  selectedOptionId: string;
  reasoning: string;
  expectedOutcome: string;
  createdAt: string;
  status: DecisionStatus;

  // Outcome fields (filled later)
  actualOutcome?: string;
  outcomeRating?: OutcomeRating;
  lessonsLearned?: string;
  resolvedAt?: string;
}

export interface DecisionStats {
  totalDecisions: number;
  resolvedDecisions: number;
  pendingDecisions: number;
  averageRating: number;
  categoryBreakdown: Record<DecisionCategory, number>;
  accuracyRate: number;
}

export interface BiasInsight {
  type: string;
  description: string;
  occurrence: number;
}
