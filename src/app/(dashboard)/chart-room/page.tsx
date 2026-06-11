"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Waves, Anchor, ArrowRight, Compass } from "lucide-react";

export default function ChartRoomHub() {
  const tools = [
    {
      title: "Heritage Strategy",
      description: "Define long-term objectives, trust structures, and family mission protocols.",
      href: "/strategy",
      icon: Map,
      color: "text-primary",
      status: "Active"
    },
    {
      title: "Matrix Simulator",
      description: "Run high-fidelity simulations of financial market events and social family transitions.",
      href: "/simulator",
      icon: Waves,
      color: "text-secondary",
      status: "Ready"
    },
    {
      title: "Generational Timeline",
      description: "Map the generational journey from current state to legacy ideal across 50+ years.",
      href: "/heritage-timeline",
      icon: Anchor,
      color: "text-accent",
      status: "Updated"
    }
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Navigation Deck</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight flex items-center gap-4">
          <Compass className="h-10 w-10 text-primary" />
          Chart Room
        </h1>
        <p className="text-xl text-muted-foreground italic font-headline max-w-2xl leading-relaxed">
          The strategic center for mapping your family's multi-generational course and simulating future scenarios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.title} className="group">
            <Card className="glass-panel border-white/5 hover:border-primary/30 transition-all duration-500 h-full flex flex-col overflow-hidden">
              <div className="h-2 w-full bg-primary/10 group-hover:bg-primary/30 transition-colors" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/20 transition-all duration-500`}>
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest opacity-50">{tool.status}</Badge>
                </div>
                <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-6 flex justify-end">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  Enter {tool.title.split(' ')[1] || tool.title} <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="glass-panel bg-primary/5 border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Map className="h-48 w-48" />
        </div>
        <CardContent className="p-12 relative z-10 space-y-4">
          <h3 className="text-2xl font-headline font-bold">Institutional Readiness</h3>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            Your family's strategic path is currently 78% aligned. Use the Matrix Simulator to identify emotional friction points in the upcoming Gen-2 transition window.
          </p>
          <div className="pt-6">
            <Link href="/simulator">
              <Button size="lg" className="px-8 shadow-xl">
                Run Alignment Simulation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
