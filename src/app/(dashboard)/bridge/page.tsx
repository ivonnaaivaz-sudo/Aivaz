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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart as PieChartIcon, 
  Landmark, 
  Plus, 
  Link as LinkIcon, 
  Loader2,
  Home,
  Briefcase,
  ChevronDown,
  ShieldCheck,
  User,
  Users,
  Eye,
  EyeOff,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  AlertTriangle
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const assetAllocation = [
  { name: 'Private Tech Equity', value: 55, color: 'hsl(var(--primary))' },
  { name: 'Real Estate (Asia)', value: 30, color: 'hsl(var(--secondary))' },
  { name: 'Fixed Income', value: 10, color: 'hsl(var(--accent))' },
  { name: 'Cash/Liquid', value: 5, color: 'hsl(var(--muted-foreground))' },
];

const memberExposure = [
  { name: "Julian (G1)", percent: 65, color: "bg-primary" },
  { name: "Marcus (G2)", percent: 20, color: "bg-primary/60" },
  { name: "Elena (G2)", percent: 15, color: "bg-primary/30" }
];

const mockLinkedAccounts = [
  { id: 1, name: "Aivaz Family Trust", institution: "Morgan Stanley", balance: "$27,500,000", status: "Concentrated", type: "Tech Equity" },
  { id: 2, name: "Asian Strategic RE", institution: "UBS Singapore", balance: "$15,000,000", status: "Synced", type: "Real Estate" },
  { id: 3, name: "Strategic Reserve", institution: "Goldman Sachs", balance: "$5,000,000", status: "Stable", type: "Fixed Income" },
];

export default function BridgeHub() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"individual" | "aggregated">("individual");
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
      toast({ title: "Asset Registered", description: `${newAsset.name} added to the vault.` });
      setIsAddAssetOpen(false);
      setNewAsset({ name: "", type: "Real Estate", appraisalValue: "", location: "", appraisalDate: new Date().toISOString().split('T')[0] });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      {/* Privacy Toggle & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Tactical Station</Badge>
            <div className="h-px w-8 bg-white/5" />
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase flex items-center gap-1.5">
              {viewMode === 'individual' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {viewMode === 'individual' ? 'Privacy: Individual Mode' : 'Privacy: Family Aggregated'}
            </span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">The Bridge</h1>
          <p className="text-muted-foreground italic text-sm">Consolidated operational hub for multi-jurisdictional oversight.</p>
        </div>

        <div className="flex items-center gap-4">
          <Tabs 
            value={viewMode} 
            onValueChange={(val) => setViewMode(val as any)}
            className="bg-white/5 border border-white/10 p-1 rounded-xl"
          >
            <TabsList className="bg-transparent border-none">
              <TabsTrigger 
                value="individual" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest"
              >
                <User className="mr-2 h-3.5 w-3.5" /> My Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="aggregated" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest"
              >
                <Users className="mr-2 h-3.5 w-3.5" /> Family Aggregated
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Demo Alert */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="p-2 bg-amber-500/20 rounded-full">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-500 uppercase tracking-widest">Concentration Threshold Alert</p>
          <p className="text-xs text-muted-foreground">Tech equity holdings have reached 55% of AUM. Downside risk projected at $12M.</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto bg-amber-500/10 border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase" asChild>
          <Link href="/chart-room">Analyze Blindspots</Link>
        </Button>
      </div>

      {viewMode === "individual" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-white/5 bg-primary/5">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Individual Value</p>
                <h3 className="text-3xl font-headline font-bold text-primary">$50,000,000</h3>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+12.4% Growth YTD</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/5">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Liquid Capital (5%)</p>
                <h3 className="text-3xl font-headline font-bold">$2,500,000</h3>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[5%]" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/5">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Concentrated Assets</p>
                <h3 className="text-3xl font-headline font-bold">55% Exposure</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-500 font-bold uppercase tracking-widest">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>High Tech Concentration</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold">Institutional Accounts</h2>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="h-9 bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest">
                <LinkIcon className="mr-2 h-3.5 w-3.5" /> Link Institution
              </Button>
              <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-9 text-[10px] font-bold uppercase tracking-widest shadow-xl">
                    <Plus className="mr-2 h-3.5 w-3.5" /> Add Asset
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Register Manual Asset</DialogTitle>
                    <DialogDescription>Add real estate, art, or private holdings to the vault.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Asset Name</Label>
                      <Input placeholder="e.g. Hong Kong Commercial" value={newAsset.name} onChange={(e) => setNewAsset({...newAsset, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Asset Type</Label>
                        <Select value={newAsset.type} onValueChange={(val) => setNewAsset({...newAsset, type: val})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Real Estate">Real Estate</SelectItem>
                            <SelectItem value="Art">Fine Art</SelectItem>
                            <SelectItem value="Private Equity">Private Equity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Value ($)</Label>
                        <Input type="number" value={newAsset.appraisalValue} onChange={(e) => setNewAsset({...newAsset, appraisalValue: e.target.value})} />
                      </div>
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
          </div>

          <Card className="glass-panel border-white/5 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">Asset / Account</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6">Balance / Valuation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLinkedAccounts.map((acc) => (
                  <TableRow key={acc.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Landmark className="h-4 w-4 text-primary/70" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{acc.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">{acc.institution}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold uppercase tracking-widest opacity-60">{acc.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[8px] font-bold px-2 py-0",
                        acc.status === 'Concentrated' ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'
                      )}>
                        {acc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-headline font-bold text-primary px-6">{acc.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 glass-panel border-white/5 flex flex-col">
            <CardHeader className="pb-2 border-b border-white/5 mb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-primary" />
                  Asset Allocation Strategy
                </CardTitle>
                <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-primary/30 text-primary">Live Exposure</Badge>
              </div>
              <CardDescription className="text-xs">Consolidated family group exposure across all major asset classes.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col md:flex-row items-center justify-around p-12 gap-8">
              <div className="w-full max-w-[300px] aspect-square relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--foreground), 0.1)', borderRadius: '12px' }} 
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Portfolio</p>
                  <p className="text-4xl font-headline font-bold">100%</p>
                </div>
              </div>
              
              <div className="w-full md:w-64 space-y-4">
                {assetAllocation.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-primary">{item.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-1000" style={{ backgroundColor: item.color, width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-5 space-y-6">
            <Card className="glass-panel border-white/5">
              <CardHeader className="pb-2 border-b border-white/5 mb-6">
                <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Member Exposure Breakdown
                </CardTitle>
                <CardDescription className="text-xs">Relative proportional ownership of the aggregated family holdings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {memberExposure.map((member, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-bold">{member.name}</span>
                      </div>
                      <span className="font-headline font-bold text-primary">{member.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${member.color} transition-all duration-1000`} 
                        style={{ width: `${member.percent}%` }} 
                      />
                    </div>
                  </div>
                ))}
                
                <div className="pt-6 border-t border-white/5">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                    <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                      Privacy Shield is active. Raw dollar values are hidden to facilitate family oversight without revealing individual principal balances.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <CardHeader className="pb-4">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Strategic Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm font-headline font-medium leading-relaxed">
                  Analyze how market shifts affect multi-generational alignment.
                </p>
                <Link href="/simulator">
                  <Button className="w-full text-[10px] font-bold uppercase tracking-widest h-10 group" variant="secondary">
                    Run Exposure Simulator
                    <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
