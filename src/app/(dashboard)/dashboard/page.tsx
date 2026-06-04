
"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  ArrowUpRight, 
  Activity,
  Fingerprint,
  BookOpen,
  Newspaper,
  ArrowRight,
  ExternalLink,
  Users2
} from "lucide-react";
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const performanceData = [
  { name: 'Jan', value: 138 },
  { name: 'Feb', value: 140 },
  { name: 'Mar', value: 139 },
  { name: 'Apr', value: 142 },
  { name: 'May', value: 145 },
  { name: 'Jun', value: 142 },
];

const familyInsights = [
  {
    title: "Navigating the 2nd Gen Liquidity Gap",
    category: "Case Study",
    description: "How a European founder-led family office restructured their trust to engage 3rd generation members early.",
    tags: ["Succession", "Liquidity"],
    icon: Users2
  },
  {
    title: "The Philanthropic Pivot",
    category: "Strategy",
    description: "Converting a stagnant private foundation into a dynamic social impact vehicle to align family values.",
    tags: ["Philanthropy", "Alignment"],
    icon: BookOpen
  }
];

const legacyNews = [
  {
    title: "2025 Dynasty Trust Legislation Update",
    source: "Heritage Law Review",
    time: "2h ago",
    impact: "High"
  },
  {
    title: "Global Shift in Real Estate Tokenization",
    source: "Wealth Tech Monthly",
    time: "5h ago",
    impact: "Medium"
  },
  {
    title: "Psychological Friction: The Silent Portfolio Killer",
    source: "Family Office Journal",
    time: "1d ago",
    impact: "Strategic"
  }
];

export default function DashboardPage() {
  const { user } = useUser();
  const { data: dna, loading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">Executive Oversight</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Family Command Center</h1>
        <p className="text-muted-foreground italic">Consolidated family net worth and strategic legacy alignment.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Command Center
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Educational Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 mt-0 border-none p-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Family Net Worth</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline">$142.4M</div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                  <ArrowUpRight className="h-3 w-3" /> +2.4% vs last audit
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Legacy Alignment</CardTitle>
                <ShieldCheck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline">78%</div>
                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
                  <Activity className="h-3 w-3" /> Gap detected in Gen 2
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current DNA</CardTitle>
                <Fingerprint className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold font-headline truncate">
                  {dna?.generationalStage || "Founder-Led"}
                </div>
                <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
                  Extraction Active
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Entities</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline">12</div>
                <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
                  Across 4 jurisdictions
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 glass-panel border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Aggregate Wealth Trajectory</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--foreground), 0.05)" />
                    <XAxis dataKey="name" stroke="hsla(var(--foreground), 0.4)" fontSize={12} />
                    <YAxis stroke="hsla(var(--foreground), 0.4)" fontSize={12} tickFormatter={(v) => `$${v}M`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--foreground), 0.1)' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Narrative Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-sm italic leading-relaxed text-foreground opacity-80">
                    "{dna?.narrativeSummary || "Your legacy DNA is being synthesized. Complete the profiling journey to unlock human-centric insights."}"
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Core Priorities</p>
                  <div className="flex flex-wrap gap-2">
                    {dna?.coreValues?.slice(0, 3).map((val: string) => (
                      <Badge key={val} variant="secondary" className="bg-white/5 border-white/10">{val}</Badge>
                    ))}
                    {!dna?.coreValues && (
                      <Badge variant="outline" className="opacity-30">Values Pending</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-0 border-none p-0 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <Users2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-headline font-bold">Peer Generational Strategies</h2>
                  <p className="text-sm text-muted-foreground">Anonymized case studies from families in your stage ({dna?.generationalStage || "Founder-Led"}).</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {familyInsights.map((insight, i) => (
                  <Card key={i} className="glass-panel border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter bg-primary/5 border-primary/20 text-primary">
                          {insight.category}
                        </Badge>
                        <insight.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{insight.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {insight.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">#{tag}</span>
                        ))}
                      </div>
                    </CardContent>
                    <CardContent className="pt-0 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Analysis <ArrowRight className="h-3 w-3" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="glass-panel border-white/5 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-white/5">
                  <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    The Aivaz Library
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Deep dives into the human architecture of wealth.</p>
                </div>
                <CardContent className="p-0">
                  {[
                    "Mental Health in Multi-Generational Wealth",
                    "Structuring Trusts for Individual Purpose",
                    "Cross-Border Dynamics: When the Family Scatters",
                  ].map((title, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-muted-foreground/30">0{i+1}</span>
                        <p className="text-sm font-medium">{title}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <Newspaper className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-headline font-bold">Legacy News</h2>
              </div>

              <Card className="glass-panel border-white/5">
                <CardContent className="p-0">
                  {legacyNews.map((news, i) => (
                    <div key={i} className="p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{news.source}</span>
                        <Badge variant="outline" className={`text-[9px] ${news.impact === 'High' ? 'border-amber-500/50 text-amber-500' : 'border-white/10 text-muted-foreground'}`}>
                          {news.impact} Impact
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold group-hover:text-primary transition-colors mb-2">{news.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{news.time}</p>
                    </div>
                  ))}
                </CardContent>
                <CardHeader className="pt-0">
                  <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest h-12 hover:bg-primary/10">
                    View Full Feed
                  </Button>
                </CardHeader>
              </Card>

              <Card className="glass-panel bg-primary/5 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="h-12 w-12 text-primary" />
                </div>
                <CardHeader>
                  <CardTitle className="text-sm">Situation Alert</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Based on your **Asset Complexity** and **Geographic Distribution**, we've flagged a new tax treaty update in Singapore that may impact your offshore estratégico reserve.
                  </p>
                  <Button size="sm" className="w-full mt-4 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                    Review Simulation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
