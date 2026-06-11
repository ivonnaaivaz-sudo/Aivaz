
"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useDoc, useFirestore } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { wealthScenarioSimulation, type WealthScenarioSimulationOutput } from "@/ai/flows/wealth-scenario-simulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  CheckCircle2,
  Clock,
  Flag,
  ShieldAlert,
  Zap,
  ArrowUpRight,
  MessageSquare
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
  { time: '09:00', score: 72 },
  { time: '10:00', score: 74 },
  { time: '11:00', score: 73 },
  { time: '12:00', score: 78 },
  { time: '13:00', score: 77 },
  { time: '14:00', score: 81 },
  { time: '15:00', score: 79 },
  { time: '16:00', score: 84 },
];

const MOCK_TIMELINE_EVENTS = [
  { id: "e1", year: 2024, title: "G2 Educational Trust Funding", status: "completed", type: "SUCCESSION" },
  { id: "e2", year: 2025, title: "Golden Visa Eligibility", status: "in-progress", type: "PERSONAL" },
  { id: "e3", year: 2026, title: "Aivaz Foundation Launch", status: "target", type: "PHILANTHROPY" },
  { id: "e4", year: 2028, title: "G2 Principal Payout", status: "target", type: "FINANCIAL" },
  { id: "e5", year: 2035, title: "Dynasty Trust Maturity", status: "target", type: "MILESTONE" },
  { id: "e6", year: 2050, title: "Global Heritage Apex", status: "target", type: "VISION" },
  { id: "e7", year: 2075, title: "Legacy Century Celebration", status: "target", type: "VISION" }
];

type ScenarioType = 'base' | 'bull' | 'bear';

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

  // Timeline Scrubber State
  const [timelineYear, setTimelineYear] = useState([2024]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const blindspots = useMemo(() => {
    const data = {
      base: [
        { id: 'b1', name: 'Tech Concentration', risk: 'High', impact: '22%', color: 'amber' },
        { id: 'b2', name: 'Jurisdictional Diversity', risk: 'Moderate', impact: '12%', color: 'blue' },
        { id: 'b3', name: 'Liquidity Mismatch', risk: 'Low', impact: '5%', color: 'emerald' }
      ],
      bull: [
        { id: 'b1', name: 'Tech Concentration', risk: 'Extreme', impact: '35%', color: 'red' },
        { id: 'b2', name: 'Jurisdictional Diversity', risk: 'Moderate', impact: '10%', color: 'blue' },
        { id: 'b3', name: 'Liquidity Mismatch', risk: 'Low', impact: '2%', color: 'emerald' }
      ],
      bear: [
        { id: 'b1', name: 'Tech Concentration', risk: 'Critical', impact: '48%', color: 'red' },
        { id: 'b2', name: 'Jurisdictional Diversity', risk: 'Urgent', impact: '25%', color: 'amber' },
        { id: 'b3', name: 'Liquidity Mismatch', risk: 'High', impact: '18%', color: 'amber' }
      ]
    };
    return data[activeScenario];
  }, [activeScenario]);

  const runSimulation = async () => {
    if (!scenario) return;
    setSimLoading(true);
    try {
      const output = await wealthScenarioSimulation({
        currentFinancialOverview: "Total portfolio $142M. 60% tech equities, 20% real estate. FL Resident.",
        familyDNADynamics: dna ? JSON.stringify(dna.personalProfile.psychologicalProfile) : "Founder-led, succession tension detected.",
        scenarioDescription: scenario
      });
      setSimResult(output);
      toast({
        title: "Simulation Complete",
        description: "Predictive alignment matrix updated.",
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
      const topRisk = [...blindspots].sort((a, b) => parseInt(b.impact) - parseInt(a.impact))[0];
      text = `STRATEGY ALERT: Blindspot Analysis in ${activeScenario.toUpperCase()} scenario.\n\nThe current portfolio shows a ${topRisk.name} blindspot. The ${activeScenario} scenario suggests this risk increases impact to ${topRisk.impact}. How should we reallocate?`;
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
        description: "Scenario output shared for family discussion.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEvents = useMemo(() => {
    return MOCK_TIMELINE_EVENTS.filter(e => e.year >= timelineYear[0]);
  }, [timelineYear]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-32">
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
          <Activity className="h-5 w-5 text-primary animate-pulse" />
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
          <Card className="glass-panel border-white/5 bg-black/40">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
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
                      "text-[9px] font-bold uppercase tracking-widest px-4 h-7",
                      activeScenario === s ? "bg-primary/20 text-primary" : "text-muted-foreground"
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
                {blindspots.map((b) => (
                  <div 
                    key={b.id} 
                    className={cn(
                      "p-6 rounded-2xl border transition-all duration-500 relative group overflow-hidden",
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
                        <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Projected Impact Score</p>
                      </div>
                    </div>
                  </div>
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
                  <CardDescription className="text-xs font-mono uppercase">Execution environment for hybrid scenarios</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-[9px] border-primary/30 text-primary">Live</Badge>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Textarea 
                  placeholder="INPUT SCENARIO: e.g. 'Model 10% market downturn during G2 succession transition...'" 
                  className="min-h-[160px] bg-black/60 border-white/10 font-mono text-sm leading-relaxed focus-visible:ring-primary/40 placeholder:opacity-30"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {["Tax Reform 2025", "IPO Event", "Asset Liquidity Shift", "Jurisdiction Pivot"].map(t => (
                    <Button 
                      key={t} 
                      variant="outline" 
                      size="sm" 
                      className="text-[10px] h-7 bg-white/5 hover:bg-primary/10 border-white/5 font-mono"
                      onClick={() => setScenario(`Scenario: ${t}. Impact on family alignment and wealth...`)}
                    >
                      +{t}
                    </Button>
                  ))}
                </div>
                <Button 
                  className="w-full h-12 shadow-[0_0_30px_rgba(75,163,199,0.2)] font-bold uppercase tracking-widest group" 
                  onClick={runSimulation}
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
                    <p className="text-sm font-headline italic leading-relaxed">
                      "{simResult.scenarioSummary}"
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Predictive Alignment & Timeline */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="glass-panel border-white/5 bg-black/40">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <LineChartIcon className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Predictive Alignment</CardTitle>
              </div>
              <CardDescription className="text-xs font-mono">Live variance stream based on current strategy</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[200px] w-full px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={alignmentData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--foreground), 0.05)" />
                    <XAxis dataKey="time" stroke="hsla(var(--foreground), 0.4)" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid hsla(var(--primary), 0.3)', borderRadius: '12px' }}
                      itemStyle={{ color: 'hsl(var(--primary))', fontSize: '10px', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Consensus Score</p>
                  <p className="text-2xl font-headline font-bold text-primary">84%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Volatility</p>
                  <p className="text-2xl font-headline font-bold text-amber-500">LOW</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heritage Timeline with Scrubber */}
          <Card className="glass-panel border-white/5 bg-black/40">
            <CardHeader className="flex flex-col gap-4 border-b border-white/5 mb-6">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Heritage Timeline</CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase opacity-50">Generational Scrubber</CardDescription>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold font-mono">
                  <span>FOCUS: {timelineYear[0]}</span>
                  <span className="opacity-50">2075</span>
                </div>
                <Slider 
                  value={timelineYear} 
                  onValueChange={setTimelineYear} 
                  min={2024} 
                  max={2075} 
                  step={1}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-6 relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="flex gap-6 group relative pl-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10",
                        event.status === 'completed' ? 'bg-primary/20 border-primary' :
                        event.status === 'in-progress' ? 'bg-amber-500/10 border-amber-500 animate-pulse' :
                        'bg-card border-white/10'
                      )}>
                        {event.status === 'completed' ? <CheckCircle2 className="h-3 w-3 text-primary" /> : 
                         event.status === 'in-progress' ? <Clock className="h-3 w-3 text-amber-500" /> :
                         <Flag className="h-3 w-3 text-muted-foreground opacity-50" />}
                      </div>
                      <div className="space-y-1 pb-4">
                        <div className="flex items-center gap-2">
                          <p className="text-px] font-mono font-bold text-primary">{event.year}</p>
                          <Badge variant="outline" className="text-[7px] font-mono py-0">{event.type}</Badge>
                        </div>
                        <p className="text-xs font-bold leading-tight">{event.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button className="w-full text-[10px] font-bold uppercase tracking-widest" variant="secondary">
                Add Visionary Milestone
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
