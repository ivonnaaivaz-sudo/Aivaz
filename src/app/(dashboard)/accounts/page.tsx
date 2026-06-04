
"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  RefreshCw, 
  ExternalLink, 
  Home, 
  Palmtree, 
  Gem, 
  FileText, 
  Landmark, 
  DollarSign, 
  MapPin,
  Calendar,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockLinkedAccounts = [
  { id: 1, name: "Aivaz Family Trust", institution: "Morgan Stanley", balance: "$45,200,000", type: "Irrevocable Trust", status: "Active" },
  { id: 2, name: "Offshore Strategic Reserve", institution: "UBS Zurich", balance: "$28,150,000", type: "Private Banking", status: "Synchronized" },
  { id: 3, name: "Real Estate Holding Co", institution: "Chase Private Client", balance: "$12,400,000", type: "Business Account", status: "Pending" },
  { id: 4, name: "Julian Aivaz Individual Portfolio", institution: "Goldman Sachs", balance: "$56,750,230", type: "Investment Account", status: "Active" },
];

export default function AccountsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Asset Form State
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

  const handleAddAsset = async () => {
    if (!user || !db) return;
    setIsSubmitting(true);
    
    try {
      const assetRef = doc(collection(db, "users", user.uid, "assets"));
      setDoc(assetRef, {
        ...newAsset,
        appraisalValue: parseFloat(newAsset.appraisalValue),
        documentCount: 1, // Default placeholder for the appraisal doc
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Asset Added",
        description: `${newAsset.name} has been successfully registered in the vault.`,
      });
      
      setIsAddAssetOpen(false);
      setNewAsset({
        name: "",
        type: "Real Estate",
        appraisalValue: "",
        location: "",
        appraisalDate: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.error("Error adding asset:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalManualValue = useMemo(() => {
    return manualAssets.reduce((sum, asset) => sum + (asset.appraisalValue || 0), 0);
  }, [manualAssets]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Financial & Physical Holdings</h1>
          <p className="text-muted-foreground">Comprehensive overview of linked institutions and manual generational assets.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="glass-card">
            <RefreshCw className="mr-2 h-4 w-4" /> Sync All
          </Button>
          <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="shadow-[0_0_15px_rgba(75,163,199,0.3)]">
                <Plus className="mr-2 h-4 w-4" /> Add Physical Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Register Manual Asset</DialogTitle>
                <DialogDescription>
                  Manually track assets like real estate, art, or private holdings that aren't linked via banking APIs.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Asset Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Aspen Ski Lodge" 
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Asset Type</Label>
                    <Select value={newAsset.type} onValueChange={(val) => setNewAsset({...newAsset, type: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
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
                    <Label htmlFor="value">Appraisal Value ($)</Label>
                    <Input 
                      id="value" 
                      type="number" 
                      placeholder="5000000" 
                      value={newAsset.appraisalValue}
                      onChange={(e) => setNewAsset({...newAsset, appraisalValue: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location / Jurisdiction</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g. Colorado, USA" 
                    value={newAsset.location}
                    onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Last Appraisal Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newAsset.appraisalDate}
                    onChange={(e) => setNewAsset({...newAsset, appraisalDate: e.target.value})}
                  />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Aggregate Net Worth", value: `$${(142.4 + totalManualValue / 1000000).toFixed(1)}M`, icon: Landmark },
          { label: "Physical Assets", value: manualAssets.length.toString(), icon: Home },
          { label: "Physical Value", value: `$${(totalManualValue / 1000000).toFixed(1)}M`, icon: DollarSign },
          { label: "Jurisdictions", value: "6", icon: Landmark }
        ].map((stat, i) => (
          <Card key={i} className="glass-panel">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
                <p className="text-xl font-headline font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="linked" className="space-y-4">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="linked" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Financial Accounts
          </TabsTrigger>
          <TabsTrigger value="physical" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Physical & Manual Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linked" className="space-y-4">
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Connected Institutions</CardTitle>
              <CardDescription>Live feeds from global banking partners and trust managers.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Account</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Institution</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLinkedAccounts.map((acc) => (
                    <TableRow key={acc.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-medium py-4">
                        <div>
                          <p>{acc.name}</p>
                          <p className="text-[10px] text-muted-foreground">{acc.type}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{acc.institution}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[9px] font-bold">
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

        <TabsContent value="physical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manualAssets.map((asset) => (
              <Card key={asset.id} className="glass-panel border-white/5 hover:border-primary/20 transition-all group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[9px] font-bold uppercase">
                      {asset.type}
                    </Badge>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
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
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Latest Appraisal</p>
                    <p className="text-2xl font-headline font-bold text-primary">${asset.appraisalValue?.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{asset.appraisalDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{asset.documentCount} Document(s)</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest group-hover:text-primary">
                      Manage Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="glass-panel border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center space-y-4" onClick={() => setIsAddAssetOpen(true)}>
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Add New Manual Holding</p>
                <p className="text-[10px] text-muted-foreground mt-1 px-4">Register non-liquid assets, art, or private real estate holdings.</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
