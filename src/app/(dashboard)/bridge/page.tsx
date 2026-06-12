
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
  ShieldCheck,
  User,
  Users,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  Euro,
  Globe
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
  { name: 'Commercial Real Estate', value: 55, color: 'hsl(var(--primary))' },
  { name: 'Private Equity (Ind.)', value: 25, color: 'hsl(var(--secondary))' },
  { name: 'Cash (Idle)', value: 11, color: 'hsl(var(--accent))' },
  { name: 'ESG/Tech Equity', value: 9, color: 'hsl(var(--muted-foreground))' },
];

const memberExposure = [
  { name: "Dr. Markus (G1)", percent: 60, color: "bg-primary" },
  { name: "Elena (G1)", percent: 15, color: "bg-primary/60" },
  { name: "Sophie (G3)", percent: 12.5, color: "bg-primary/40" },
  { name: "Alexander (G3)", percent: 12.5, color: "bg-primary/20" }
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Tactical Station</Badge>
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Hartmann Heritage Ecosystem</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">The Bridge</h1>
          <p className="text-muted-foreground italic text-sm">Consolidated operational hub for multi-jurisdictional Hartmann assets.</p>
        </div>

        <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as any)} className="bg-white/5 p-1 rounded-xl">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger value="individual" className="text-[10px] font-bold uppercase px-4"><User className="mr-2 h-3.5 w-3.5" /> My View</TabsTrigger>
            <TabsTrigger value="aggregated" className="text-[10px] font-bold uppercase px-4"><Users className="mr-2 h-3.5 w-3.5" /> Hartmann Aggregated</TabsTrigger>
          </TabsList>
        </Tabs>
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
        <Card className="glass-panel border-white/5 bg-primary/5">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Aggregate Hartmann Net Worth</p>
            <h3 className="text-3xl font-headline font-bold text-primary">€380,000,000</h3>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500">
              <TrendingUp className="h-3.5 w-3.5" /> <span>Stable Preservation</span>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-white/5">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Real Estate Concentration</p>
            <h3 className="text-3xl font-headline font-bold text-amber-500">55%</h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
              <AlertTriangle className="h-3.5 w-3.5" /> <span>High Regional Exposure</span>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-white/5">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Jurisdictions</p>
            <h3 className="text-3xl font-headline font-bold">5</h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
              <Globe className="h-3.5 w-3.5" /> <span>DE, SG, UK, CH, KY</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-7 glass-panel border-white/5">
          <CardHeader className="border-b border-white/5 mb-6">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-primary" /> Hartmann Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex flex-col md:flex-row items-center justify-around p-8">
            <div className="w-full max-w-[280px] aspect-square relative">
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
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Assets</p>
                <p className="text-3xl font-headline font-bold">€380M</p>
              </div>
            </div>
            <div className="space-y-4 min-w-[200px]">
              {assetAllocation.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full" style={{ backgroundColor: item.color, width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 glass-panel border-white/5">
          <CardHeader className="border-b border-white/5 mb-6">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Member Exposure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {memberExposure.map((member, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{member.name}</span>
                  <span className="font-headline font-bold text-primary">{member.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${member.color}`} style={{ width: `${member.percent}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-6 border-t border-white/5">
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
    </div>
  );
}
