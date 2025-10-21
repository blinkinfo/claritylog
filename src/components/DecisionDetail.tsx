import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Lightbulb,
  Target,
  Brain,
  Star,
  Trash2,
} from 'lucide-react';
import type { Decision, OutcomeRating } from '@/types';
import { useDecisions } from '@/contexts/DecisionContext';
import { format } from 'date-fns';

interface DecisionDetailProps {
  decision: Decision | null;
  open: boolean;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  career: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  business: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  personal: 'bg-green-500/10 text-green-500 border-green-500/20',
  financial: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  health: 'bg-red-500/10 text-red-500 border-red-500/20',
  relationships: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function DecisionDetail({ decision, open, onClose }: DecisionDetailProps) {
  const { updateDecision, deleteDecision } = useDecisions();
  const [isEditingOutcome, setIsEditingOutcome] = useState(false);
  const [actualOutcome, setActualOutcome] = useState('');
  const [outcomeRating, setOutcomeRating] = useState<OutcomeRating>(3);
  const [lessonsLearned, setLessonsLearned] = useState('');

  if (!decision) return null;

  const handleLogOutcome = () => {
    if (!actualOutcome.trim()) {
      alert('Please describe the actual outcome');
      return;
    }

    updateDecision(decision.id, {
      status: 'resolved',
      actualOutcome,
      outcomeRating,
      lessonsLearned,
      resolvedAt: new Date().toISOString(),
    });

    setIsEditingOutcome(false);
    setActualOutcome('');
    setOutcomeRating(3);
    setLessonsLearned('');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this decision? This cannot be undone.')) {
      deleteDecision(decision.id);
      onClose();
    }
  };

  const startEditingOutcome = () => {
    setIsEditingOutcome(true);
    setActualOutcome(decision.actualOutcome || '');
    setOutcomeRating(decision.outcomeRating || 3);
    setLessonsLearned(decision.lessonsLearned || '');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{decision.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
                <Badge className={categoryColors[decision.category]}>
                  {decision.category}
                </Badge>
                {decision.status === 'pending' ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                ) : (
                  <Badge className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20">
                    <CheckCircle2 className="h-3 w-3" />
                    Resolved
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(decision.createdAt), 'MMMM d, yyyy')}
                </span>
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Context */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Context & Background
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {decision.context}
                </p>
              </CardContent>
            </Card>

            {/* Options Considered */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Options Considered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {decision.options.map((option) => (
                  <Card
                    key={option.id}
                    className={
                      option.id === decision.selectedOptionId
                        ? 'ring-2 ring-primary bg-primary/5'
                        : ''
                    }
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-2 mb-3">
                        {option.id === decision.selectedOptionId && (
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        )}
                        <p className="font-medium flex-1">{option.description}</p>
                      </div>

                      {(option.pros.length > 0 || option.cons.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {option.pros.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-green-500 mb-2">Pros</h4>
                              <ul className="text-sm space-y-1">
                                {option.pros.map((pro, i) => (
                                  <li key={i} className="text-muted-foreground">
                                    • {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {option.cons.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-red-500 mb-2">Cons</h4>
                              <ul className="text-sm space-y-1">
                                {option.cons.map((con, i) => (
                                  <li key={i} className="text-muted-foreground">
                                    • {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Reasoning */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Your Reasoning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {decision.reasoning}
                </p>
              </CardContent>
            </Card>

            {/* Expected Outcome */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Expected Outcome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {decision.expectedOutcome}
                </p>
              </CardContent>
            </Card>

            {/* Actual Outcome */}
            {decision.status === 'resolved' && !isEditingOutcome ? (
              <>
                <Card className="border-primary/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Actual Outcome
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startEditingOutcome}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Outcome</Label>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {decision.actualOutcome}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Rating</Label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`h-5 w-5 ${
                              rating <= (decision.outcomeRating || 0)
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {decision.lessonsLearned && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Lessons Learned
                        </Label>
                        <p className="text-sm mt-1 whitespace-pre-wrap">
                          {decision.lessonsLearned}
                        </p>
                      </div>
                    )}

                    {decision.resolvedAt && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Resolved on {format(new Date(decision.resolvedAt), 'MMMM d, yyyy')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : decision.status === 'pending' || isEditingOutcome ? (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="text-base">
                    {isEditingOutcome ? 'Update Outcome' : 'Log Outcome'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="actualOutcome">Actual Outcome *</Label>
                    <Textarea
                      id="actualOutcome"
                      value={actualOutcome}
                      onChange={(e) => setActualOutcome(e.target.value)}
                      placeholder="What actually happened?"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rate the Outcome</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setOutcomeRating(rating as OutcomeRating)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              rating <= outcomeRating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      1 = Poor, 3 = Neutral, 5 = Excellent
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lessonsLearned">Lessons Learned (Optional)</Label>
                    <Textarea
                      id="lessonsLearned"
                      value={lessonsLearned}
                      onChange={(e) => setLessonsLearned(e.target.value)}
                      placeholder="What did you learn from this decision?"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    {isEditingOutcome && (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingOutcome(false)}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handleLogOutcome}>
                      {isEditingOutcome ? 'Update Outcome' : 'Save Outcome'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
