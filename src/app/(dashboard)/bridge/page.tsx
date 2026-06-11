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
import { 
  PieChart as PieChartIcon, 
  Landmark, 
  Plus, 
  Link as LinkIcon, 
  Loader2,
  Home,
  Briefcase,
  ChevronDown
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip
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

export default function BridgeHub() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
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
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Operational Hub</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">The Bridge</h1>
        <p className="text-muted-foreground italic text-sm">Dedicated environment for portfolio performance and account management.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Tile */}
        <Card className="lg:col-span-1 glass-panel border-white/5 flex flex-col h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-primary" />
              Allocation (%)
            </CardTitle>
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
            <div className="pt-6 mt-auto">
              <Button variant="ghost" className="w-full text-[10px] uppercase font-bold tracking-widest text-primary" asChild>
                <Link href="/portfolio">Open Full Portfolio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Tile */}
        <Card className="lg:col-span-2 glass-panel border-white/5 flex flex-col h-full">
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
                      <Plus className="mr-1.5 h-3 w-3" /> Add Asset
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
            <CardDescription className="text-xs">Consolidated institutional bank feeds and manual physical assets.</CardDescription>
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
                {manualAssets?.map((asset) => (
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
                  View Detailed Holdings <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
