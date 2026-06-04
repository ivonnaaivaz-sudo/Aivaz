
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Milestone, History, ArrowUpRight, ShieldCheck, HeartPulse, UserCircle2 } from "lucide-react";

const timelineEvents = [
  { id: 1, title: "Initial Asset Transfer", date: "Jan 2024", type: "financial", status: "completed", description: "Consolidated Gen 1 offshore holdings." },
  { id: 2, title: "Psychological Alignment Survey", date: "Feb 2024", type: "personal", status: "completed", description: "Identified core friction in succession strategy." },
  { id: 3, title: "Gen 2 Leadership Onboarding", date: "May 2024", type: "succession", status: "in-progress", description: "Structured mentorship for primary successors." },
  { id: 4, title: "Legacy Foundation Launch", date: "Sep 2024", type: "philanthropy", status: "upcoming", description: "Aligning capital with family heritage values." },
  { id: 5, title: "Ideal Legacy State Realization", date: "Dec 2026", type: "vision", status: "target", description: "Full alignment of values and capital." },
];

export default function LegacyCommandPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">Strategic Alignment</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Legacy Command</h1>
        <p className="text-muted-foreground italic">Bridging the gap between financial reality and generational intent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel group hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Legacy Alignment Score</CardTitle>
            <HeartPulse className="h-4 w-4 text-primary animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline">78%</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span>Value Sync</span>
                <span className="text-primary">+12%</span>
              </div>
              <Progress value={78} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Principal Stakeholder</CardTitle>
            <UserCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">Julian Aivaz</div>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">Gen 1 Founder • Active</p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Core Legacy Goal</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-headline leading-tight">Unity Across Geographic Borders</div>
            <p className="text-xs text-muted-foreground mt-2">Target Completion: Q4 2025</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <History className="h-48 w-48" />
        </div>
        <CardHeader>
          <CardTitle>Generational Lifecycle Timeline</CardTitle>
          <CardDescription>A human-centric narrative of your family's transition from current state to legacy ideal.</CardDescription>
        </CardHeader>
        <CardContent className="pt-10 pb-20 overflow-x-auto">
          <div className="min-w-[800px] relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
            <div className="flex justify-between items-center relative z-10">
              {timelineEvents.map((event, i) => (
                <div key={event.id} className="flex flex-col items-center gap-4 w-40">
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${event.status === 'completed' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {event.date}
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    event.status === 'completed' ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(75,163,199,0.4)]' : 
                    event.status === 'in-progress' ? 'bg-amber-500/10 border-amber-500' :
                    'bg-background border-white/10'
                  }`}>
                    {event.status === 'completed' && <ShieldCheck className="h-4 w-4 text-primary" />}
                    {event.status === 'in-progress' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${event.status === 'target' ? 'text-primary italic' : ''}`}>{event.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Legacy Gap Analysis</CardTitle>
            <CardDescription>Identified friction between current structures and heritage intent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Successor Competency Gap", risk: "Medium", desc: "Gen 2 leadership development is 18 months behind optimal trajectory." },
              { label: "Cross-Border Tax Friction", risk: "High", desc: "Swiss holdings lack the necessary trust wrappers for NY tax residency." },
              { label: "Emotional Bottleneck", risk: "Critical", desc: "Founder hesitation on voting rights is causing decision-making delays." }
            ].map((gap, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 group hover:border-white/10 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">{gap.label}</span>
                  <Badge variant="outline" className={`${
                    gap.risk === 'Critical' ? 'border-red-500/50 text-red-500' : 
                    gap.risk === 'High' ? 'border-amber-500/50 text-amber-500' : 
                    'text-muted-foreground'
                  }`}>
                    {gap.risk} Risk
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{gap.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Family DNA Extraction</CardTitle>
            <CardDescription>Synthesized from profiling and behavioral data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {["Stewardship First", "Intellectual Capital Focused", "Risk-Averse Succession", "Philanthropic Driven"].map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm italic leading-relaxed text-foreground opacity-80">
                "The Aivaz family DNA is defined by a transition from aggressive wealth creation to conservative heritage preservation. The primary friction is not capital, but the alignment of the founder's vision with the successors' individual autonomy."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
