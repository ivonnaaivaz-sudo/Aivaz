
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
  ArrowRight,
  AlertTriangle
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

// Demo data for alignment stream
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

  const [scenario, setScenario] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<WealthScenarioSimulationOutput | null>(null);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('base');
  const [selectedBlindspot, setSelectedBlindspot] = useState<Blindspot | null>(null);

  const blindspots: Record<ScenarioType, Blindspot[]> = useMemo(() => ({
    base: [
      { id: 'b1', name: 'Tech Concentration', risk: 'High', impact: '55%', color: 'amber', mitigations: ['Hedge via Derivatives', 'Transfer to G2 Trust', 'Fixed Income Pivot'] },
      { id: 'b2', name: 'Liquidity Mismatch', risk: 'Urgent', impact: '$12M Risk', color: 'red', mitigations: ['Open Revolving Credit', 'Secondary Sale', 'Allocation Hedge'] },
      { id: 'b3', name: 'Succession Gap', risk: 'Moderate', impact: '62% Score', color: 'blue', mitigations: ['Charter Review', 'Successor Training', 'Governance Sync'] }
    ],
    bull: [
      { id: 'b1', name: 'Tech Concentration', risk: 'Extreme', impact: '68%', color: 'red', mitigations: ['Lock-in Profits', 'Venture Debt Bridge', 'Tax Run'] },
      { id: 'b2', name: 'Liquidity Mismatch', risk: 'Low', impact: '$2M Risk', color: 'emerald', mitigations: ['Growth Capital', 'Expand PE Reach', 'Leverage Expansion'] },
      { id: 'b3', name: 'Succession Gap', risk: 'Stable', impact: '88% Score', color: 'emerald', mitigations: ['None Required', 'Continue Roadmap', 'Strategic Bonus'] }
    ],
    bear: [
      { id: 'b1', name: 'Tech Concentration', risk: 'Critical', impact: '48% Loss', color: 'red', mitigations: ['Immediate Liquidation', 'Defensive Puts', 'Collateral Buffer'] },
      { id: 'b2', name: 'Liquidity Mismatch', risk: 'Extreme', impact: '$12M Deficit', color: 'red', mitigations: ['Cash Reserve Pivot', 'Credit Line Sync', 'Debt Refinancing'] },
      { id: 'b3', name: 'Succession Gap', risk: 'Critical', impact: '62% Score', color: 'red', mitigations: ['Emergency Charter', 'Conflict Mediation', 'Advisor Exit Strategy'] }
    ]
  }), []);

  const currentBlindspots = blindspots[activeScenario];

  const runSimulation = async (presetScenario?: string) => {
    const scenarioToRun = presetScenario || scenario;
    if (!scenarioToRun) return;
    
    setSimLoading(true);
    const isBear = activeScenario === 'bear' || scenarioToRun.toLowerCase().includes('market crash') || scenarioToRun.toLowerCase().includes('bear');

    try {
      await new Promise(r => setTimeout(r, 1500));
      
      const output: WealthScenarioSimulationOutput = {
        scenarioSummary: isBear ? "Current tech exposure creates a $12M downside risk. G2 transition becomes underfunded as alignment drops to 62%." : "Portfolio remains resilient in base conditions, but liquidity for G2 commitments is tight.",
        projectedWealth: isBear ? "$44.5M (Down from $50M)" : "$51.2M",
        projectedTaxObligations: isBear ? "Net loss carry-forwards active" : "Normalizing for FL Residency",
        socialImpactAnalysis: isBear ? "Critical risk to G2 Educational Trust. Conflict potential High between Julian (Preservation) and Marcus (Growth)." : "Stable alignment.",
        riskLevel: isBear ? 'Critical' : 'Medium'
      };
      
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

  const shareToWardroom = async () => {
    if (!user || !db || !simResult) return;
    try {
      const msgRef = doc(collection(db, "users", user.uid, "messages"));
      await setDoc(msgRef, {
        senderId: user.uid,
        senderName: "Julian Aivaz",
        text: `STRATEGY ALERT: Bear Scenario Simulation Output.\n\nSummary: ${simResult.scenarioSummary}\nProjected Wealth: ${simResult.projectedWealth}\nAlignment Score: 62%\n\nDiscussing mitigation in Wardroom.`,
        type: "recommendation",
        timestamp: new Date().toISOString()
      });
      toast({ title: "Sent to Wardroom", description: "Strategy data shared with family stakeholders." });
    } catch (e) { console.error(e); }
  };

  return (
    <div className={cn(
      "space-y-8 max-w-[1600px] mx-auto pb-32 transition-all duration-1000",
      activeScenario === 'bear' ? "bg-red-500/[0.02]" : activeScenario === 'bull' ? "bg-primary/[0.02]" : ""
    )}>
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
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Predictive Alignment</p>
            <p className="text-xl font-headline font-bold text-primary">{activeScenario === 'bear' ? '62.0%' : '84.2%'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className={cn("glass-panel border-white/5 bg-black/40 transition-all duration-700", activeScenario === 'bear' ? "ring-1 ring-red-500/20" : "")}>
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className={activeScenario === 'bear' ? "text-red-500" : "text-amber-500"} />
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
                      <div onClick={() => setSelectedBlindspot(b)} className={cn("p-6 rounded-2xl border transition-all duration-500 relative group overflow-hidden cursor-pointer hover:scale-[1.02]", b.color === 'red' ? "bg-red-500/5 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : b.color === 'amber' ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "bg-white/5 border-white/10")}>
                        <div className="relative z-10 space-y-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{b.name}</p>
                          <div className="space-y-1">
                            <p className="text-2xl font-headline font-bold">{b.impact}</p>
                            <Badge variant="outline" className={cn("text-[8px] font-mono", b.color === 'red' ? "text-red-500 border-red-500/40" : b.color === 'amber' ? "text-amber-500 border-amber-500/40" : "text-emerald-500 border-emerald-500/40")}>{b.risk}</Badge>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
                      <DialogHeader><DialogTitle>Instant Mitigator: {b.name}</DialogTitle></DialogHeader>
                      <div className="grid gap-3 py-6">
                        {b.mitigations.map((action, i) => (
                          <Button key={i} variant="outline" className="h-14 justify-between bg-white/5 border-white/10 hover:bg-primary/10 hover:border-primary/30 group" onClick={() => {toast({ title: "Mitigation Queued", description: `Action "${action}" queued for Wardroom.` }); setSelectedBlindspot(null);}}>
                            <span className="text-sm font-bold">{action}</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5 bg-black/40 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-primary" />
                <div><CardTitle className="text-lg">Matrix Simulator</CardTitle><CardDescription className="text-xs">Demo execution environment</CardDescription></div>
              </div>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Market Bear 20%", icon: TrendingUp, prompt: "Model 20% global equities crash during G2 transition." },
                  { label: "Succession Conflict", icon: Zap, prompt: "Simulate impact of G1/G2 voting deadlock on trust liquidity." },
                  { label: "IPO/Liquidity Event", icon: ArrowUpRight, prompt: "Model $5.2M liquidity event impact." },
                  { label: "Tax Reform", icon: ShieldAlert, prompt: "Simulate 15% increase in capital gains." }
                ].map((preset) => (
                  <Button key={preset.label} variant="outline" className="h-16 justify-start gap-4 bg-white/[0.02] border-white/5 hover:bg-primary/10" onClick={() => runSimulation(preset.prompt)} disabled={simLoading}>
                    <preset.icon className="h-4 w-4" /><span className="text-xs font-bold">{preset.label}</span>
                  </Button>
                ))}
              </div>
              {simResult && (
                <div className="space-y-6 pt-8 border-t border-white/5 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10"><p className="text-[9px] font-bold uppercase mb-1">Projected Wealth</p><p className="text-lg font-bold text-primary">{simResult.projectedWealth}</p></div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10"><p className="text-[9px] font-bold uppercase mb-1">Risk Level</p><p className={cn("text-lg font-bold", simResult.riskLevel === 'Critical' ? 'text-red-500' : 'text-amber-500')}>{simResult.riskLevel}</p></div>
                  </div>
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 italic text-sm">"{simResult.scenarioSummary}"</div>
                  <Button className="w-full h-12" onClick={shareToWardroom}><Send className="mr-2 h-4 w-4" /> Discuss Scenario in Wardroom</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="glass-panel border-white/5 bg-black/40">
            <CardHeader><CardTitle className="text-sm uppercase font-bold">Predictive Alignment</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="h-[250px] w-full px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={alignmentData}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/><stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--foreground), 0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="hsla(var(--foreground), 0.4)" fontSize={10} hide />
                    <YAxis domain={[0, 100]} hide />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid hsla(var(--primary), 0.3)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="actual" name="Actual Alignment" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
                    {simResult && <Area type="monotone" dataKey="simulated" name="Simulated" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorSim)" strokeWidth={2} strokeDasharray="5 5" />}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="p-6 space-y-4 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[9px] font-bold uppercase text-muted-foreground">Current</p><p className="text-2xl font-bold text-primary">84.2%</p></div>
                  <div><p className="text-[9px] font-bold uppercase text-muted-foreground">Delta</p><p className={cn("text-2xl font-bold", simResult ? 'text-red-500' : 'text-muted-foreground/30')}>{simResult ? "-22.2%" : "--"}</p></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
