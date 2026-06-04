
"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, ShieldCheck, UserCircle2, BrainCircuit, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function LegacyCommandPage() {
  const { user } = useUser();
  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Critical Friction Points
            </CardTitle>
            <CardDescription>AI-diagnosed emotional bottlenecks requiring immediate focus.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dna?.frictionPoints?.map((point: string, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <p className="text-sm font-bold text-amber-500 leading-relaxed">{point}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <CardTitle>Advisor Gap Analysis</CardTitle>
            </div>
            <CardDescription>What your current banks and lawyers are overlooking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dna?.overlookedFactors?.map((factor: string, i: number) => (
              <div key={i} className="text-sm text-muted-foreground p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                {factor}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
