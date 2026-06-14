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
import { 
  PieChart as PieChartIcon, 
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
  Scale
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STRATEGIC_VS_TACTICAL = [
  { name: 'Strategic Allocation', value: 76, color: '#1e3a8a', description: 'Core Long-Term Holdings' },
  { name: 'Tactical Allocation', value: 24, color: '#0ea5e9', description: 'Opportunistic / Short-Term' },
];

const DETAILED_ALLOCATION = [
  { name: 'Commercial Real Estate', value: 55, color: '#3b82f6' },
  { name: 'Industrial Chemicals', value: 25, color: '#1d4ed8' },
  { name: 'Cash (Idle)', value: 11, color: '#f59e0b' },
  { name: 'Tech/Growth Equity', value: 9, color: '#64748b' },
];

const HARTMANN_ACCOUNTS = [
  { id: 1, name: "Hartmann Family Trust", institution: "Morgan Stanley", balance: "€45,200,000", type: "Irrevocable Trust", owner: "Aggregated", status: "Active" },
  { id: 2, name: "Offshore Strategic Reserve", institution: "UBS Zurich", balance: "€28,150,000", type: "Private Banking", owner: "Markus", status: "Synchronized" },
  { id: 3, name: "Industrial Holding Co", institution: "Deutsche Bank", balance: "€12,400,000", type: "Business Account", owner: "Markus", status: "Active" },
  { id: 4, name: "Singapore Real Estate Fund", institution: "DBS Singapore", balance: "€56,750,230", type: "Investment Account", owner: "Aggregated", status: "Active" },
  { id: 5, name: "Alexander London Growth", institution: "Goldman Sachs", balance: "€5,200,000", type: "Venture Fund", owner: "Next Gen", status: "Active" },
];

const TPA_STEPS = [
  { step: 1, label: "Set Risk Targets", desc: "Identify sustainable market risk appetite via reference portfolio.", active: true },
  { step: 2, label: "Set Exposure Targets", desc: "Determine factor mix to maximize long-horizon risk-adjusted returns.", active: true },
  { step: 3, label: "Set Strategy Targets", desc: "Translate factor exposures into actual building blocks (Real Assets, PE).", active: true },
  { step: 4, label: "Balance & Selection", desc: "Analyze how major new investments affect total portfolio exposures.", active: true }
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
        createdAt: new Date().toISOString()
      });
      toast({ title: "Asset Registered", description: `${newAsset.name} added to the Hartmann vault.` });
      setIsAddAssetOpen(false);
      setNewAsset({ name: "", type: "Real Estate", appraisalValue: "", location: "", appraisalDate: new Date().toISOString().split('T')[0] });
    } catch (e) { console.error(e); }
    finally { setIsSubmitting(false); }
  };

  const netWorth = viewMode === 'aggregated' ? "€380,000,000" : "€247,000,000";

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="uppercase tracking-widest text-[9px] font-bold">Total Portfolio Approach</Badge>
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Hartmann Heritage Ecosystem</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">The Bridge</h1>
          <p className="text-muted-foreground italic text-sm">Consolidated operational hub for multi-jurisdictional Hartmann assets.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as any)} className="bg-muted p-1 rounded-xl">
            <TabsList className="bg-transparent border-none">
              <TabsTrigger value="individual" className="text-[10px] font-bold uppercase px-4">
                <User className="mr-2 h-3.5 w-3.5" /> My View
              </TabsTrigger>
              <TabsTrigger value="aggregated" className="text-[10px] font-bold uppercase px-4">
                <Users className="mr-2 h-3.5 w-3.5" /> Hartmann Aggregated
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <LinkIcon className="mr-2 h-4 w-4" /> Link Account
            </Button>
            <Button size="sm" className="shadow-lg" onClick={() => setIsAddAssetOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          </div>
        </div>
      </div>

      {/* TPA Methodology Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {TPA_STEPS.map((s) => (
          <Card key={s.step} className="bg-white/40 border-slate-200">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {s.step}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">TPA Step</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{s.label}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Split Portfolio View (Dual Ring Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-12 border-none shadow-xl bg-white/80 overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Strategic vs. Tactical Allocation
                </CardTitle>
                <CardDescription>Dual-ring visualization of core legacy holdings versus opportunistic reserves.</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total AUM</p>
                <p className="text-2xl font-headline font-bold text-primary">{netWorth}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="h-[350px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {/* Inner Ring: Strategic/Tactical Split */}
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
                    {/* Outer Ring: Detailed Allocation */}
                    <Pie
                      data={DETAILED_ALLOCATION}
                      innerRadius={115}
                      outerRadius={125}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {DETAILED_ALLOCATION.map((entry, index) => (
                        <Cell key={`cell-detailed-${index}`} fill={entry.color} opacity={0.4} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Aggregate</p>
                  <p className="text-3xl font-headline font-bold">€380M</p>
                </div>
              </div>

              <div className="space-y-8">
                {STRATEGIC_VS_TACTICAL.map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="font-bold text-lg">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-headline font-bold">{item.value}%</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">€{(380 * item.value / 100).toFixed(1)}M</p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-1000" style={{ backgroundColor: item.color, width: `${item.value}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      {item.name === 'Strategic Allocation' 
                        ? "Designed for multi-generational stability and legacy goals. Changes rarely."
                        : "Used for near-term opportunities, risk management, and market timing."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strategic Card */}
        <Card className="border-l-4 border-l-blue-900 shadow-lg bg-blue-50/30">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-blue-900" />
              <CardTitle className="text-blue-900">Strategic Portfolio</CardTitle>
            </div>
            <CardDescription className="text-blue-800/60 font-medium">Core long-term wealth preservation & generational transfer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase text-blue-900/40 tracking-widest">Time Horizon</p>
                <p className="font-bold text-blue-900">10–50+ Years</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-blue-900/40 tracking-widest">Risk Profile</p>
                <p className="font-bold text-blue-900">Moderate, Diversified</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-blue-900/40 tracking-widest">Goal Alignment</p>
                <p className="font-bold text-blue-900">High</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-blue-900/40 tracking-widest">Rebalancing</p>
                <p className="font-bold text-blue-900">Annual or Less</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-900/5 border border-blue-900/10">
              <p className="text-[10px] font-bold uppercase text-blue-900/40 tracking-widest mb-2">Key Assets</p>
              <div className="flex flex-wrap gap-2">
                {['Core Real Estate', 'Blue-Chip Equities', 'Private Equity', 'Dynasty Trusts'].map(tag => (
                  <Badge key={tag} className="bg-blue-900/10 text-blue-900 border-blue-900/20 text-[9px]">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tactical Card */}
        <Card className="border-l-4 border-l-sky-500 shadow-lg bg-sky-50/30">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-sky-500" />
              <CardTitle className="text-sky-600">Tactical Portfolio</CardTitle>
            </div>
            <CardDescription className="text-sky-600/60 font-medium">Capitalize on short-term opportunities & manage risks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase text-sky-600/40 tracking-widest">Time Horizon</p>
                <p className="font-bold text-sky-600">6–36 Months</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-sky-600/40 tracking-widest">Risk Profile</p>
                <p className="font-bold text-sky-600">Higher Volatility</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-sky-600/40 tracking-widest">Goal Alignment</p>
                <p className="font-bold text-sky-600">Medium (Flexible)</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-sky-600/40 tracking-widest">Rebalancing</p>
                <p className="font-bold text-sky-600">Quarterly / Event-driven</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10">
              <p className="text-[10px] font-bold uppercase text-sky-600/40 tracking-widest mb-2">Key Assets</p>
              <div className="flex flex-wrap gap-2">
                {['Cash', 'Liquid Equities', 'Commodities', 'Hedge Funds', 'Opportunistic Plays'].map(tag => (
                  <Badge key={tag} className="bg-sky-500/10 text-sky-600 border-sky-500/20 text-[9px]">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tactical Alerts & Ledger */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-500 uppercase tracking-widest">Tactical Alert: Excess Cash</p>
          <p className="text-xs text-muted-foreground">€42M Cash sitting in low-yield accounts. Opportunity cost estimated at €2.1M annually.</p>
        </div>
        <Button variant="outline" size="sm" className="bg-amber-500/10 border-amber-500/30 text-amber-500" asChild>
          <Link href="/chart-room">Manage Tactical Shift</Link>
        </Button>
      </div>

      <Tabs defaultValue="linked" className="space-y-6">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="linked" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] font-bold uppercase px-6">
            Financial Ledger
          </TabsTrigger>
          <TabsTrigger value="physical" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] font-bold uppercase px-6">
            Manual Generational Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linked">
          <Card className="border-none shadow-lg bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Connected Accounts</CardTitle>
              <CardDescription>Real-time banking feeds and private trust holdings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Account</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Institution</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((acc) => (
                    <TableRow key={acc.id} className="hover:bg-muted/50 transition-colors group">
                      <TableCell className="font-medium py-4">
                        <div>
                          <p>{acc.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">{acc.type}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{acc.institution}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-[8px] font-bold px-2 py-0",
                          acc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-primary/5 text-primary border-primary/20'
                        )}>
                          {acc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-headline font-bold text-primary">{acc.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physical">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manualAssets.map((asset) => (
              <Card key={asset.id} className="border-none shadow-lg bg-white/80 hover:ring-2 hover:ring-primary/20 transition-all group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[9px] font-bold uppercase">
                      {asset.type}
                    </Badge>
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/5 transition-colors">
                      {asset.type === 'Real Estate' ? <Home className="h-4 w-4" /> : 
                       asset.type === 'Art' ? <Palmtree className="h-4 w-4" /> : <Gem className="h-4 w-4" />}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{asset.name}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">{asset.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Latest Appraisal</p>
                    <p className="text-2xl font-headline font-bold text-primary">€{asset.appraisalValue?.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{asset.appraisalDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
            
            <Card className="border-2 border-dashed border-muted-foreground/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center space-y-4 bg-transparent" onClick={() => setIsAddAssetOpen(true)}>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Add New Manual Asset</p>
                <p className="text-[10px] text-muted-foreground mt-1 px-4">Register non-liquid assets, art, or private real estate holdings.</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Asset Addition Dialog */}
      <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register Manual Asset</DialogTitle>
            <DialogDescription>
              Manually track assets like real estate, art, or private holdings that aren't linked via banking APIs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Asset Name</Label>
              <Input id="name" placeholder="e.g. Aspen Ski Lodge" value={newAsset.name} onChange={(e) => setNewAsset({...newAsset, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Asset Type</Label>
                <Select value={newAsset.type} onValueChange={(val) => setNewAsset({...newAsset, type: val})}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
                <Label htmlFor="value">Appraisal Value (€)</Label>
                <Input id="value" type="number" placeholder="5000000" value={newAsset.appraisalValue} onChange={(e) => setNewAsset({...newAsset, appraisalValue: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location / Jurisdiction</Label>
              <Input id="location" placeholder="e.g. Munich, Germany" value={newAsset.location} onChange={(e) => setNewAsset({...newAsset, location: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddAsset} disabled={isSubmitting || !newAsset.name || !newAsset.appraisalValue}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
