
"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, Sparkles, ShieldAlert, Heart, Fingerprint, Zap, Globe, Layers, AlertCircle } from "lucide-react";

export default function FamilyDNAPage() {
  const { user } = useUser();
  const { data: dna, loading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto p-8">
        <div className="flex flex-col gap-4 items-center">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Fingerprint className="h-6 w-6 text-primary" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Biometric Legacy Profile</span>
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight">Family Core DNA</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {dna.generationalStage} • {dna.geographicDistribution}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-panel border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Sparkles className="h-24 w-24 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Core Legacy Values
            </CardTitle>
            <CardDescription>The non-negotiable principles guiding your heritage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dna.coreValues?.map((value: string, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="font-bold text-sm leading-relaxed">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ShieldAlert className="h-24 w-24 text-amber-500" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Psychological Friction Points
            </CardTitle>
            <CardDescription>AI-diagnosed emotional bottlenecks in your journey.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dna.frictionPoints?.map((point: string, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="font-bold text-sm text-amber-500 leading-relaxed">{point}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Narrative Synthesis</CardTitle>
          </div>
          <p className="text-lg italic font-headline text-foreground/80 leading-relaxed">
            "{dna.narrativeSummary}"
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Overlooked Factors
            </CardTitle>
            <CardDescription>What traditional advisors typically ignore for your profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dna.overlookedFactors?.map((factor: string, i: number) => (
              <div key={i} className="flex gap-3 text-sm text-muted-foreground border-b border-white/5 pb-2 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                <p>{factor}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Asset Complexity Focus
            </CardTitle>
            <CardDescription>The structural challenges your family DNA reveals.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground bg-white/5 p-4 rounded-xl">
              {dna.assetComplexity}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
