
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
  Link2,
  Info
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const MOCK_DNA = {
  personalProfile: {
    roleInFamily: "Principal Founder",
    generationalStage: "1st Generation",
    primaryLocation: "Palm Beach, Florida",
    otherLocations: ["Singapore", "Zurich", "London"],
    psychologicalProfile: {
      biggestHeadache: "Hesitation to pass decision-making control to an unaligned successor group.",
      currentPriorities: ["Consolidation of offshore assets", "Succession readiness training", "Philanthropic legacy definition"],
      emotionalFrictionPoints: ["Tension between Gen 1 speed and Gen 2 governance preference", "Concerns regarding wealth dilution over 50 years"],
      advisorBlindSpots: ["Traditional banks focus on tax but ignore the emotional sibling dynamics between Julian and Marcus."]
    },
    financialSnapshot: {
      estimatedNetWorth: "$142M",
      primaryAssetClasses: ["Tech Equity", "European Real Estate", "Private Foundations"]
    },
    aiSummary: "Julian is a high-conviction principal focused on long-term preservation. His legacy is currently at a critical pivot point between builder-led growth and institutionalized family governance."
  },
  familyProfile: {
    familyName: "Aivaz Heritage",
    currentGenerationalStage: "1st Generation Transition",
    geographicFootprint: ["United States", "Singapore", "Switzerland", "UK"],
    wealthSource: "Semiconductor Infrastructure & Global Logistics",
    estimatedTotalNetWorth: "$850M (Aggregated Family Group)",
    history: {
      summary: "Founded in the late 1980s as a specialized logistics firm, the Aivaz wealth was significantly expanded through early strategic investments in semiconductor supply chains. The family has since transitioned into a multi-jurisdictional investment office with a focus on deep tech and heritage assets.",
      keyHoldings: ["Aivaz Logistics Global", "Alpine Strategic Real Estate", "Heritage Tech Fund"],
      notableTransitions: ["1998 Global Expansion", "2015 Liquidity Event", "2021 Dynasty Trust Formation"]
    },
    identifiedMembers: [
      { name: "Julian Aivaz", relationship: "Self", generationalStage: "G1", role: "Founder" },
      { name: "Marcus Aivaz", relationship: "Child", generationalStage: "G2", role: "Successor" },
      { name: "Elena Aivaz", relationship: "Spouse", generationalStage: "G1", role: "Foundation Chair" }
    ],
    socialCapital: {
      reputationIndicators: ["Known for discretion", "Educational Philanthropy Leaders", "Global Mobility Pioneers"],
      keyNetworks: ["World Heritage Forum", "Principals Circle", "Oxford Heritage Society"],
      mobilityProfile: "Tier 1 (Global Passport Access + Private Air Infrastructure)"
    },
    relationalDynamics: {
      keyFrictionPoints: ["Succession transparency", "Investment risk tolerance variance between G1 and G2"],
      alignmentLevel: "Medium",
      successionReadinessScore: 68
    },
    familyLegacyNarrative: "The Aivaz family represents a classic builder legacy currently navigating its most significant hurdle: the transition from an individual-led empire to a values-based family institution. Their 'DNA' is defined by high intellectual capital and a globalist perspective, though internal emotional alignment remains a key area for development."
  }
};

export default function FamilyDNAPage() {
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

  // Use real data if available, otherwise use mock data for demo purposes
  const dna = realDna || MOCK_DNA;
  const isDemo = !realDna;

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
            {isDemo && (
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-bold uppercase">
                Demo Profile
              </Badge>
            )}
            <span className="text-muted-foreground/30 text-xs font-mono">Archive No: {user?.uid?.slice(0, 8) || "DEMO-01"}</span>
          </div>
          <h1 className="font-headline text-5xl font-bold tracking-tighter">
            {f.familyName || "The Legacy"} Profile
          </h1>
          <p className="text-xl text-muted-foreground italic font-headline max-w-3xl leading-relaxed">
            A comprehensive psychological and generational extraction derived from the Aivaz Heritage Repository.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-white/5 border-white/10 text-muted-foreground px-4 py-1">Stability: v4.2.1 Stable</Badge>
        </div>
      </div>

      {isDemo && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3 text-amber-500/80 text-sm">
          <Info className="h-4 w-4" />
          <span>Showing sample Family DNA. Complete the Psychological Discovery to generate your unique heritage profile.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Wikipedia Sidebar Info Box */}
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
                    { label: "Principal", value: user?.displayName || "Julian Aivaz", icon: User },
                    { label: "Role", value: p.roleInFamily, icon: Anchor },
                    { label: "Gen Stage", value: p.generationalStage, icon: History },
                    { label: "Base", value: p.primaryLocation, icon: Globe },
                    { label: "Wealth Source", value: f.wealthSource, icon: Landmark },
                    { label: "Family Net Worth", value: f.estimatedTotalNetWorth, icon: Landmark },
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

              <Separator className="bg-white/5" />

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/20 pb-1">Social Capital</h3>
                <div className="space-y-4">
                  <div className="text-[11px] text-muted-foreground leading-relaxed">
                    <p className="font-bold text-foreground mb-1 uppercase tracking-tighter opacity-50">Reputation Indicators</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {f.socialCapital.reputationIndicators.map((rep: string) => (
                        <Badge key={rep} variant="secondary" className="bg-white/5 text-[9px] px-2">{rep}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">
                    <p className="font-bold text-foreground mb-1 uppercase tracking-tighter opacity-50">Global Network Access</p>
                    <p>{f.socialCapital.keyNetworks.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Main Article Content */}
        <div className="lg:col-span-8 space-y-16">
          {/* AI Generated Personal Summary */}
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
                "{p.aiSummary}"
              </p>
            </div>
          </section>

          {/* Psychological Profile Section */}
          <section className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Heart className="h-5 w-5 text-primary" />
              2. Psychological Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
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
              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Relational Bottlenecks</p>
                  </div>
                  <ul className="space-y-3">
                    {p.psychologicalProfile.emotionalFrictionPoints.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-amber-500/80 leading-snug">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Advisor Blind Spots</p>
                  </div>
                  <ul className="space-y-2">
                    {p.psychologicalProfile.advisorBlindSpots.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground leading-relaxed italic">
                        "{item}"
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Family History Section */}
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
                        <Badge key={h} variant="outline" className="bg-white/5 border-white/10 hover:border-primary/40 transition-colors px-3 py-1">
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

          {/* Family Dynamics */}
          <section className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Users className="h-5 w-5 text-primary" />
              4. Legacy Dynamics & Succession
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel p-6 text-center space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Alignment Level</p>
                <div className="flex items-center justify-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${f.relationalDynamics.alignmentLevel === 'High' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                  <p className="text-3xl font-headline font-bold">{f.relationalDynamics.alignmentLevel}</p>
                </div>
              </div>
              <div className="glass-panel p-6 text-center space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Succession Score</p>
                <p className="text-3xl font-headline font-bold text-primary">
                  {f.relationalDynamics.successionReadinessScore}%
                </p>
              </div>
              <div className="glass-panel p-6 text-center space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global Footprint</p>
                <p className="text-sm font-bold uppercase tracking-tighter">
                  {f.geographicFootprint.join(" • ")}
                </p>
              </div>
            </div>

            <div className="bg-white/[0.02] p-10 rounded-3xl border border-white/5 relative">
              <div className="absolute top-6 left-6 opacity-10">
                <BookOpen className="h-12 w-12" />
              </div>
              <h4 className="text-lg font-headline font-bold mb-6 text-center text-primary">The Heritage Narrative</h4>
              <p className="text-lg text-foreground/80 leading-relaxed font-body text-center max-w-2xl mx-auto italic">
                "{f.familyLegacyNarrative}"
              </p>
              <div className="mt-12 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
                <Link2 className="h-4 w-4" />
                <span>SECURE CRYPTOGRAPHIC SIGNATURE: AIVAZ-CORE-DNA-STABLE</span>
                <Link2 className="h-4 w-4" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
