
"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  AlertTriangle,
  BrainCircuit,
  Compass,
  FileText,
  Zap,
  Heart,
  Anchor,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { FamilyCalendar, type FamilyEvent } from "@/components/dashboard/FamilyCalendar";
import { Button } from "@/components/ui/button";

const MOCK_EVENTS: FamilyEvent[] = [
  { id: "1", title: "Hartmann Family Council", date: "2026-06-12", eventType: "GOVERNANCE", priority: "URGENT", description: "Reviewing the €42M cash reserve deployment proposal.", memberAccess: ["Dr. Markus", "Elena", "Sophie", "Alexander"] },
  { id: "2", title: "Specialty Chem Dividend", date: "2026-06-25", eventType: "FINANCIAL", priority: "NORMAL", description: "Q2 Dividend distribution for Hartmann Specialty Chem.", memberAccess: ["All Stakeholders"] },
  { id: "3", title: "Heritage Gala Munich", date: "2026-07-15", eventType: "SOCIAL", priority: "NORMAL", description: "Annual family philanthropic event in Munich.", memberAccess: ["All Family"] },
];

export default function DashboardPage() {
  const { user } = useUser();
  const { data: dna, loading: dnaLoading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  const firstName = user?.displayName?.split(" ")[0] || "Markus";
  
  if (dnaLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32">
      {/* Professional Command Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(75,163,199,0.1)]">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Governance Active</span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Hartmann Heritage Protocol • Level 4</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="font-headline text-5xl font-bold tracking-tighter text-slate-900">
              Welcome, <span className="text-primary">{firstName}</span>.
            </h1>
            <p className="text-lg text-muted-foreground font-headline max-w-2xl leading-relaxed">
              The Aivaz engine has synthesized your latest portfolio alignment data. Governance remains stable at 84.2%.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="px-6 py-4 rounded-2xl bg-white shadow-sm border border-slate-100 text-center">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">AUM Sync</p>
            <p className="text-2xl font-headline font-bold text-slate-900 tracking-tighter">€380M</p>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-white shadow-sm border border-slate-100 text-center">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Alignment</p>
            <p className="text-2xl font-headline font-bold text-emerald-500 tracking-tighter">84.2%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Strategic Column */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Family Narrative Layer */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Heart className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Legacy Status Narrative</h2>
            </div>
            <Card className="border-none shadow-sm bg-primary/5 overflow-hidden rounded-3xl">
              <CardContent className="p-10 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <BrainCircuit className="h-32 w-32 text-primary" />
                </div>
                <div className="space-y-6 relative z-10">
                  <p className="text-2xl font-headline font-medium leading-relaxed italic text-slate-800">
                    "The Hartmann legacy is currently navigating a pivotal transition from G1 patriarch-led control to G3 institutional governance. Strategic tension is concentrated in the Munich-Singapore axis."
                  </p>
                  <div className="flex gap-4">
                    <Badge variant="outline" className="bg-white/50 border-primary/20 text-[10px] font-bold uppercase tracking-tighter text-primary">Core Value: Industrial Precision</Badge>
                    <Badge variant="outline" className="bg-white/50 border-primary/20 text-[10px] font-bold uppercase tracking-tighter text-primary">Next Milestone: Charter Formalization</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Action Hub */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Priority Strategic Tracks</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/chart-room" className="group">
                <Card className="border-none shadow-md hover:shadow-xl hover:ring-2 hover:ring-primary/20 transition-all h-full bg-white rounded-3xl overflow-hidden">
                  <CardContent className="p-8 space-y-5">
                    <div className="p-3 w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AlertTriangle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl leading-tight text-slate-900">Stress-Test G3 Exposure</h3>
                      <p className="text-sm text-slate-500 mt-3 leading-relaxed">Simulate a €12M downside scenario on Alexander's tech-growth holdings to protect core legacy capital.</p>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Enter Chart Room <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/vault" className="group">
                <Card className="border-none shadow-md hover:shadow-xl hover:ring-2 hover:ring-blue-600/20 transition-all h-full bg-white rounded-3xl overflow-hidden">
                  <CardContent className="p-8 space-y-5">
                    <div className="p-3 w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl leading-tight text-slate-900">Governance Charter</h3>
                      <p className="text-sm text-slate-500 mt-3 leading-relaxed">Formalize Hartmann industrial norms to resolve authority rifts between generations.</p>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-blue-600 uppercase tracking-widest gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Strongroom <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          <FamilyCalendar events={MOCK_EVENTS} />
        </div>

        {/* Sidebar Intelligence Column */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Intelligence Sidebar */}
          <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
            <CardHeader className="border-b bg-slate-50/50 p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">Aivaz Intelligence</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Relational Alert</p>
                <p className="text-sm font-medium leading-relaxed text-slate-700">12% Alignment gap detected: Alexander's growth mindset vs your preservation mandate.</p>
                <Link href="/wardroom" className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 hover:text-primary pt-3 transition-colors">
                  Initiate Alignment Workshop <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Capital Efficiency</p>
                <p className="text-sm font-medium leading-relaxed text-slate-700">€42M Cash idle in the MS Trust. Opportunity cost of €1.8M/year detected.</p>
                <Link href="/bridge" className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 hover:text-primary pt-3 transition-colors">
                  Execute Rebalancing <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Aggregate Pulse */}
          <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total Heritage Pulse</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Family Wealth</p>
                  <p className="text-3xl font-headline font-bold text-white tracking-tighter">€380.0M</p>
                </div>
                <Badge variant="outline" className="text-[8px] border-white/10 text-slate-400 font-bold uppercase tracking-widest">Aggregated</Badge>
              </div>
              <div className="pt-2">
                <Link href="/bridge">
                  <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 text-[10px] font-bold uppercase tracking-widest rounded-xl h-11">
                    Manage Portfolio Axis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
