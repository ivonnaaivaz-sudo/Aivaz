
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

const HARTMANN_DNA = {
  personalProfile: {
    roleInFamily: "Principal Founder",
    generationalStage: "1st Generation (G1)",
    primaryLocation: "Munich, Germany",
    otherLocations: ["Singapore", "London", "Zurich"],
    psychologicalProfile: {
      biggestHeadache: "Fragmentation of authority and the tension between traditional industrial values and G3's push for ESG and tech-led growth.",
      currentPriorities: ["Consolidation of €42M idle cash", "Formalizing the Hartmann Family Charter", "Resolving the Asia vs. Europe relocation debate"],
      emotionalFrictionPoints: ["Dr. Markus's control-oriented management vs. Sophie's impact-driven autonomy", "Alexander's high-risk tech appetite vs. family capital preservation"],
      advisorBlindSpots: ["Advisors focus on tax structures in Luxembourg but ignore the deep emotional rift regarding the family's geographic future."]
    },
    financialSnapshot: {
      estimatedNetWorth: "€380M (Aggregated)",
      primaryAssetClasses: ["Commercial Real Estate", "Chemical Manufacturing", "Private Equity"]
    },
    aiSummary: "The Hartmann legacy is at a pivotal crossroads. Dr. Markus Hartmann's industrial era is transitioning into a fragmented global portfolio, requiring a move from patriarch-led control to institutional governance."
  },
  familyProfile: {
    familyName: "Hartmann Heritage",
    currentGenerationalStage: "1st Generation Transitioning to 3rd",
    geographicFootprint: ["Germany", "Singapore", "United Kingdom", "Switzerland", "Cayman Islands"],
    wealthSource: "Specialty Chemicals & Industrial Infrastructure",
    estimatedTotalNetWorth: "€380M",
    history: {
      summary: "Founded in Munich by Dr. Markus Hartmann, the family wealth grew from a specialized chemicals firm into a diversified industrial and real estate empire. With significant footholds in Singapore and London, the family now faces the challenge of unifying fragmented accounts and diverse generational visions.",
      keyHoldings: ["Hartmann Specialty Chem", "Munich-Singapore Real Estate Trust", "Luxembourg Industrial Holdings"],
      notableTransitions: ["1992 Foundation", "2008 Singapore Expansion", "2024 Institutional Pivot"]
    },
    identifiedMembers: [
      { name: "Dr. Markus Hartmann", relationship: "Founder", generationalStage: "G1", role: "Principal" },
      { name: "Elena Hartmann", relationship: "Spouse", generationalStage: "G1", role: "Philanthropy Chair" },
      { name: "Sophie Hartmann", relationship: "Child", generationalStage: "G3", role: "ESG/Impact Lead" },
      { name: "Alexander Hartmann", relationship: "Child", generationalStage: "G3", role: "Tech Entrepreneur" },
      { name: "Lina Hartmann", relationship: "Child", generationalStage: "G3", role: "Art & Heritage" }
    ],
    socialCapital: {
      reputationIndicators: ["German Industrial Excellence", "Swiss Banking Pedigree (via Elena)", "Sustainable Fashion Innovation (via Sophie)"],
      keyNetworks: ["Munich Industrialists Circle", "Singapore Heritage Forum", "London Tech Founders"],
      mobilityProfile: "Tier 1 Global Citizenship"
    },
    relationalDynamics: {
      keyFrictionPoints: ["Geographic relocation (Munich vs. Singapore/London)", "Investment risk tolerance (Dr. Markus vs. Alexander)"],
      alignmentLevel: "Medium-Low",
      successionReadinessScore: 42
    },
    familyLegacyNarrative: "The Hartmann family represents the quintessential European industrial legacy facing the complexity of the 21st century. Their DNA is a blend of traditional German precision and emerging global impacts."
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

  const dna = realDna || HARTMANN_DNA;
  const isDemo = !realDna;
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
            {isDemo && (
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-bold uppercase">
                Hartmann Demo Profile
              </Badge>
            )}
          </div>
          <h1 className="font-headline text-5xl font-bold tracking-tighter">
            {f.familyName} Profile
          </h1>
          <p className="text-xl text-muted-foreground italic font-headline max-w-3xl leading-relaxed">
            A comprehensive generational extraction derived from the Hartmann Heritage Repository.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-panel border-white/10 overflow-hidden sticky top-8">
            <div className="aspect-square relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center border-b border-white/5 overflow-hidden">
              <Fingerprint className="h-32 w-32 text-primary/30" />
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/20 pb-1">Core Identity</h3>
                <div className="space-y-3">
                  {[
                    { label: "Principal", value: "Dr. Markus Hartmann", icon: User },
                    { label: "Origin", value: "Munich, Germany", icon: Globe },
                    { label: "Wealth Source", value: "Chemicals & Real Estate", icon: Landmark },
                    { label: "Net Worth", value: f.estimatedTotalNetWorth, icon: Landmark },
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
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 italic text-xl font-headline">
              "{p.aiSummary}"
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
                <p className="text-base font-medium">{p.psychologicalProfile.biggestHeadache}</p>
              </div>
              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3">Relational Tension</p>
                <p className="text-sm italic">{p.psychologicalProfile.emotionalFrictionPoints[0]}</p>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Users className="h-5 w-5 text-primary" />
              3. Generational Alignment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel p-6 text-center space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Succession Score</p>
                <p className="text-3xl font-headline font-bold text-primary">{f.relationalDynamics.successionReadinessScore}%</p>
              </div>
              <div className="glass-panel p-6 text-center space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Alignment</p>
                <p className="text-3xl font-headline font-bold">{f.relationalDynamics.alignmentLevel}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
