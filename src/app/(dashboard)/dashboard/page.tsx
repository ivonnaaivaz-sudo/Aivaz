
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
  UserCircle2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

  const firstName = user?.displayName?.split(" ")[0] || "Principal";
  const role = dna?.personalProfile?.roleInFamily || "Hartmann Stakeholder";

  if (dnaLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32">
      {/* Personalized Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BrainCircuit className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Identity Verified</span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Heritage Protocol 4.0</span>
            </div>
          </div>
          <h1 className="font-headline text-5xl font-bold tracking-tighter">
            Welcome back, <span className="text-primary">{firstName}</span>.
          </h1>
          <p className="text-muted-foreground font-headline italic">
            "Based on your Family DNA, we noticed growing tension around geographic relocation vs. industrial stability."
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Family Alignment</p>
            <p className="text-xl font-headline font-bold text-primary">84.2%</p>
          </div>
        </div>
      </div>

      {/* Guided Journey: Next Actions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Guided Journey</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/chart-room" className="group">
            <Card className="glass-panel border-white/5 hover:border-primary/30 transition-all h-full bg-primary/5">
              <CardContent className="p-6 space-y-4">
                <div className="p-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Review Exposure Blindspots</h3>
                  <p className="text-xs text-muted-foreground mt-2">Analyze the €380M portfolio's 55% concentration in German Real Estate.</p>
                </div>
                <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest gap-2 pt-2">
                  Execute Analysis <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/simulator" className="group">
            <Card className="glass-panel border-white/5 hover:border-secondary/30 transition-all h-full">
              <CardContent className="p-6 space-y-4">
                <div className="p-2 w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Map className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Run Relocation Scenario</h3>
                  <p className="text-xs text-muted-foreground mt-2">Model the financial and social impact of shifting operations to Singapore.</p>
                </div>
                <div className="flex items-center text-[10px] font-bold text-secondary uppercase tracking-widest gap-2 pt-2">
                  Open Matrix <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/vault" className="group">
            <Card className="glass-panel border-white/5 hover:border-accent/30 transition-all h-full">
              <CardContent className="p-6 space-y-4">
                <div className="p-2 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Draft Family Mission</h3>
                  <p className="text-xs text-muted-foreground mt-2">Institutionalize the Hartmann values to reduce G1 vs G3 friction.</p>
                </div>
                <div className="flex items-center text-[10px] font-bold text-accent uppercase tracking-widest gap-2 pt-2">
                  Enter Strongroom <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { label: "Total Hartmann AUM", value: "€380M", change: "Aggregated", icon: TrendingUp, color: "text-primary" },
          { label: "Idle Capital", value: "€42.0M", change: "ALERT", icon: AlertTriangle, color: "text-amber-500" },
          { label: "RE Exposure", value: "55%", change: "Concentrated", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Succession Sync", value: "42%", change: "Needs Action", icon: Activity, color: "text-amber-500" },
          { label: "Compliance Grade", value: "A+", change: "Stable", icon: ShieldCheck, color: "text-emerald-500" }
        ].map((stat, i) => (
          <Card key={i} className="glass-panel border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stat.value}</div>
              <div className={cn("text-[9px] font-bold mt-1 uppercase tracking-tighter", stat.color, "opacity-80")}>{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FamilyCalendar events={MOCK_EVENTS} />

      <Link href="/academy" className="block group">
        <Card className="glass-panel border-primary/20 bg-primary/5 p-8 flex items-center justify-between transition-all hover:bg-primary/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Strategic Insight</span>
            </div>
            <h3 className="text-xl font-headline font-bold">The Hartmann Governance Charter</h3>
            <p className="text-sm text-muted-foreground">Transitioning from Dr. Markus's industrial control to a global, value-based institution.</p>
          </div>
          <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 shrink-0">
            <ArrowRight className="h-6 w-6" />
          </div>
        </Card>
      </Link>
    </div>
  );
}
