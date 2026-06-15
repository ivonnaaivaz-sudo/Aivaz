
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
  Link2,
  Calendar
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
    aiSummary: "The Hartmann legacy is at a pivotal crossroads. Dr. Markus Hartmann's industrial era is transitioning into a fragmented global portfolio, requiring a move from patriarch-led control to institutional governance."
  },
  familyProfile: {
    familyName: "Hartmann Heritage",
    wealthSource: "Specialty Chemicals & Industrial Infrastructure",
    estimatedTotalNetWorth: "€380M (Aggregated)",
    history: {
      summary: "Founded in the late 1980s as a specialized industrial chemical firm in Munich, the Hartmann wealth was significantly expanded through strategic dominance in European infrastructure supply chains.",
      keyHoldings: ["Hartmann Chemicals Global", "Alpine Strategic Real Estate"],
      notableTransitions: ["1992 Foundation", "2008 Singapore Expansion"]
    }
  }
};

export default function HousePage() {
  const { user } = useUser();
  const { data: profile } = useDoc(user ? `users/${user.uid}` : null);
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
            Principal Node
          </h1>
        </div>
        <Badge className="bg-white/5 border-white/10 text-muted-foreground px-4 py-1">Identity: {profile?.displayName || "Dr. Markus Hartmann"}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-panel border-white/10 overflow-hidden sticky top-8">
            <div className="aspect-square relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center border-b border-white/5 overflow-hidden">
              <Fingerprint className="h-32 w-32 text-primary/30" />
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/20 pb-1">Archive ID</h3>
                <div className="space-y-3">
                  {[
                    { label: "Principal", value: profile?.displayName || "Dr. Markus Hartmann", icon: User },
                    { label: "Born", value: profile?.dob || "1964-08-12", icon: Calendar },
                    { label: "Role", value: p.roleInFamily || "Principal Founder", icon: Anchor },
                    { label: "Gen Stage", value: p.generationalStage || "G1", icon: History },
                    { label: "Base", value: p.primaryLocation || "Munich, Germany", icon: Globe },
                    { label: "Wealth Source", value: f.wealthSource || "Chemicals", icon: Landmark },
                    { label: "Net Worth", value: p.financialSnapshot?.estimatedNetWorth || "€380M", icon: Landmark },
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
                <p className="text-base font-medium leading-relaxed">{p.psychologicalProfile?.biggestHeadache || "Fragmentation of authority."}</p>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Legacy Priorities</p>
                <ul className="space-y-3">
                  {(p.psychologicalProfile?.currentPriorities || ["Succession", "Consolidation"]).map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="bg-white/[0.02] p-10 rounded-3xl border border-white/5 relative text-center">
            <div className="absolute top-6 left-6 opacity-10">
              <BookOpen className="h-12 w-12" />
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed font-body italic max-w-2xl mx-auto">
              "We preserve not just the capital, but the character that created it."
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
