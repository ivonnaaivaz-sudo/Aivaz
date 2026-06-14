"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BrainCircuit, 
  Fingerprint, 
  Globe, 
  History, 
  Heart, 
  User, 
  Landmark, 
  Zap, 
  BookOpen,
  Anchor,
  Compass,
  Link2
} from "lucide-react";

const MOCK_DNA = {
  personalProfile: {
    roleInFamily: "Principal Founder",
    generationalStage: "1st Generation",
    primaryLocation: "Munich, Germany",
    riskAppetite: "Low / Preservation Focused",
    psychologicalProfile: {
      biggestHeadache: "Ensuring succession readiness while maintaining operational speed.",
      currentPriorities: ["Consolidation of offshore assets", "Succession readiness training", "Philanthropic legacy definition"],
      emotionalFrictionPoints: ["Tension between Gen 1 speed and Gen 2 governance preference"],
      advisorBlindSpots: ["Traditional banks focus on tax but ignore the emotional sibling dynamics."]
    },
    financialSnapshot: {
      estimatedNetWorth: "€380M",
      primaryAssetClasses: ["Specialty Chemicals", "European Real Estate"]
    },
    aiSummary: "Dr. Markus Hartmann is a high-conviction founder who built his wealth in industrial chemicals. Currently, he is focused on institutionalizing his legacy for the next generation while maintaining the stability that built the Hartmann name."
  },
  familyProfile: {
    familyName: "Hartmann Heritage",
    wealthSource: "Specialty Chemicals & Industrial Infrastructure",
    estimatedTotalNetWorth: "€380M (Aggregated)",
    history: {
      summary: "Founded in the late 1980s as a specialized industrial chemical firm in Munich, the Hartmann wealth was significantly expanded through strategic dominance in European infrastructure supply chains. The family has since transitioned into a multi-jurisdictional investment office with a strong presence in Singapore.",
      keyHoldings: ["Hartmann Chemicals Global", "Alpine Strategic Real Estate"],
      notableTransitions: ["1992 Foundation", "2008 Singapore Expansion"]
    },
    relationalDynamics: {
      alignmentLevel: "Medium",
      successionReadinessScore: 42
    }
  }
};

export default function HousePage() {
  const { user } = useUser();
  const { data: realDna, loading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  if (loading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-8">
        <Skeleton className="h-12 w-3/4 mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-4 h-96 rounded-2xl" />
          <Skeleton className="lg:col-span-8 h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const dna = realDna || MOCK_DNA;
  const p = dna.personalProfile;
  const f = dna.familyProfile;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 tracking-[0.2em] font-bold uppercase text-[9px] px-3">
              Heritage Archive
            </Badge>
          </div>
          <h1 className="font-headline text-5xl font-bold tracking-tighter">
            Family DNA
          </h1>
        </div>
        <Badge className="bg-white/5 border-white/10 text-muted-foreground px-4 py-1">Profile: Dr. Markus Hartmann</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-panel border-white/10 overflow-hidden sticky top-8">
            <div className="aspect-square relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center border-b border-white/5 overflow-hidden">
              <Fingerprint className="h-32 w-32 text-primary/30" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/20 pb-1">Core Identity Info</h3>
                <div className="space-y-3">
                  {[
                    { label: "Principal", value: user?.displayName || "Dr. Markus Hartmann", icon: User },
                    { label: "Role", value: p.roleInFamily, icon: Anchor },
                    { label: "Gen Stage", value: p.generationalStage, icon: History },
                    { label: "Base", value: p.primaryLocation, icon: Globe },
                    { label: "Risk Appetite", value: p.riskAppetite, icon: Compass },
                    { label: "Wealth Source", value: f.wealthSource, icon: Landmark },
                    { label: "Net Worth", value: p.financialSnapshot.estimatedNetWorth, icon: Landmark },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] py-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <item.icon className="h-3 w-3" />
                        <span>{item.label}</span>
                      </div>
                      <span className="font-bold text-foreground text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-16">
          <section className="space-y-6">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Zap className="h-5 w-5 text-primary" />
              1. Personal Synthesis
            </h2>
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit className="h-24 w-24" />
              </div>
              <p className="text-xl leading-relaxed text-foreground/90 italic font-headline relative z-10">
                {p.aiSummary}
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Heart className="h-5 w-5 text-primary" />
              2. Psychological Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Primary Friction Point</p>
                <p className="text-base font-medium leading-relaxed">{p.psychologicalProfile.biggestHeadache}</p>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Legacy Priorities</p>
                <ul className="space-y-3">
                  {p.psychologicalProfile.currentPriorities.map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <History className="h-5 w-5 text-primary" />
              3. Family Origin & Heritage
            </h2>
            <Card className="glass-panel border-white/5 shadow-none bg-white/[0.01]">
              <CardContent className="p-10 space-y-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                    {f.history.summary}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-5">Primary Entities & Holdings</h4>
                    <div className="flex flex-wrap gap-3">
                      {f.history.keyHoldings.map((h: string) => (
                        <Badge key={h} variant="outline" className="bg-white/5 border-white/10 px-3 py-1">
                          {h}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-5">Historical Transitions</h4>
                    <ul className="space-y-3">
                      {f.history.notableTransitions.map((t: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-3">
                          <Compass className="h-4 w-4 text-primary/40 shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="bg-white/[0.02] p-10 rounded-3xl border border-white/5 relative text-center">
            <div className="absolute top-6 left-6 opacity-10">
              <BookOpen className="h-12 w-12" />
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed font-body italic max-w-2xl mx-auto">
              The Hartmann legacy is defined by industrial excellence and a deep commitment to precision as a means of wealth preservation.
            </p>
            <div className="mt-12 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
              <Link2 className="h-4 w-4" />
              <span>SECURE ARCHIVE: HARTMANN-HERITAGE-STABLE</span>
              <Link2 className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
