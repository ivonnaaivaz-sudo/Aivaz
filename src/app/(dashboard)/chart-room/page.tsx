
"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, limit } from "firebase/firestore";
import { wealthScenarioSimulation, type WealthScenarioSimulationOutput } from "@/ai/flows/wealth-scenario-simulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Cpu, 
  Loader2, 
  LineChart as LineChartIcon, 
  TrendingUp, 
  History, 
  Sparkles, 
  Send, 
  Terminal, 
  ArrowRight,
  ChevronRight,
  Compass,
  AlertCircle,
  Activity,
  CheckCircle2,
  Clock,
  Flag
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { useToast } from "@/hooks/use-toast";

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

export default function ChartRoomPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  // Simulation State
  const [scenario, setScenario] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<WealthScenarioSimulationOutput | null>(null);

  // Timeline Scrubber State
  const [timelineYear, setTimelineYear] = useState([2024]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const sendToWardroom = async () => {
    if (!simResult || !user || !db) return;
    try {
      const msgRef = doc(collection(db, "users", user.uid, "messages"));
      await setDoc(msgRef, {
        senderId: user.uid,
        senderName: user.displayName || "Julian Aivaz",
        text: `PROGNOSIS OUTPUT: ${simResult.scenarioSummary}\n\nProjected Wealth: ${simResult.projectedWealth}\nRisk Level: ${simResult.riskLevel}`,
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
          <h1 className="font-headline text-4xl font-bold tracking-tight">Chart Room</h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest opacity-60">High-fidelity prognosis & legacy simulation</p>
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
        {/* Left Column: Simulation Matrix */}
        <div className="lg:col-span-8 space-y-8">
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
                      onClick={sendToWardroom}
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

          {/* Heritage Timeline with Scrubber */}
          <Card className="glass-panel border-white/5 bg-black/40">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
              <div>
                <CardTitle className="text-lg">Heritage Timeline</CardTitle>
                <CardDescription className="text-xs font-mono uppercase">50+ Year Generational Prognosis</CardDescription>
              </div>
              <div className="w-64 space-y-2">
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
            <CardContent className="pb-12 px-10">
              <div className="relative mt-10">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
                <div className="flex justify-between items-center relative z-10 gap-8 overflow-x-auto pb-8 scrollbar-hide">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="flex flex-col items-center gap-4 min-w-[120px] group">
                      <p className="text-[10px] font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">{event.year}</p>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        event.status === 'completed' ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(75,163,199,0.3)]' :
                        event.status === 'in-progress' ? 'bg-amber-500/10 border-amber-500 animate-pulse' :
                        'bg-card border-white/10'
                      }`}>
                        {event.status === 'completed' ? <CheckCircle2 className="h-4 w-4 text-primary" /> : 
                         event.status === 'in-progress' ? <Clock className="h-4 w-4 text-amber-500" /> :
                         <Flag className="h-4 w-4 text-muted-foreground opacity-50" />}
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[11px] font-bold leading-tight max-w-[100px]">{event.title}</p>
                        <p className="text-[8px] uppercase tracking-tighter opacity-40 font-mono">{event.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Predictive Alignment Charts */}
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
              <div className="h-[250px] w-full px-2">
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

          <Card className="glass-panel border-white/5 bg-black/40">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Simulation History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Tax Reform Analysis", date: "09:42 AM", status: "STABLE" },
                { title: "G3 Education Trust", date: "Yesterday", status: "MODIFIED" },
                { title: "Offshore Exit Study", date: "3 days ago", status: "ARCHIVED" }
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                  <div>
                    <p className="text-xs font-bold group-hover:text-primary transition-colors">{h.title}</p>
                    <p className="text-[9px] font-mono text-muted-foreground">{h.date}</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-mono opacity-50">{h.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Prognosis Alert</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your "Heritage Century" vision is currently 78% aligned. Consider running a <strong>Succession Friction</strong> simulation to identify G2 transition bottlenecks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
