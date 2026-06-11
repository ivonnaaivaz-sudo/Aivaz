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
  Percent,
  AlertTriangle
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

const assetAllocation = [
  { name: 'Private Tech Equity', value: 55, color: 'hsl(var(--primary))' },
  { name: 'Real Estate (Asia)', value: 30, color: 'hsl(var(--secondary))' },
  { name: 'Fixed Income', value: 10, color: 'hsl(var(--accent))' },
  { name: 'Cash/Liquid', value: 5, color: 'hsl(var(--muted-foreground))' },
];

const performanceData = [
  { year: '2020', return: 12.4 },
  { year: '2021', return: 28.2 },
  { year: '2022', return: -4.5 },
  { year: '2023', return: 18.8 },
  { year: '2024 YTD', return: 12.4 },
];

const generationalBreakdown = [
  {
    bucket: "Tech Equity",
    total: "$27.5M",
    members: [
      { name: "Julian (G1)", percent: 70, color: "bg-primary" },
      { name: "Marcus (G2)", percent: 30, color: "bg-primary/60" }
    ]
  },
  {
    bucket: "Real Estate",
    total: "$15.0M",
    members: [
      { name: "Julian (G1)", percent: 60, color: "bg-primary" },
      { name: "Elena (G2)", percent: 40, color: "bg-primary/30" }
    ]
  },
  {
    bucket: "Fixed Income",
    total: "$5.0M",
    members: [
      { name: "Julian (G1)", percent: 100, color: "bg-primary" }
    ]
  },
  {
    bucket: "Cash/Liquid",
    total: "$2.5M",
    members: [
      { name: "Marcus (G2)", percent: 50, color: "bg-primary/60" },
      { name: "Elena (G2)", percent: 50, color: "bg-primary/30" }
    ]
  }
];

export default function PortfolioPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-muted-foreground">Comprehensive oversight of the $50M Aivaz Heritage Portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Asset Allocation
              </CardTitle>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">55% Concentration Alert</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetAllocation} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--foreground), 0.1)' }} />
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
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--foreground), 0.1)' }} cursor={{ fill: 'hsla(var(--primary), 0.1)' }} />
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
              <CardDescription>Relative exposure per principal across the $50M AUM.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Aggregated Family View</Badge>
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
                    <div key={i} className={`${member.color} transition-all duration-500`} style={{ width: `${member.percent}%` }} />
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
    </div>
  );
}
