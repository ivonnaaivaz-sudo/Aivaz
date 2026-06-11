
"use client";

import { useUser, useDoc, useFirestore } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Fingerprint, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  History, 
  Zap, 
  Heart, 
  BookOpen, 
  Compass, 
  Plus, 
  Info
} from "lucide-react";

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
      { id: "1", name: "Julian Aivaz", relationship: "Self", generationalStage: "G1", role: "Founder", avatar: "https://picsum.photos/seed/julian/100/100" },
      { id: "2", name: "Elena Aivaz", relationship: "Spouse", generationalStage: "G1", role: "Foundation Chair", avatar: "https://picsum.photos/seed/elena/100/100" },
      { id: "3", name: "Marcus Aivaz", relationship: "Child", generationalStage: "G2", role: "Successor", avatar: "https://picsum.photos/seed/marcus/100/100" },
      { id: "4", name: "Sarah Aivaz", relationship: "Child", generationalStage: "G2", role: "Investment Principal", avatar: "https://picsum.photos/seed/sarah/100/100" }
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
    familyLegacyNarrative: "The Aivaz family represents a classic builder legacy currently navigating its most significant hurdle: the transition from an individual-led empire to a values-based family institution."
  }
};

export default function HousePage() {
  const { user } = useUser();
  const { data: realDna, loading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  const dna = realDna || MOCK_DNA;
  const isDemo = !realDna;

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const g1Members = dna.familyProfile.identifiedMembers.filter((m: any) => m.generationalStage === "G1");
  const g2Members = dna.familyProfile.identifiedMembers.filter((m: any) => m.generationalStage === "G2");

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Fingerprint className="h-6 w-6 text-primary" />
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 tracking-[0.2em] font-bold uppercase text-[9px] px-3">
              The House of {dna.familyProfile.familyName.split(' ')[0]}
            </Badge>
          </div>
          <h1 className="font-headline text-5xl font-bold tracking-tighter">Family DNA & Heritage</h1>
          <p className="text-xl text-muted-foreground italic font-headline max-w-2xl leading-relaxed">
            The core repository of family history, psychological architecture, and generational lineage.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 text-xs font-bold uppercase tracking-widest">
            <History className="mr-2 h-4 w-4" /> View Archive
          </Button>
          <Button className="shadow-[0_0_20px_rgba(75,163,199,0.3)] text-xs font-bold uppercase tracking-widest">
            <UserPlus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-headline font-bold">Generational Lineage</h2>
        </div>

        <Card className="glass-panel border-white/5 bg-white/[0.01]">
          <CardContent className="p-12">
            <div className="flex flex-col items-center space-y-16">
              <div className="flex flex-col items-center space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">G1: Foundational</span>
                <div className="flex flex-wrap justify-center gap-8">
                  {g1Members.map((member: any) => (
                    <div key={member.id} className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-2xl">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-px h-16 bg-gradient-to-b from-primary/40 to-transparent" />

              <div className="flex flex-col items-center space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">G2: Successor</span>
                <div className="flex flex-wrap justify-center gap-8">
                  {g2Members.map((member: any) => (
                    <div key={member.id} className="flex flex-col items-center gap-4">
                      <Avatar className="h-20 w-20 border border-white/10 shadow-xl">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  <div className="h-20 w-20 rounded-full border border-dashed border-white/20 flex items-center justify-center hover:border-primary/50 cursor-pointer transition-all">
                    <Plus className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-16">
          <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">AI Synthesis</h3>
            <p className="text-xl leading-relaxed text-foreground/90 italic font-headline">
              "{dna.personalProfile.aiSummary}"
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-3 border-b border-white/5 pb-2">
              <Zap className="h-5 w-5 text-primary" />
              Psychological Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Emotional Friction Points</p>
                <ul className="space-y-4">
                  {dna.personalProfile.psychologicalProfile.emotionalFrictionPoints.map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Legacy Priorities</p>
                <ul className="space-y-4">
                  {dna.personalProfile.psychologicalProfile.currentPriorities.map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Heritage Scorecard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">Alignment</span>
                  <span className="text-primary">{dna.relationalDynamics?.alignmentLevel || "Medium"}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[60%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">Succession Readiness</span>
                  <span className="text-primary">{dna.relationalDynamics?.successionReadinessScore || 68}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[68%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
