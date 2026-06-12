
"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  AlertTriangle,
  BrainCircuit,
  Compass,
  FileText,
  Map,
  UserCircle2,
  ChevronRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import { FamilyCalendar, type FamilyEvent } from "@/components/dashboard/FamilyCalendar";
import { cn } from "@/lib/utils";

const MOCK_EVENTS: FamilyEvent[] = [
  { id: "1", title: "Hartmann Family Council", date: "2026-06-12", eventType: "GOVERNANCE", priority: "URGENT", description: "Reviewing the €42M cash reserve deployment proposal.", memberAccess: ["Dr. Markus", "Elena", "Sophie", "Alexander"] },
  { id: "2", title: "Specialty Chem Dividend", date: "2026-06-25", eventType: "FINANCIAL", priority: "NORMAL", description: "Q2 Dividend distribution for Hartmann Specialty Chem.", memberAccess: ["All Stakeholders"] },
  { id: "3", title: "Heritage Gala Munich", date: "2026-07-15", eventType: "SOCIAL", priority: "NORMAL", description: "Annual family philanthropic event in Munich.", memberAccess: ["All Family"] },
];

export default function DashboardPage() {
  const { user } = useUser();
  const { data: dna, loading: dnaLoading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  const firstName = user?.displayName?.split(" ")[0] || "Markus";
  const role = dna?.personalProfile?.roleInFamily || "Principal Founder";

  if (dnaLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-32">
      {/* Personalized Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BrainCircuit className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Identity Verified</span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Hartmann Heritage Protocol</span>
            </div>
          </div>
          <h1 className="font-headline text-5xl font-bold tracking-tighter">
            Welcome back, <span className="text-primary">{firstName}</span>.
          </h1>
          <p className="text-xl text-muted-foreground font-headline italic max-w-2xl leading-relaxed">
            "Based on the latest Hartmann DNA synthesis, we noticed growing tension between G1 industrial stability and G3's push for a Singapore-led tech pivot."
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-2xl">
          <Activity className="h-6 w-6 text-primary animate-pulse" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Family Alignment</p>
            <p className="text-2xl font-headline font-bold text-primary">84.2%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-10">
          {/* Guided Journey: Action Hub */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Guided Journey</h2>
              </div>
              <Badge variant="outline" className="text-[8px] font-bold uppercase">3 High Priority Actions</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/chart-room" className="group">
                <Card className="glass-panel border-white/5 hover:border-primary/30 transition-all h-full bg-primary/5">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">Stress-Test Tech Exposure</h3>
                      <p className="text-xs text-muted-foreground mt-2">The portfolio has a 55% concentration risk. Simulate the €12M downside scenario in the Chart Room.</p>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest gap-2 pt-2">
                      Launch Simulation <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/vault" className="group">
                <Card className="glass-panel border-white/5 hover:border-secondary/30 transition-all h-full bg-secondary/5">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-2 w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">Draft Governance Charter</h3>
                      <p className="text-xs text-muted-foreground mt-2">Institutionalize Hartmann values to resolve authority rifts between G1 and G3.</p>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-secondary uppercase tracking-widest gap-2 pt-2">
                      Enter Strongroom <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          <FamilyCalendar events={MOCK_EVENTS} />
        </div>

        {/* Sidebar Column: For You / Personal Intelligence */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="glass-panel border-white/10 bg-black/40">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Intelligence For You</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 group hover:border-primary/30 transition-all cursor-pointer">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Relational Alert</p>
                <p className="text-sm font-medium leading-relaxed">Alexander's aggressive growth mindset currently clashes with your preservation mandate.</p>
                <Link href="/wardroom" className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 group-hover:text-primary pt-2">
                  Initiate Alignment Workshop <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 group hover:border-primary/30 transition-all cursor-pointer">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Capital Efficiency</p>
                <p className="text-sm font-medium leading-relaxed">€42M Cash idle. Aivaz recommends shifting €3M to Fixed Income to secure G2 liquidity.</p>
                <Link href="/bridge" className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 group-hover:text-primary pt-2">
                  Execute Rebalancing <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 group hover:border-primary/30 transition-all cursor-pointer">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Heritage Opportunity</p>
                <p className="text-sm font-medium leading-relaxed">Elena has requested a review of the Philanthropic mission for G3 inclusion.</p>
                <Link href="/vault" className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 group-hover:text-primary pt-2">
                  Review Heritage Bedrock <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Hartmann Aggregate Pulse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Total Hartmann AUM</p>
                  <p className="text-xl font-headline font-bold">€380.0M</p>
                </div>
                <Badge variant="outline" className="text-[8px] bg-white/5">Aggregated</Badge>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] text-amber-500 uppercase font-bold tracking-widest">Idle Capital Risk</p>
                  <p className="text-xl font-headline font-bold text-amber-500">€42.0M</p>
                </div>
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[8px] font-bold uppercase">Action Required</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Link href="/academy" className="block group">
        <Card className="glass-panel border-primary/20 bg-primary/5 p-8 flex items-center justify-between transition-all hover:bg-primary/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Strategic Insight</span>
            </div>
            <h3 className="text-xl font-headline font-bold">The Hartmann Governance Charter</h3>
            <p className="text-sm text-muted-foreground">Transitioning from industrial era control to a global, value-based institution.</p>
          </div>
          <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 shrink-0">
            <ArrowRight className="h-6 w-6" />
          </div>
        </Card>
      </Link>
    </div>
  );
}
