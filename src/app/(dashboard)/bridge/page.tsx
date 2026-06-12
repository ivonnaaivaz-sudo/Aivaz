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
  Palmtree
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
import { cn } from "@/lib/utils";
import Link from "next/link";

const AGGREGATED_ALLOCATION = [
  { name: 'Commercial Real Estate', value: 55, color: '#3b82f6' },
  { name: 'Industrial Chemicals', value: 25, color: '#1d4ed8' },
  { name: 'Cash (Idle)', value: 11, color: '#f59e0b' },
  { name: 'Tech/Growth Equity', value: 9, color: '#64748b' },
];

const INDIVIDUAL_ALLOCATION = [
  { name: 'Commercial Real Estate', value: 80, color: '#3b82f6' },
  { name: 'Industrial Chemicals', value: 15, color: '#1d4ed8' },
  { name: 'Cash (Idle)', value: 5, color: '#f59e0b' },
];

const HARTMANN_ACCOUNTS = [
  { id: 1, name: "Hartmann Family Trust", institution: "Morgan Stanley", balance: "€45,200,000", type: "Irrevocable Trust", owner: "Aggregated", status: "Active" },
  { id: 2, name: "Offshore Strategic Reserve", institution: "UBS Zurich", balance: "€28,150,000", type: "Private Banking", owner: "Markus", status: "Synchronized" },
  { id: 3, name: "Industrial Holding Co", institution: "Deutsche Bank", balance: "€12,400,000", type: "Business Account", owner: "Markus", status: "Active" },
  { id: 4, name: "Singapore Real Estate Fund", institution: "DBS Singapore", balance: "€56,750,230", type: "Investment Account", owner: "Aggregated", status: "Active" },
  { id: 5, name: "Alexander London Growth", institution: "Goldman Sachs", balance: "€5,200,000", type: "Venture Fund", owner: "Next Gen", status: "Active" },
];

const memberExposure = [
  { name: "Dr. Markus (G1)", percent: 65, color: "bg-primary" },
  { name: "Elena (G1)", percent: 15, color: "bg-primary/60" },
  { name: "Sophie (G3)", percent: 10, color: "bg-primary/40" },
  { name: "Alexander (G3)", percent: 10, color: "bg-primary/20" }
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

  const currentAllocation = viewMode === 'aggregated' ? AGGREGATED_ALLOCATION : INDIVIDUAL_ALLOCATION;
  const netWorth = viewMode === 'aggregated' ? "€380,000,000" : "€247,000,000";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="uppercase tracking-widest text-[9px] font-bold">Tactical Station</Badge>
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
            <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="shadow-lg">
                  <Plus className="mr-2 h-4 w-4" /> Add Asset
                </Button>
              </DialogTrigger>
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
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-500 uppercase tracking-widest">Idle Capital Alert</p>
          <p className="text-xs text-muted-foreground">€42M Cash sitting in low-yield accounts. Opportunity cost estimated at €2.1M annually.</p>
        </div>
        <Button variant="outline" size="sm" className="bg-amber-500/10 border-amber-500/30 text-amber-500" asChild>
          <Link href="/chart-room">Analyze Deployment</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-primary/5">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
              {viewMode === 'aggregated' ? 'Aggregate Hartmann Net Worth' : 'My Estimated Stake'}
            </p>
            <h3 className="text-3xl font-headline font-bold text-primary">{netWorth}</h3>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" /> <span>Stable Preservation</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-white/80">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Concentration Risk</p>
            <h3 className="text-3xl font-headline font-bold text-amber-600">{viewMode === 'aggregated' ? '55%' : '80%'}</h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
              <AlertTriangle className="h-3.5 w-3.5" /> <span>Industrial Real Estate</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-white/80">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Jurisdictions</p>
            <h3 className="text-3xl font-headline font-bold">5</h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
              <Globe className="h-3.5 w-3.5 text-primary" /> <span>DE, SG, UK, CH, KY</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-7 border-none shadow-lg bg-white/80">
          <CardHeader className="border-b mb-6">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2 text-primary">
              <PieChartIcon className="h-4 w-4" /> Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex flex-col md:flex-row items-center justify-around p-8">
            <div className="w-full max-w-[280px] aspect-square relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentAllocation}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {currentAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Assets</p>
                <p className="text-3xl font-headline font-bold">{netWorth}</p>
              </div>
            </div>
            <div className="space-y-4 min-w-[200px]">
              {currentAllocation.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full" style={{ backgroundColor: item.color, width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 border-none shadow-lg bg-white/80">
          <CardHeader className="border-b mb-6">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2 text-primary">
              <Users className="h-4 w-4" /> Member Exposure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {memberExposure.map((member, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{member.name}</span>
                  <span className="font-headline font-bold text-primary">{member.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${member.color}`} style={{ width: `${member.percent}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-6 border-t">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                  Hartmann Family Privacy Shield is active. Raw valuations are aggregated for cross-generational oversight.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
}