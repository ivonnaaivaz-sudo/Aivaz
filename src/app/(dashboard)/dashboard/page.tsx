
"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Fingerprint,
  Activity
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: 'Jan', value: 138 },
  { name: 'Feb', value: 140 },
  { name: 'Mar', value: 139 },
  { name: 'Apr', value: 142 },
  { name: 'May', value: 145 },
  { name: 'Jun', value: 142 },
];

export default function DashboardPage() {
  const { user } = useUser();
  const { data: dna, loading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">Executive Overview</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Family Command Center</h1>
        <p className="text-muted-foreground italic">Consolidated family net worth and strategic alignment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Family Net Worth</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">$142.4M</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
              <ArrowUpRight className="h-3 w-3" /> +2.4% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Legacy Alignment</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">78%</div>
            <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
              <Activity className="h-3 w-3" /> Gap detected in Gen 2
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Family DNA</CardTitle>
            <Fingerprint className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-headline truncate">
              {dna?.generationalStage || "Processing..." }
            </div>
            <div className="text-[10px] text-muted-foreground font-bold mt-1">
              Extracted & Active
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trust Entities</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">12</div>
            <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
              Across 4 jurisdictions
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-panel border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Aggregate Wealth Trajectory</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--foreground), 0.05)" />
                <XAxis dataKey="name" stroke="hsla(var(--foreground), 0.4)" fontSize={12} />
                <YAxis stroke="hsla(var(--foreground), 0.4)" fontSize={12} tickFormatter={(v) => `$${v}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--foreground), 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Legacy Narrative Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm italic leading-relaxed text-foreground opacity-80">
                "{dna?.narrativeSummary || "Your legacy DNA is being synthesized. Complete the profiling journey to unlock human-centric insights."}"
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Core Priorities</p>
              <div className="flex flex-wrap gap-2">
                {dna?.coreValues?.slice(0, 3).map((val: string) => (
                  <Badge key={val} variant="secondary" className="bg-white/5 border-white/10">{val}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
