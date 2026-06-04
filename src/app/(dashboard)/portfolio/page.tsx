
"use client";

import { useUser, useDoc, useCollection } from "@/firebase";
import { useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Milestone, History, ArrowUpRight, ShieldCheck, HeartPulse, UserCircle2, BrainCircuit } from "lucide-react";

export default function LegacyCommandPage() {
  const { user } = useUser();
  const { data: profile, loading: profileLoading } = useDoc(user ? `users/${user.uid}` : null);
  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  
  const timelineQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(db, "users", user.uid, "timeline"));
  }, [user]);
  
  const { data: timelineEvents, loading: timelineLoading } = useCollection(timelineQuery);

  if (profileLoading || timelineLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">Strategic Alignment</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Legacy Command</h1>
        <p className="text-muted-foreground italic">Bridging the gap between financial reality and generational intent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel group hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Legacy Alignment Score</CardTitle>
            <HeartPulse className="h-4 w-4 text-primary animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline">78%</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span>Value Sync</span>
                <span className="text-primary">+12%</span>
              </div>
              <Progress value={78} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Principal Stakeholder</CardTitle>
            <UserCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{user?.displayName || "Member"}</div>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">
              {dna?.generationalStage || profile?.role || "Principal"} • Active
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Core Legacy Goal</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-headline leading-tight">
              {dna?.legacyGoals?.[0] || "Universal Stewardship"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Personalized Strategy Active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <History className="h-48 w-48" />
        </div>
        <CardHeader>
          <CardTitle>Generational Lifecycle Timeline</CardTitle>
          <CardDescription>A human-centric narrative of your family's transition from current state to legacy ideal.</CardDescription>
        </CardHeader>
        <CardContent className="pt-10 pb-20 overflow-x-auto">
          <div className="min-w-[800px] relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
            <div className="flex justify-between items-center relative z-10">
              {timelineEvents?.length > 0 ? timelineEvents.map((event: any, i: number) => (
                <div key={event.id} className="flex flex-col items-center gap-4 w-48 group">
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${event.status === 'completed' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {event.date}
                  </div>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110 ${
                    event.status === 'completed' ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(75,163,199,0.4)]' : 
                    event.status === 'in-progress' ? 'bg-amber-500/10 border-amber-500' :
                    'bg-background border-white/10'
                  }`}>
                    {event.status === 'completed' && <ShieldCheck className="h-5 w-5 text-primary" />}
                    {event.status === 'in-progress' && <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
                  </div>
                  <div className="text-center px-4">
                    <p className={`text-sm font-bold ${event.status === 'target' ? 'text-primary italic' : ''}`}>{event.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
                  </div>
                </div>
              )) : (
                <div className="w-full text-center py-10 opacity-30 italic">Timeline generating from DNA...</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Legacy Gap Analysis</CardTitle>
            <CardDescription>Identified friction between current structures and heritage intent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dna?.frictionPoints?.map((point: string, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 group hover:border-white/10 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Identified Friction Point</span>
                  <Badge variant="outline" className="border-amber-500/50 text-amber-500">Analysis Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{point}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Heritage Narrative</CardTitle>
            </div>
            <CardDescription>Synthesized from profiling and behavioral data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {dna?.coreValues?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm italic leading-relaxed text-foreground opacity-80">
                "{dna?.narrativeSummary || "Your legacy DNA is being processed. Complete the discovery survey to unlock insights."}"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
