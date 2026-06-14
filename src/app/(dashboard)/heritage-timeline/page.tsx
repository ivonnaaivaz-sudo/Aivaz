"use client";

import { useUser, useFirestore, useCollection } from "@/firebase";
import { useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Milestone, Flag, Clock, CheckCircle2, Landmark, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const HARTMANN_TIMELINE = [
  {
    id: "h-1",
    title: "Hartmann Specialty Chem Foundation",
    date: "1992",
    type: "financial",
    description: "Dr. Markus Hartmann establishes the core industrial entity in Munich, laying the foundation for the family's wealth.",
    status: "completed"
  },
  {
    id: "h-2",
    title: "Singapore Expansion Pivot",
    date: "2008",
    type: "vision",
    description: "Successful entry into Asian real estate markets, diversifying the industrial base into multi-jurisdictional holdings.",
    status: "completed"
  },
  {
    id: "h-3",
    title: "G2 Educational Trust Funding",
    date: "Jan 2024",
    type: "succession",
    description: "Formal capitalization of the Singapore-based educational trust for G2 and G3 members. Ring-fencing capital for growth.",
    status: "completed"
  },
  {
    id: "h-4",
    title: "Institutional Governance Pivot",
    date: "Jun 2026",
    type: "succession",
    description: "Current Phase: Moving from founder-led control to a formal Family Council governance structure.",
    status: "in-progress"
  },
  {
    id: "h-5",
    title: "Family Foundation Launch",
    date: "Dec 2026",
    type: "philanthropy",
    description: "Formal establishment of the primary Hartmann philanthropic vehicle, aligned with Elena's heritage values.",
    status: "target"
  }
];

export default function HeritageTimelinePage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const timelineQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "timeline"), orderBy("date", "asc"));
  }, [user, db]);
  
  const { data: realEvents, loading } = useCollection(timelineQuery);

  const isDemoMode = !realEvents || realEvents.length === 0;
  const timelineEvents = isDemoMode ? HARTMANN_TIMELINE : realEvents;

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">The Hartmann Story</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Heritage Journey</h1>
        <p className="text-muted-foreground italic">Mapping the Hartmann legacy from 1992 industrial roots to 2026 institutional stability.</p>
      </div>

      <Card className="glass-panel border-white/5 relative overflow-hidden min-h-[550px] bg-black/40">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <History className="h-64 w-64" />
        </div>
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-lg">Generational Lifecycle Matrix</CardTitle>
          <CardDescription>Synthesized milestones from the Hartmann Heritage Repository.</CardDescription>
        </CardHeader>
        <CardContent className="pt-24 pb-24 overflow-x-auto">
          <div className="min-w-[1400px] relative px-10">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2" />
            
            <div className="flex justify-between items-center relative z-10">
              {timelineEvents.map((event: any) => (
                <div key={event.id} className="flex flex-col items-center gap-4 w-72 group">
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.25em] transition-colors",
                    event.status === 'completed' ? 'text-primary' : 
                    event.status === 'in-progress' ? 'text-amber-500' : 
                    'text-muted-foreground'
                  )}>
                    {event.date}
                  </div>
                  
                  <div className={cn(
                    "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-700 group-hover:scale-110",
                    event.status === 'completed' ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(75,163,199,0.3)]' : 
                    event.status === 'in-progress' ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]' :
                    'bg-card border-white/10 group-hover:border-primary/50'
                  )}>
                    {event.status === 'completed' && <CheckCircle2 className="h-7 w-7 text-primary" />}
                    {event.status === 'in-progress' && <Clock className="h-7 w-7 text-amber-500 animate-pulse" />}
                    {event.status === 'target' && <Flag className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />}
                  </div>

                  <div className="text-center px-4 space-y-2">
                    <p className={cn(
                      "text-sm font-bold leading-tight group-hover:text-primary transition-colors",
                      event.status === 'completed' ? 'text-foreground' : 
                      event.status === 'in-progress' ? 'text-foreground' : 
                      'text-muted-foreground'
                    )}>
                      {event.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 line-clamp-3 leading-relaxed font-medium">
                      {event.description}
                    </p>
                    <div className="pt-2">
                      <Badge variant="outline" className="text-[8px] uppercase tracking-tighter opacity-50 px-2 py-0 border-white/10">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-panel border-white/10 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Milestone className="h-5 w-5 text-primary" />
              Strategic Path: Next 12 Months
            </CardTitle>
            <CardDescription>High-priority milestones required for institutional stability.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {timelineEvents.filter((e: any) => e.status !== 'completed').slice(0, 3).map((event: any) => (
              <div key={event.id} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                  event.status === 'in-progress' ? 'bg-amber-500/10' : 'bg-primary/10'
                )}>
                  {event.status === 'in-progress' ? <Clock className="h-6 w-6 text-amber-500" /> : <Flag className="h-6 w-6 text-primary" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm group-hover:text-primary transition-colors">{event.title}</p>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{event.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="outline" className="bg-white/5 text-[9px] uppercase tracking-tighter">{event.type}</Badge>
                    {event.status === 'in-progress' && (
                      <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[9px] uppercase font-bold">Priority Target</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel bg-black/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Legacy Milestone Aggregator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Succession Grade</p>
                <p className="text-2xl font-headline font-bold">Institutional Pivot Phase</p>
              </div>
              <Landmark className="h-10 w-10 text-primary opacity-30" />
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Strategic Objectives</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Munich-Singapore Axis", icon: Globe },
                  { label: "G2 Trust Liquidity", icon: Landmark },
                  { label: "Charter Formalization", icon: Milestone }
                ].map((goal, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.01] text-xs font-bold group hover:border-primary/30 transition-all">
                    <goal.icon className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                    {goal.label}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
