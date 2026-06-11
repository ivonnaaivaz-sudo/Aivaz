"use client";

import { useUser, useDoc, useFirestore } from "@/firebase";
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
  Sparkles
} from "lucide-react";

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
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
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

      {/* Narrative Summary */}
      <Card className="glass-panel border-white/5 relative overflow-hidden">
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
              <a href="/house">Inside The House</a>
            </Button>
            <Button className="shadow-xl" asChild>
              <a href="/insights">Review All Insights</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
