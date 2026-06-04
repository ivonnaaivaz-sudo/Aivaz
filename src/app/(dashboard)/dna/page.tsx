
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Sparkles, ShieldAlert, Heart, Fingerprint, Zap } from "lucide-react";

export default function FamilyDNAPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Fingerprint className="h-6 w-6 text-primary" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Biometric Legacy Profile</span>
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight">Family Core DNA</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">The extracted psychological essence that drives your family's decisions and legacy architecture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-panel border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Sparkles className="h-24 w-24 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Core Values
            </CardTitle>
            <CardDescription>The non-negotiable principles guiding your heritage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Intellectual Stewardship", desc: "Prioritizing the growth of family knowledge over liquid capital." },
              { title: "Intergenerational Autonomy", desc: "Empowering successors with the freedom to build their own legacy within the family framework." },
              { title: "Discreet Impact", desc: "Influence through quiet philanthropy and strategic behind-the-scenes leadership." }
            ].map((value, i) => (
              <div key={i} className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="font-bold text-sm mb-1">{value.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{value.desc}</p>
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
            <CardDescription>AI-diagnosed emotional bottlenecks in your legacy journey.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "The Founder's Dilemma", desc: "Emotional hesitation to delegate voting control to unproven Gen 2 leadership." },
              { title: "Geographic Dissociation", desc: "Fragmented family dynamics due to diverse residency (NY, Zurich, Singapore)." },
              { title: "Complex Asset Fatigue", desc: "Successors feel overwhelmed by the complexity of the trust structures." }
            ].map((point, i) => (
              <div key={i} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="font-bold text-sm mb-1 text-amber-500">{point.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>AI Synthesis Narrative</CardTitle>
          </div>
          <p className="text-lg italic font-headline text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            "Your family is currently at a 'Gen 1 Pivot'—the most critical psychological transition in a family's history. The data suggests that while your financial architecture is robust, your human architecture is fragile. The legacy is currently tied to a single principal's decision-making framework, creating a single point of failure for the entire heritage. To bridge this, the platform will focus on 'DNA Transfer'—translating the founder's wisdom into scalable family protocols."
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}
