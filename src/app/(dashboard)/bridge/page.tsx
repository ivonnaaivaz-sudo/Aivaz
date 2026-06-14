"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  Coins,
  MapPin,
  Home,
  Palmtree,
  Gem,
  FileText,
  BarChart3
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip as ChartTooltip
} from "recharts";
import { cn } from "@/lib/utils";

const MEMBERS = [
  { name: "Markus", color: "bg-blue-500", hex: "#3b82f6", avatar: "https://picsum.photos/seed/markus/100/100" },
  { name: "Elena", color: "bg-purple-500", hex: "#a855f7", avatar: "https://picsum.photos/seed/elena/100/100" },
  { name: "Sophie", color: "bg-emerald-500", hex: "#10b981", avatar: "https://picsum.photos/seed/sophie/100/100" },
  { name: "Alexander", color: "bg-amber-500", hex: "#f59e0b", avatar: "https://picsum.photos/seed/alexander/100/100" },
];

const INDIVIDUAL_ALLOCATION = [
  { name: 'Real Estate', value: 68, color: '#3b82f6' },
  { name: 'Industrial', value: 22, color: '#64748b' },
  { name: 'Liquid Cash', value: 10, color: '#10b981' },
];

const AGGREGATED_ALLOCATION = [
  { 
    name: 'Real Estate & Industrial', 
    value: 55, 
    color: '#3b82f6',
    stakeholders: [
      { name: "Markus", pct: 60 },
      { name: "Elena", pct: 20 },
      { name: "Sophie", pct: 20 }
    ]
  },
  { 
    name: 'Industrial Chemicals', 
    value: 25, 
    color: '#64748b',
    stakeholders: [
      { name: "Markus", pct: 90 },
      { name: "Alexander", pct: 10 }
    ]
  },
  { 
    name: 'Tech / Growth Equity', 
    value: 9, 
    color: '#f59e0b',
    stakeholders: [
      { name: "Alexander", pct: 100 }
    ]
  },
  { 
    name: 'Cash & Liquid', 
    value: 11, 
    color: '#10b981',
    stakeholders: [
      { name: "Markus", pct: 50 },
      { name: "Sophie", pct: 30 },
      { name: "Alexander", pct: 20 }
    ]
  },
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

  const assetsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "assets"));
  }, [user, db]);

  const { data: manualAssets = [] } = useCollection(assetsQuery);

  const filteredAccounts = useMemo(() => {
    if (viewMode === 'individual') {
      return HARTMANN_ACCOUNTS.filter(acc => acc.owner === 'Markus' || acc.breakdown?.some(b => b.member === 'Markus'));
    }
    return HARTMANN_ACCOUNTS;
  }, [viewMode]);

  const stats = useMemo(() => {
    if (viewMode === 'individual') {
      return [
        { title: "Personal Risk", icon: AlertTriangle, val: "32%", label: "Concentration", desc: "Lower due to trust buffers.", color: "text-amber-600" },
        { title: "Net Liquidity", icon: Coins, val: "€28M", label: "Accessible", desc: "Ready for deployment.", color: "text-emerald-600" },
        { title: "Governance", icon: Zap, val: "92%", label: "Control Score", desc: "Primary voting authority.", color: "text-primary" },
        { title: "Estate Path", icon: BarChart3, val: "98%", label: "Tax Ready", desc: "Markus specific planning.", color: "text-emerald-600" },
      ];
    }
    return [
      { title: "Risk", icon: AlertTriangle, val: "55%", label: "Concentration", desc: "Industrial property heavy.", color: "text-red-600" },
      { title: "Liquidity", icon: Coins, val: "€42M", label: "Cash Idle", desc: "Opportunity cost high.", color: "text-amber-600" },
      { title: "Generational", icon: Zap, val: "78%", label: "DNA Alignment", desc: "Stability index.", color: "text-primary" },
      { title: "Geography", icon: Globe, val: "47%", label: "Asia Exposure", desc: "Strategic Singapore hub.", color: "text-slate-500" },
    ];
  }, [viewMode]);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-32 animate-in fade-in duration-500">
      {/* Header Axis */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-primary/40 text-primary bg-primary/10 px-3">Heritage Hub</Badge>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocol: {viewMode === 'individual' ? 'Personal-Markus' : 'Hartmann-Global'}</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
              {viewMode === 'individual' ? "Markus's Portfolio Stake" : "Hartmann Family Total Wealth"}
            </p>
            <div className="flex items-baseline gap-4">
              <h1 className="text-5xl font-headline font-bold text-slate-900 tracking-tighter">
                {viewMode === 'individual' ? "€242M" : "€380M"}
              </h1>
              <span className="text-xl font-headline font-bold text-emerald-600">+4.2%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="bg-slate-100 p-1 rounded-xl shadow-inner">
            <TabsList className="bg-transparent h-10">
              <TabsTrigger value="individual" className="text-[10px] font-bold uppercase h-8 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-none"><User className="mr-2 h-3.5 w-3.5" /> Individual</TabsTrigger>
              <TabsTrigger value="aggregated" className="text-[10px] font-bold uppercase h-8 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-none"><Users className="mr-2 h-3.5 w-3.5" /> Aggregated</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Strategic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card, i) => (
          <Card key={i} className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-[10px] font-bold uppercase tracking-widest flex items-center gap-2", card.color)}>
                <card.icon className="h-3.5 w-3.5" /> {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-headline font-bold text-slate-900">{card.val}</p>
              <div>
                <p className="text-[10px] font-bold text-slate-800 uppercase">{card.label}</p>
                <p className="text-[10px] text-slate-400 italic leading-tight">{card.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Portfolio Breakdown */}
      <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline font-bold text-slate-900">Capital Segmentation</CardTitle>
              <CardDescription>Visualizing the asset class distribution of the {viewMode === 'individual' ? 'personal stake' : 'family aggregate'}.</CardDescription>
            </div>
            <Badge className="bg-primary/5 text-primary border-primary/20 uppercase text-[10px] font-bold px-3">Dynamic View</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={viewMode === 'individual' ? INDIVIDUAL_ALLOCATION : AGGREGATED_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {(viewMode === 'individual' ? INDIVIDUAL_ALLOCATION : AGGREGATED_ALLOCATION).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Net</p>
                <p className="text-2xl font-headline font-bold text-slate-900">{viewMode === 'individual' ? '€242M' : '€380M'}</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {(viewMode === 'individual' ? INDIVIDUAL_ALLOCATION : AGGREGATED_ALLOCATION).map((item: any) => (
                <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                      {viewMode === 'aggregated' && item.stakeholders && (
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-2">Stakeholders</p>
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {item.stakeholders.map((sh: any) => {
                              const member = MEMBERS.find(m => m.name === sh.name);
                              return (
                                <TooltipProvider key={sh.name}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Avatar className="h-5 w-5 border-2 border-white ring-1 ring-slate-100">
                                        <AvatarImage src={member?.avatar} />
                                        <AvatarFallback className="text-[6px] font-bold">{sh.name[0]}</AvatarFallback>
                                      </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent className="p-2 text-[10px] font-bold">
                                      {sh.name} {sh.pct}%
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {viewMode === 'individual' && (
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Personal Ownership</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-headline font-bold text-slate-900">{item.value}%</p>
                    <p className="text-[10px] text-primary font-bold uppercase">€{(viewMode === 'individual' ? (242 * item.value / 100) : (380 * item.value / 100)).toFixed(1)}M</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holdings & Assets Tabs */}
      <Tabs defaultValue="liquid" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 px-1">
          <TabsList className="bg-slate-100 p-1 rounded-xl h-12">
            <TabsTrigger value="liquid" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-[10px] font-bold uppercase px-8 shadow-none h-10">
              Liquid Holdings
            </TabsTrigger>
            <TabsTrigger value="physical" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-[10px] font-bold uppercase px-8 shadow-none h-10">
              Physical Assets
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 bg-white text-slate-600 h-10 px-4 text-[10px] uppercase font-bold tracking-widest">
              <LinkIcon className="mr-2 h-4 w-4" /> Sync API
            </Button>
          </div>
        </div>

        <TabsContent value="liquid">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">Institutional Feed</CardTitle>
                  <CardDescription>Live banking and private wealth integrations.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400 animate-spin-slow" />
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
                    <TableHead className="text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest pr-8 py-5">Current Stake</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((acc: any) => (
                    <TableRow key={acc.id} className="hover:bg-slate-50 transition-colors border-slate-100 group">
                      <TableCell className="font-medium py-6 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <Landmark className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-slate-900 font-bold">{acc.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{acc.type}</p>
                            {viewMode === 'aggregated' && acc.breakdown && (
                               <div className="flex -space-x-1 mt-2">
                                 {acc.breakdown.map((b: any) => {
                                   const member = MEMBERS.find(m => m.name === b.member);
                                   return (
                                     <TooltipProvider key={b.member}>
                                       <Tooltip>
                                         <TooltipTrigger asChild>
                                           <Avatar className="h-4 w-4 border-2 border-white">
                                             <AvatarImage src={member?.avatar} />
                                             <AvatarFallback className="text-[4px]">{b.member[0]}</AvatarFallback>
                                           </Avatar>
                                         </TooltipTrigger>
                                         <TooltipContent className="p-1 text-[8px] font-bold">
                                           {b.member} {b.pct}%
                                         </TooltipContent>
                                       </Tooltip>
                                     </TooltipProvider>
                                   );
                                 })}
                               </div>
                            )}
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
                      <TableCell className="text-right font-headline font-bold text-primary pr-8 py-6 text-lg">
                        {viewMode === 'individual' && acc.breakdown ? (
                           `€${((parseInt(acc.balance.replace(/[^\d]/g, '')) * (acc.breakdown.find((b: any) => b.member === 'Markus')?.pct || 0)) / 100).toLocaleString()}`
                        ) : acc.balance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physical">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Asset Add Card */}
            <Card className="border-2 border-dashed border-slate-200 shadow-none bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center space-y-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-lg font-headline font-bold text-slate-900">Register Asset</p>
                <p className="text-sm text-slate-400 max-w-[200px]">Add real estate, art, or private holdings to the legacy.</p>
              </div>
            </Card>

            {manualAssets.map((asset: any) => (
              <Card key={asset.id} className="border-slate-200 shadow-sm bg-white hover:border-primary/20 transition-all group rounded-2xl overflow-hidden">
                <CardHeader className="pb-2 px-6 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[9px] font-bold uppercase px-3 py-1">
                      {asset.type}
                    </Badge>
                    <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-primary/5 transition-colors border border-slate-100">
                      {asset.type === 'Real Estate' ? <Home className="h-5 w-5 text-slate-500" /> : 
                      asset.type === 'Art' ? <Palmtree className="h-5 w-5 text-slate-500" /> : <Gem className="h-5 w-5 text-slate-500" />}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-headline font-bold text-slate-900">{asset.name}</CardTitle>
                  <div className="flex items-center gap-2 text-slate-400 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">{asset.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Latest Valuation</p>
                    <p className="text-3xl font-headline font-bold text-slate-900">€{asset.appraisalValue?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <FileText className="h-4 w-4" />
                      <span>{asset.documentCount || 0} Docs</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl">
                      View Records
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
