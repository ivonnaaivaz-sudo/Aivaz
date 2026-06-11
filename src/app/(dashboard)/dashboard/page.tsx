"use client";

import { useState, useMemo } from "react";
import { useUser, useDoc, useCollection, useFirestore } from "@/firebase";
import { collection, doc, setDoc, query, writeBatch } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Activity,
  Globe,
  Calendar,
  HeartPulse,
  ChevronDown,
  RefreshCw,
  Lock,
  Plus,
  Link as LinkIcon,
  Landmark,
  PieChart as PieChartIcon,
  Loader2,
  Home,
  Briefcase
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const assetAllocation = [
  { name: 'Equities', value: 60, color: 'hsl(var(--primary))' },
  { name: 'Real Estate', value: 20, color: 'hsl(var(--secondary))' },
  { name: 'Fixed Income', value: 15, color: 'hsl(var(--accent))' },
  { name: 'Alternatives', value: 5, color: 'hsl(var(--muted-foreground))' },
];

const mockLinkedAccounts = [
  { id: 1, name: "Aivaz Family Trust", institution: "Morgan Stanley", balance: "$45,200,000", status: "Active" },
  { id: 2, name: "Offshore Reserve", institution: "UBS Zurich", balance: "$28,150,000", status: "Synced" },
  { id: 3, name: "PE HoldCo", institution: "Goldman Sachs", balance: "$12,400,000", status: "Active" },
];

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: dna, loading: dnaLoading } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  
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

  const { data: manualAssets, loading: assetsLoading } = useCollection(assetsQuery);

  const totalManualValue = useMemo(() => {
    return manualAssets.reduce((sum, asset) => sum + (asset.appraisalValue || 0), 0);
  }, [manualAssets]);

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

  if (dnaLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      {/* Global Header / Top-Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 hover:bg-transparent flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src="https://picsum.photos/seed/family/100/100" />
                  <AvatarFallback>AF</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-bold flex items-center gap-2">
                    Aivaz Family Account <ChevronDown className="h-3 w-3" />
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                    Institutional Tier
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-panel w-56">
              <DropdownMenuLabel>Switch Entity</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Aivaz Family Trust</DropdownMenuItem>
              <DropdownMenuItem>Heritage Logistics Co.</DropdownMenuItem>
              <DropdownMenuItem>Private Foundation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              All 12 Entities Synced
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
              3 Members Online • AES-256 Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Last Updated</p>
            <p className="text-xs font-medium flex items-center gap-2 justify-end cursor-pointer group">
              Today, 09:42 AM <RefreshCw className="h-3 w-3 text-primary group-hover:rotate-180 transition-transform duration-500" />
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 py-1.5 px-3 rounded-full">
            <Lock className="h-3 w-3" />
            Privacy-First Mode Active
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Main Bridge</h1>
        <p className="text-muted-foreground italic text-sm">Consolidated family net worth and strategic legacy alignment.</p>
      </div>

      {/* Executive Overview Row - 5 Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card className="glass-panel border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Family Net Worth</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">$142.4M</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
              <ArrowUpRight className="h-3 w-3" /> +2.4% vs last audit
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Legacy Alignment</CardTitle>
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">78%</div>
            <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
              <Activity className="h-3 w-3" /> Gap detected in G2
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Geopolitical Risk</CardTitle>
            <Globe className="h-3.5 w-3.5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline text-amber-500">Moderate</div>
            <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
              Reviewing EU Treaties
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Next Milestone</CardTitle>
            <Calendar className="h-3.5 w-3.5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-headline leading-tight">
              Gen-2 Transition
            </div>
            <div className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">
              Target Window: 2028
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Overall Health</CardTitle>
            <HeartPulse className="h-3.5 w-3.5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline text-emerald-500">84/100</div>
            <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
              Stable Stability Index
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bridge Grid Implementation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Tile */}
        <Card className="lg:col-span-1 glass-panel border-white/5 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-primary" />
                Portfolio Allocation
              </CardTitle>
              <Link href="/portfolio">
                <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest text-primary">Details</Button>
              </Link>
            </div>
            <CardDescription className="text-xs">Current exposure by asset class.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center min-h-[300px]">
            <ResponsiveContainer width="100%" height={220}>
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
                <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--foreground), 0.1)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 px-2">
              {assetAllocation.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accounts Tile */}
        <Card className="lg:col-span-2 glass-panel border-white/5 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Holdings & Accounts
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest">
                  <LinkIcon className="mr-1.5 h-3 w-3" /> Link Account
                </Button>
                <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      <Plus className="mr-1.5 h-3 w-3" /> Add Physical Asset
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
                        <Input placeholder="e.g. London Office Tower" value={newAsset.name} onChange={(e) => setNewAsset({...newAsset, name: e.target.value})} />
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
            <CardDescription className="text-xs">Live feeds and manual generational assets.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Account / Asset</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLinkedAccounts.map((acc) => (
                  <TableRow key={acc.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="py-4">
                      <p className="text-sm font-medium">{acc.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{acc.institution}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[8px] font-bold">{acc.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-headline font-bold text-primary">{acc.balance}</TableCell>
                  </TableRow>
                ))}
                {manualAssets.slice(0, 2).map((asset) => (
                  <TableRow key={asset.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Home className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm font-medium">{asset.name}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[8px] font-bold uppercase">Manual</Badge></TableCell>
                    <TableCell className="text-right font-headline font-bold text-primary">${asset.appraisalValue?.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 flex justify-center border-t border-white/5">
              <Link href="/accounts">
                <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  View All Accounts <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Persistent Quick Actions Bar */}
      <div className="fixed bottom-8 left-[310px] right-8 z-50">
        <div className="glass-panel border-white/10 bg-card/80 p-3 rounded-2xl flex items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Legacy Ready</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/simulator">
              <Button size="sm" variant="outline" className="bg-white/5 border-white/5 text-[10px] font-bold uppercase tracking-widest h-9">
                Run Simulation
              </Button>
            </Link>
            <Button size="sm" variant="outline" className="bg-white/5 border-white/5 text-[10px] font-bold uppercase tracking-widest h-9">
              Invite Member
            </Button>
            <Button size="sm" variant="outline" className="bg-white/5 border-white/5 text-[10px] font-bold uppercase tracking-widest h-9">
              Charter Draft
            </Button>
            <Button size="sm" className="shadow-lg h-9 px-6 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground">
              Review Alignment Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
