"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Milestone, Flag, Target, ShieldCheck, ChevronRight } from "lucide-react";

const roadmap = [
  { 
    id: 1, 
    title: "Q4 Trust Capitalization", 
    status: "In Progress", 
    date: "Dec 2025",
    description: "Finalizing the transfer of offshore commercial holdings into the Irrevocable Family Trust.",
    progress: 85
  },
  { 
    id: 2, 
    title: "Legacy Foundation Setup", 
    status: "Upcoming", 
    date: "Mar 2026",
    description: "Establishing the Aivaz Heritage Foundation for philanthropic initiatives across education and technology.",
    progress: 10
  },
  { 
    id: 3, 
    title: "Generational Governance Charter", 
    status: "Completed", 
    date: "Oct 2024",
    description: "Formal documentation of family values and decision-making protocols signed by all principals.",
    progress: 100
  }
];

export default function StrategyPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Heritage Strategy</h1>
        <p className="text-muted-foreground">Strategic roadmap for long-term legacy goals and transition plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Target, label: "Core Objective", val: "Wealth Preservation" },
          { icon: ShieldCheck, label: "Trust Structure", val: "Dynasty Trust" },
          { icon: Flag, label: "Next Milestone", val: "Foundation Alpha" }
        ].map((item, i) => (
          <Card key={i} className="glass-panel text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">{item.label}</p>
              <p className="text-lg font-headline font-semibold">{item.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-headline font-bold">Integrated Roadmap</h2>
        <div className="space-y-4 relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5" />
          
          {roadmap.map((item) => (
            <Card key={item.id} className="glass-panel ml-16 relative border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary/40 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(75,163,199,0.3)] group-hover:scale-110 transition-transform">
                <Milestone className="h-4 w-4 text-primary" />
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant={item.status === 'Completed' ? 'secondary' : 'outline'} className="text-[10px]">
                      {item.status}
                    </Badge>
                  </div>
                  <span className="text-sm font-headline text-muted-foreground">{item.date}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary shadow-[0_0_10px_rgba(75,163,199,0.5)] transition-all duration-1000" 
                      style={{ width: `${item.progress}%` }} 
                    />
                  </div>
                  <span className="text-xs font-bold text-primary">{item.progress}%</span>
                </div>
              </CardContent>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-6 w-6 text-primary" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}