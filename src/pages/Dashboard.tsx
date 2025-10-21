import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, CheckCircle2, Calendar, Filter, Search } from 'lucide-react';
import { useDecisions } from '@/contexts/DecisionContext';
import type { Decision, DecisionCategory } from '@/types';
import { format } from 'date-fns';

interface DashboardProps {
  onViewDecision: (decision: Decision) => void;
}

const categoryColors: Record<DecisionCategory, string> = {
  career: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  business: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  personal: 'bg-green-500/10 text-green-500 border-green-500/20',
  financial: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  health: 'bg-red-500/10 text-red-500 border-red-500/20',
  relationships: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function Dashboard({ onViewDecision }: DashboardProps) {
  const { decisions } = useDecisions();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<DecisionCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');

  const filteredDecisions = decisions.filter((decision) => {
    const matchesSearch =
      decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decision.context.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || decision.category === filterCategory;
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && decision.status === 'pending') ||
      (activeTab === 'resolved' && decision.status === 'resolved');
    return matchesSearch && matchesCategory && matchesTab;
  });

  const pendingCount = decisions.filter((d) => d.status === 'pending').length;
  const resolvedCount = decisions.filter((d) => d.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Decisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{decisions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Your Decisions</CardTitle>
          <CardDescription>Track and review your decision-making journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search decisions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filterCategory}
              onValueChange={(value) => setFilterCategory(value as DecisionCategory | 'all')}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="relationships">Relationships</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All ({decisions.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="flex-1">
                Resolved ({resolvedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {filteredDecisions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No decisions found.</p>
                      <p className="text-sm mt-2">
                        {decisions.length === 0
                          ? 'Start by creating your first decision entry.'
                          : 'Try adjusting your search or filters.'}
                      </p>
                    </div>
                  ) : (
                    filteredDecisions
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      )
                      .map((decision) => (
                        <Card
                          key={decision.id}
                          className="cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => onViewDecision(decision)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold truncate">{decision.title}</h3>
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
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {decision.context}
                                </p>

                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <Badge className={categoryColors[decision.category]}>
                                    {decision.category}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(decision.createdAt), 'MMM d, yyyy')}
                                  </span>
                                  {decision.status === 'resolved' && decision.outcomeRating && (
                                    <span className="flex items-center gap-1">
                                      <span className="font-medium">Rating:</span>
                                      {'⭐'.repeat(decision.outcomeRating)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
