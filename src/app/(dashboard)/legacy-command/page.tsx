
"use client";

import { useMemo } from "react";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, ShieldCheck, UserCircle2, BrainCircuit, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LegacyCommandPage() {
  const { user } = useUser();
  const db = useFirestore();

  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  
  const highPriorityRecsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "users", user.uid, "recommendations"), 
      orderBy("priority"), // High priority first
      orderBy("createdAt", "desc"),
      limit(3)
    );
  }, [user, db]);

  const { data: recommendations } = useCollection(highPriorityRecsQuery);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">Strategic Oversight</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Legacy Command</h1>
        <p className="text-muted-foreground italic">High-level heritage governance and decision center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Principal Alignment</CardTitle>
            <HeartPulse className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline">82%</div>
            <div className="mt-4 space-y-2">
              <Progress value={82} className="h-1" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Stable Trajectory</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Generation Readiness</CardTitle>
            <UserCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline">45%</div>
            <div className="mt-4 space-y-2">
              <Progress value={45} className="h-1" />
              <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Needs Engagement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Institutional Trust Sync</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline">94%</div>
            <div className="mt-4 space-y-2">
              <Progress value={94} className="h-1" />
              <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">High Compliance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                High-Impact Opportunities
              </CardTitle>
              <CardDescription>Actionable family-level recommendations for immediate discussion.</CardDescription>
            </div>
            <Link href="/insights">
              <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest">
                View All <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations?.length ? recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group flex items-start gap-4">
                <div className={`p-2 rounded-lg ${rec.priority === 'High' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm group-hover:text-primary transition-colors">{rec.title}</p>
                    <Badge variant="outline" className="text-[8px] uppercase tracking-tighter">{rec.priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{rec.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest opacity-60">
                    <span className="flex items-center gap-1.5"><UserCircle2 className="h-3 w-3" /> {rec.targetMember}</span>
                    <span className="flex items-center gap-1.5 text-primary"><Sparkles className="h-3 w-3" /> {rec.impact}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                <Sparkles className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Run Discovery in Insights to generate action items.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <CardTitle>Human Architecture Gaps</CardTitle>
              </div>
              <CardDescription>Emotional bottlenecks identified in DNA synthesis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(dna?.familyProfile?.relationalDynamics?.keyFrictionPoints || [
                "Succession transparency between G1 and G2",
                "Risk tolerance variance",
                "Emotional ownership conflicts"
              ]).map((point: string, i: number) => (
                <div key={i} className="text-xs p-3 rounded-lg border border-white/5 bg-white/[0.02] flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {point}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
