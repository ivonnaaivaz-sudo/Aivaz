"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Landmark, 
  Plus, 
  Link as LinkIcon, 
  Loader2,
  Home,
  ShieldCheck,
  User,
  Users,
  TrendingUp,
  AlertTriangle,
  Globe,
  RefreshCw,
  FileText,
  MapPin,
  Calendar,
  Gem,
  Palmtree,
  Target,
  Zap,
  Layers,
  BarChart3,
  Dna,
  Scale,
  ShieldAlert,
  Activity,
  ChevronRight,
  Info,
  ArrowUpRight
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
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

const STRATEGIC_VS_TACTICAL = [
  { name: 'Strategic Allocation', value: 76, color: '#1e3a8a', description: 'Core Long-Term Holdings' },
  { name: 'Tactical Allocation', value: 24, color: '#0ea5e9', description: 'Opportunistic / Short-Term' },
];

const LIQUIDITY_BREAKDOWN = [
  { name: 'Liquid (≤30d)', value: 18, color: '#10b981' },
  { name: 'Semi-Liquid (30-365d)', value: 31, color: '#3b82f6' },
  { name: 'Illiquid (>1y)', value: 51, color: '#6366f1' },
];

const SECTOR_CONCENTRATION = [
  { name: 'Real Estate', value: 55 },
  { name: 'Industrials', value: 25 },
  { name: 'Cash', value: 11 },
  { name: 'Tech', value: 9 },
];

const HARTMANN_ACCOUNTS = [
  { id: 1, name: "Hartmann Family Trust", institution: "Morgan Stanley", balance: "€45,200,000", type: "Irrevocable Trust", owner: "Aggregated", status: "Active", breakdown: [{ member: "Markus", pct: 60 }, { member: "Elena", pct: 20 }, { member: "Sophie", pct: 10 }, { member: "Alexander", pct: 10 }] },
  { id: 2, name: "Offshore Strategic Reserve", institution: "UBS Zurich", balance: "€28,150,000", type: "Private Banking", owner: "Markus", status: "Synchronized", breakdown: [{ member: "Markus", pct: 100 }] },
  { id: 3, name: "Industrial Holding Co", institution: "Deutsche Bank", balance: "€12,400,000", type: "Business Account", owner: "Markus", status: "Active", breakdown: [{ member: "Markus", pct: 90 }, { member: "Alexander", pct: 10 }] },
  { id: 4, name: "Singapore Real Estate Fund", institution: "DBS Singapore", balance: "€56,750,230", type: "Investment Account", owner: "Aggregated", status: "Active", breakdown: [{ member: "Sophie", pct: 60 }, { member: "Alexander", pct: 40 }] },
  { id: 5, name: "Alexander London Growth", institution: "Goldman Sachs", balance: "€5,200,000", type: "Venture Fund", owner: "Next Gen", status: "Active", breakdown: [{ member: "Alexander", pct: 100 }] },
];

const RISK_ALERTS = [
  { id: "bs-1", title: "Inheritance Tax Gap", severity: "Critical", impact: "-€8.4M", members: ["Markus", "Sophie"], description: "Exposure detected in G1 -> G3 transition." },
  { id: "bs-2", title: "Real Estate Concentration", severity: "High", impact: "55% Portfolio", members: ["Markus", "Alexander"], description: "Munich/Singapore hub sensitivity." }
];

export default function BridgeHub() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"individual" | "aggregated">("aggregated");
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "Real Estate",
    appraisalValue: "",
    location: "",
    appraisalDate: new Date().toISOString().split('T')[0],
  });

  const assetsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "assets"));
  }, [user, db]);

  const { data: manualAssets } = useCollection(assetsQuery);

  const filteredAccounts = useMemo(() => {
    if (viewMode === 'individual') {
      return HARTMANN_ACCOUNTS.filter(acc => acc.owner === 'Markus');
    }
    return HARTMANN_ACCOUNTS;
  }, [viewMode]);

  const handleAddAsset = async () => {
    if (!user || !db) return;
    setIsSubmitting(true);
    try {
      const assetRef = doc(collection(db, "users", user.uid, "assets"));
      await setDoc(assetRef, {
        ...newAsset,
        appraisalValue: parseFloat(newAsset.appraisalValue),
        documentCount: 1,
        createdAt: new Date().toISOString(),
        breakdown: [{ member: "Markus", pct: 100 }] // Default for Markus's view
      });
      toast({ title: "Asset Registered", description: `${newAsset.name} added to the Hartmann vault.` });
      setIsAddAssetOpen(false);
      setNewAsset({ name: "", type: "Real Estate", appraisalValue: "", location: "", appraisalDate: new Date().toISOString().split('T')[0] });
    } catch (e) { console.error(e); }
    finally { setIsSubmitting(false); }
  };

  const netWorth = viewMode === 'aggregated' ? "€380,000,000" : "€247,000,000";

  const MemberBreakdown = ({ breakdown }: { breakdown: { member: string, pct: number }[] }) => (
    <div className="flex -space-x-1 overflow-hidden p-1">
      {breakdown.map((b, i) => {
        const m = MEMBERS.find(mem => mem.name === b.member);
        return (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("w-2.5 h-2.5 rounded-full border border-white ring-1 ring-slate-100", m?.color)} />
              </TooltipTrigger>
              <TooltipContent className="p-2 text-[10px] font-bold">
                {b.member}: {b.pct}% contribution
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="uppercase tracking-widest text-[9px] font-bold">Total Portfolio Approach (TPA)</Badge>
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Hartmann Heritage Ecosystem</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">The Bridge</h1>
          <p className="text-muted-foreground italic text-sm">Consolidated operational hub for multi-jurisdictional heritage assets.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as any)} className="bg-slate-100 p-1 rounded-xl">
            <TabsList className="bg-transparent border-none">
              <TabsTrigger value="individual" className="text-[10px] font-bold uppercase px-4 data-[state=active]:bg-white">
                <User className="mr-2 h-3.5 w-3.5" /> Dr. Markus View
              </TabsTrigger>
              <TabsTrigger value="aggregated" className="text-[10px] font-bold uppercase px-4 data-[state=active]:bg-white">
                <Users className="mr-2 h-3.5 w-3.5" /> Hartmann Aggregated
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200">
              <LinkIcon className="mr-2 h-4 w-4" /> Link API
            </Button>
            <Button size="sm" className="rounded-xl shadow-lg" onClick={() => setIsAddAssetOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Register Asset
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'aggregated' ? (
        <>
          {/* Risk Alerts Teaser Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RISK_ALERTS.map(alert => (
              <Card key={alert.id} className="border-l-4 border-l-red-500 bg-red-50/10 border-slate-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-red-100 text-red-600">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900">{alert.title}</p>
                        <Badge variant="outline" className="text-[8px] border-red-200 text-red-600 uppercase">{alert.severity}</Badge>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Impacted Members</p>
                      <div className="flex -space-x-1.5 mt-1">
                        {alert.members.map(m => (
                          <Avatar key={m} className="w-5 h-5 border-2 border-white ring-1 ring-slate-100">
                            <AvatarImage src={MEMBERS.find(mem => mem.name === m)?.avatar} />
                            <AvatarFallback>{m[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                    <Link href="/chart-room">
                      <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5">
                        Deep Dive <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Executive Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Family Net Worth</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-headline font-bold text-slate-900">{netWorth}</h3>
                  <Badge className="bg-emerald-100 text-emerald-600 border-transparent text-[10px] font-bold">+4.2% Growth</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Diversification Alpha</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-headline font-bold text-primary">1.8%</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">Extra return via TPA</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Liquidity Score</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-headline font-bold text-slate-900">49/100</h3>
                  <Badge variant="outline" className="border-amber-200 text-amber-600 text-[9px] uppercase font-bold">Sub-Optimal</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Geopolitical Risk Score</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-headline font-bold text-slate-900">42/100</h3>
                  <Globe className="h-4 w-4 text-slate-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategic vs Tactical Dual View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-12 border-slate-200 shadow-md bg-white overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      Strategic vs. Tactical Allocation
                    </CardTitle>
                    <CardDescription>Dual-ring visualization of Hartmann core legacy vs. opportunistic reserves.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="h-[350px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={STRATEGIC_VS_TACTICAL}
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {STRATEGIC_VS_TACTICAL.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Pie
                          data={LIQUIDITY_BREAKDOWN}
                          innerRadius={115}
                          outerRadius={125}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {LIQUIDITY_BREAKDOWN.map((entry, index) => (
                            <Cell key={`cell-detailed-${index}`} fill={entry.color} opacity={0.6} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">Total AUM</p>
                      <p className="text-3xl font-headline font-bold text-slate-900">€380M</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {STRATEGIC_VS_TACTICAL.map((item, i) => (
                      <div key={i} className={cn("p-6 rounded-2xl border", i === 0 ? "border-blue-900/10 bg-blue-50/30" : "border-sky-500/10 bg-sky-50/30")}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <h4 className="font-bold text-lg text-slate-900">{item.name}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-headline font-bold text-slate-900">{item.value}%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">€{(380 * item.value / 100).toFixed(1)}M</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic border-t pt-3 border-slate-200">
                          {item.name === 'Strategic Allocation' 
                            ? "Purpose: Long-term preservation & generational transfer (10-50+ years). Key Assets: Real Estate, Private Equity, Dynasty Trusts."
                            : "Purpose: Capitalize on short-term opportunities & risk management (6-36 months). Key Assets: Cash, Liquid Equities, Commodities."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Matrix Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Concentration & Sector Breakdown */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-600 flex items-center justify-between">
                  Concentration & Sector
                  <Badge variant="outline" className="text-[8px] border-amber-200 text-amber-600">58% Top 5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  {SECTOR_CONCENTRATION.map((s) => (
                    <div key={s.name} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500">
                        <span>{s.name}</span>
                        <span>{s.value}%</span>
                      </div>
                      <Progress value={s.value} className="h-1 bg-slate-100" />
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1">Asia Exposure</p>
                    <p className="text-lg font-bold text-slate-900">47%</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1">Diversification</p>
                    <p className="text-lg font-bold text-emerald-600">68/100</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liquidity & Currency Risk */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-600 flex items-center justify-between">
                  Liquidity & Currency
                  <Badge variant="outline" className="text-[8px] border-red-200 text-red-600">High Cash Drag</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500 uppercase tracking-widest">Idle Cash (11%)</span>
                    <span className="text-slate-900">€42.0M</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-amber-600 font-bold uppercase">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Cost: €1.8M/yr opportunity cost</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Currency Risk (Unhedged)</p>
                  <div className="flex flex-wrap gap-2">
                    {['EUR: 42%', 'USD: 28%', 'SGD: 19%'].map(c => (
                      <Badge key={c} variant="outline" className="text-[9px] px-2 py-0 border-slate-200 text-slate-600">{c}</Badge>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Liquidity ≤30d</span>
                  <span className="text-lg font-bold text-slate-900">18%</span>
                </div>
              </CardContent>
            </Card>

            {/* Generational & Family Risk */}
            <Card className="border-slate-200 shadow-sm bg-white border-l-4 border-l-primary">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-600 flex items-center justify-between">
                  Generational & Family
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] uppercase">Aivaz Synthesis</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1">Alignment Score</p>
                    <p className="text-2xl font-headline font-bold text-slate-900">78%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1">Succession Risk</p>
                    <p className="text-lg font-bold text-red-600">High</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Blockholder Dynamics</p>
                  <div className="p-3 rounded-lg border border-primary/10 bg-primary/[0.02] text-[11px] italic text-slate-600 leading-snug">
                    "Control remains highly concentrated in G1. Diverging risk appetites between G1 (Preservation) and G3 (Growth) detected."
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Hedging Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-600">Hedging Effectiveness & Beta</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Portfolio Volatility</span>
                      <span className="text-sm font-bold text-slate-900">12.4% (vs 14.1% BM)</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Hedging Coverage</span>
                      <span className="text-sm font-bold text-amber-600">34.0%</span>
                    </div>
                    <Progress value={34} className="h-1.5" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Beta to China Slowdown</span>
                      <span className="text-sm font-bold text-slate-900">1.8</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-600 font-bold uppercase flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Non-Linear Risk Flag: Real Estate Concentration Blindspot</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TPA steps row (re-styled) */}
            <div className="grid grid-cols-2 gap-4">
              {TPA_STEPS.map((s) => (
                <Card key={s.step} className="bg-slate-50/50 border-slate-200">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                        {s.step}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">TPA Step</span>
                    </div>
                    <p className="text-[13px] font-bold text-slate-900">{s.label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{s.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Individual View for Markus */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-md">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Principal Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="text-center pb-6 border-b">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">My Total Assets</p>
                  <p className="text-4xl font-headline font-bold text-slate-900">{netWorth}</p>
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
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">My Managed Accounts</CardTitle>
                <CardDescription>Accounts where Dr. Markus Hartmann is the primary principal.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-6">Account</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Institution</TableHead>
                      <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 pr-6">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((acc) => (
                      <TableRow key={acc.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="pl-6 font-medium">
                          <p>{acc.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{acc.type}</p>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{acc.institution}</TableCell>
                        <TableCell className="text-right font-headline font-bold text-primary pr-6">{acc.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Shared Ledger & Tabs Area */}
      <Tabs defaultValue="linked" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="linked" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] font-bold uppercase px-6">
            Financial Ledger
          </TabsTrigger>
          <TabsTrigger value="physical" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] font-bold uppercase px-6">
            Manual Generational Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linked">
          <Card className="border-slate-200 shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Ledger Integration</CardTitle>
                  <CardDescription>Real-time banking feeds and private trust holdings.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-slate-400 animate-spin-slow" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synced 2m ago</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest pl-8">Account</TableHead>
                    <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Institution</TableHead>
                    <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right text-slate-400 font-bold uppercase text-[10px] tracking-widest pr-8">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((acc: any) => (
                    <TableRow key={acc.id} className="hover:bg-slate-50 transition-colors group">
                      <TableCell className="font-medium py-5 pl-8">
                        <div className="flex items-center gap-3">
                          {viewMode === 'aggregated' && <MemberBreakdown breakdown={acc.breakdown} />}
                          <div>
                            <p className="text-slate-900">{acc.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">{acc.type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">{acc.institution}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-[8px] font-bold px-2 py-0",
                          acc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-primary/5 text-primary border-primary/20'
                        )}>
                          {acc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-headline font-bold text-primary pr-8">{acc.balance}</TableCell>
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
              <Card key={asset.id} className="border-slate-200 shadow-md bg-white hover:ring-2 hover:ring-primary/20 transition-all group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[9px] font-bold uppercase">
                        {asset.type}
                      </Badge>
                      {viewMode === 'aggregated' && <MemberBreakdown breakdown={asset.breakdown || [{ member: "Markus", pct: 100 }]} />}
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/5 transition-colors">
                      {asset.type === 'Real Estate' ? <Home className="h-4 w-4" /> : 
                       asset.type === 'Art' ? <Palmtree className="h-4 w-4" /> : <Gem className="h-4 w-4" />}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{asset.name}</CardTitle>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">{asset.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Latest Appraisal</p>
                    <p className="text-2xl font-headline font-bold text-slate-900">€{asset.appraisalValue?.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{asset.appraisalDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{asset.documentCount} Document(s)</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest group-hover:text-primary">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-2 border-dashed border-slate-200 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-50/20" onClick={() => setIsAddAssetOpen(true)}>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Add New Manual Asset</p>
                <p className="text-[10px] text-slate-400 mt-1 px-4">Register non-liquid assets, art, or private real estate holdings.</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Asset Addition Dialog */}
      <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">Register Manual Asset</DialogTitle>
            <DialogDescription>
              Manually track assets like real estate, art, or private holdings that aren't linked via banking APIs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-400">Asset Name</Label>
              <Input id="name" placeholder="e.g. Aspen Ski Lodge" className="rounded-xl" value={newAsset.name} onChange={(e) => setNewAsset({...newAsset, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Asset Type</Label>
                <Select value={newAsset.type} onValueChange={(val) => setNewAsset({...newAsset, type: val})}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Art">Fine Art</SelectItem>
                    <SelectItem value="Collectibles">Collectibles</SelectItem>
                    <SelectItem value="Jewelry">Jewelry</SelectItem>
                    <SelectItem value="Private Equity">Private Equity</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value" className="text-xs font-bold uppercase tracking-widest text-slate-400">Appraisal (€)</Label>
                <Input id="value" type="number" placeholder="5000000" className="rounded-xl" value={newAsset.appraisalValue} onChange={(e) => setNewAsset({...newAsset, appraisalValue: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-slate-400">Location</Label>
              <Input id="location" placeholder="e.g. Munich, Germany" className="rounded-xl" value={newAsset.location} onChange={(e) => setNewAsset({...newAsset, location: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddAsset} disabled={isSubmitting || !newAsset.name || !newAsset.appraisalValue} className="rounded-xl w-full">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TPA_STEPS = [
  { step: 1, label: "Set Risk Targets", desc: "Identify sustainable market risk appetite via board-level reference portfolio.", active: true },
  { step: 2, label: "Set Exposure Targets", desc: "Determine factor mix (growth, rates, inflation) to maximize long-horizon returns.", active: true },
  { step: 3, label: "Set Strategy Targets", desc: "Translate broad factor exposures into actual building blocks (Real Assets, PE).", active: true },
  { step: 4, label: "Balance & Selection", desc: "Analyze how major new investments affect total portfolio factor exposures.", active: true }
];
