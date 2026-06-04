
"use client";

import { useUser, useCollection } from "@/firebase";
import { useMemo } from "react";
import { collection, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { History, ShieldCheck, Milestone, Flag } from "lucide-react";

export default function HeritageTimelinePage() {
  const { user } = useUser();
  
  const timelineQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(useFirestore(), "users", user.uid, "timeline"));
  }, [user]);
  
  const { data: timelineEvents, loading } = useCollection(timelineQuery);

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

      <Card className="glass-panel border-white/5 relative overflow-hidden min-h-[500px]">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <History className="h-48 w-48" />
        </div>
        <CardHeader>
          <CardTitle>Generational Lifecycle Journey</CardTitle>
          <CardDescription>Human-centric milestones synthesized from your Family DNA.</CardDescription>
        </CardHeader>
        <CardContent className="pt-20 pb-20 overflow-x-auto">
          <div className="min-w-[1000px] relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
            <div className="flex justify-between items-center relative z-10">
              {timelineEvents?.length > 0 ? timelineEvents.map((event: any, i: number) => (
                <div key={event.id} className="flex flex-col items-center gap-4 w-48 group">
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${event.status === 'completed' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {event.date}
                  </div>
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110 ${
                    event.status === 'completed' ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(75,163,199,0.4)]' : 
                    event.status === 'in-progress' ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                    'bg-background border-white/10'
                  }`}>
                    {event.status === 'completed' && <ShieldCheck className="h-5 w-5 text-primary" />}
                    {event.status === 'in-progress' && <Milestone className="h-5 w-5 text-amber-500 animate-pulse" />}
                    {event.status === 'target' && <Flag className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="text-center px-4">
                    <p className={`text-sm font-bold ${event.status === 'target' ? 'text-primary' : ''}`}>{event.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
                  </div>
                </div>
              )) : (
                <div className="w-full text-center py-20 opacity-30 italic">No timeline events synthesized yet.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Critical Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineEvents?.filter(e => e.status !== 'completed').slice(0, 3).map((event: any) => (
                <div key={event.id} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Milestone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
