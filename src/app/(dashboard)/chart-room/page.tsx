
"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  LayoutGrid,
  Zap,
  ArrowRightLeft,
  Check,
  Ban,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  BarChart3,
  Dna,
  Scale,
  PlusCircle,
  Trash2,
  Activity,
  Package,
  Trophy,
  ArrowRight
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
}

const INITIAL_PROPOSED_ACTIONS: DecisionCard[] = [
  {
    id: 'ai-b-1',
    type: 'action',
    title: "Inheritance Tax Gap",
    description: "Detected €8M exposure in the G1 -> G3 transition path due to new EU-wide reporting standards.",
    impactMetric: "-€8.0M Risk",
    liquidityValue: -8000000,
    riskDelta: 10,
    taxImpact: 8000000,
    logic: "System-detected tax blindspot.",
    category: "AI Blindspot",
    isAI: true,
    status: 'pending'
  },
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
    status: 'accepted'
  },
  {
    id: 'a-2',
    type: 'action',
    title: "Industrial Tech R&D",
    description: "Self-funding a new chemical synthesis lab in Munich.",
    impactMetric: "-€12.0M Capex",
    liquidityValue: -12000000,
    riskDelta: 15,
    logic: "Core business preservation through innovation.",
    category: "Business",
    status: 'accepted'
  }
];

const INITIAL_STRATEGIC_OFFSETS: DecisionCard[] = [
  {
    id: 'o-1',
    type: 'offset',
    title: "Concentration Hedge",
    description: "Immediate liquidation of €15M in stagnant commercial real estate to rebalance tech exposure.",
    impactMetric: "+€15.0M Liquidity",
    liquidityValue: 15000000,
    riskDelta: -25,
    taxImpact: -2000000,
    logic: "Mitigates the 55% real estate concentration risk detected in Hartmann DNA.",
    category: "Risk Management",
    isCritical: true
  },
  {
    id: 'o-2',
    type: 'offset',
    title: "Dividend-Backed Mortgage",
    description: "Finance the London property via a 15-year interest-only loan backed by Specialty Chem dividends.",
    impactMetric: "+€5.4M Liquidity Retention",
    liquidityValue: 5400000,
    riskDelta: -5,
    logic: "Preserves dry powder for market volatility while satisfying the housing need.",
    category: "Strategy"
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

  const aiBlindspots = useMemo(() => proposedActions.filter(a => a.isAI && a.status === 'pending'), [proposedActions]);
  const activeProposedActions = useMemo(() => proposedActions.filter(a => a.status === 'accepted'), [proposedActions]);

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
    let tax = 0;
    activeSynergies.forEach(({ action, offset }) => {
      if (action) {
        liquidity += action.liquidityValue;
        risk += action.riskDelta;
        tax += action.taxImpact || 0;
      }
      if (offset) {
        liquidity += offset.liquidityValue;
        risk += offset.riskDelta;
        tax += offset.taxImpact || 0;
      }
    });
    return { liquidity, risk, tax };
  }, [activeSynergies]);

  // Utility Ranking Logic for Strategy Pairs
  const utilityRanking = useMemo(() => {
    return activeSynergies.map(({ action, offset }) => {
      if (!action || !offset) return null;
      // Formula: Base DNA Alignment (85%) adjusted for Risk Delta and Liquidity Retention
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
    const baselineLiquidity = 42; // €M
    const baselineRisk = 55; // %
    const baselineVaR = 12.4; // €M
    
    const projectLiquidity = baselineLiquidity + (netImpact.liquidity / 1000000);
    const projectRisk = baselineRisk + netImpact.risk;
    const projectedVaR = Math.max(0, baselineVaR + (netImpact.risk * 0.15) + (netImpact.liquidity / 20000000));
    const dnaUtility = utilityRanking.length > 0 ? utilityRanking.reduce((sum, r) => sum + r.score, 0) / utilityRanking.length : 85;

    return [
      { 
        name: 'Liquidity Matrix', 
        baseline: baselineLiquidity, 
        projected: projectLiquidity, 
        unit: '€M',
        driver: utilityRanking[0]?.title || 'Preservation Mandate',
        status: projectLiquidity < 15 ? 'warning' : 'healthy',
        logic: "Aggregated liquidity penalty applied to outflows."
      },
      { 
        name: 'Monte Carlo VaR', 
        baseline: baselineVaR, 
        projected: projectedVaR, 
        unit: '€M',
        driver: 'Aggregate Sensitivity',
        status: projectedVaR > 15 ? 'warning' : 'healthy',
        isTechnical: true,
        logic: "Projected 95% CI loss across drafted strategy pairs."
      },
      { 
        name: 'DNA Utility Alignment', 
        baseline: 85, 
        projected: dnaUtility, 
        unit: '%',
        driver: utilityRanking[0] ? `Leader: ${utilityRanking[0].title}` : 'Baseline DNA',
        status: dnaUtility < 70 ? 'warning' : 'healthy',
        isDNA: true,
        logic: "Human architecture alignment based on Hartmann weights."
      },
    ];
  }, [netImpact, utilityRanking]);

  const handlePairing = (actionId: string, offsetId: string) => {
    setPairedIds(prev => {
      if (prev[actionId] === offsetId) {
        const next = { ...prev };
        delete next[actionId];
        return next;
      }
      if (Object.keys(prev).length === 0) setIsAnalysisExpanded(true);
      return { ...prev, [actionId]: offsetId };
    });
  };

  const handleAcceptAI = (id: string) => {
    setProposedActions(prev => prev.map(a => a.id === id ? { ...a, status: 'accepted' } : a));
    setIsAnalysisExpanded(true);
    toast({ title: "Blindspot Accepted", description: "Risk is now on the board for stabilization." });
  };

  const handleDismissAI = (id: string) => {
    setProposedActions(prev => prev.filter(a => a.id !== id));
    toast({ title: "Insight Dismissed", description: "System alert bypassed." });
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
      status: 'accepted'
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
      logic: "User-defined strategic offset.",
      category: newOffset.category,
      isUserGenerated: true
    };
    setStrategicOffsets(prev => [...prev, offset]);
    setNewOffset({ title: "", description: "", value: "0", riskDelta: "0", category: "Custom Strategy" });
    setIsAddOffsetOpen(false);
  };

  const handleDismissAction = (id: string) => {
    setProposedActions(prev => prev.filter(a => a.id !== id));
    setPairedIds(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
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
        text: `STABILIZED TPA BUNDLE: ${activeSynergies.length} Pairs Analysis.\n\nUtility Leaderboard:\n${rankingText}\n\nAggregate Impact:\n- Net Liquidity: €${(netImpact.liquidity / 1000000).toFixed(1)}M\n- Risk Delta: ${netImpact.risk > 0 ? '+' : ''}${netImpact.risk}%\n- Monte Carlo VaR: €${analysisBreakdown[1].projected.toFixed(1)}M`,
        type: "recommendation",
        timestamp: new Date().toISOString(),
        track: "strategy"
      });

      toast({ title: "TPA Bundle Transmitted", description: "Utility ranking and impact analysis sent to family council." });
      setPairedIds({});
      setIsAnalysisExpanded(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white antialiased">
      {/* Header */}
      <header className="h-20 border-b border-slate-200 px-12 flex items-center justify-between shrink-0 bg-white z-[60]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">TPA Decision Sandbox</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <p className="text-sm font-medium text-slate-500 italic">Finding the optimal Factor Exposures for Hartmann heritage.</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="h-8 bg-slate-50 border-slate-200 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-500">
            {activeSynergies.length} Strategy Pairs
          </Badge>
          <Button 
            disabled={activeSynergies.length === 0 || isSubmitting}
            onClick={handleSendToWardroom}
            className={cn(
              "h-10 px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
              activeSynergies.length > 0 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-slate-100 text-slate-400 border border-slate-200"
            )}
          >
            {isSubmitting ? "Transmitting..." : "Send to Wardroom"}
          </Button>
        </div>
      </header>

      {/* Workspace */}
      <main className="flex-1 overflow-hidden flex bg-slate-50/50">
        <div className="flex-1 overflow-y-auto px-12 pt-12 pb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Proposed Actions */}
            <div className="flex flex-col space-y-8">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="h-4 w-4 text-slate-400" />
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Proposed Actions</h2>
                </div>
                <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest gap-2 text-slate-500">
                      <PlusCircle className="h-3.5 w-3.5" /> Add New Action
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Propose Capital Event</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2"><Label>Title</Label><Input placeholder="e.g. Zurich Penthouse" value={newAction.title} onChange={e => setNewAction({...newAction, title: e.target.value})} /></div>
                      <div className="grid gap-2"><Label>Outflow Value (€)</Label><Input type="number" value={newAction.value} onChange={e => setNewAction({...newAction, value: e.target.value})} /></div>
                      <div className="grid gap-2"><Label>Strategic Risk Delta (0-100)</Label><Input type="number" value={newAction.riskDelta} onChange={e => setNewAction({...newAction, riskDelta: e.target.value})} /></div>
                    </div>
                    <DialogFooter><Button onClick={handleAddAction}>Add to Board</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-6 pb-20">
                {aiBlindspots.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Detective: Critical Blindspots</span>
                    </div>
                    {aiBlindspots.map((action) => (
                      <Card key={action.id} className="border-primary/20 bg-primary/[0.02] shadow-sm relative overflow-hidden transition-all">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-primary/20 text-primary">System Detection</Badge>
                            <span className="text-[10px] font-bold text-red-600">{action.impactMetric}</span>
                          </div>
                          <CardTitle className="text-sm font-bold text-slate-900 mt-2">{action.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[11px] text-slate-500 leading-relaxed italic mb-4">"{action.description}"</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 h-8 text-[9px] font-bold uppercase tracking-widest border-primary/20 text-primary" onClick={() => handleAcceptAI(action.id)}>Accept Risk</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest text-slate-400" onClick={() => handleDismissAI(action.id)}>Dismiss</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {activeProposedActions.map((action) => (
                  <Card key={action.id} className={cn("border transition-all relative shadow-sm group", pairedIds[action.id] ? "border-primary ring-1 ring-primary/10 bg-primary/[0.01]" : "border-slate-200 bg-white")}>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"><Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-red-500" onClick={() => handleDismissAction(action.id)}><Trash2 className="h-3 w-3" /></Button></div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-slate-100">{action.category}</Badge>
                        <span className="text-[10px] font-bold text-red-600">{action.impactMetric}</span>
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-900 mt-2">{action.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[11px] text-slate-500 leading-relaxed italic mb-4">"{action.description}"</p>
                      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{pairedIds[action.id] ? "Strategically Stabilized" : "Unpaired Outflow"}</span>
                        {pairedIds[action.id] && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Strategic Offsets */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-primary/60" />
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Strategic Offsets</h2>
                </div>
                <Dialog open={isAddOffsetOpen} onOpenChange={setIsAddOffsetOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest gap-2 text-primary">
                      <PlusCircle className="h-3.5 w-3.5" /> Add New Offset
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Define Strategic Offset</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2"><Label>Title</Label><Input placeholder="e.g. Dividend Recapture" value={newOffset.title} onChange={e => setNewOffset({...newOffset, title: e.target.value})} /></div>
                      <div className="grid gap-2"><Label>Stabilization Value (€)</Label><Input type="number" value={newOffset.value} onChange={e => setNewOffset({...newOffset, value: e.target.value})} /></div>
                    </div>
                    <DialogFooter><Button onClick={handleAddOffset}>Add to Board</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4 pb-20">
                {strategicOffsets.map((offset) => {
                  const pairedActionIds = Object.keys(pairedIds).filter(key => pairedIds[key] === offset.id);
                  const isPaired = pairedActionIds.length > 0;
                  return (
                    <Card 
                      key={offset.id}
                      onClick={() => {
                        const targetId = activeProposedActions.find(a => !pairedIds[a.id])?.id || activeProposedActions[0]?.id;
                        if (targetId) handlePairing(targetId, offset.id);
                      }}
                      className={cn("border transition-all cursor-pointer relative shadow-sm group overflow-hidden", offset.isCritical ? "border-amber-200 bg-amber-50/30" : "border-slate-200 bg-white", isPaired && "border-primary bg-primary/[0.02]")}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className={cn("text-[8px] uppercase tracking-widest", offset.isCritical ? "border-amber-400 text-amber-600" : "border-slate-100")}>{offset.category}</Badge>
                          <span className="text-[10px] font-bold text-emerald-600">{offset.impactMetric}</span>
                        </div>
                        <CardTitle className="text-sm font-bold text-slate-900 mt-2">{offset.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-[11px] leading-relaxed text-slate-600 font-medium">"{offset.description}"</p>
                        {isPaired && (
                          <div className="pt-3 border-t border-primary/10 space-y-2">
                             {pairedActionIds.map(actionId => (
                               <div key={actionId} className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-primary">
                                 <span className="flex items-center gap-1.5"><ArrowRightLeft className="h-3 w-3" /> Stabilizing {activeProposedActions.find(a => a.id === actionId)?.title}</span>
                                 <CheckCircle2 className="h-3 w-3" />
                               </div>
                             ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* TPA Diagnostic Hub - Anchored and Multi-Layered */}
      <div className={cn(
        "sticky bottom-0 bg-white border-t border-slate-200 z-[70] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out",
        isAnalysisExpanded ? "h-[620px]" : "h-24"
      )}>
        <div className={cn(
          "absolute top-0 left-0 w-full h-[calc(100%-6rem)] px-12 pt-8 transition-opacity duration-300 overflow-y-auto",
          isAnalysisExpanded ? "opacity-100 visible" : "opacity-0 invisible"
        )}>
          <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">Total Portfolio Diagnostic (TPA Matrix)</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsAnalysisExpanded(false)} className="h-8 text-[10px] font-bold uppercase tracking-widest">Minimize Diagnostic</Button>
            </div>

            {/* Utility Leaderboard Section - MOVED ABOVE MATRICES */}
            {utilityRanking.length > 0 && (
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Strategy Utility Leaderboard</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {utilityRanking.map((rank, i) => (
                    <div key={rank.id} className={cn(
                      "p-4 rounded-xl border transition-all flex flex-col gap-2 relative",
                      i === 0 ? "bg-amber-50/30 border-amber-200" : "bg-slate-50/50 border-slate-200"
                    )}>
                      {i === 0 && <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white border-transparent text-[8px] uppercase">Leader</Badge>}
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rank #{i + 1} • {rank.driver}</p>
                      <p className="text-xs font-bold truncate text-slate-900">{rank.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className={cn("h-full", i === 0 ? "bg-amber-500" : "bg-primary")} style={{ width: `${rank.score}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-900">{rank.score.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pillar Grid - NOW BELOW RANKING */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {analysisBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      {item.isTechnical ? <BarChart3 className="h-3.5 w-3.5 text-slate-400" /> : item.isDNA ? <Dna className="h-3.5 w-3.5 text-primary" /> : <Scale className="h-3.5 w-3.5 text-slate-400" />}
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {item.projected.toFixed(1)}{item.unit}
                    </span>
                  </div>
                  
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-300 z-10" />
                    <div 
                      className={cn("h-full transition-all duration-1000", item.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500')} 
                      style={{ 
                        width: `${Math.abs((item.projected - item.baseline) / item.baseline) * 50}%`,
                        marginLeft: item.projected >= item.baseline ? '50%' : `${50 - Math.abs((item.projected - item.baseline) / item.baseline) * 50}%`
                      }} 
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>Baseline: {item.baseline}{item.unit}</span>
                    <span className={cn(item.projected > item.baseline ? 'text-emerald-600' : 'text-amber-600')}>
                      Delta: {(item.projected - item.baseline).toFixed(1)}{item.unit}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logic: {item.driver}</p>
                    <p className="text-sm font-medium text-slate-600 italic leading-snug">{item.logic}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* TPA Methodology Tracker */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-4 gap-4">
              {[
                { step: 1, label: "Set Risk Targets", desc: "Identifying Hartmann sustainability goals", active: true },
                { step: 2, label: "Factor Exposure", desc: "Optimizing mix for return & preservation", active: activeProposedActions.length > 0 },
                { step: 3, label: "Strategy Blocks", desc: "Modeling building blocks & real assets", active: activeSynergies.length > 0 },
                { step: 4, label: "Balance & Selection", desc: "Cumulative execution check", active: activeSynergies.length > 1 }
              ].map((s) => (
                <div key={s.step} className={cn("flex flex-col gap-1 px-4 py-2 border-l-2", s.active ? "border-primary" : "border-slate-100 opacity-40")}>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary">TPA Step {s.step}</span>
                  <span className="text-xs font-bold">{s.label}</span>
                  <span className="text-[10px] text-slate-500 leading-tight">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Permanent Summary Bar */}
        <div className="absolute bottom-0 left-0 w-full h-24 flex items-center justify-between px-12 border-t border-slate-50 bg-white">
          <div className="flex items-center gap-12">
            <div className="flex flex-col cursor-pointer group" onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}>
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">Drafting Stability Hub</p>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> {activeSynergies.length} Bundled Strategies
                {isAnalysisExpanded ? <ChevronDown className="h-3.5 w-3.5 text-primary" /> : <ChevronUp className="h-3.5 w-3.5 text-primary" />}
              </p>
            </div>
            <div className="h-10 w-px bg-slate-100" />
            <div className="flex flex-col cursor-pointer group" onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}>
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">Cumulative Bundle Impact</p>
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                  <span className={cn("text-xl font-bold", netImpact.liquidity >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {netImpact.liquidity >= 0 ? '+' : ''}€{(netImpact.liquidity / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Liquidity</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xl font-bold", netImpact.risk <= 0 ? "text-emerald-600" : "text-amber-600")}>
                    {netImpact.risk > 0 ? '+' : ''}{netImpact.risk}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Risk Shift</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Synergies Established</p>
              <p className="text-[11px] text-slate-500 italic">Ready for Wardroom review.</p>
            </div>
            <Button onClick={handleSendToWardroom} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20">Transmit Package</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
