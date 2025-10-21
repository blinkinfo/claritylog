import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingUp,
  Target,
  Award,
  AlertTriangle,
  BarChart3,
  PieChart,
  Star,
} from 'lucide-react';
import { useDecisions } from '@/contexts/DecisionContext';
import type { DecisionCategory } from '@/types';

const categoryColors: Record<DecisionCategory, string> = {
  career: 'bg-blue-500',
  business: 'bg-purple-500',
  personal: 'bg-green-500',
  financial: 'bg-yellow-500',
  health: 'bg-red-500',
  relationships: 'bg-pink-500',
  other: 'bg-gray-500',
};

const categoryLabels: Record<DecisionCategory, string> = {
  career: 'Career',
  business: 'Business',
  personal: 'Personal',
  financial: 'Financial',
  health: 'Health',
  relationships: 'Relationships',
  other: 'Other',
};

export function Analytics() {
  const { getStats, getBiasInsights } = useDecisions();
  const stats = getStats();
  const biasInsights = getBiasInsights();

  const categoryEntries = Object.entries(stats.categoryBreakdown) as [DecisionCategory, number][];
  const totalCategoryDecisions = categoryEntries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Analytics</h2>
        <p className="text-muted-foreground">
          Insights into your decision-making patterns and biases
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Decisions
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDecisions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingDecisions} pending, {stats.resolvedDecisions} resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.resolvedDecisions > 0 ? stats.averageRating.toFixed(1) : '—'}
            </div>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-3 w-3 ${
                    rating <= Math.round(stats.averageRating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Accuracy Rate
              </CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.resolvedDecisions > 0 ? `${Math.round(stats.accuracyRate)}%` : '—'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Decisions rated 4+ stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolution Rate
              </CardTitle>
              <Award className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.totalDecisions > 0
                ? `${Math.round((stats.resolvedDecisions / stats.totalDecisions) * 100)}%`
                : '—'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Decisions with outcomes logged
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Decision Categories
          </CardTitle>
          <CardDescription>Breakdown of decisions by category</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No decisions recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryEntries
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => {
                  const percentage = totalCategoryDecisions > 0
                    ? (count / totalCategoryDecisions) * 100
                    : 0;

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${categoryColors[category]}`}
                          />
                          <span className="font-medium">{categoryLabels[category]}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {count} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${categoryColors[category]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bias Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Cognitive Bias Insights
          </CardTitle>
          <CardDescription>
            Patterns that may indicate decision-making biases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.resolvedDecisions < 3 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Resolve at least 3 decisions to see bias insights.</p>
              <p className="text-sm mt-2">
                ClarityLog will analyze your patterns to help you improve your decision-making.
              </p>
            </div>
          ) : biasInsights.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                <Award className="h-6 w-6 text-green-500" />
              </div>
              <p className="font-medium">Great job!</p>
              <p className="text-sm text-muted-foreground mt-1">
                No significant biases detected in your decision-making patterns.
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                {biasInsights.map((insight, index) => (
                  <Card key={index} className="border-yellow-500/20 bg-yellow-500/5">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{insight.type}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {insight.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            Found in {insight.occurrence} decision
                            {insight.occurrence !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tips for Better Decision-Making
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong className="text-foreground">Be honest about outcomes:</strong> Rate
                decisions objectively to get accurate insights into your decision-making patterns.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong className="text-foreground">Document thoroughly:</strong> The more
                context you provide, the better you'll understand your reasoning when you review.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong className="text-foreground">Review regularly:</strong> Revisit your
                pending decisions to log outcomes and learn from your choices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong className="text-foreground">Learn from patterns:</strong> Pay attention
                to bias insights and adjust your decision-making process accordingly.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
