
"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useDoc, useFirestore } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { wealthScenarioSimulation, type WealthScenarioSimulationOutput } from "@/ai/flows/wealth-scenario-simulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Cpu, 
  Loader2, 
  LineChart as LineChartIcon, 
  TrendingUp, 
  Sparkles, 
  Send, 
  Terminal, 
  AlertCircle, 
  Activity,
  ShieldAlert,
  Zap,
  ArrowUpRight,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock data for the Predictive Alignment data stream
const alignmentData = [
  { time: '09:00', actual: 72, simulated: 72 },
  { time: '10:00', actual: 74, simulated: 75 },
  { time: '11:00', actual: 73, simulated: 78 },
  { time: '12:00', actual: 78, simulated: 82 },
  { time: '13:00', actual: 77, simulated: 85 },
  { time: '14:00', actual: 81, simulated: 88 },
  { time: '15:00', actual: 79, simulated: 91 },
  { time: '16:00', actual: 84, simulated: 94 },
];

type ScenarioType = 'base' | 'bull' | 'bear';

interface Blindspot {
  id: string;
  name: string;
  risk: string;
  impact: string;
  color: 'red' | 'amber' | 'emerald' | 'blue';
  mitigations: string[];
}

export default function ChartRoomPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  // Simulation State
  const [scenario, setScenario] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<WealthScenarioSimulationOutput | null>(null);

  // Blindspot Engine State
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('base');
  const [selectedBlindspot, setSelectedBlindspot] = useState<Blindspot | null>(null);

  const blindspots: Record<ScenarioType, Blindspot[]> = useMemo(() => ({
    base: [
      { id: 'b1', name: 'Tech Concentration', risk: 'High', impact: '22%', color: 'amber', mitigations: ['Transfer to G2 Trust', 'Hedge via Derivatives', 'Diversify into Real Estate'] },
      { id: 'b2', name: 'Jurisdictional Diversity', risk: 'Moderate', impact: '12%', color: 'blue', mitigations: ['Relocate Liquid Capital', 'Establish Swiss Trust', 'Pivot to Singapore Hub'] },
      { id: 'b3', name: 'Liquidity Mismatch', risk: 'Low', impact: '5%', color: 'emerald', mitigations: ['Liquidate Non-Core', 'Open Revolving Credit', 'Short-Term Bond Pivot'] }
    ],
    bull: [
      { id: 'b1', name: 'Tech Concentration', risk: 'Extreme', impact: '35%', color: 'red', mitigations: ['Lock-in Profits', 'Aggressive G2 Payout', 'Venture Debt Bridge'] },
      { id: 'b2', name: 'Jurisdictional Diversity', risk: 'Moderate', impact: '10%', color: 'blue', mitigations: ['Asset Relocation', 'Tax Optimization Run', 'Currency Swap'] },
      { id: 'b3', name: 'Liquidity Mismatch', risk: 'Low', impact: '2%', color: 'emerald', mitigations: ['Growth Capital Deployment', 'Expand PE Reach', 'Leverage Expansion'] }
    ],
    bear: [
      { id: 'b1', name: 'Tech Concentration', risk: 'Critical', impact: '48%', color: 'red', mitigations: ['Defensive Put Options', 'Immediate Liquidation', 'Collateral Buffer'] },
      { id: 'b2', name: 'Jurisdictional Diversity', risk: 'Urgent', impact: '25%', color: 'amber', mitigations: ['Flight to Quality', 'Repatriate Assets', 'Jurisdictional Exit'] },
      { id: 'b3', name: 'Liquidity Mismatch', risk: 'High', impact: '18%', color: 'amber', mitigations: ['Cash Reserve Pivot', 'Credit Line Utilization', 'Debt Refinancing'] }
    ]
  }), []);

  const currentBlindspots = blindspots[activeScenario];

  const runSimulation = async (presetScenario?: string) => {
    const scenarioToRun = presetScenario || scenario;
    if (!scenarioToRun) return;
    
    setSimLoading(true);
    try {
      const output = await wealthScenarioSimulation({
        currentFinancialOverview: "Total portfolio $142M. 60% tech equities, 20% real estate. FL Resident.",
        familyDNADynamics: dna ? JSON.stringify(dna.personalProfile.psychologicalProfile) : "Founder-led, succession tension detected.",
        scenarioDescription: scenarioToRun
      });
      setSimResult(output);
      toast({
        title: "Simulation Complete",
        description: "Predictive alignment matrix updated with trajectory overlay.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSimLoading(false);
    }
  };

  const shareScenarioToWardroom = async (source: 'simulation' | 'blindspots') => {
    if (!user || !db) return;
    
    let text = "";
    if (source === 'blindspots') {
      const topRisk = [...currentBlindspots].sort((a, b) => parseInt(b.impact) - parseInt(a.impact))[0];
      text = `STRATEGY ALERT: Blindspot Analysis in ${activeScenario.toUpperCase()} scenario.\n\nThe current portfolio shows a ${topRisk.name} blindspot. Impact is projected at ${topRisk.impact}. Mitigator requested.`;
    } else if (simResult) {
      text = `PROGNOSIS OUTPUT: ${simResult.scenarioSummary}\n\nProjected Wealth: ${simResult.projectedWealth}\nRisk Level: ${simResult.riskLevel}`;
    }

    try {
      const msgRef = doc(collection(db, "users", user.uid, "messages"));
      await setDoc(msgRef, {
        senderId: user.uid,
        senderName: user.displayName || "Julian Aivaz",
        text,
        type: "recommendation",
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Sent to Wardroom",
        description: "Strategy data shared with family stakeholders.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const executeMitigation = (action: string) => {
    toast({
      title: "Mitigation Initiated",
      description: `Action "${action}" has been queued for family approval in the Wardroom.`,
    });
    setSelectedBlindspot(null);
  };

  return (
    <div className={cn(
      "space-y-8 max-w-[1600px] mx-auto pb-32 transition-all duration-1000",
      activeScenario === 'bear' ? "bg-red-500/[0.02]" : activeScenario === 'bull' ? "bg-primary/[0.02]" : ""
    )}>
      {/* Terminal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-[0.2em] text-[9px] font-bold">Innovation Deck v4.0</Badge>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-glow">Chart Room</h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest opacity-60">High-fidelity prognosis & blindspot analysis</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <Activity className={cn(
            "h-5 w-5 animate-pulse",
            activeScenario === 'bear' ? "text-red-500" : "text-primary"
          )} />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Global Alignment</p>
            <p className="text-xl font-headline font-bold text-primary">84.2%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Simulation & Blindspots */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Blindspot Analysis Engine */}
          <Card className={cn(
            "glass-panel border-white/5 bg-black/40 transition-all duration-700",
            activeScenario === 'bear' ? "ring-1 ring-red-500/20" : ""
          )}>
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className={cn(
                    "h-4 w-4",
                    activeScenario === 'bear' ? "text-red-500" : "text-amber-500"
                  )} />
                  <CardTitle className="text-lg">Blindspot Analysis Engine</CardTitle>
                </div>
                <CardDescription className="text-xs uppercase tracking-widest opacity-60">Interactive Portfolio stress-testing</CardDescription>
              </div>
              <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
                {(['base', 'bull', 'bear'] as ScenarioType[]).map((s) => (
                  <Button
                    key={s}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-4 h-7 transition-all",
                      activeScenario === s 
                        ? (s === 'bear' ? "bg-red-500/20 text-red-500" : "bg-primary/20 text-primary")
                        : "text-muted-foreground"
                    )}
                    onClick={() => setActiveScenario(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentBlindspots.map((b) => (
                  <Dialog key={b.id} open={selectedBlindspot?.id === b.id} onOpenChange={(open) => !open && setSelectedBlindspot(null)}>
                    <DialogTrigger asChild>
                      <div 
                        onClick={() => setSelectedBlindspot(b)}
                        className={cn(
                          "p-6 rounded-2xl border transition-all duration-500 relative group overflow-hidden cursor-pointer hover:scale-[1.02]",
                          b.color === 'red' ? "bg-red-500/5 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]" :
                          b.color === 'amber' ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]" :
                          "bg-white/5 border-white/10"
                        )}
                      >
                        {b.color === 'red' && <div className="absolute inset-0 bg-red-500/5 animate-pulse" />}
                        <div className="relative z-10 space-y-4">
                          <div className="flex justify-between items-start">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{b.name}</p>
                            <Badge variant="outline" className={cn(
                              "text-[8px] font-mono",
                              b.color === 'red' ? "text-red-500 border-red-500/40" :
                              b.color === 'amber' ? "text-amber-500 border-amber-500/40" :
                              "text-emerald-500 border-emerald-500/40"
                            )}>
                              {b.risk}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-3xl font-headline font-bold">{b.impact}</p>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Impact Score</p>
                          </div>
                          <div className="pt-4 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>Open Instant Mitigator</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          Instant Mitigator: {b.name}
                        </DialogTitle>
                        <DialogDescription className="text-xs uppercase tracking-widest font-mono">
                          Targeted rebalancing to reduce {b.impact} risk impact
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-3 py-6">
                        {b.mitigations.map((action, i) => (
                          <Button 
                            key={i} 
                            variant="outline" 
                            className="h-14 justify-between bg-white/5 border-white/10 hover:bg-primary/10 hover:border-primary/30 group"
                            onClick={() => executeMitigation(action)}
                          >
                            <span className="text-sm font-bold">{action}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </Button>
                        ))}
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                          Executing a mitigator will instantly generate a decision vote in the Wardroom for all family principals.
                        </p>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border border-background bg-muted flex items-center justify-center text-[8px] font-bold">
                        {i === 1 ? 'JA' : i === 2 ? 'MA' : 'EA'}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">Current Consensus: 78% on {activeScenario} rebalancing</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 text-[9px] font-bold uppercase tracking-widest"
                  onClick={() => shareScenarioToWardroom('blindspots')}
                >
                  <MessageSquare className="mr-2 h-3.5 w-3.5" />
                  Discuss Scenario in Wardroom
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Matrix Simulator */}
          <Card className="glass-panel border-white/5 bg-black/40 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Matrix Simulator</CardTitle>
                  <CardDescription className="text-xs font-mono uppercase">Execution environment for legacy pivot points</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-[9px] border-primary/30 text-primary">Live Engine</Badge>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Scenario Library</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: "Market Crash 20%", icon: TrendingUp, prompt: "Model 20% global equities crash during G2 succession transition." },
                    { label: "Succession Conflict", icon: Zap, prompt: "Simulate impact of G1/G2 voting deadlock on trust liquidity." },
                    { label: "Jurisdiction Pivot", icon: Activity, prompt: "Project tax and estate efficiency shift from US to Singapore." },
                    { label: "IPO/Liquidity Event", icon: ArrowUpRight, prompt: "Model $50M liquidity event and impact on generational alignment." },
                    { label: "Global Tax Reform", icon: ShieldAlert, prompt: "Simulate 15% increase in capital gains tax across EU holdings." },
                    { label: "G3 Education Funding", icon: Sparkles, prompt: "Model early capitalization of 2035 Education Trust for G3." }
                  ].map((preset) => (
                    <Button 
                      key={preset.label}
                      variant="outline"
                      className="h-16 justify-start gap-4 bg-white/[0.02] border-white/5 hover:bg-primary/10 hover:border-primary/20 group text-left"
                      onClick={() => runSimulation(preset.prompt)}
                      disabled={simLoading}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <preset.icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold leading-tight">{preset.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Custom Matrix Input</p>
                  <Button variant="link" className="h-auto p-0 text-[10px] font-bold uppercase text-primary" onClick={() => setScenario("")}>Clear Input</Button>
                </div>
                <Textarea 
                  placeholder="INPUT CUSTOM SCENARIO: e.g. 'Model impact of Robert Chen (Advisor) exit during tax audit...'" 
                  className="min-h-[120px] bg-black/60 border-white/10 font-mono text-sm leading-relaxed focus-visible:ring-primary/40 placeholder:opacity-30"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                />
                <Button 
                  className="w-full h-12 shadow-[0_0_30px_rgba(75,163,199,0.2)] font-bold uppercase tracking-widest group" 
                  onClick={() => runSimulation()}
                  disabled={simLoading || !scenario}
                >
                  {simLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Terminal className="mr-2 h-4 w-4" />}
                  Execute Simulation Run
                </Button>
              </div>

              {simResult && (
                <div className="space-y-6 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Projected Wealth</p>
                      <p className="text-lg font-headline font-bold text-primary">{simResult.projectedWealth}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Risk Level</p>
                      <p className={`text-lg font-headline font-bold ${simResult.riskLevel === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>{simResult.riskLevel}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 border-primary/20 hover:bg-primary/5 text-primary gap-2"
                      onClick={() => shareScenarioToWardroom('simulation')}
                    >
                      <Send className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Send to Wardroom</span>
                    </Button>
                  </div>
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 relative group">
                    <Sparkles className="absolute top-4 right-4 h-4 w-4 text-primary opacity-20" />
                    <p className="text-sm font-headline italic leading-relaxed text-foreground/90">
                      "{simResult.scenarioSummary}"
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Predictive Alignment Graph */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="glass-panel border-white/5 bg-black/40">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <LineChartIcon className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Predictive Alignment</CardTitle>
              </div>
              <CardDescription className="text-xs font-mono">
                {simResult ? "Simulated Trajectory Overlay Active" : "Live variance stream based on current strategy"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[250px] w-full px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={alignmentData}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--foreground), 0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="hsla(var(--foreground), 0.4)" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid hsla(var(--primary), 0.3)', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="actual" 
                      name="Actual Alignment"
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorActual)" 
                      strokeWidth={2}
                    />
                    {simResult && (
                      <Area 
                        type="monotone" 
                        dataKey="simulated" 
                        name="Simulated Trajectory"
                        stroke="hsl(var(--accent))" 
                        fillOpacity={1} 
                        fill="url(#colorSim)" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="p-6 space-y-4 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Current Alignment</p>
                    <p className="text-2xl font-headline font-bold text-primary">84%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Simulated Delta</p>
                    <p className={cn(
                      "text-2xl font-headline font-bold",
                      simResult ? "text-emerald-500" : "text-muted-foreground/30"
                    )}>
                      {simResult ? "+10%" : "--"}
                    </p>
                  </div>
                </div>
                {simResult && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Proposed Strategy Increases Alignment</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5 bg-black/40 overflow-hidden group">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Strategic Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-headline font-medium leading-relaxed italic">
                Simulated rebalancing is projected to improve multi-generational stability by 10% in bear conditions.
              </p>
              <Button className="w-full text-[10px] font-bold uppercase tracking-widest h-10 group bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                Generate Full Prognosis Report
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
