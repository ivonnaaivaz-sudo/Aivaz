"use client";

import { useUser, useDoc, useCollection, useFirestore } from "@/firebase";
import { useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShieldCheck, 
  ChevronRight,
  History,
  CheckCircle2,
  Clock,
  Flag,
  Compass,
  AlertTriangle,
  FileText,
  Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FamilyCalendar, type FamilyEvent } from "@/components/dashboard/FamilyCalendar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const MOCK_EVENTS: FamilyEvent[] = [
  { id: "1", title: "Hartmann Family Council", date: "2026-06-12", eventType: "GOVERNANCE", priority: "URGENT", description: "Reviewing the €42M cash reserve deployment proposal.", memberAccess: ["Dr. Markus", "Elena", "Sophie", "Alexander"] },
  { id: "2", title: "Specialty Chem Dividend", date: "2026-06-25", eventType: "FINANCIAL", priority: "NORMAL", description: "Q2 Dividend distribution for Hartmann Specialty Chem.", memberAccess: ["All Stakeholders"] },
  { id: "3", title: "Heritage Gala Munich", date: "2026-07-15", eventType: "SOCIAL", priority: "NORMAL", description: "Annual family philanthropic event in Munich.", memberAccess: ["All Family"] },
];

const HARTMANN_TIMELINE = [
  { id: "h-1", title: "Foundation", date: "1992", type: "financial", status: "completed" },
  { id: "h-2", title: "Singapore Pivot", date: "2008", type: "vision", status: "completed" },
  { id: "h-3", title: "G2 Trust Capitalization", date: "2024", type: "succession", status: "completed" },
  { id: "h-4", title: "Institutional Governance", date: "2026", type: "succession", status: "in-progress" },
  { id: "h-5", title: "Family Foundation", date: "2027", type: "philanthropy", status: "target" }
];

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: dna, loading: dnaLoading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  const timelineQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "timeline"), orderBy("date", "asc"));
  }, [user, db]);
  
  const { data: realEvents } = useCollection(timelineQuery);
  const timelineEvents = realEvents && realEvents.length > 0 ? realEvents : HARTMANN_TIMELINE;

  const firstName = user?.displayName?.split(" ")[0] || "Markus";
  
  if (dnaLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-lg min-h-[340px] flex items-end">
        <Image 
          src="https://firebasestorage.googleapis.com/v0/b/studio-9632545142-53067.firebasestorage.app/o/Branding%2FIMG_1935.png?alt=media"
          alt="Family Heritage"
          fill
          className="object-cover"
          priority
          data-ai-hint="heritage family"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        
        <div className="relative z-10 w-full p-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">Identity Secure</span>
                <span className="text-[9px] text-white/60 uppercase font-bold tracking-widest">Hartmann Heritage Protocol</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="font-headline text-5xl font-bold tracking-tighter text-white">
                Welcome back, {firstName}
              </h1>
              <p className="text-lg text-white/80 font-headline max-w-2xl leading-relaxed">
                The Aivaz engine has synthesized your latest portfolio alignment data. Governance remains stable at 84.2%.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <p className="text-[9px] text-white/70 uppercase font-bold tracking-widest mb-1">AUM Sync</p>
              <p className="text-2xl font-headline font-bold text-white tracking-tighter">€380M</p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <p className="text-[9px] text-white/70 uppercase font-bold tracking-widest mb-1">Alignment</p>
              <p className="text-2xl font-headline font-bold text-emerald-400 tracking-tighter">84.2%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Heritage Journey Timeline</h2>
              </div>
              <Link href="/heritage-timeline">
                <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest">Full Journey <ChevronRight className="ml-1 h-3 w-3" /></Button>
              </Link>
            </div>
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-3xl">
              <CardContent className="p-8">
                <ScrollArea className="w-full whitespace-nowrap pb-4">
                  <div className="flex gap-6">
                    {timelineEvents.map((event: any, i: number) => (
                      <div key={i} className="flex flex-col gap-3 min-w-[180px] group">
                        <div className={cn(
                          "text-[9px] font-bold uppercase tracking-widest",
                          event.status === 'completed' ? 'text-primary' : event.status === 'in-progress' ? 'text-amber-500' : 'text-slate-400'
                        )}>
                          {event.date}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all group-hover:scale-110",
                            event.status === 'completed' ? 'bg-primary/5 border-primary/20 text-primary' : 
                            event.status === 'in-progress' ? 'bg-amber-50 border-amber-200 text-amber-500' : 
                            'bg-slate-50 border-slate-100 text-slate-300'
                          )}>
                            {event.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : 
                             event.status === 'in-progress' ? <Clock className="h-4 w-4 animate-pulse" /> : 
                             <Flag className="h-4 w-4" />}
                          </div>
                          <div className="h-px w-full bg-slate-100 last:hidden" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">{event.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">{event.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </section>

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

        <div className="lg:col-span-4 space-y-10">
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
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Capital Efficiency</p>
                <p className="text-sm font-medium leading-relaxed text-slate-700">€42M Cash idle in the MS Trust. Opportunity cost of €1.8M/year detected.</p>
              </div>
            </CardContent>
          </Card>

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
