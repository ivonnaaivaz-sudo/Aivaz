"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BrainCircuit, 
  Fingerprint, 
  Globe, 
  History, 
  Heart, 
  ShieldAlert, 
  User, 
  Users, 
  Landmark, 
  Zap, 
  BookOpen,
  Anchor,
  Compass,
  Link2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function FamilyDNAPage() {
  const { user } = useUser();
  const { data: dna, loading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto p-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-96 md:col-span-1 rounded-2xl" />
          <Skeleton className="h-96 md:col-span-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!dna) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Fingerprint className="h-12 w-12 text-muted-foreground opacity-20" />
        <h2 className="text-xl font-headline font-bold">DNA Not Synthesized</h2>
        <p className="text-muted-foreground">Complete the profiling journey to extract your family's core DNA.</p>
      </div>
    );
  }

  const p = dna.personalProfile;
  const f = dna.familyProfile;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Wikipedia Style Header */}
      <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 tracking-[0.2em] font-bold uppercase text-[9px] px-3">
              Heritage Archive
            </Badge>
            <span className="text-muted-foreground/30 text-xs font-mono">Last Synchronized: {new Date().toLocaleDateString()}</span>
          </div>
          <h1 className="font-headline text-6xl font-bold tracking-tighter">
            {f.familyName || "The Legacy"} Profile
          </h1>
          <p className="text-xl text-muted-foreground italic font-headline max-w-3xl">
            From the Aivaz Heritage Repository, the comprehensive biographical and psychological extraction for the {f.familyName} estate.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-white/5 border-white/10 text-muted-foreground px-4 py-1">v4.2.1 Stable</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Wikipedia Sidebar Info Box */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-panel border-white/10 overflow-hidden sticky top-8">
            <div className="aspect-square relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center border-b border-white/5">
              <Fingerprint className="h-24 w-24 text-primary/40" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Core Identity Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: "Principal", value: user?.displayName || "Julian Aivaz", icon: User },
                    { label: "Role", value: p.roleInFamily, icon: Anchor },
                    { label: "Gen Stage", value: p.generationalStage, icon: History },
                    { label: "Base", value: p.primaryLocation, icon: Globe },
                    { label: "Wealth Source", value: f.wealthSource, icon: Landmark },
                    { label: "Total Value", value: f.estimatedTotalNetWorth, icon: Landmark },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <item.icon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                      </div>
                      <span className="font-bold text-foreground text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Social Capital</h3>
                <div className="space-y-3">
                  <div className="text-[11px] text-muted-foreground leading-relaxed">
                    <p className="font-bold text-foreground mb-1">Reputation:</p>
                    {f.socialCapital.reputationIndicators.join(", ")}
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">
                    <p className="font-bold text-foreground mb-1">Networks:</p>
                    {f.socialCapital.keyNetworks.join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Main Article Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* AI Generated Personal Summary */}
          <section className="space-y-4">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Zap className="h-5 w-5 text-primary" />
              Executive Synthesis
            </h2>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit className="h-24 w-24" />
              </div>
              <p className="text-lg leading-relaxed text-foreground/90 italic font-headline">
                "{p.aiSummary}"
              </p>
            </div>
          </section>

          {/* Psychological Profile Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Heart className="h-5 w-5 text-primary" />
              Psychological Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Primary Friction Point</p>
                  <p className="text-sm font-medium leading-relaxed">{p.psychologicalProfile.biggestHeadache}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Priorities</p>
                  <ul className="space-y-1">
                    {p.psychologicalProfile.currentPriorities.map((item: string, i: number) => (
                      <li key={i} className="text-xs flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Relational Bottlenecks</p>
                  </div>
                  <ul className="space-y-2">
                    {p.psychologicalProfile.emotionalFrictionPoints.map((item: string, i: number) => (
                      <li key={i} className="text-xs text-amber-500/80 leading-snug">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Advisor Blind Spots</p>
                  </div>
                  <ul className="space-y-1">
                    {p.psychologicalProfile.advisorBlindSpots.map((item: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Family History Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <History className="h-5 w-5 text-primary" />
              Family Origin & Trajectory
            </h2>
            <Card className="glass-panel border-white/5">
              <CardContent className="p-8 space-y-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {f.history.summary}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Key Holdings</h4>
                    <div className="flex flex-wrap gap-2">
                      {f.history.keyHoldings.map((h: string) => (
                        <Badge key={h} variant="secondary" className="bg-white/5 hover:bg-white/10">{h}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Historical Transitions</h4>
                    <ul className="space-y-2">
                      {f.history.notableTransitions.map((t: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                          <Compass className="h-3 w-3 text-primary/40" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Family Dynamics & Wikipedia-style Narrative */}
          <section className="space-y-6">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Users className="h-5 w-5 text-primary" />
              Legacy Dynamics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-panel text-center p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Alignment Level</p>
                <p className={`text-2xl font-headline font-bold ${f.relationalDynamics.alignmentLevel === 'High' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {f.relationalDynamics.alignmentLevel}
                </p>
              </Card>
              <Card className="glass-panel text-center p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Succession Score</p>
                <p className="text-2xl font-headline font-bold text-primary">
                  {f.relationalDynamics.successionReadinessScore}%
                </p>
              </Card>
              <Card className="glass-panel text-center p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Global Footprint</p>
                <p className="text-sm font-bold truncate">
                  {f.geographicFootprint.join(", ")}
                </p>
              </Card>
            </div>

            <Card className="glass-panel bg-white/[0.01]">
              <CardHeader>
                <CardTitle className="text-lg">Legacy Narrative</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
                  <p className="text-base text-foreground/80 leading-relaxed font-body">
                    {f.familyLegacyNarrative}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Secure Cryptographic Signature Active</span>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
