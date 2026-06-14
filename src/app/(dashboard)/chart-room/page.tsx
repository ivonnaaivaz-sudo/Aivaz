
"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Sparkles, 
  CheckCircle2, 
  Zap,
  ArrowRightLeft,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  BarChart3,
  Dna,
  Scale,
  PlusCircle,
  Trash2,
  Package,
  Trophy,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  LayoutGrid
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type CardType = 'action' | 'offset';

interface DecisionCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  impactMetric: string;
  liquidityValue: number; 
  riskDelta: number; // -100 to 100
  taxImpact?: number;
  logic: string;
  category: string;
  isCritical?: boolean;
  isUserGenerated?: boolean;
  isAI?: boolean;
  status?: 'pending' | 'accepted' | 'dismissed';
  relatedMembers: string[];
}

const MEMBERS = [
  { name: "Markus", avatar: "https://picsum.photos/seed/markus/100/100" },
  { name: "Elena", avatar: "https://picsum.photos/seed/elena/100/100" },
  { name: "Sophie", avatar: "https://picsum.photos/seed/sophie/100/100" },
  { name: "Alexander", avatar: "https://picsum.photos/seed/alexander/100/100" },
];

const KEY_BLINDSPOTS = [
  {
    id: 'bs-1',
    title: "Inheritance Tax Gap (G1-G3)",
    severity: "Critical",
    description: "Detected €8.4M exposure in the G1 -> G3 transition path due to lack of current trust alignment.",
    impact: "-€8.4M Asset Value",
    relatedMembers: ["Markus", "Sophie"],
    suggestedPair: {
      action: { title: "G1-G3 Trust Transfer", val: -8400000, risk: 2, desc: "Mandatory tax exposure resolution." },
      offset: { title: "Dynasty Trust Recap", val: 8400000, risk: -5, desc: "Strategic buffer for trust consolidation." }
    }
  },
  {
    id: 'bs-2',
    title: "Real Estate Concentration",
    severity: "High",
    description: "Munich and Singapore properties represent 55% of the Hartmann legacy.",
    impact: "+18% Beta Sensitivity",
    relatedMembers: ["Markus", "Alexander"],
    suggestedPair: {
      action: { title: "Asia Exposure Re-Weight", val: -12000000, risk: 18, desc: "Reducing geographic sensitivity." },
      offset: { title: "PE Tech Infrastructure Swap", val: 15000000, risk: -25, desc: "Liquidity offset via industrial re-allocation." }
    }
  }
];

const INITIAL_PROPOSED_ACTIONS: DecisionCard[] = [
  {
    id: 'a-1',
    type: 'action',
    title: "G3 London Property",
    description: "Lump-sum capital expenditure for Sophie's primary residence in London.",
    impactMetric: "-€6.0M Liquidity",
    liquidityValue: -6000000,
    riskDelta: 5,
    logic: "Sophie's professional relocation mandate.",
    category: "Real Estate",
    status: 'accepted',
    relatedMembers: ["Sophie"]
  }
];

const INITIAL_STRATEGIC_OFFSETS: DecisionCard[] = [
  {
    id: 'o-2',
    type: 'offset',
    title: "Dividend-Backed Mortgage",
    description: "Finance Sophie's London property via a 15-year interest-only loan.",
    impactMetric: "+€5.4M Liquidity Retention",
    liquidityValue: 5400000,
    riskDelta: -5,
    logic: "Preserves dry powder.",
    category: "Strategy",
    relatedMembers: ["Sophie", "Markus"]
  }
];

export default function DecisionSandboxPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [proposedActions, setProposedActions] = useState<DecisionCard[]>(INITIAL_PROPOSED_ACTIONS);
  const [strategicOffsets, setStrategicOffsets] = useState<DecisionCard[]>(INITIAL_STRATEGIC_OFFSETS);
  const [pairedIds, setPairedIds] = useState<Record<string, string>>({}); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [isAddOffsetOpen, setIsAddOffsetOpen] = useState(false);

  const [newAction, setNewAction] = useState({ title: "", description: "", value: "0", riskDelta: "0", category: "Capital Event" });
  const [newOffset, setNewOffset] = useState({ title: "", description: "", value: "0", riskDelta: "0", category: "Custom Strategy" });

  const activeSynergies = useMemo(() => {
    return Object.entries(pairedIds).map(([actionId, offsetId]) => {
      const action = proposedActions.find(c => c.id === actionId);
      const offset = strategicOffsets.find(c => c.id === offsetId);
      return { action, offset };
    });
  }, [pairedIds, proposedActions, strategicOffsets]);

  const netImpact = useMemo(() => {
    let liquidity = 0;
    let risk = 0;
    activeSynergies.forEach(({ action, offset }) => {
      if (action) {
        liquidity += action.liquidityValue;
        risk += action.riskDelta;
      }
      if (offset) {
        liquidity += offset.liquidityValue;
        risk += offset.riskDelta;
      }
    });
    return { liquidity, risk };
  }, [activeSynergies]);

  const utilityRanking = useMemo(() => {
    return activeSynergies.map(({ action, offset }) => {
      if (!action || !offset) return null;
      const riskImpact = (action.riskDelta + offset.riskDelta);
      const liqImpact = (action.liquidityValue + offset.liquidityValue) / 1000000;
      const score = 85 - (riskImpact * 0.4) + (liqImpact * 0.5);
      return {
        title: `${action.title} / ${offset.title}`,
        score: Math.max(0, Math.min(100, score)),
        id: `${action.id}-${offset.id}`,
        driver: action.category
      };
    }).filter((r): r is NonNullable<typeof r> => r !== null).sort((a, b) => b.score - a.score);
  }, [activeSynergies]);

  const analysisBreakdown = useMemo(() => {
    const baselineLiquidity = 42; 
    const baselineVaR = 12.4; 
    
    const projectLiquidity = baselineLiquidity + (netImpact.liquidity / 1000000);
    const projectedVaR = Math.max(0, baselineVaR + (netImpact.risk * 0.15) + (netImpact.liquidity / 20000000));
    const dnaUtility = utilityRanking.length > 0 ? utilityRanking.reduce((sum, r) => sum + r.score, 0) / utilityRanking.length : 85;

    return [
      { name: 'Liquidity Matrix', baseline: baselineLiquidity, projected: projectLiquidity, unit: '€M', status: projectLiquidity < 15 ? 'warning' : 'healthy', logic: "Aggregated liquidity penalty applied." },
      { name: 'Monte Carlo VaR', baseline: baselineVaR, projected: projectedVaR, unit: '€M', status: projectedVaR > 15 ? 'warning' : 'healthy', isTechnical: true, logic: "Projected 95% CI loss across pairs." },
      { name: 'DNA Utility Alignment', baseline: 85, projected: dnaUtility, unit: '%', status: dnaUtility < 70 ? 'warning' : 'healthy', isDNA: true, logic: "Human architecture alignment." },
    ];
  }, [netImpact, utilityRanking]);

  const handlePairing = (actionId: string, offsetId: string) => {
    setPairedIds(prev => {
      if (prev[actionId] === offsetId) {
        const next = { ...prev };
        delete next[actionId];
        return next;
      }
      setIsAnalysisExpanded(true);
      return { ...prev, [actionId]: offsetId };
    });
  };

  const handleTakeActionOnBlindspot = (bs: typeof KEY_BLINDSPOTS[0]) => {
    const actionId = `ai-a-${Date.now()}`;
    const offsetId = `ai-o-${Date.now()}`;
    
    const newActionCard: DecisionCard = {
      id: actionId,
      type: 'action',
      title: bs.suggestedPair.action.title,
      description: bs.suggestedPair.action.desc,
      impactMetric: `€${(bs.suggestedPair.action.val / 1000000).toFixed(1)}M`,
      liquidityValue: bs.suggestedPair.action.val,
      riskDelta: bs.suggestedPair.action.risk,
      logic: "AI-suggested exposure resolution.",
      category: "Exposure",
      isAI: true,
      status: 'accepted',
      relatedMembers: bs.relatedMembers
    };

    const newOffsetCard: DecisionCard = {
      id: offsetId,
      type: 'offset',
      title: bs.suggestedPair.offset.title,
      description: bs.suggestedPair.offset.desc,
      impactMetric: `+€${(bs.suggestedPair.offset.val / 1000000).toFixed(1)}M`,
      liquidityValue: bs.suggestedPair.offset.val,
      riskDelta: bs.suggestedPair.offset.risk,
      logic: "Stabilization offset.",
      category: "Risk Management",
      isAI: true,
      relatedMembers: bs.relatedMembers
    };

    setProposedActions(prev => [newActionCard, ...prev]);
    setStrategicOffsets(prev => [newOffsetCard, ...prev]);
    setPairedIds(prev => ({ ...prev, [actionId]: offsetId }));
    setIsAnalysisExpanded(true);
    toast({ title: "Pairing Created", description: "AI-suggested strategy added to board." });
  };

  const handleAddAction = () => {
    const id = `user-a-${Date.now()}`;
    const val = parseFloat(newAction.value) || 0;
    const action: DecisionCard = {
      id,
      type: 'action',
      title: newAction.title,
      description: newAction.description,
      impactMetric: `€${(val / 1000000).toFixed(1)}M`,
      liquidityValue: val,
      riskDelta: parseFloat(newAction.riskDelta) || 0,
      logic: "User-defined capital event.",
      category: newAction.category,
      isUserGenerated: true,
      status: 'accepted',
      relatedMembers: ["Markus"]
    };
    setProposedActions(prev => [...prev, action]);
    setNewAction({ title: "", description: "", value: "0", riskDelta: "0", category: "Capital Event" });
    setIsAddActionOpen(false);
  };

  const handleAddOffset = () => {
    const id = `user-o-${Date.now()}`;
    const val = parseFloat(newOffset.value) || 0;
    const offset: DecisionCard = {
      id,
      type: 'offset',
      title: newOffset.title,
      description: newOffset.description,
      impactMetric: `€${(val / 1000000).toFixed(1)}M`,
      liquidityValue: val,
      riskDelta: parseFloat(newOffset.riskDelta) || 0,
      logic: "User-defined offset.",
      category: newOffset.category,
      isUserGenerated: true,
      relatedMembers: ["Markus"]
    };
    setStrategicOffsets(prev => [...prev, offset]);
    setNewOffset({ title: "", description: "", value: "0", riskDelta: "0", category: "Custom Strategy" });
    setIsAddOffsetOpen(false);
  };

  const handleSendToWardroom = async () => {
    if (!user || !db || activeSynergies.length === 0) return;
    setIsSubmitting(true);
    try {
      const msgRef = collection(db, "users", user.uid, "messages");
      const rankingText = utilityRanking.map((r, i) => `${i + 1}. ${r.title} (Utility: ${r.score.toFixed(0)}%)`).join('\n');
      await addDoc(msgRef, {
        senderId: "aivaz-system",
        senderName: "TPA Sandbox",
        text: `STABILIZED STRATEGY PACKAGE:\n\nUtility Leaderboard:\n${rankingText}\n\nAggregate Impact:\n- Net Liquidity: €${(netImpact.liquidity / 1000000).toFixed(1)}M\n- Risk Delta: ${netImpact.risk > 0 ? '+' : ''}${netImpact.risk}%`,
        type: "recommendation",
        timestamp: new Date().toISOString(),
        track: "strategy"
      });
      toast({ title: "Transmitted", description: "Package sent to council." });
      setPairedIds({});
      setIsAnalysisExpanded(false);
    } catch (e) { console.error(e); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white antialiased">
      <header className="h-20 border-b border-slate-200 px-12 flex items-center justify-between shrink-0 bg-white z-[60]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">TPA Decision Sandbox</span>
          </div>
          <p className="text-sm font-medium text-slate-500 italic">Optimizing Hartmann heritage exposures.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            disabled={activeSynergies.length === 0 || isSubmitting}
            onClick={handleSendToWardroom}
            className="h-10 px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-primary text-white shadow-lg disabled:bg-slate-100 disabled:text-slate-400"
          >
            {isSubmitting ? "Transmitting..." : "Send to Wardroom"}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col bg-slate-50/50">
        <section className="shrink-0 px-12 pt-8 pb-4 bg-white border-b border-slate-200 shadow-sm z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900">Portfolio Blindspots</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {KEY_BLINDSPOTS.map((bs) => (
                <Card key={bs.id} className="relative overflow-hidden border border-slate-200 bg-white hover:shadow-md transition-all">
                  <div className={cn("absolute top-0 left-0 w-1 h-full", bs.severity === 'Critical' ? "bg-red-500" : "bg-amber-500")} />
                  <CardHeader className="py-4 pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={cn("text-[9px] uppercase font-bold", bs.severity === 'Critical' ? "bg-red-500 text-white" : "bg-amber-500 text-white")}>
                        {bs.severity}
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-900">{bs.impact}</span>
                    </div>
                    <CardTitle className="text-sm font-bold mt-2 text-slate-900">{bs.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 flex flex-col gap-4">
                    <p className="text-[11px] text-slate-600 line-clamp-1 italic">"{bs.description}"</p>
                    <Button 
                      size="sm" 
                      className="w-full h-8 text-[9px] font-bold uppercase tracking-widest"
                      onClick={() => handleTakeActionOnBlindspot(bs)}
                    >
                      <PlusCircle className="mr-2 h-3 w-3" /> Create a Pairing
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <div className="flex-1 overflow-y-auto px-12 pt-8 pb-32">
          <div className="max-w-4xl mx-auto flex flex-col gap-12">
            
            {/* Strategic Offsets (Inflows / Money Coming In) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-500" />
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Strategic Offsets (Inflows)</h2>
                </div>
                <Dialog open={isAddOffsetOpen} onOpenChange={setIsAddOffsetOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest text-primary">
                      + Add New Offset
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Strategic Offset</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2"><Label>Title</Label><Input value={newOffset.title} onChange={e => setNewOffset({...newOffset, title: e.target.value})} /></div>
                      <div className="grid gap-2"><Label>Inflow Value (€)</Label><Input type="number" value={newOffset.value} onChange={e => setNewOffset({...newOffset, value: e.target.value})} /></div>
                    </div>
                    <DialogFooter><Button onClick={handleAddOffset}>Add Offset</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategicOffsets.map((offset) => (
                  <Card 
                    key={offset.id} 
                    onClick={() => {
                      const targetId = proposedActions.find(a => !pairedIds[a.id])?.id || proposedActions[0]?.id;
                      if (targetId) handlePairing(targetId, offset.id);
                    }}
                    className={cn(
                      "border transition-all cursor-pointer relative shadow-sm",
                      Object.values(pairedIds).includes(offset.id) ? "border-primary bg-primary/[0.02] ring-1 ring-primary/20" : "border-slate-200 bg-white"
                    )}
                  >
                    <CardHeader className="py-4 pb-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[8px] uppercase tracking-widest">{offset.category}</Badge>
                        <span className="text-[10px] font-bold text-emerald-600">{offset.impactMetric}</span>
                      </div>
                      <CardTitle className="text-sm font-bold mt-1">{offset.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-[10px] text-slate-500 italic">"{offset.description}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Proposed Actions (Outflows / Capital Events) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-slate-400" />
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Proposed Actions (Outflows)</h2>
                </div>
                <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      + Add New Action
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Propose Capital Event</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2"><Label>Title</Label><Input value={newAction.title} onChange={e => setNewAction({...newAction, title: e.target.value})} /></div>
                      <div className="grid gap-2"><Label>Outflow Value (€)</Label><Input type="number" value={newAction.value} onChange={e => setNewAction({...newAction, value: e.target.value})} /></div>
                    </div>
                    <DialogFooter><Button onClick={handleAddAction}>Add Action</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposedActions.map((action) => (
                  <Card 
                    key={action.id} 
                    className={cn(
                      "border transition-all relative shadow-sm",
                      pairedIds[action.id] ? "border-primary bg-primary/[0.01] ring-1 ring-primary/10" : "border-slate-200 bg-white"
                    )}
                  >
                    <CardHeader className="py-4 pb-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[8px] uppercase tracking-widest">{action.category}</Badge>
                        <span className="text-[10px] font-bold text-red-600">{action.impactMetric}</span>
                      </div>
                      <CardTitle className="text-sm font-bold mt-1">{action.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4 flex flex-col gap-3">
                      <p className="text-[10px] text-slate-500 italic">"{action.description}"</p>
                      {pairedIds[action.id] && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase text-primary">Stabilized</span>
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* TPA Diagnostic Hub */}
      <div className={cn(
        "sticky bottom-0 bg-white border-t border-slate-200 z-[70] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out",
        isAnalysisExpanded ? "h-[500px]" : "h-24"
      )}>
        <div className={cn(
          "absolute top-0 left-0 w-full h-[calc(100%-6rem)] px-12 pt-6 transition-opacity duration-300 overflow-y-auto",
          isAnalysisExpanded ? "opacity-100 visible" : "opacity-0 invisible"
        )}>
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">Total Portfolio Truth Check</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsAnalysisExpanded(false)} className="h-8 text-[9px] font-bold uppercase">Minimize</Button>
            </div>

            {/* Utility Leaderboard */}
            {utilityRanking.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Strategy Utility Ranking</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {utilityRanking.map((rank, i) => (
                    <div key={rank.id} className={cn("p-3 rounded-lg border flex flex-col gap-1", i === 0 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Rank #{i + 1} • {rank.driver}</p>
                      <p className="text-[11px] font-bold truncate">{rank.title}</p>
                      <Progress value={rank.score} className="h-1 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pillar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              {analysisBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                    <span className="text-[9px] font-bold uppercase text-slate-400">{item.name}</span>
                    <span className="text-xs font-bold">{item.projected.toFixed(1)}{item.unit}</span>
                  </div>
                  <Progress value={(item.projected / item.baseline) * 50} className="h-1.5" />
                  <p className="text-[10px] text-slate-500 leading-tight italic">{item.logic}</p>
                </div>
              ))}
            </div>

            {/* TPA Progress */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              {[
                { step: 2, label: "Factor Exposure", active: true },
                { step: 3, label: "Strategy Blocks", active: activeSynergies.length > 0 },
                { step: 4, label: "Balance & Execution", active: activeSynergies.length > 1 }
              ].map((s) => (
                <div key={s.step} className={cn("flex flex-col gap-1 pl-3 border-l-2", s.active ? "border-primary" : "border-slate-100 opacity-40")}>
                  <span className="text-[8px] font-bold uppercase text-primary">TPA Step {s.step}</span>
                  <span className="text-[11px] font-bold">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 flex items-center justify-between px-12 border-t border-slate-50 bg-white">
          <div className="flex items-center gap-12">
            <div className="flex flex-col cursor-pointer" onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}>
              <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">Active Pairs</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> {activeSynergies.length} Bundled Strategies
                {isAnalysisExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              </p>
            </div>
            <div className="flex items-center gap-10">
              <div className="flex flex-col">
                <p className="text-[9px] font-bold uppercase text-slate-400">Net Liquidity</p>
                <span className={cn("text-lg font-bold", netImpact.liquidity >= 0 ? "text-emerald-600" : "text-red-600")}>
                  {netImpact.liquidity >= 0 ? '+' : ''}€{(netImpact.liquidity / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-[9px] font-bold uppercase text-slate-400">Risk Shift</p>
                <span className={cn("text-lg font-bold", netImpact.risk <= 0 ? "text-emerald-600" : "text-amber-600")}>
                  {netImpact.risk > 0 ? '+' : ''}{netImpact.risk}%
                </span>
              </div>
            </div>
          </div>
          <Button onClick={handleSendToWardroom} disabled={activeSynergies.length === 0} className="bg-primary hover:bg-primary/90 rounded-xl h-12 px-8 text-[10px] font-bold uppercase tracking-widest shadow-lg">
            Transmit Package
          </Button>
        </div>
      </div>
    </div>
  );
}
