"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, deleteDoc } from "firebase/firestore";
import { wealthScenarioSimulation, type WealthScenarioSimulationOutput } from "@/ai/flows/wealth-scenario-simulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Cpu, 
  Loader2, 
  Activity, 
  PlusCircle, 
  Trash2, 
  MapPin, 
  Zap, 
  Send, 
  Sticker, 
  Target, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  MessageSquare,
  Bot,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TIME_HORIZONS = ["Current", "5 Years", "10 Years", "25 Years"];
const FAMILY_MEMBERS = [
  { name: "Dr. Markus", role: "Principal" },
  { name: "Elena", role: "Legacy Chair" },
  { name: "Sophie", role: "ESG / SG" },
  { name: "Alexander", role: "Tech / UK" },
  { name: "Lina", role: "Next Gen" },
];

type Intention = {
  value: number; // in Millions
  type: 'inflow' | 'outflow';
  label: string;
};

export default function ChartRoomPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  const captainImg = PlaceHolderImages.find(img => img.id === 'captain-avatar');

  const [newMove, setNewMove] = useState({ title: "", description: "" });
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<WealthScenarioSimulationOutput | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Proactive Captain Logic
  const [isCaptainExpanded, setIsCaptainExpanded] = useState(false);
  const [captainMessage, setCaptainMessage] = useState<string>("Analyzing the Hartmann matrix for hidden synergies...");
  const [captainProposal, setCaptainProposal] = useState<{title: string, desc: string} | null>(null);

  // Intentions Matrix Data
  const [intentions, setIntentions] = useState<Record<string, Intention>>({
    "Dr. Markus-Current": { value: 15, type: 'inflow', label: "Inheritance Payout" },
    "Dr. Markus-5 Years": { value: 25, type: 'outflow', label: "Estate Diversification" },
    "Elena-Current": { value: 5, type: 'outflow', label: "Philanthropy Grant" },
    "Sophie-Current": { value: 12, type: 'inflow', label: "Trust Distribution" },
    "Alexander-10 Years": { value: 40, type: 'outflow', label: "VC Fund Buy-in" },
    "Lina-25 Years": { value: 10, type: 'inflow', label: "Legacy Dividend" },
  });

  const scenariosQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "scenarios"), orderBy("createdAt", "desc"));
  }, [user, db]);

  const { data: scenarios } = useCollection(scenariosQuery);

  // Update Captain's Proposal when intentions change
  useEffect(() => {
    const markusPayout = intentions["Dr. Markus-Current"];
    const sophiePayout = intentions["Sophie-Current"];
    const alexBuyin = intentions["Alexander-10 Years"];

    if (markusPayout && sophiePayout && alexBuyin) {
      setCaptainMessage(`Hey Markus, I've noticed a synergy. Have you considered leveraging your €15M and Sophie's €12M current payouts to accelerate Alexander's VC Buy-in move?`);
      setCaptainProposal({
        title: "Capital Bridge: Payout Acceleration",
        desc: "Leveraging G1 and G3 current inflows to fund the G3 technology pivot, reducing total interest exposure by €4.2M over a 10-year horizon."
      });
      // Automatically show the "teaser" if not already expanded
      if (!isCaptainExpanded) {
        // Trigger a subtle animation or state change if needed
      }
    }
  }, [intentions]);

  const handleAddMove = async (manualTitle?: string, manualDesc?: string) => {
    if (!user || !db) return;
    const title = manualTitle || newMove.title;
    const description = manualDesc || newMove.description;
    
    if (!title) return;

    try {
      const scenarioRef = doc(collection(db, "users", user.uid, "scenarios"));
      await setDoc(scenarioRef, {
        title,
        description: description || "Auto-generated from Hartmann Matrix.",
        author: user.displayName || "Family Member",
        status: "draft",
        createdAt: new Date().toISOString()
      });
      setNewMove({ title: "", description: "" });
      setIsAdding(false);
      setIsCaptainExpanded(false);
      toast({ title: "Move Promoted", description: "This intention has been moved to the strategic sandbox." });
    } catch (e) { console.error(e); }
  };

  const handleDeleteMove = async (id: string) => {
    if (!user || !db) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "scenarios", id));
      toast({ title: "Move Removed", description: "Strategic note deleted." });
    } catch (e) { console.error(e); }
  };

  const runSimulation = async (context?: string) => {
    setSimLoading(true);
    const combinedContext = (scenarios || []).map(s => `${s.title}: ${s.description}`).join("\n") + (context ? `\n\nActive Trigger: ${context}` : "");

    try {
      const output = await wealthScenarioSimulation({
        currentFinancialOverview: "€380M AUM. 55% Real Estate Concentration. €42M Idle Cash.",
        familyDNADynamics: dna ? JSON.stringify(dna.familyProfile.relationalDynamics) : "Succession tension between G1 (industrial) and G3 (tech/ESG).",
        scenarioDescription: combinedContext || "General portfolio stress test across current drafted life moves."
      });
      
      setSimResult(output);
      toast({
        title: "Simulation Complete",
        description: "The Captain has synthesized the projected impact of your strategic sandbox.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSimLoading(false);
    }
  };

  const toggleIntention = (member: string, horizon: string) => {
    const key = `${member}-${horizon}`;
    setIntentions(prev => {
      const existing = prev[key];
      if (!existing) {
        return {
          ...prev,
          [key]: { value: 10, type: 'outflow', label: "New Outflow Move" }
        };
      }
      if (existing.type === 'outflow') {
        return { ...prev, [key]: { ...existing, type: 'inflow', label: "New Inflow Move" } };
      }
      const newIntentions = { ...prev };
      delete newIntentions[key];
      return newIntentions;
    });
  };

  const promoteToSandbox = (member: string, horizon: string) => {
    const intent = intentions[`${member}-${horizon}`];
    if (!intent) return;
    const title = `${member}: ${intent.label} (${horizon})`;
    const description = `This strategic event is classified as a ${intent.type} of €${intent.value}M.`;
    handleAddMove(title, description);
  };

  const inheritanceHealth = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    Object.values(intentions).forEach(i => {
      if (i.type === 'inflow') totalInflow += i.value;
      else totalOutflow += i.value;
    });
    const net = totalInflow - totalOutflow;
    const score = 75 + (net / 2);
    return Math.min(100, Math.max(0, score));
  }, [intentions]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-32 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sticker className="h-4 w-4 text-primary" />
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-[0.2em] text-[9px] font-bold">Generational Sandbox v4.2</Badge>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">Chart Room</h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest opacity-60">Collaborative planning & predictive synthesis</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Predictive Alignment</p>
            <p className="text-xl font-headline font-bold text-primary">84.2%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="glass-panel border-white/5 bg-white shadow-sm overflow-hidden">
            <CardHeader className="border-b border-black/5 bg-muted/30 p-8 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline font-bold">Legacy Intentions Matrix</CardTitle>
                <CardDescription>Plan family milestones. Green: Cash Inflows, Red: Outflows.</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Inheritance Stability</p>
                <p className={cn("text-2xl font-headline font-bold", inheritanceHealth < 40 ? 'text-red-500' : inheritanceHealth < 70 ? 'text-amber-500' : 'text-emerald-500')}>
                  {inheritanceHealth.toFixed(1)}%
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-8 overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-[180px_repeat(4,1fr)] gap-3 mb-6">
                  <div />
                  {TIME_HORIZONS.map(h => (
                    <div key={h} className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</p>
                    </div>
                  ))}
                </div>
                {FAMILY_MEMBERS.map(member => (
                  <div key={member.name} className="grid grid-cols-[180px_repeat(4,1fr)] gap-3 mb-3">
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold">{member.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{member.role}</p>
                    </div>
                    {TIME_HORIZONS.map(horizon => {
                      const key = `${member.name}-${horizon}`;
                      const intent = intentions[key];
                      const isActive = !!intent;
                      return (
                        <div 
                          key={horizon}
                          className={cn(
                            "h-24 rounded-xl cursor-pointer transition-all border border-transparent flex flex-col items-center justify-center group relative overflow-hidden text-center p-2",
                            !isActive ? 'bg-muted/30 opacity-40 hover:opacity-100 hover:bg-muted/50' : 
                            intent.type === 'inflow' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' :
                            'bg-red-500/10 text-red-700 border-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]'
                          )}
                          onClick={() => toggleIntention(member.name, horizon)}
                        >
                          {isActive ? (
                            <>
                              {intent.type === 'inflow' ? <ArrowUpRight className="h-4 w-4 mb-1" /> : <ArrowDownRight className="h-4 w-4 mb-1" />}
                              <span className="text-[10px] font-bold uppercase tracking-tighter leading-tight">{intent.label}</span>
                              <span className="text-[10px] font-mono mt-1">€{intent.value}M</span>
                            </>
                          ) : <Target className="h-4 w-4 opacity-20" />}
                          {isActive && (
                            <div 
                              className="absolute inset-0 bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-full group-hover:translate-y-0 text-white"
                              onClick={(e) => { e.stopPropagation(); promoteToSandbox(member.name, horizon); }}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <ArrowDownToLine className="h-5 w-5 animate-bounce" />
                                <span className="text-[8px] font-bold uppercase">To Sandbox</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5 bg-white shadow-sm overflow-hidden min-h-[400px]">
            <CardHeader className="border-b border-black/5 bg-muted/30 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-headline font-bold">Strategic Sandbox</CardTitle>
                  <CardDescription>Collaborative life moves. Drag intentions here to simulate legacy impact.</CardDescription>
                </div>
                <Button onClick={() => setIsAdding(true)} className="rounded-full h-10 px-6 shadow-lg">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Life Move
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-black/5">
                {isAdding && (
                  <div className="p-8 bg-primary/5 space-y-4 animate-in slide-in-from-top duration-300">
                    <Input placeholder="Title of Move" className="text-lg font-bold border-none bg-transparent px-0" value={newMove.title} onChange={(e) => setNewMove({...newMove, title: e.target.value})} />
                    <Textarea placeholder="Details and goals..." className="min-h-[100px] border-none bg-transparent px-0 resize-none" value={newMove.description} onChange={(e) => setNewMove({...newMove, description: e.target.value})} />
                    <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
                      <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                      <Button onClick={() => handleAddMove()}>Save Move</Button>
                    </div>
                  </div>
                )}
                {scenarios?.map((s) => (
                  <div key={s.id} className="p-8 hover:bg-muted/30 transition-all group relative border-l-4 border-transparent hover:border-primary">
                    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteMove(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-bold">{s.title}</h3>
                        <p className="text-muted-foreground text-sm">{s.description}</p>
                        <div className="pt-4 flex items-center gap-4">
                          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase" onClick={() => runSimulation(s.title)}>
                            <Cpu className="mr-2 h-3.5 w-3.5" /> Simulate
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase" asChild>
                             <Link href="/wardroom">Discuss</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Column: The Captain's AI Agent Interaction */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-8 space-y-6">
            {/* The Captain's Avatar & Pop-up Trigger */}
            <div className="flex flex-col items-end gap-4">
              <div className="relative group cursor-pointer" onClick={() => setIsCaptainExpanded(!isCaptainExpanded)}>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <Avatar className="h-20 w-20 border-4 border-white shadow-2xl relative">
                  <AvatarImage src={captainImg?.imageUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary text-white"><Bot className="h-10 w-10" /></AvatarFallback>
                </Avatar>
                {/* Notification Badge */}
                {!isCaptainExpanded && captainProposal && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    <span className="text-[8px] font-bold text-white">1</span>
                  </div>
                )}
              </div>

              {/* Speech Bubble / Pop-up */}
              <div className={cn(
                "w-full transition-all duration-500 transform origin-top-right",
                isCaptainExpanded ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
              )}>
                <div className="bg-white rounded-3xl border-2 border-primary/20 shadow-2xl overflow-hidden">
                  <div className="p-4 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Strategic Insight</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCaptainExpanded(false)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-relaxed text-slate-800">
                        {captainMessage}
                      </p>
                    </div>

                    {captainProposal && (
                      <div className="space-y-4 animate-in slide-in-from-bottom-2">
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1.5">
                          <p className="text-xs font-bold text-primary uppercase">{captainProposal.title}</p>
                          <p className="text-[11px] text-slate-600 leading-tight">{captainProposal.desc}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 h-10 text-[10px] font-bold uppercase shadow-lg rounded-xl"
                            onClick={() => handleAddMove(captainProposal.title, captainProposal.desc)}
                          >
                            Add to Sandbox
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-10 w-12 p-0 bg-slate-50 border-slate-200 hover:bg-primary/10 rounded-xl"
                            asChild
                          >
                            <Link href="/wardroom"><MessageSquare className="h-4 w-4 text-primary" /></Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Simulation Result Area - Integrated with AI interaction */}
              {isCaptainExpanded && simResult && !simLoading && (
                <div className="w-full mt-4 animate-in fade-in duration-700">
                  <Card className="border-none shadow-xl bg-black/5 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Legacy Projection</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white/50 border border-black/5">
                          <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Total Wealth</p>
                          <p className="text-sm font-bold text-primary">{simResult.projectedWealth}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/50 border border-black/5">
                          <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Risk</p>
                          <p className={cn("text-sm font-bold", simResult.riskLevel === 'Critical' ? 'text-red-500' : 'text-amber-500')}>{simResult.riskLevel}</p>
                        </div>
                      </div>
                      <Button className="w-full h-9 shadow-lg bg-primary text-white uppercase text-[9px] font-bold rounded-xl" onClick={shareToWardroom}>
                        <Send className="mr-2 h-3.5 w-3.5" /> Share with Council
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {simLoading && (
                <div className="w-full flex flex-col items-center justify-center py-6 space-y-2 opacity-60">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <p className="text-[8px] uppercase font-bold tracking-widest text-primary animate-pulse">Processing Hartmann Matrix...</p>
                </div>
              )}
            </div>

            {/* Quick Context Card */}
            <Card className="glass-panel border-white/5 bg-white/40 p-6 space-y-4">
               <div className="flex items-center gap-2">
                 <Bot className="h-4 w-4 text-primary" />
                 <h3 className="text-[10px] font-bold uppercase tracking-widest">Captain's Brief</h3>
               </div>
               <p className="text-[11px] text-muted-foreground leading-relaxed">
                 I'm currently analyzing {Object.keys(intentions).length} family intentions. High-alignment path detected through G3 technology rebalancing.
               </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
