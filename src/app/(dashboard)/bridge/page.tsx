
"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Landmark, 
  Plus, 
  Link as LinkIcon, 
  User,
  Users,
  AlertTriangle,
  Globe,
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Coins,
  MapPin,
  Home,
  Palmtree,
  Gem,
  FileText,
  Calendar,
  Layers,
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
  { name: 'Tactical', value: 24, color: '#CBD5E1' },
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
                  <div className={cn(dotSize, "rounded-full border border-white shadow-sm", m?.color)} />
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
                  <Avatar className="h-5 w-5 border-2 border-white shadow-sm">
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
    <div className="space-y-10 max-w-7xl mx-auto pb-32 animate-in fade-in duration-500">
      {/* Header Advisor Topline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-primary/40 text-primary bg-primary/10">Heritage Hub</Badge>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocol: Hartmann-Global</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Hartmann Family Total Wealth</p>
            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl font-headline font-bold text-slate-900 tracking-tighter">€380M</h1>
              <span className="text-xl font-headline font-bold text-emerald-600">+4.2% <span className="text-sm opacity-60">annual growth</span></span>
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
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-xs font-bold text-slate-700">Tactical (24%)</span>
              </div>
            </div>
          </div>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="bg-slate-100 p-1 rounded-xl">
            <TabsList className="bg-transparent">
              <TabsTrigger value="individual" className="text-[10px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-none"><User className="mr-2 h-3.5 w-3.5" /> Markus</TabsTrigger>
              <TabsTrigger value="aggregated" className="text-[10px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-none"><Users className="mr-2 h-3.5 w-3.5" /> Aggregated</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { title: "Biggest Risk", icon: AlertTriangle, val: "55%", label: "Property Concentration", desc: "Foundational industrial exposure.", color: "text-red-600", members: ["Markus", "Sophie"] },
          { title: "Liquidity", icon: Coins, val: "€42M", label: "Cash Idle", desc: "Opportunity cost identified.", color: "text-amber-600", members: ["Markus"] },
          { title: "Generational", icon: Zap, val: "78%", label: "DNA Alignment", desc: "Governance stability score.", color: "text-primary", members: [] },
          { title: "Geography", icon: Globe, val: "47%", label: "Asia Exposure", desc: "Strategic Singapore node.", color: "text-slate-500", members: ["Sophie"] },
          { title: "Efficiency", icon: BarChart3, val: "94%", label: "Tax Yield", desc: "Estate planning grade.", color: "text-emerald-600", members: ["Markus", "Sophie"] }
        ].map((card, i) => (
          <Card key={i} className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-[10px] font-bold uppercase tracking-widest flex items-center gap-2", card.color)}>
                <card.icon className="h-3.5 w-3.5" /> {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xl font-headline font-bold text-slate-900">{card.val}</p>
                {card.members.length > 0 && <MemberIndicators members={card.members} />}
              </div>
              <p className="text-[10px] font-bold text-slate-800 uppercase">{card.label}</p>
              <p className="text-[10px] text-slate-400 italic leading-tight">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Strategy Terminal */}
      <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden rounded-3xl relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <ShieldCheck className="h-40 w-40" />
        </div>
        <CardHeader className="border-b border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-headline font-bold flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary fill-primary" />
                Top Strategic Moves
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">Direct council actions to stabilize the Hartmann legacy.</CardDescription>
            </div>
            <Link href="/chart-room">
              <Button className="bg-primary hover:bg-primary/90 text-white border-none px-6 rounded-xl shadow-lg h-11 text-[11px] font-bold uppercase tracking-widest">
                Chart Room <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { title: "Reduce RE Concentration", desc: "Rebalance industrial holdings into liquid growth technology.", icon: Home, link: "/chart-room" },
              { title: "Plan Inheritance Inflow", desc: "Structure the upcoming settlement for generational tax efficiency.", icon: Landmark, link: "/heritage-timeline" },
              { title: "Secure G3 Mandate", desc: "Execute the primary relocation strategy using idle tactical reserves.", icon: MapPin, link: "/simulator" },
            ].map((action, i) => (
              <Link href={action.link} key={i} className="group p-8 hover:bg-white/[0.03] transition-colors cursor-pointer block">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/40 transition-all">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{action.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{action.desc}</p>
                <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Track <ArrowRight className="ml-2 h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Breakdown Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Family Portfolio Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PORTFOLIO_BREAKDOWN.map((item) => (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="border-slate-200 shadow-sm bg-white hover:border-primary/20 transition-all cursor-default overflow-hidden group rounded-2xl">
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
                         <span className="text-[9px] text-slate-400 font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Details</span>
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
                <TooltipContent side="top" className="p-4 bg-white border-slate-200 shadow-2xl rounded-2xl min-w-[200px] z-[100]">
                  <div className="space-y-3 text-slate-900">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{item.name} Split</p>
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
      </section>

      {/* Ledger Section */}
      <Tabs defaultValue="linked" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="linked" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-[10px] font-bold uppercase px-6 shadow-none">
              Financial Ledger
            </TabsTrigger>
            <TabsTrigger value="physical" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-[10px] font-bold uppercase px-6 shadow-none">
              Generational Assets
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="rounded-xl border-slate-200 bg-white text-slate-600 h-10 px-4 text-[10px] uppercase font-bold tracking-widest">
              <LinkIcon className="mr-2 h-4 w-4" /> Link API
            </Button>
            <Button size="sm" className="rounded-xl shadow-lg h-10 px-6 text-[10px] uppercase font-bold tracking-widest">
              <Plus className="mr-2 h-4 w-4" /> Register Asset
            </Button>
          </div>
        </div>

        <TabsContent value="linked">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">Ledger Integration</CardTitle>
                  <CardDescription>Real-time banking feeds and private holdings.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synced 2m ago</span>
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
              <Card key={asset.id} className="border-slate-200 shadow-sm bg-white hover:border-primary/20 transition-all group rounded-2xl overflow-hidden">
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
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <FileText className="h-4 w-4" />
                      <span>{asset.documentCount} Doc(s)</span>
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
