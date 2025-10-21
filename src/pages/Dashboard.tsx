import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle2, Calendar, Filter, Search, TrendingUp, FileText, Sparkles } from 'lucide-react';
import { useDecisions } from '@/contexts/DecisionContext';
import type { Decision, DecisionCategory } from '@/types';
import { format } from 'date-fns';

interface DashboardProps {
  onViewDecision: (decision: Decision) => void;
}

const categoryColorClasses: Record<DecisionCategory, string> = {
  career: 'badge-career',
  business: 'badge-business',
  personal: 'badge-personal',
  financial: 'badge-financial',
  health: 'badge-health',
  relationships: 'badge-relationships',
  other: 'badge-other',
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

  // Calculate average rating for resolved decisions
  const resolvedWithRatings = decisions.filter((d) => d.status === 'resolved' && d.outcomeRating);
  const avgRating = resolvedWithRatings.length > 0
    ? resolvedWithRatings.reduce((sum, d) => sum + (d.outcomeRating || 0), 0) / resolvedWithRatings.length
    : 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          <span className="text-gradient">Dashboard</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Track and review your decision-making journey
        </p>
      </div>

      {/* Stats Overview - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <Card className="gradient-shine border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="pb-3 p-4 md:p-6 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Decisions
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-3xl font-bold md:text-4xl">{decisions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your decision history
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
          <CardHeader className="pb-3 p-4 md:p-6 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-3xl font-bold text-yellow-500 md:text-4xl">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting outcomes
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 hover:border-green-500/40 transition-all duration-300">
          <CardHeader className="pb-3 p-4 md:p-6 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Resolved
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-3xl font-bold text-green-500 md:text-4xl">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              With outcomes logged
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <CardHeader className="pb-3 p-4 md:p-6 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Average Rating
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-3xl font-bold text-blue-500 md:text-4xl">
              {avgRating > 0 ? avgRating.toFixed(1) : '—'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgRating > 0 && '⭐'.repeat(Math.round(avgRating))}
              {avgRating === 0 && 'No ratings yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Decisions List */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                Your Decisions
              </CardTitle>
              <CardDescription className="mt-1 text-xs md:text-sm">
                Manage and track your important life choices
              </CardDescription>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Filters - Mobile Optimized */}
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search decisions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <Select
              value={filterCategory}
              onValueChange={(value) => setFilterCategory(value as DecisionCategory | 'all')}
            >
              <SelectTrigger className="w-full md:w-[180px] h-10">
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
        </CardHeader>

        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="w-full grid grid-cols-3 h-auto">
              <TabsTrigger value="all" className="text-xs md:text-sm py-2">
                All <span className="ml-1">({decisions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs md:text-sm py-2">
                Pending <span className="ml-1">({pendingCount})</span>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs md:text-sm py-2">
                Resolved <span className="ml-1">({resolvedCount})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[calc(100vh-520px)] min-h-[400px] pr-2 md:pr-4">
                <div className="space-y-3">
                  {filteredDecisions.length === 0 ? (
                    <div className="text-center py-12 md:py-16">
                      <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted/50 mb-4">
                        <FileText className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                      </div>
                      <p className="text-base md:text-lg font-medium mb-1">No decisions found</p>
                      <p className="text-sm text-muted-foreground">
                        {decisions.length === 0
                          ? 'Start by creating your first decision entry'
                          : 'Try adjusting your search or filters'}
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
                          className="cursor-pointer hover:bg-accent/50 hover:border-primary/40 transition-all duration-200 active:scale-[0.98]"
                          onClick={() => onViewDecision(decision)}
                        >
                          <CardContent className="p-4 md:p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                                  <h3 className="font-semibold text-base md:text-lg truncate">
                                    {decision.title}
                                  </h3>
                                  {decision.status === 'pending' ? (
                                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                      <Clock className="h-3 w-3" />
                                      <span className="text-xs">Pending</span>
                                    </Badge>
                                  ) : (
                                    <Badge className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 w-fit">
                                      <CheckCircle2 className="h-3 w-3" />
                                      <span className="text-xs">Resolved</span>
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                  {decision.context}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <Badge className={`${categoryColorClasses[decision.category]} text-xs`}>
                                    {decision.category}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(decision.createdAt), 'MMM d, yyyy')}
                                  </span>
                                  {decision.status === 'resolved' && decision.outcomeRating && (
                                    <span className="flex items-center gap-1 font-medium">
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
