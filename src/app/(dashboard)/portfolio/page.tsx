
"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Layers, 
  Globe,
  Briefcase,
  Users,
  Percent
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from "recharts";
import { Progress } from "@/components/ui/progress";

const assetAllocation = [
  { name: 'Equities', value: 60, color: 'hsl(var(--primary))' },
  { name: 'Real Estate', value: 20, color: 'hsl(var(--secondary))' },
  { name: 'Fixed Income', value: 15, color: 'hsl(var(--accent))' },
  { name: 'Alternatives', value: 5, color: 'hsl(var(--muted-foreground))' },
];

const performanceData = [
  { year: '2020', return: 12.4 },
  { year: '2021', return: 18.2 },
  { year: '2022', return: -4.5 },
  { year: '2023', return: 14.8 },
  { year: '2024 YTD', return: 6.2 },
];

const generationalBreakdown = [
  {
    bucket: "Equities",
    total: "$85.4M",
    members: [
      { name: "Julian (G1)", percent: 45, color: "bg-primary" },
      { name: "Elena (G1)", percent: 35, color: "bg-primary/60" },
      { name: "Marcus (G2)", percent: 20, color: "bg-primary/30" }
    ]
  },
  {
    bucket: "Real Estate",
    total: "$28.5M",
    members: [
      { name: "Julian (G1)", percent: 70, color: "bg-primary" },
      { name: "Elena (G1)", percent: 30, color: "bg-primary/60" }
    ]
  },
  {
    bucket: "Alternatives",
    total: "$7.1M",
    members: [
      { name: "Marcus (G2)", percent: 50, color: "bg-primary/30" },
      { name: "Sarah (G2)", percent: 50, color: "bg-accent" }
    ]
  },
  {
    bucket: "Fixed Income",
    total: "$21.4M",
    members: [
      { name: "Elena (G1)", percent: 100, color: "bg-primary/60" }
    ]
  }
];

export default function PortfolioPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-muted-foreground">Quantitative breakdown of asset allocation, performance, and generational ownership.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocation}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--foreground), 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Annual Returns (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--foreground), 0.05)" />
                <XAxis dataKey="year" stroke="hsla(var(--foreground), 0.4)" fontSize={12} />
                <YAxis stroke="hsla(var(--foreground), 0.4)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--foreground), 0.1)' }}
                  cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
                />
                <Bar dataKey="return" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Generational Ownership Breakdown
              </CardTitle>
              <CardDescription>Percentage of ownership per family member across major asset buckets.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Aggregated Family View
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {generationalBreakdown.map((item) => (
              <div key={item.bucket} className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm">{item.bucket}</h4>
                  <span className="text-xs font-headline font-bold text-primary">{item.total}</span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-white/5">
                  {item.members.map((member, i) => (
                    <div 
                      key={i} 
                      className={`${member.color} transition-all duration-500`} 
                      style={{ width: `${member.percent}%` }}
                      title={`${member.name}: ${member.percent}%`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {item.members.map((member, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className={`w-2 h-2 rounded-full ${member.color}`} />
                        <span>{member.name}</span>
                      </div>
                      <span className="font-bold">{member.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Geographic Spread</CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {['North America (65%)', 'Europe (20%)', 'Asia Pacific (15%)'].map((loc) => (
                <div key={loc} className="flex items-center justify-between text-sm">
                  <span>{loc.split(' (')[0]}</span>
                  <span className="font-bold text-primary">{loc.split('(')[1].replace(')', '')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Top Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/5">
              {[
                { name: 'Apple Inc.', sector: 'Tech', value: '$12.4M', weight: '8.7%' },
                { name: 'Aivaz Private Equity Fund II', sector: 'Alternatives', value: '$8.2M', weight: '5.8%' },
                { name: 'Central London Commercial RE', sector: 'Real Estate', value: '$15.0M', weight: '10.5%' },
                { name: 'US Treasury Bills', sector: 'Fixed Income', value: '$10.0M', weight: '7.0%' },
              ].map((hold) => (
                <div key={hold.name} className="py-3 flex items-center justify-between group cursor-default">
                  <div>
                    <p className="font-bold text-sm">{hold.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{hold.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-sm text-primary">{hold.value}</p>
                    <p className="text-[10px] text-muted-foreground">{hold.weight} weight</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
