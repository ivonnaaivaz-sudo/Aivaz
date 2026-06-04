
"use client";

import { useUser, useFirestore, useCollection } from "@/firebase";
import { useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { History, ShieldCheck, Milestone, Flag, Info, Clock, CheckCircle2 } from "lucide-react";

const MOCK_TIMELINE_EVENTS = [
  {
    id: "m-1",
    title: "G2 Educational Trust Funding",
    date: "Jan 2024",
    type: "succession",
    description: "Completed capitalization of the Singapore-based educational trust for G2 and G3 members.",
    status: "completed"
  },
  {
    id: "m-2",
    title: "Golden Visa Eligibility",
    date: "May 2025",
    type: "personal",
    description: "Residency threshold reached for EU Golden Visa status. Coordinate with legal for final filing and side-letter adjustments.",
    status: "in-progress"
  },
  {
    id: "m-3",
    title: "Aivaz Foundation Launch",
    date: "Dec 2025",
    type: "philanthropy",
    description: "Target date for the formal establishment of the primary family philanthropic vehicle.",
    status: "target"
  },
  {
    id: "m-4",
    title: "Elena's PE Payout & Sideletter",
    date: "Oct 2027",
    type: "financial",
    description: "Private equity investment payout scheduled. Review renewal of sideletter and G2 principal inclusion.",
    status: "target"
  }
];

export default function HeritageTimelinePage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const timelineQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "timeline"));
  }, [user, db]);
  
  const { data: realEvents, loading } = useCollection(timelineQuery);

  const isDemoMode = !realEvents || realEvents.length === 0;
  const timelineEvents = isDemoMode ? MOCK_TIMELINE_EVENTS : realEvents;

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">Generational Path</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Heritage Timeline</h1>
        <p className="text-muted-foreground italic">Mapping the generational milestones from current state to legacy ideal.</p>
      </div>

      {isDemoMode && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3 text-amber-500/80 text-sm">
          <Info className="h-4 w-4" />
          <span>Showing mockup Timeline. Complete the Psychological Discovery to synthesize your unique generational journey.</span>
        </div>
      )}

      <Card className="glass-panel border-white/5 relative overflow-hidden min-h-[550px]">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <History className="h-48 w-48" />
        </div>
        <CardHeader>
          <CardTitle>Generational Lifecycle Journey</CardTitle>
          <CardDescription>Human-centric milestones synthesized from your Family DNA and portfolio assets.</CardDescription>
        </CardHeader>
        <CardContent className="pt-20 pb-20 overflow-x-auto">
          <div className="min-w-[1200px] relative px-10">
            {/* The line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
            
            <div className="flex justify-between items-center relative z-10">
              {timelineEvents.map((event: any, i: number) => (
                <div key={event.id} className="flex flex-col items-center gap-4 w-60 group">
                  <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    event.status === 'completed' ? 'text-primary' : 
                    event.status === 'in-progress' ? 'text-amber-500' : 
                    'text-muted-foreground'
                  }`}>
                    {event.date}
                  </div>
                  
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                    event.status === 'completed' ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(75,163,199,0.4)]' : 
                    event.status === 'in-progress' ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' :
                    'bg-card border-white/10 group-hover:border-primary/50'
                  }`}>
                    {event.status === 'completed' && <CheckCircle2 className="h-6 w-6 text-primary" />}
                    {event.status === 'in-progress' && <Clock className="h-6 w-6 text-amber-500 animate-pulse" />}
                    {event.status === 'target' && <Flag className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />}
                  </div>

                  <div className="text-center px-4 space-y-2">
                    <p className={`text-sm font-bold leading-tight ${
                      event.status === 'completed' ? 'text-foreground' : 
                      event.status === 'in-progress' ? 'text-foreground' : 
                      'text-muted-foreground group-hover:text-foreground transition-colors'
                    }`}>
                      {event.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                    <Badge variant="outline" className="text-[8px] uppercase tracking-tighter opacity-50">
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Milestone className="h-5 w-5 text-primary" />
              Critical Path: Next 12 Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineEvents.filter(e => e.status !== 'completed').slice(0, 3).map((event: any) => (
                <div key={event.id} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    event.status === 'in-progress' ? 'bg-amber-500/10' : 'bg-primary/10'
                  }`}>
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
                        <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[9px] uppercase">Immediate Focus</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Legacy Milestone Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Succession Readiness</p>
                <p className="text-lg font-headline font-bold">Stable Trajectory</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-primary opacity-50" />
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synthesized Goals</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Global Mobility Hub",
                  "Educational Trust Alpha",
                  "Philanthropic Legacy",
                  "PE Asset Liquidity"
                ].map((goal, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg border border-white/5 bg-white/[0.01] text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {goal}
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
