"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, ArrowUpRight, ArrowDownRight, MoreHorizontal, Wallet } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4780 },
  { name: 'May', value: 5890 },
  { name: 'Jun', value: 6390 },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Portfolio Command</h1>
        <p className="text-muted-foreground">Diversified assets and family ecosystem performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Family Worth</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">$142,500,230</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +12.5%
              </span>
              <span className="text-xs text-muted-foreground">from last year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Liquid Assets</CardTitle>
            <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">PREMIUM</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">$38,210,000</div>
            <div className="text-xs text-muted-foreground mt-1">26.8% of total portfolio</div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risk Exposure</CardTitle>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">Conservative</div>
            <div className="mt-2">
              <Progress value={35} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel overflow-hidden border-white/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aggregate Growth</CardTitle>
              <CardDescription>Visualizing performance across all trust entities.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">YTD</Badge>
              <Badge variant="outline">MAX</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsla(var(--foreground), 0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsla(var(--foreground), 0.5)', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsla(var(--foreground), 0.5)', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsla(var(--foreground), 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Recent Trust Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Vanguard S&P 500 Dividend</p>
                    <p className="text-xs text-muted-foreground">Portfolio Rebalance • {i + 1} hours ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-400">+$12,450.00</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">TRUST-A4</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Legacy Strategy Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{i === 1 ? 'Q3 Trust Capitalization' : i === 2 ? 'Global Entity Audit' : 'Foundation Setup'}</span>
                  <span className="font-bold">{i === 1 ? '85%' : i === 2 ? '40%' : '10%'}</span>
                </div>
                <Progress value={i === 1 ? 85 : i === 2 ? 40 : 10} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}