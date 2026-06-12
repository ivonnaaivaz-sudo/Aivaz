
"use client";

import { useState, useMemo } from "react";
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
  Clock, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Info,
  ArrowDownToLine,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const alignmentData = [
  { time: '09:00', actual: 82, simulated: 82 },
  { time: '10:00', actual: 84, simulated: 82 },
  { time: '11:00', actual: 83, simulated: 75 },
  { time: '12:00', actual: 84.2, simulated: 70 },
  { time: '13:00', actual: 84.2, simulated: 65 },
  { time: '14:00', actual: 84.2, simulated: 62 },
  { time: '15:00', actual: 84.2, simulated: 62 },
  { time: '16:00', actual: 84.2, simulated: 62 },
];

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

  const [newMove, setNewMove] = useState({ title: "", description: "" });
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<WealthScenarioSimulationOutput | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Intentions Matrix Data (Cash Inflows vs Outflows)
  const [intentions, setIntentions] = useState<Record<string, Intention>>({
    "Dr. Markus-Current": { value: 15, type: 'inflow', label: "Inheritance Payout" },
    "Dr. Markus-5 Years": { value: 25, type: 'outflow', label: "Estate Diversification" },
    "Elena-Current": { value: 5, type: 'outflow', label: "Philanthropy Grant" },
    "Sophie-5 Years": { value: 12, type: 'inflow', label: "Trust Distribution" },
    "Alexander-10 Years": { value: 40, type: 'outflow', label: "VC Fund Buy-in" },
    "Lina-25 Years": { value: 10, type: 'inflow', label: "Legacy Dividend" },
  });

  const scenariosQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "scenarios"), orderBy("createdAt", "desc"));
  }, [user, db]);

  const { data: scenarios } = useCollection(scenariosQuery);

  const handleAddMove = async (manualTitle?: string, manualDesc?: string) => {
    if (!user || !db) return;
    const title = manualTitle || newMove.title;
    const description = manualDesc || newMove.description;
    
    if (!title) return;

    try {
      const scenarioRef = doc(collection(db, "users", user.uid, "scenarios"));
      await setDoc(scenarioRef, {
        title,
        description: description || "Auto-generated from Intentions Matrix.",
        author: user.displayName || "Family Member",
        status: "draft",
        createdAt: new Date().toISOString()
      });
      setNewMove({ title: "", description: "" });
      setIsAdding(false);
      toast({ title: "Move Promoted", description: "This intention has been moved to the strategic sandbox." });
    } catch (e) { 
      console.error(e); 
    }
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
    const combinedContext = scenarios.map(s => `${s.title}: ${s.description}`).join("\n") + (context ? `\n\nActive Trigger: ${context}` : "");

    try {
      const output = await wealthScenarioSimulation({
        currentFinancialOverview: "€380M AUM. 55% Real Estate Concentration. €42M Idle Cash.",
        familyDNADynamics: dna ? JSON.stringify(dna.familyProfile.relationalDynamics) : "Succession tension between G1 (industrial) and G3 (tech/ESG).",
        scenarioDescription: combinedContext || "General portfolio stress test across current drafted life moves."
      });
      
      setSimResult(output);
      toast({
        title: "Simulation Complete",
        description: "Aivaz has synthesized the projected impact of your strategic sandbox.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSimLoading(false);
    }
  };

  const shareToWardroom = async () => {
    if (!user || !db || !simResult) return;
    try {
      const msgRef = doc(collection(db, "users", user.uid, "messages"));
      await setDoc(msgRef, {
        senderId: user.uid,
        senderName: "Julian Aivaz",
        text: `STRATEGY PROJECTION: Strategic Sandbox Simulation.\n\nProjected Wealth: ${simResult.projectedWealth}\nRisk Level: ${simResult.riskLevel}\nSummary: ${simResult.scenarioSummary}`,
        type: "recommendation",
        timestamp: new Date().toISOString()
      });
      toast({ title: "Shared with Wardroom", description: "Projections shared with family stakeholders." });
    } catch (e) { console.error(e); }
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
      // Cycle: Outflow -> Inflow -> Off
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
    const description = `This strategic event is classified as a ${intent.type} of €${intent.value}M. It represents a major generational milestone impacting ${member}'s stake and overall inheritance health.`;
    handleAddMove(title, description);
  };

  const inheritanceHealth = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    Object.values(intentions).forEach(i => {
      if (i.type === 'inflow') totalInflow += i.value;
      else totalOutflow += i.value;
    });
    
    // Balance score: More inflows improve it, more outflows stress it
    const net = totalInflow - totalOutflow;
    const score = 75 + (net / 2);
    return Math.min(100, Math.max(0, score));
  }, [intentions]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-32">
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
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Family Intentions Matrix (Heat Map) */}
          <Card className="glass-panel border-white/5 bg-white shadow-sm overflow-hidden">
            <CardHeader className="border-b border-black/5 bg-muted/30 p-8 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline font-bold">Legacy Intentions Matrix</CardTitle>
                <CardDescription>Plan family milestones. Green cells represent cash coming in (Inheritance, Payouts), red represents outflows (Purchases, Payouts).</CardDescription>
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
                {/* Header row */}
                <div className="grid grid-cols-[180px_repeat(4,1fr)] gap-3 mb-6">
                  <div />
                  {TIME_HORIZONS.map(h => (
                    <div key={h} className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</p>
                    </div>
                  ))}
                </div>

                {/* Body rows */}
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
                            intent.type === 'inflow' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
                            'bg-red-500/10 text-red-700 border-red-500/20'
                          )}
                          onClick={() => toggleIntention(member.name, horizon)}
                        >
                          {isActive ? (
                            <>
                              {intent.type === 'inflow' ? <ArrowUpRight className="h-4 w-4 mb-1" /> : <ArrowDownRight className="h-4 w-4 mb-1" />}
                              <span className="text-[10px] font-bold uppercase tracking-tighter leading-tight">{intent.label}</span>
                              <span className="text-[10px] font-mono mt-1">€{intent.value}M</span>
                            </>
                          ) : (
                            <Target className="h-4 w-4 opacity-20" />
                          )}
                          
                          {/* Promotion Overlay */}
                          {isActive && (
                            <div 
                              className="absolute inset-0 bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-full group-hover:translate-y-0 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                promoteToSandbox(member.name, horizon);
                              }}
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
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <p className="text-[10px] text-muted-foreground font-medium">
                    <strong>Green (Inflow):</strong> Funds entering the family ecosystem (Inheritance, Distributions, Revenue). Improves stability score.
                  </p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <p className="text-[10px] text-muted-foreground font-medium">
                    <strong>Red (Outflow):</strong> Capital leaving or being redeployed (Asset purchases, Buy-outs, Lifestyle). Stresses stability score.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Strategic Sandbox (Notion-like) */}
          <Card className="glass-panel border-white/5 bg-white shadow-sm overflow-hidden min-h-[400px]">
            <CardHeader className="border-b border-black/5 bg-muted/30 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-headline font-bold">Strategic Sandbox</CardTitle>
                  <CardDescription>Aggregate moves projected for the Hartmann Council. Drag objectives from the Matrix to simulate.</CardDescription>
                </div>
                <Button onClick={() => setIsAdding(true)} className="rounded-full h-10 px-6 shadow-lg bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Life Move
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-black/5">
                {isAdding && (
                  <div className="p-8 bg-primary/5 space-y-4 animate-in slide-in-from-top duration-300">
                    <Input 
                      placeholder="Title of Move (e.g., 'Alexander's House Purchase')" 
                      className="text-lg font-bold border-none bg-transparent focus-visible:ring-0 px-0"
                      value={newMove.title}
                      onChange={(e) => setNewMove({...newMove, title: e.target.value})}
                    />
                    <Textarea 
                      placeholder="Describe the details, goals, and emotional drivers..."
                      className="min-h-[100px] border-none bg-transparent focus-visible:ring-0 px-0 resize-none text-muted-foreground"
                      value={newMove.description}
                      onChange={(e) => setNewMove({...newMove, description: e.target.value})}
                    />
                    <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
                      <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                      <Button onClick={() => handleAddMove()}>Save Move</Button>
                    </div>
                  </div>
                )}

                {(scenarios?.length || 0) === 0 && !isAdding && (
                  <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground opacity-30">
                    <ArrowDownToLine className="h-12 w-12 animate-pulse" />
                    <div>
                      <p className="font-bold">Sandbox Empty</p>
                      <p className="text-xs">Promote objectives from the Matrix above to start simulating your legacy.</p>
                    </div>
                  </div>
                )}

                {scenarios?.map((s) => (
                  <div key={s.id} className="p-8 hover:bg-muted/30 transition-all group relative border-l-4 border-transparent hover:border-primary">
                    <div className="absolute top-8 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteMove(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold">{s.title}</h3>
                          <Badge variant="outline" className="text-[8px] uppercase">{s.author}</Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm">{s.description}</p>
                        <div className="pt-4 flex items-center gap-4">
                          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest" onClick={() => runSimulation(s.title)}>
                            <Cpu className="mr-2 h-3.5 w-3.5" /> Simulate Move
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest" asChild>
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

        {/* Side Column: Projection Engine */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="glass-panel border-white/5 bg-black/40 overflow-hidden">
            <CardHeader className="bg-primary/10 border-b border-white/10">
              <CardTitle className="text-sm uppercase font-bold tracking-widest text-primary flex items-center gap-2">
                <Zap className="h-4 w-4" /> Matrix Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[250px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={alignmentData}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--foreground), 0.05)" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 100]} hide />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid hsla(var(--primary), 0.3)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="actual" name="Alignment" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="p-8 space-y-8 border-t border-white/5">
                {!simResult && !simLoading && (
                  <div className="text-center py-10 space-y-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Ready for Synthesis</p>
                    <Button className="w-full h-12 shadow-xl" onClick={() => runSimulation()} disabled={(scenarios?.length || 0) === 0}>
                      <Cpu className="mr-2 h-4 w-4" /> Execute Aggregate Simulation
                    </Button>
                    <p className="text-[10px] text-muted-foreground italic">Simulation incorporates all Sandbox items and Matrix inflows/outflows.</p>
                  </div>
                )}

                {simLoading && (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-primary animate-pulse">Processing Hartmann Matrix...</p>
                  </div>
                )}

                {simResult && !simLoading && (
                  <div className="space-y-6 animate-in fade-in duration-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[9px] font-bold uppercase mb-1">Projected Wealth</p>
                        <p className="text-lg font-bold text-primary">{simResult.projectedWealth}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[9px] font-bold uppercase mb-1">Risk Level</p>
                        <p className={cn("text-lg font-bold", simResult.riskLevel === 'Critical' ? 'text-red-500' : 'text-amber-500')}>{simResult.riskLevel}</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 italic text-sm leading-relaxed text-foreground/80">
                      "{simResult.scenarioSummary}"
                    </div>
                    <Button className="w-full h-12 shadow-lg" onClick={shareToWardroom}>
                      <Send className="mr-2 h-4 w-4" /> Share with Council
                    </Button>
                    <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-widest" onClick={() => setSimResult(null)}>
                      Clear Projection
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5 bg-black/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Strategic Overlay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Matrix Complexity", value: "High", icon: Activity },
                { label: "G3 Capital Lockup", value: "€55M Risk", icon: Clock },
                { label: "Inheritance Stability", value: `${inheritanceHealth.toFixed(1)}%`, icon: Target }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <stat.icon className="h-3.5 w-3.5" /> {stat.label}
                  </span>
                  <span className="font-bold text-foreground">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
