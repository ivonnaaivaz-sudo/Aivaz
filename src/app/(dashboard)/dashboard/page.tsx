
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
  Zap,
  MessageCircle,
  Heart,
  Anchor
} from "lucide-react";
import Link from "next/link";
import { FamilyCalendar, type FamilyEvent } from "@/components/dashboard/FamilyCalendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const MOCK_EVENTS: FamilyEvent[] = [
  { id: "1", title: "Hartmann Family Council", date: "2026-06-12", eventType: "GOVERNANCE", priority: "URGENT", description: "Reviewing the €42M cash reserve deployment proposal.", memberAccess: ["Dr. Markus", "Elena", "Sophie", "Alexander"] },
  { id: "2", title: "Specialty Chem Dividend", date: "2026-06-25", eventType: "FINANCIAL", priority: "NORMAL", description: "Q2 Dividend distribution for Hartmann Specialty Chem.", memberAccess: ["All Stakeholders"] },
  { id: "3", title: "Heritage Gala Munich", date: "2026-07-15", eventType: "SOCIAL", priority: "NORMAL", description: "Annual family philanthropic event in Munich.", memberAccess: ["All Family"] },
];

export default function DashboardPage() {
  const { user } = useUser();
  const { data: dna, loading: dnaLoading } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  const [mindText, setMindText] = useState("");

  const firstName = user?.displayName?.split(" ")[0] || "Markus";
  
  if (dnaLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32">
      {/* Personalized Welcome Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(75,163,199,0.1)]">
              <Anchor className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Identity Secure</span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Hartmann Heritage Protocol Active</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="font-headline text-6xl font-bold tracking-tighter text-slate-900">
              Welcome back, <span className="text-primary">{firstName}</span>.
            </h1>
            <p className="text-xl text-muted-foreground font-headline italic max-w-2xl leading-relaxed">
              "Hope you had a great time in the Alps. While you were away, Aivaz synthesized new alignment data between your industrial core and G3's growth ambitions."
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 px-8 py-6 rounded-3xl bg-white shadow-xl border border-primary/5">
          <Activity className="h-8 w-8 text-primary animate-pulse mb-1" />
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Family Alignment</p>
            <p className="text-3xl font-headline font-bold text-slate-900 tracking-tighter">84.2%</p>
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
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Hartmann Narrative</h2>
            </div>
            <Card className="border-none shadow-sm bg-primary/5 overflow-hidden rounded-3xl">
              <CardContent className="p-10 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <BrainCircuit className="h-32 w-32 text-primary" />
                </div>
                <div className="space-y-6 relative z-10">
                  <p className="text-2xl font-headline font-medium leading-relaxed italic text-slate-800">
                    "Built on industrial precision in Munich, the Hartmann legacy is now entering its most complex phase: the transition from G1 founder-led control to G3 institutional governance."
                  </p>
                  <div className="flex gap-4">
                    <Badge variant="outline" className="bg-white/50 border-primary/20 text-[10px] font-bold uppercase tracking-tighter text-primary">Core Value: Precision</Badge>
                    <Badge variant="outline" className="bg-white/50 border-primary/20 text-[10px] font-bold uppercase tracking-tighter text-primary">Axis: Munich-Singapore</Badge>
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
              <Badge variant="secondary" className="text-[9px] font-bold uppercase py-1 px-3 bg-white shadow-sm border-slate-100">3 High Priority Actions</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/chart-room" className="group">
                <Card className="border-none shadow-md hover:shadow-xl hover:ring-2 hover:ring-primary/20 transition-all h-full bg-white rounded-3xl overflow-hidden">
                  <CardContent className="p-8 space-y-5">
                    <div className="p-3 w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AlertTriangle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl leading-tight text-slate-900">Stress-Test G3 Tech Exposure</h3>
                      <p className="text-sm text-slate-500 mt-3 leading-relaxed">The aggregated portfolio has a 55% concentration risk. Simulate the €12M downside scenario to protect core legacy capital.</p>
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
                      <h3 className="font-bold text-xl leading-tight text-slate-900">Formalize the Charter</h3>
                      <p className="text-sm text-slate-500 mt-3 leading-relaxed">Institutionalize Hartmann values to resolve authority rifts between G1 industrial norms and G3 impact preferences.</p>
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
          
          {/* Contextual Intelligence Sidebar */}
          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="border-b bg-slate-50/50 p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">Intelligence For You</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 group hover:bg-primary/10 transition-all cursor-pointer">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Relational Alert</p>
                <p className="text-sm font-medium leading-relaxed text-slate-700">Alexander's aggressive tech-growth mindset clashes with your preservation mandate. 12% alignment gap detected.</p>
                <Link href="/wardroom" className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 group-hover:text-primary pt-3 transition-colors">
                  Initiate Alignment Workshop <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10 group hover:bg-amber-500/5 transition-all cursor-pointer">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Capital Efficiency</p>
                <p className="text-sm font-medium leading-relaxed text-slate-700">€42M Cash idle in the MS Trust. Aivaz recommends a €3.5M shift to Fixed Income to secure G2 liquidity for Elena.</p>
                <Link href="/bridge" className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 group-hover:text-primary pt-3 transition-colors">
                  Execute Rebalancing <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 group hover:bg-emerald-500/5 transition-all cursor-pointer">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Heritage Opportunity</p>
                <p className="text-sm font-medium leading-relaxed text-slate-700">Elena has requested a review of the Munich Philanthropy mission to include Sophie's ESG framework.</p>
                <Link href="/vault" className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 group-hover:text-primary pt-3 transition-colors">
                  Review Bedrock Values <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Hartmann Aggregate Pulse Card */}
          <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total Heritage Pulse</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Hartmann Wealth</p>
                  <p className="text-3xl font-headline font-bold text-white tracking-tighter">€380.0M</p>
                </div>
                <Badge variant="outline" className="text-[8px] border-white/10 text-slate-400 font-bold uppercase tracking-widest">Aggregated</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-amber-500 uppercase font-bold tracking-widest mb-1">Idle Capital Drag</p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-headline font-bold text-amber-500">€42.0M</p>
                  <div className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase border border-amber-500/20">Action Required</div>
                </div>
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

      {/* The Captain Prompt: Anything on your mind? */}
      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden group">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 items-center">
            <div className="md:col-span-1 bg-primary/5 p-12 flex flex-col items-center justify-center border-r border-slate-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white shadow-lg border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                   <img src="https://firebasestorage.googleapis.com/v0/b/studio-9632545142-53067.firebasestorage.app/o/Branding%2FIMG_1687.png?alt=media" alt="Turtle Captain" className="w-16 h-16 object-contain" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <p className="mt-4 font-headline font-bold text-slate-900">Captain (AI)</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Heritage Strategist</p>
            </div>
            <div className="md:col-span-3 p-12 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-bold text-slate-900">Anything on your mind today, Markus?</h3>
                <p className="text-muted-foreground text-sm">Tell me about any changes in family dynamics, new legacy goals, or concerns from the Alps trip. I'll factor them into your next strategic synthesis.</p>
              </div>
              <div className="flex gap-4 items-center bg-slate-50 border border-slate-100 p-2 pl-6 rounded-2xl focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                <MessageCircle className="h-5 w-5 text-slate-300" />
                <Input 
                  placeholder="Share a thought, a worry, or a new milestone..." 
                  className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium h-12"
                  value={mindText}
                  onChange={(e) => setMindText(e.target.value)}
                />
                <Button className="rounded-xl px-8 h-12 shadow-xl transition-all group-hover:scale-[1.02]">
                  Send to Aivaz
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
