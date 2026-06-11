
"use client";

import { useUser, useDoc, useFirestore } from "@/firebase";
import { useState, useMemo } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Fingerprint, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Anchor, 
  History, 
  Zap, 
  Heart, 
  ShieldAlert, 
  BookOpen, 
  Compass, 
  Plus, 
  MoreVertical,
  Mail,
  Shield,
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
    familyLegacyNarrative: "The Aivaz family represents a classic builder legacy currently navigating its most significant hurdle: the transition from an individual-led empire to a values-based family institution. Their 'DNA' is defined by high intellectual capital and a globalist perspective."
  }
};

const advisors = [
  { name: "Robert Chen", role: "Trustee / Lead Advisor", firm: "Global Wealth Partners", status: "Active", avatar: "https://picsum.photos/seed/robert/100/100" },
  { name: "Sarah Jenkins", role: "Tax Strategist", firm: "Swiss Private Bank", status: "Consulting", avatar: "https://picsum.photos/seed/jenkins/100/100" },
  { name: "Michael Vance", role: "Estate Lawyer", firm: "Vance & Co.", status: "Active", avatar: "https://picsum.photos/seed/vance/100/100" },
];

export default function WardroomPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: realDna, loading } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  const [activeTab, setActiveTab] = useState("dna");

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
      {/* Maritime Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Anchor className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 tracking-[0.2em] font-bold uppercase text-[9px] px-3">
              Family Wardroom
            </Badge>
          </div>
          <h1 className="font-headline text-5xl font-bold tracking-tighter">
            {dna.familyProfile.familyName} Command
          </h1>
          <p className="text-xl text-muted-foreground italic font-headline max-w-2xl leading-relaxed">
            The collaborative hub for human architecture, trust alignment, and multi-generational values.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="mr-2 h-4 w-4" /> Governance Audit
          </Button>
          <Button className="shadow-[0_0_20px_rgba(75,163,199,0.3)] text-xs font-bold uppercase tracking-widest">
            <UserPlus className="mr-2 h-4 w-4" /> Invite Stakeholder
          </Button>
        </div>
      </div>

      {/* Section 1: The Chain of Command (Family Tree) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-headline font-bold">The Chain of Command</h2>
          </div>
          <Badge variant="secondary" className="bg-white/5 text-[10px] uppercase font-bold tracking-tighter">
            Generational Hierarchy View
          </Badge>
        </div>

        <Card className="glass-panel border-white/5 bg-white/[0.01] overflow-hidden">
          <CardContent className="p-12">
            <div className="flex flex-col items-center space-y-16">
              {/* Generation 1 */}
              <div className="flex flex-col items-center space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">G1: Foundational Generation</span>
                <div className="flex flex-wrap justify-center gap-8">
                  {g1Members.map((member: any) => (
                    <div key={member.id} className="flex flex-col items-center gap-4 group">
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-2 border-primary/20 group-hover:border-primary transition-all duration-500 shadow-2xl">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-background border border-white/10 rounded-full p-1.5 shadow-lg">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-px h-16 bg-gradient-to-b from-primary/40 to-transparent" />

              {/* Generation 2 */}
              <div className="flex flex-col items-center space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">G2: Successor Generation</span>
                <div className="flex flex-wrap justify-center gap-8">
                  {g2Members.map((member: any) => (
                    <div key={member.id} className="flex flex-col items-center gap-4 group">
                      <Avatar className="h-20 w-20 border border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-xl">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  {/* Add Member Placeholder */}
                  <div className="flex flex-col items-center gap-4 cursor-pointer group">
                    <div className="h-20 w-20 rounded-full border border-dashed border-white/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                      <Plus className="h-8 w-8 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm text-muted-foreground group-hover:text-primary transition-colors">Add Heir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Grid: Advisors (Side) | DNA Content (Main) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* DNA Content (Main) */}
        <div className="lg:col-span-8 space-y-16">
          {isDemo && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3 text-amber-500/80 text-sm">
              <Info className="h-4 w-4" />
              <span>Showing sample Family DNA. Run the Discovery Matrix to generate your unique heritage profile.</span>
            </div>
          )}

          {/* Section: Synthesis */}
          <section className="space-y-6">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-3 border-b border-white/5 pb-2">
              <Zap className="h-5 w-5 text-primary" />
              1. Hull Integrity: Personal Synthesis
            </h2>
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
              <p className="text-xl leading-relaxed text-foreground/90 italic font-headline relative z-10">
                "{dna.personalProfile.aiSummary}"
              </p>
            </div>
          </section>

          {/* Section: Psychological Architecture */}
          <section className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-3 border-b border-white/5 pb-2">
              <Heart className="h-5 w-5 text-primary" />
              2. Human Architecture & Dynamics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Primary Friction Points</p>
                <ul className="space-y-4">
                  {dna.personalProfile.psychologicalProfile.emotionalFrictionPoints.map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-3 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_rgba(75,163,199,0.5)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Legacy Priorities</p>
                <ul className="space-y-4">
                  {dna.personalProfile.psychologicalProfile.currentPriorities.map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-3 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Origin Story */}
          <section className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-3 border-b border-white/5 pb-2">
              <History className="h-5 w-5 text-primary" />
              3. Ship's Log: Family Origin & Heritage
            </h2>
            <Card className="glass-panel border-white/5 shadow-none bg-white/[0.01]">
              <CardContent className="p-10 space-y-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                    {dna.familyProfile.history.summary}
                  </p>
                </div>
                <div className="pt-8 border-t border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-5">Historical Transitions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dna.familyProfile.history.notableTransitions.map((t: string, i: number) => (
                      <div key={i} className="text-xs text-muted-foreground flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <Compass className="h-4 w-4 text-primary/40 shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Advisory Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-8 space-y-8">
            <Card className="glass-panel border-white/10">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    The Advisory Deck
                  </CardTitle>
                </div>
                <CardDescription className="text-xs uppercase tracking-widest font-bold">Authorized Trusted Crew</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {advisors.map((advisor) => (
                    <div key={advisor.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-primary/30 transition-all">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={advisor.avatar} />
                        <AvatarFallback>{advisor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{advisor.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter font-bold">{advisor.role}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full border-dashed border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest h-10">
                  <Plus className="mr-2 h-3.5 w-3.5" /> Enlist New Advisor
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-panel bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Governance Sync</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-background/50 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-muted-foreground">Compliance Rating</span>
                    <span className="text-emerald-500">Tier 1 Secure</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[94%]" />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                  "All family communication channels and document vaults are currently synchronized across 6 jurisdictions."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
