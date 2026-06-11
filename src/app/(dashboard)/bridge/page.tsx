"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Compass, LayoutDashboard, PieChart, Landmark, ArrowRight, TrendingUp } from "lucide-react";

export default function BridgeHub() {
  const sectors = [
    {
      title: "Command Center",
      description: "Live oversight of family net worth, strategic alignment, and real-time risk telemetry.",
      href: "/dashboard",
      icon: LayoutDashboard,
      color: "text-primary",
      status: "Live"
    },
    {
      title: "Portfolio Analytics",
      description: "Deep quantitative analysis of asset allocation, annual returns, and sectoral weightings.",
      href: "/portfolio",
      icon: PieChart,
      color: "text-secondary",
      status: "Calculated"
    },
    {
      title: "Holdings & Accounts",
      description: "Comprehensive registry of institutional bank feeds and manual physical asset appraisals.",
      href: "/accounts",
      icon: Landmark,
      color: "text-accent",
      status: "Synced"
    }
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Main Deck</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight flex items-center gap-4">
          <Compass className="h-10 w-10 text-primary" />
          The Bridge
        </h1>
        <p className="text-xl text-muted-foreground italic font-headline max-w-2xl leading-relaxed">
          The primary operational station for tracking wealth growth, allocation strategy, and multi-jurisdictional liquidity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sectors.map((sector) => (
          <Link href={sector.href} key={sector.title} className="group">
            <Card className="glass-panel border-white/5 hover:border-primary/30 transition-all duration-500 h-full flex flex-col overflow-hidden">
              <div className="h-2 w-full bg-primary/10 group-hover:bg-primary/30 transition-colors" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/20 transition-all duration-500`}>
                    <sector.icon className={`h-6 w-6 ${sector.color}`} />
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest opacity-50">{sector.status}</Badge>
                </div>
                <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors">{sector.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2">{sector.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-6 flex justify-end">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  Access {sector.title.split(' ')[0]} <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="glass-panel bg-primary/5 border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <TrendingUp className="h-48 w-48" />
        </div>
        <CardContent className="p-12 relative z-10 space-y-4">
          <h3 className="text-2xl font-headline font-bold">Consolidated Performance</h3>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            Your aggregate family net worth has increased by **2.4%** since the last institutional audit. Most growth is driven by the technology equity sector in the G1 primary portfolio.
          </p>
          <div className="pt-6">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 shadow-xl">
                Review Command Center
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
