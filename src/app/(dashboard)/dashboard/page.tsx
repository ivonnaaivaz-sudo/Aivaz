"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowUpRight, 
  Activity,
  Globe,
  Calendar,
  HeartPulse,
  ChevronDown,
  RefreshCw,
  Lock,
  BrainCircuit,
  Sparkles,
  Radio,
  PlayCircle,
  Clock,
  Zap,
  UserPlus,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const { data: dna, loading: dnaLoading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  if (dnaLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const aiSummary = dna?.personalProfile?.aiSummary || "Aivaz is synthesizing your family's global footprint and wealth dynamics. Complete the psychological discovery for a deeper legacy narrative.";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32">
      {/* Global Header / Top-Bar */}
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
                    {dna?.familyProfile?.familyName || "Aivaz Family"} <ChevronDown className="h-3 w-3" />
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
              All 12 Entities Synced
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
              3 Members Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Last Updated</p>
            <p className="text-xs font-medium flex items-center gap-2 justify-end cursor-pointer group">
              Today, 09:42 AM <RefreshCw className="h-3 w-3 text-primary group-hover:rotate-180 transition-transform duration-500" />
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 py-1.5 px-3 rounded-full">
            <Lock className="h-3 w-3" />
            Privacy-First Mode Active
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground italic text-sm">Consolidated family net worth and strategic legacy alignment.</p>
      </div>

      {/* Executive Overview Row - 5 Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card className="glass-panel border-white/5">
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

        <Card className="glass-panel border-white/5">
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

        <Card className="glass-panel border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Geopolitical Risk</CardTitle>
            <Globe className="h-3.5 w-3.5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline text-amber-500">Moderate</div>
            <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
              Reviewing EU Treaties
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Next Milestone</CardTitle>
            <Calendar className="h-3.5 w-3.5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-headline leading-tight">
              Gen-2 Transition
            </div>
            <div className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">
              Target Window: 2028
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Overall Health</CardTitle>
            <HeartPulse className="h-3.5 w-3.5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline text-emerald-500">84/100</div>
            <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
              Stable Stability Index
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Narrative Synthesis */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="glass-panel border-white/5 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <BrainCircuit className="h-48 w-48" />
            </div>
            <CardContent className="p-12 relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-2xl font-headline font-bold">Aivaz Narrative Synthesis</h3>
              </div>
              <p className="text-xl text-foreground/90 italic font-headline leading-relaxed max-w-4xl">
                "{aiSummary}"
              </p>
              <div className="pt-4 flex gap-4">
                <Button variant="outline" className="bg-white/5 border-white/10" asChild>
                  <Link href="/house">Inside The House</Link>
                </Button>
                <Button className="shadow-xl" asChild>
                  <Link href="/insights">Review All Insights</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Principal Briefing Radio & Daily Snippets */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-panel bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Audio Briefing</CardTitle>
                <Radio className="h-4 w-4 text-primary animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20 group cursor-pointer hover:bg-primary/20 transition-all">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Q4 Strategic Summary</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Aivaz Synthetic Voice • 4:20</p>
                </div>
              </div>
              <p className="text-[10px] text-center text-muted-foreground/60 uppercase font-bold tracking-widest italic">
                Daily briefing updated 2h ago
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Daily Snippets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Zap, label: "Market Intelligence", text: "Tech supply chain volatility up 12%. Reviewing liquidity bridge." },
                { icon: Clock, label: "Heritage Milestone", text: "Marcus (G2) scheduled for trust governance training in 4 days." },
                { icon: ShieldCheck, label: "Security Status", text: "All G1 digital vaults synchronized with biometric overrides." }
              ].map((snippet, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                  <snippet.icon className="h-3.5 w-3.5 text-primary mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{snippet.label}</p>
                    <p className="text-xs text-muted-foreground leading-tight mt-1">{snippet.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Persistent Quick Actions Bar */}
      <div className="fixed bottom-0 left-[280px] right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-white/5 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Legacy Ready Actions</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest" asChild>
              <Link href="/simulator">
                <BrainCircuit className="mr-2 h-3.5 w-3.5" /> Run New Simulation
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest" asChild>
              <Link href="/family">
                <UserPlus className="mr-2 h-3.5 w-3.5" /> Invite Family
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest">
              <FileText className="mr-2 h-3.5 w-3.5" /> Generate Charter
            </Button>
            <Button size="sm" className="shadow-lg text-[10px] font-bold uppercase tracking-widest" asChild>
              <Link href="/insights">
                <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Review Alignment Report
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
