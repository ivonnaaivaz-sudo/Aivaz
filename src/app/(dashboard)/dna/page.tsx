"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Fingerprint, 
  Globe, 
  History, 
  Heart, 
  User, 
  Users, 
  Landmark, 
  Zap, 
  ShieldCheck,
  UserPlus,
  Shield,
  MoreVertical
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
      { name: "Dr. Markus Hartmann", relationship: "Founder", generationalStage: "G1", role: "Principal", status: "Active", alignment: 92, avatar: "https://picsum.photos/seed/markus/100/100" },
      { name: "Elena Hartmann", relationship: "Spouse", generationalStage: "G1", role: "Philanthropy Chair", status: "Engaged", alignment: 88, avatar: "https://picsum.photos/seed/elena/100/100" },
      { name: "Sophie Hartmann", relationship: "Child", generationalStage: "G3", role: "ESG/Impact Lead", status: "Active", alignment: 65, avatar: "https://picsum.photos/seed/sophie/100/100" },
      { name: "Alexander Hartmann", relationship: "Child", generationalStage: "G3", role: "Tech Entrepreneur", status: "Critical", alignment: 42, avatar: "https://picsum.photos/seed/alexander/100/100" },
      { name: "Lina Hartmann", relationship: "Child", generationalStage: "G3", role: "Next Gen", status: "Onboarding", alignment: 75, avatar: "https://picsum.photos/seed/lina/100/100" }
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
            {f.familyName} DNA
          </h1>
          <p className="text-xl text-muted-foreground italic font-headline max-w-3xl leading-relaxed">
            The synthesized human architecture of the Hartmann legacy.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10">
            <ShieldCheck className="mr-2 h-4 w-4" /> Governance Audit
          </Button>
          <Button className="shadow-lg">
            <UserPlus className="mr-2 h-4 w-4" /> Expand Ecosystem
          </Button>
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
                    { label: "AUM", value: f.estimatedTotalNetWorth, icon: Landmark },
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
              1. Family Narrative
            </h2>
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 italic text-xl font-headline">
              "{f.familyLegacyNarrative}"
            </div>
            <Card className="glass-panel border-white/5 bg-white/[0.01]">
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed">
                  {f.history.summary}
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Users className="h-5 w-5 text-primary" />
              2. Family Ecosystem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {f.identifiedMembers.map((member: any) => (
                <Card key={member.name} className="glass-panel border-white/5 hover:border-primary/20 transition-all group">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <Avatar className="h-12 w-12 border border-white/10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{member.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{member.role}</p>
                    </div>
                    <Badge variant="outline" className="text-[8px] uppercase">{member.generationalStage}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest">
                        <span className="text-muted-foreground">Alignment Score</span>
                        <span className={member.alignment < 50 ? 'text-red-500' : 'text-primary'}>{member.alignment}%</span>
                      </div>
                      <Progress value={member.alignment} className="h-1" />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          member.status === 'Active' ? 'bg-emerald-500' : member.status === 'Critical' ? 'bg-red-500' : 'bg-amber-500'
                        )} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">{member.status}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="border-2 border-dashed border-muted-foreground/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center space-y-4 bg-transparent group">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <UserPlus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">Invite Stakeholder</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Add G2 or G3 members to the ecosystem.</p>
                </div>
              </Card>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Heart className="h-5 w-5 text-primary" />
              3. Relational Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Primary Friction Point</p>
                <p className="text-base font-medium">{p.psychologicalProfile.biggestHeadache}</p>
              </div>
              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3">Psychological Alignment</p>
                <p className="text-sm italic">{p.psychologicalProfile.emotionalFrictionPoints[0]}</p>
              </div>
            </div>
          </section>

          <div className="bg-white/[0.02] p-10 rounded-3xl border border-white/5 text-center">
            <p className="text-lg text-foreground/80 leading-relaxed font-body italic max-w-2xl mx-auto">
              "The Hartmann legacy is defined by industrial excellence and a deep commitment to precision as a means of wealth preservation."
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
              <Shield className="h-4 w-4" />
              <span>SECURE ARCHIVE: HARTMANN-HERITAGE-STABLE</span>
              <Shield className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}