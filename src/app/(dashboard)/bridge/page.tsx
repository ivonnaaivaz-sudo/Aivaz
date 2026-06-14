"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, doc, setDoc, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Landmark, 
  Plus, 
  Link as LinkIcon, 
  User,
  Users,
  AlertTriangle,
  Globe,
  RefreshCw,
  TrendingUp,
  Zap,
  ArrowRight,
  ShieldCheck,
  Coins,
  MapPin,
  Home,
  Gem,
  Palmtree,
  FileText,
  Calendar,
  Layers,
  Activity,
  BarChart3
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const MEMBERS = [
  { name: "Markus", color: "bg-blue-500", avatar: "https://picsum.photos/seed/markus/100/100" },
  { name: "Elena", color: "bg-purple-500", avatar: "https://picsum.photos/seed/elena/100/100" },
  { name: "Sophie", color: "bg-emerald-500", avatar: "https://picsum.photos/seed/sophie/100/100" },
  { name: "Alexander", color: "bg-amber-500", avatar: "https://picsum.photos/seed/alexander/100/100" },
];

const STRATEGIC_DATA = [
  { name: 'Strategic', value: 76, color: 'hsl(var(--primary))' },
  { name: 'Tactical', value: 24, color: '#94a3b8' },
];

const PORTFOLIO_BREAKDOWN = [
  { 
    name: "Real Estate & Industrial", 
    pct: 55, 
    icon: Home,
    members: ["Markus", "Sophie"], 
    contributions: [
      { name: "Markus", share: 68 },
      { name: "Sophie", share: 22 },
      { name: "Alexander", share: 10 }
    ]
  },
  { 
    name: "Industrial Chemicals", 
    pct: 25, 
    icon: Landmark,
    members: ["Markus", "Alexander"], 
    contributions: [
      { name: "Markus", share: 90 },
      { name: "Alexander", share: 10 }
    ]
  },
  { 
    name: "Tech / Growth Equity", 
    pct: 9, 
    icon: Zap,
    members: ["Alexander"], 
    contributions: [
      { name: "Alexander", share: 100 }
    ]
  },
  { 
    name: "Cash & Liquid", 
    pct: 11, 
    icon: Coins,
    members: ["Markus", "Elena"], 
    contributions: [
      { name: "Markus", share: 50 },
      { name: "Elena", share: 50 }
    ]
  }
];

const HARTMANN_ACCOUNTS = [
  { id: 1, name: "Hartmann Family Trust", institution: "Morgan Stanley", balance: "€45,200,000", type: "Irrevocable Trust", owner: "Aggregated", status: "Active", breakdown: [{ member: "Markus", pct: 60 }, { member: "Elena", pct: 20 }, { member: "Sophie", pct: 10 }, { member: "Alexander", pct: 10 }] },
  { id: 2, name: "Offshore Strategic Reserve", institution: "UBS Zurich", balance: "€28,150,000", type: "Private Banking", owner: "Markus", status: "Synchronized", breakdown: [{ member: "Markus", pct: 100 }] },
  { id: 3, name: "Industrial Holding Co", institution: "Deutsche Bank", balance: "€12,400,000", type: "Business Account", owner: "Markus", status: "Active", breakdown: [{ member: "Markus", pct: 90 }, { member: "Alexander", pct: 10 }] },
  { id: 4, name: "Singapore Real Estate Fund", institution: "DBS Singapore", balance: "€56,750,230", type: "Investment Account", owner: "Aggregated", status: "Active", breakdown: [{ member: "Sophie", pct: 60 }, { member: "Alexander", pct: 40 }] },
  { id: 5, name: "Alexander London Growth", institution: "Goldman Sachs", balance: "€5,200,000", type: "Venture Fund", owner: "Next Gen", status: "Active", breakdown: [{ member: "Alexander", pct: 100 }] },
];

export default function BridgeHub() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: profile } = useDoc(user ? `users/${user.uid}` : null);
  const [viewMode, setViewMode] = useState<"individual" | "aggregated">("aggregated");
  
  const userRole = profile?.role || "Principal";
  const isLimited = userRole === "Limited Member" || userRole === "Advisor/Guest";

  const assetsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "assets"));
  }, [user, db]);

  const { data: manualAssets = [] } = useCollection(assetsQuery);

  const filteredAccounts = useMemo(() => {
    if (viewMode === 'individual') {
      return HARTMANN_ACCOUNTS.filter(acc => acc.owner === 'Markus');
    }
    return HARTMANN_ACCOUNTS;
  }, [viewMode]);

  const MemberIndicators = ({ members: membersList, size = "sm" }: { members: string[], size?: "xs" | "sm" }) => {
    if (isLimited) return null;
    const dotSize = size === "xs" ? "w-1.5 h-1.5" : "w-2 h-2";
    return (
      <div className="flex -space-x-1 items-center ml-2">
        {membersList.map(name => {
          const m = MEMBERS.find(mem => mem.name === name);
          return (
            <TooltipProvider key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(dotSize, "rounded-full border border-white", m?.color)} />
                </TooltipTrigger>
                <TooltipContent className="p-1 text-[8px] font-bold uppercase">{name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    );
  };

  const MemberAvatars = ({ members: membersList }: { members: string[] }) => {
    if (isLimited) return null;
    return (
      <div className="flex -space-x-2 items-center">
        {membersList.map(name => {
          const m = MEMBERS.find(mem => mem.name === name);
          return (
            <TooltipProvider key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-5 w-5 border-2 border-white">
                    <AvatarImage src={m?.avatar} />
                    <AvatarFallback className="text-[6px]">{name[0]}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent className="p-1 text-[8px] font-bold uppercase">{name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-32">
      {/* Header Advisor Topline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-primary/20 text-primary bg-primary/5">Aivaz Heritage Hub</Badge>
            <span className="text-slate-300 opacity-50">|</span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Protocol: Hartmann-Global</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Hartmann Family Total Wealth</p>
            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl font-headline font-bold text-slate-900 tracking-tighter">€380M</h1>
              <span className="text-xl font-headline font-bold text-emerald-500">+4.2% <span className="text-sm opacity-60">this year</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STRATEGIC_DATA}
                    innerRadius={28}
                    outerRadius={38}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {STRATEGIC_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <Layers className="h-4 w-4 text-slate-300" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-bold text-slate-700">Strategic (76%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs font-bold text-slate-700">Tactical (24%)</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic max-w-[140px]">Balanced for multi-generational stability.</p>
            </div>
          </div>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="bg-slate-100 p-1 rounded-xl">
            <TabsList className="bg-transparent">
              <TabsTrigger value="individual" className="text-[10px] font-bold uppercase data-[state=active]:bg-white"><User className="mr-2 h-3.5 w-3.5" /> Dr. Markus</TabsTrigger>
              <TabsTrigger value="aggregated" className="text-[10px] font-bold uppercase data-[state=active]:bg-white"><Users className="mr-2 h-3.5 w-3.5" /> Aggregated</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {viewMode === 'aggregated' ? (
        <div className="space-y-12 animate-in fade-in duration-500">
          {/* Smart Advisor Insight Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-white border-slate-200 shadow-sm col-span-1 lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" /> Biggest Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-headline font-bold">55%</p>
                  <MemberIndicators members={["Markus", "Sophie"]} />
                </div>
                <p className="text-[10px] font-bold text-slate-900 uppercase">Real Estate Concentration</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  "Mostly Markus's industrial properties in Munich + Sophie's Singapore assets. High sensitivity to EU/Asia corridor."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2">
                  <Coins className="h-3.5 w-3.5" /> Liquidity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-headline font-bold text-amber-600">€42M</p>
                  <MemberIndicators members={["Markus"]} />
                </div>
                <p className="text-[10px] font-bold text-slate-900 uppercase">Cash Sitting Idle (11%)</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  "Significant dry powder. Estimated opportunity cost of ~€1.8M/year compared to fixed-income benchmarks."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> Generational
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xl font-headline font-bold text-primary">78%</p>
                <p className="text-[10px] font-bold text-slate-900 uppercase">Control & Alignment</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  "G1 holds majority control. G3 (Sophie & Alexander) pushing for growth & ESG impact. Strategic tension detected."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" /> Geography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xl font-headline font-bold text-slate-900">47%</p>
                <p className="text-[10px] font-bold text-slate-900 uppercase">Asia Exposure</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  "Concentrated in Singapore growth equities and premium residential holdings. Vital pillar for G3 succession."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200 shadow-sm border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Top Holdings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {[
                    { label: "RE & Industrial", val: "55%", members: ["Markus", "Sophie"] },
                    { label: "Tech / Growth", val: "9%", members: ["Alexander"] },
                    { label: "Cash & Liquid", val: "11%", members: ["Markus"] },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-600 truncate mr-2">{h.label}</span>
                      <div className="flex items-center gap-2">
                        <MemberIndicators members={h.members} />
                        <span className="text-[10px] font-bold text-slate-900">{h.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Strategy Terminal */}
          <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <ShieldCheck className="h-40 w-40" />
            </div>
            <CardHeader className="border-b border-white/10 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                    <Zap className="h-6 w-6 text-primary fill-primary" />
                    Top 3 Things to Address
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-1">Stabilize the Hartmann legacy through immediate council action.</CardDescription>
                </div>
                <Link href="/chart-room">
                  <Button className="bg-primary hover:bg-primary/90 text-white border-none px-6 rounded-xl shadow-lg">
                    Launch Chart Room <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                {[
                  { title: "Reduce RE Concentration", desc: "Rebalance 8% of Munich industrial holdings into liquid ESG technology to neutralize geopolitical risk.", icon: Home, link: "/chart-room" },
                  { title: "Plan Inheritance Inflow", desc: "Structure the upcoming €8.4M G1 settlement into the G2/G3 trust to optimize for inheritance tax gap.", icon: Landmark, link: "/heritage-timeline" },
                  { title: "Secure G3 Housing", desc: "Execute the Sophie London Residence mandate using idle tactical reserves to protect core family capital.", icon: MapPin, link: "/simulator" },
                ].map((action, i) => (
                  <Link href={action.link} key={i} className="group p-8 hover:bg-white/[0.03] transition-colors cursor-pointer block">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all border border-white/10 group-hover:border-primary/40">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{action.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{action.desc}</p>
                    <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Start Workflow <ArrowRight className="ml-2 h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Family Portfolio Breakdown */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Family Portfolio Breakdown</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PORTFOLIO_BREAKDOWN.map((item) => (
                <TooltipProvider key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card className="bg-white border-slate-200 shadow-sm hover:border-primary/40 transition-all cursor-default overflow-hidden group">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.name}</p>
                            <p className="text-2xl font-headline font-bold text-slate-900">{item.pct}%</p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                            <item.icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="flex items-center justify-between">
                             <MemberAvatars members={item.members} />
                             <Badge variant="ghost" className="text-[9px] text-slate-400 font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">View Detail</Badge>
                          </div>
                          <div className="mt-4 flex gap-1 h-1 w-full rounded-full overflow-hidden bg-slate-100">
                             {item.contributions.map((c, i) => (
                                <div 
                                  key={i} 
                                  className={cn("h-full", MEMBERS.find(m => m.name === c.name)?.color)} 
                                  style={{ width: `${c.share}%` }} 
                                />
                             ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="p-4 bg-white border-slate-200 shadow-xl rounded-2xl min-w-[200px] z-[100]">
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{item.name} Breakdown</p>
                        {item.contributions.map((c, i) => (
                          <div key={i} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", MEMBERS.find(m => m.name === c.name)?.color)} />
                              <span className="text-xs font-bold text-slate-700">{c.name}</span>
                            </div>
                            <span className="text-xs font-bold text-primary">{c.share}%</span>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Individual View for Markus */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-md bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Principal Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="text-center pb-6 border-b border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">My Total Assets</p>
                  <p className="text-4xl font-headline font-bold text-slate-900">€247,000,000</p>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Linked Accounts</span>
                    <span className="font-bold">€85.7M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Manual Assets</span>
                    <span className="font-bold">€161.3M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg">My Managed Accounts</CardTitle>
                <CardDescription>Accounts where Dr. Markus Hartmann is the primary principal.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-6 py-4">Account</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Institution</TableHead>
                      <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 pr-6 py-4">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((acc) => (
                      <TableRow key={acc.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                        <TableCell className="pl-6 font-medium py-4">
                          <p className="text-slate-900">{acc.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{acc.type}</p>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 py-4">{acc.institution}</TableCell>
                        <TableCell className="text-right font-headline font-bold text-primary pr-6 py-4">{acc.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Ledger Section */}
      <Tabs defaultValue="linked" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="linked" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] font-bold uppercase px-6">
              Financial Ledger
            </TabsTrigger>
            <TabsTrigger value="physical" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] font-bold uppercase px-6">
              Generational Assets
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="rounded-xl border-slate-200 h-9">
              <LinkIcon className="mr-2 h-4 w-4" /> Link External API
            </Button>
            <Button size="sm" className="rounded-xl shadow-lg h-9">
              <Plus className="mr-2 h-4 w-4" /> Register Asset
            </Button>
          </div>
        </div>

        <TabsContent value="linked">
          <Card className="border-slate-200 shadow-md bg-white overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Ledger Integration</CardTitle>
                  <CardDescription>Real-time banking feeds and private trust holdings.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last synced 2m ago</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest pl-8 py-5">Account</TableHead>
                    <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest py-5">Institution</TableHead>
                    <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest py-5">Status</TableHead>
                    <TableHead className="text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest pr-8 py-5">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((acc: any) => (
                    <TableRow key={acc.id} className="hover:bg-slate-50 transition-colors border-slate-100 group">
                      <TableCell className="font-medium py-6 pl-8">
                        <div className="flex items-center gap-3">
                          {viewMode === 'aggregated' && <MemberIndicators members={acc.breakdown?.map((b: any) => b.member) || []} />}
                          <div>
                            <p className="text-slate-900 font-bold">{acc.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-70">{acc.type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm py-6">{acc.institution}</TableCell>
                      <TableCell className="py-6">
                        <Badge variant="outline" className={cn(
                          "text-[8px] font-bold px-2 py-0 h-5",
                          acc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-primary/5 text-primary border-primary/20'
                        )}>
                          {acc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-headline font-bold text-primary pr-8 py-6 text-lg">{acc.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physical">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manualAssets.map((asset: any) => (
              <Card key={asset.id} className="border-slate-200 shadow-md bg-white hover:ring-2 hover:ring-primary/20 transition-all group rounded-2xl overflow-hidden">
                <CardHeader className="pb-2 px-6 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[9px] font-bold uppercase px-3 py-1">
                        {asset.type}
                      </Badge>
                      {viewMode === 'aggregated' && <MemberIndicators members={asset.breakdown?.map((b: any) => b.member) || ["Markus"]} />}
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-primary/5 transition-colors border border-slate-100">
                      {asset.type === 'Real Estate' ? <Home className="h-5 w-5 text-slate-500 group-hover:text-primary" /> : 
                       asset.type === 'Art' ? <Palmtree className="h-5 w-5 text-slate-500 group-hover:text-primary" /> : <Gem className="h-5 w-5 text-slate-500 group-hover:text-primary" />}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors font-headline font-bold text-slate-900">{asset.name}</CardTitle>
                  <div className="flex items-center gap-2 text-slate-400 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">{asset.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Latest Appraisal</p>
                    <p className="text-3xl font-headline font-bold text-slate-900">€{asset.appraisalValue?.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{asset.appraisalDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <FileText className="h-4 w-4" />
                      <span>{asset.documentCount} Secure Doc(s)</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest group-hover:text-primary rounded-xl">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
