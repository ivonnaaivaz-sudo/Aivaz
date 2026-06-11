
"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
  Users2,
  ChevronDown,
  RefreshCw,
  Globe,
  Calendar,
  HeartPulse,
  AlertTriangle,
  Sparkles,
  UserPlus,
  FileText,
  Cpu,
  Lock
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
  { name: 'Jan', value: 138.2 },
  { name: 'Feb', value: 140.5 },
  { name: 'Mar', value: 139.8 },
  { name: 'Apr', value: 142.1 },
  { name: 'May', value: 145.4 },
  { name: 'Jun', value: 142.4 },
];

const blindspots = [
  { title: "China Tech Concentration", impact: "High", description: "Exposure to G2 direct equity holdings exceeds risk threshold." },
  { title: "European Regulatory Shift", impact: "Moderate", description: "New EU side-letter requirements for private equity holdings." },
  { title: "Succession Gap", impact: "Strategic", description: "G2 participation in trust governance remains below target level." }
];

const aiInsights = [
  {
    title: "Optimize Trust Liquidity",
    description: "Move 5% of logistics equity to fixed income to buffer G3 educational payouts.",
    action: "Review Strategy",
    icon: Sparkles
  },
  {
    title: "Tax Jurisdiction Alert",
    description: "Singapore treaty update impacts offshore strategic reserves. Simulate impact.",
    action: "Run Simulation",
    icon: Globe
  },
  {
    title: "Governance Alignment",
    description: "Draft a formal Family Charter to resolve sibling variance in risk tolerance.",
    action: "Draft Charter",
    icon: ShieldCheck
  }
];

export default function DashboardPage() {
  const { user } = useUser();
  const { data: dna, loading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      {/* Top Header / Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 hover:bg-transparent flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src="https://picsum.photos/seed/family/100/100" />
                  <AvatarFallback>AF</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-bold flex items-center gap-2">
                    Aivaz Family Account <ChevronDown className="h-3 w-3" />
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                    Institutional Tier
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-panel w-56">
              <DropdownMenuLabel>Switch Entity</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Aivaz Family Trust</DropdownMenuItem>
              <DropdownMenuItem>Heritage Logistics Co.</DropdownMenuItem>
              <DropdownMenuItem>Private Foundation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              Live Connection Active
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
              12 Entities Synced • 3 Members Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Last Intelligence Audit</p>
            <p className="text-xs font-medium flex items-center gap-2 justify-end">
              Today, 09:42 AM <RefreshCw className="h-3 w-3 text-primary animate-spin-slow" />
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 py-1 px-3">
            <Lock className="h-3 w-3" />
            Privacy-First Mode Active
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Family Command Center</h1>
        <p className="text-muted-foreground italic">Consolidated family net worth and strategic legacy alignment.</p>
      </div>

      {/* Executive Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Family Net Worth</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
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
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Legacy Alignment</CardTitle>
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">78%</div>
            <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
              <Activity className="h-3 w-3" /> Gap detected in G2
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Geopolitical Risk</CardTitle>
            <Globe className="h-3.5 w-3.5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline text-amber-500">Moderate</div>
            <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
              Reviewing EU Side-letters
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Next Milestone</CardTitle>
            <Calendar className="h-3.5 w-3.5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-headline leading-tight">
              Gen-2 Transition Window
            </div>
            <div className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">
              Target: Q4 2028
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Family Health</CardTitle>
            <HeartPulse className="h-3.5 w-3.5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">84/100</div>
            <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
              High Stability Index
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Chart Card */}
          <Card className="glass-panel border-white/5 shadow-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-headline font-bold">Aggregate Wealth Trajectory</CardTitle>
                <CardDescription>Consolidated multi-jurisdictional growth performance (USD)</CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5">Performance v4.1</Badge>
            </CardHeader>
            <CardContent className="h-[450px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--foreground), 0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsla(var(--foreground), 0.4)" 
                    fontSize={12} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="hsla(var(--foreground), 0.4)" 
                    fontSize={12} 
                    tickFormatter={(v) => `$${v}M`} 
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--foreground), 0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    strokeWidth={3}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Exposure Blindspots */}
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg font-headline font-bold">Key Exposure Blindspots</CardTitle>
              </div>
              <CardDescription>Risks detected across the human and financial architecture.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blindspots.map((spot, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-amber-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold group-hover:text-amber-500 transition-colors">{spot.title}</p>
                    <Badge variant="outline" className={`text-[8px] uppercase ${spot.impact === 'High' ? 'text-amber-500 border-amber-500/20' : 'text-primary border-primary/20'}`}>
                      {spot.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{spot.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* AI Narrative Summary */}
          <Card className="glass-panel bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Synthesis Narrative</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-background/50 border border-white/5 italic text-sm leading-relaxed text-foreground opacity-90">
                "{dna?.narrativeSummary || "Your legacy DNA is being synthesized. Complete the profiling journey to unlock human-centric insights. Current baseline indicates a transition from founder-led growth to institutional governance."}"
              </div>
            </CardContent>
          </Card>

          {/* Active AI Insights */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Active AI Insights</h3>
            {aiInsights.map((insight, i) => (
              <Card key={i} className="glass-panel border-white/5 hover:border-primary/20 transition-all group overflow-hidden">
                <CardContent className="p-5 flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <insight.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{insight.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary text-[10px] font-bold uppercase tracking-widest mt-2">
                      {insight.action} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Situation Alert */}
          <Card className="glass-panel bg-red-500/5 border-red-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="h-12 w-12 text-red-500" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <CardTitle className="text-xs font-bold uppercase text-red-500 tracking-widest">Urgent Advisory</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We've detected a significant gap between G1 and G2 in terms of **Risk Tolerance** on the Singapore-held real estate portfolio.
              </p>
              <Button size="sm" className="w-full mt-4 bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30 font-bold uppercase text-[9px]">
                Initiate Alignment Protocol
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Persistent Quick Actions Bar */}
      <div className="fixed bottom-8 left-[310px] right-8 z-50">
        <div className="glass-panel border-white/10 bg-card/80 p-3 rounded-2xl flex items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Legacy Ready</span>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="bg-white/5 border-white/5 text-[10px] font-bold uppercase tracking-widest h-9" onClick={() => window.location.href = '/simulator'}>
              <Cpu className="mr-2 h-3.5 w-3.5" /> Run Simulation
            </Button>
            <Button size="sm" variant="outline" className="bg-white/5 border-white/5 text-[10px] font-bold uppercase tracking-widest h-9" onClick={() => window.location.href = '/family'}>
              <UserPlus className="mr-2 h-3.5 w-3.5" /> Invite Member
            </Button>
            <Button size="sm" variant="outline" className="bg-white/5 border-white/5 text-[10px] font-bold uppercase tracking-widest h-9">
              <FileText className="mr-2 h-3.5 w-3.5" /> Charter Draft
            </Button>
            <Button size="sm" className="shadow-lg h-9 px-6 text-[10px] font-bold uppercase tracking-widest">
              Review Alignment Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
