
"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore, useDoc } from "@/firebase";
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
  ShieldCheck,
  PlusCircle,
  Package,
  Trophy,
  ShieldAlert,
  ChevronUp,
  ChevronDown,
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
  riskDelta: number; 
  logic: string;
  category: string;
  relatedMembers: string[];
  isAI?: boolean;
}

const MEMBERS = [
  { name: "Markus", color: "bg-blue-500", avatar: "https://picsum.photos/seed/markus/100/100" },
  { name: "Elena", color: "bg-purple-500", avatar: "https://picsum.photos/seed/elena/100/100" },
  { name: "Sophie", color: "bg-emerald-500", avatar: "https://picsum.photos/seed/sophie/100/100" },
  { name: "Alexander", color: "bg-amber-500", avatar: "https://picsum.photos/seed/alexander/100/100" },
];

const KEY_BLINDSPOTS = [
  {
    id: 'bs-1',
    title: "Inheritance Tax Gap (G1-G3)",
    severity: "Critical",
    description: "Detected €8.4M exposure in the G1 -> G3 transition path.",
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
    description: "Munich and Singapore properties represent 55% of legacy.",
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
    description: "Capital expenditure for Sophie's primary residence.",
    impactMetric: "-€6.0M Liquidity",
    liquidityValue: -6000000,
    riskDelta: 5,
    logic: "Sophie's relocation mandate.",
    category: "Real Estate",
    relatedMembers: ["Sophie"]
  }
];

const INITIAL_STRATEGIC_OFFSETS: DecisionCard[] = [
  {
    id: 'o-2',
    type: 'offset',
    title: "Dividend-Backed Mortgage",
    description: "Finance property via interest-only loan.",
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
  const { data: profile } = useDoc(user ? `users/${user.uid}` : null);
  
  const [proposedActions, setProposedActions] = useState<DecisionCard[]>(INITIAL_PROPOSED_ACTIONS);
  const [strategicOffsets, setStrategicOffsets] = useState<DecisionCard[]>(INITIAL_STRATEGIC_OFFSETS);
  const [pairedIds, setPairedIds] = useState<Record<string, string>>({}); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  
  const userRole = profile?.role || "Principal";
  const hasDetailedAccess = userRole === "Principal" || userRole === "Co-Principal";

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
      if (action) { liquidity += action.liquidityValue; risk += action.riskDelta; }
      if (offset) { liquidity += offset.liquidityValue; risk += offset.riskDelta; }
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
      { name: 'Liquidity Matrix', baseline: baselineLiquidity, projected: projectLiquidity, unit: '€M', logic: "Aggregated liquidity penalty applied." },
      { name: 'Monte Carlo VaR', baseline: baselineVaR, projected: projectedVaR, unit: '€M', logic: "Projected 95% CI loss across pairs." },
      { name: 'DNA Utility Alignment', baseline: 85, projected: dnaUtility, unit: '%', logic: "Human architecture alignment." },
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

  const handleCreatePairingFromBlindspot = (bs: typeof KEY_BLINDSPOTS[0]) => {
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
      logic: "AI exposure resolution.",
      category: "Exposure",
      isAI: true,
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
  };

  const MemberTags = ({ members }: { members: string[] }) => {
    if (userRole === "Limited Member") return null;
    return (
      <div className="flex -space-x-1.5 overflow-hidden">
        {members.map(m => (
          <TooltipProvider key={m}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="w-5 h-5 border-2 border-white ring-1 ring-slate-100">
                  <AvatarImage src={MEMBERS.find(mem => mem.name === m)?.avatar} />
                  <AvatarFallback className="text-[7px] font-bold">{m[0]}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="p-2 text-[10px] font-bold">
                {hasDetailedAccess ? `Primarily ${m}'s exposure` : "Member Exposure"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-white antialiased">
      <header className="h-16 border-b border-slate-200 px-12 flex items-center justify-between shrink-0 bg-white z-[60]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">TPA Decision Sandbox</span>
          </div>
          <Badge variant="outline" className="text-[8px] border-primary/20 text-primary uppercase">Access: {userRole}</Badge>
        </div>
        <Button 
          disabled={activeSynergies.length === 0 || isSubmitting}
          className="h-9 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-primary text-white shadow-lg"
        >
          {isSubmitting ? "Transmitting..." : "Send to Wardroom"}
        </Button>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col bg-slate-50/50">
        {/* Blindspots Section */}
        <section className="shrink-0 px-12 pt-6 pb-4 bg-white border-b border-slate-200 shadow-sm z-50 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-900">Blindspots</h2>
            </div>
            <div className="flex gap-4">
              {KEY_BLINDSPOTS.map((bs) => {
                const isMemberRelevant = !hasDetailedAccess ? bs.relatedMembers.includes("Sophie") || bs.relatedMembers.includes("Markus") : true;
                if (!isMemberRelevant && userRole !== "Principal") return null;
                return (
                  <Card key={bs.id} className="relative overflow-hidden border border-slate-200 bg-white w-80 shrink-0">
                    <div className={cn("absolute top-0 left-0 w-1 h-full", bs.severity === 'Critical' ? "bg-red-500" : "bg-amber-500")} />
                    <CardHeader className="py-3 pb-2">
                      <div className="flex justify-between items-start">
                        <Badge className="text-[8px] uppercase font-bold bg-muted text-muted-foreground">{bs.severity}</Badge>
                        <MemberTags members={bs.relatedMembers} />
                      </div>
                      <CardTitle className="text-xs font-bold mt-1">{bs.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 flex flex-col gap-2">
                      <p className="text-[10px] text-slate-500 line-clamp-1 italic">"{bs.description}"</p>
                      <Button size="sm" className="h-7 text-[8px] font-bold uppercase tracking-widest" onClick={() => handleCreatePairingFromBlindspot(bs)}>
                        Create a Pairing
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Vertical Drafting Area */}
        <div className="flex-1 overflow-y-auto px-12 pt-8 pb-32">
          <div className="max-w-4xl mx-auto flex flex-col gap-12">
            {/* Inflows */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest">Strategic Offsets (Inflows)</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {strategicOffsets.map((offset) => (
                  <Card 
                    key={offset.id} 
                    onClick={() => {
                      const targetId = proposedActions.find(a => !pairedIds[a.id])?.id || proposedActions[0]?.id;
                      if (targetId) handlePairing(targetId, offset.id);
                    }}
                    className={cn(
                      "border cursor-pointer relative shadow-sm transition-all",
                      Object.values(pairedIds).includes(offset.id) ? "border-primary bg-primary/[0.02] ring-1 ring-primary/20" : "border-slate-200 bg-white"
                    )}
                  >
                    <CardHeader className="py-4 pb-2 flex flex-row justify-between items-start">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[8px] uppercase">{offset.category}</Badge>
                        <CardTitle className="text-sm font-bold">{offset.title}</CardTitle>
                      </div>
                      <MemberTags members={offset.relatedMembers} />
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-[10px] text-slate-500 italic">"{offset.description}"</p>
                      <p className="text-[11px] font-bold text-emerald-600 mt-2">{offset.impactMetric}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Outflows */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <LayoutGrid className="h-4 w-4 text-slate-400" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest">Proposed Actions (Outflows)</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {proposedActions.map((action) => (
                  <Card 
                    key={action.id} 
                    className={cn(
                      "border relative shadow-sm transition-all",
                      pairedIds[action.id] ? "border-primary bg-primary/[0.01] ring-1 ring-primary/10" : "border-slate-200 bg-white"
                    )}
                  >
                    <CardHeader className="py-4 pb-2 flex flex-row justify-between items-start">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[8px] uppercase">{action.category}</Badge>
                        <CardTitle className="text-sm font-bold">{action.title}</CardTitle>
                      </div>
                      <MemberTags members={action.relatedMembers} />
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-[10px] text-slate-500 italic">"{action.description}"</p>
                      <div className="flex justify-between items-end mt-2">
                        <p className="text-[11px] font-bold text-red-600">{action.impactMetric}</p>
                        {pairedIds[action.id] && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
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
        "sticky bottom-0 bg-white border-t border-slate-200 z-[70] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500",
        isAnalysisExpanded ? "h-[450px]" : "h-20"
      )}>
        <div className={cn(
          "absolute top-0 left-0 w-full h-[calc(100%-5rem)] px-12 pt-6 transition-opacity duration-300 overflow-y-auto",
          isAnalysisExpanded ? "opacity-100 visible" : "opacity-0 invisible"
        )}>
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
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

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              {[
                { step: 2, label: "Factor Exposure", active: true },
                { step: 3, label: "Strategy Blocks", active: activeSynergies.length > 0 },
                { step: 4, label: "Execution Balance", active: activeSynergies.length > 1 }
              ].map((s) => (
                <div key={s.step} className={cn("flex flex-col gap-1 pl-3 border-l-2", s.active ? "border-primary" : "border-slate-100 opacity-40")}>
                  <span className="text-[8px] font-bold uppercase text-primary">TPA Step {s.step}</span>
                  <span className="text-[11px] font-bold">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-between px-12 border-t border-slate-50 bg-white">
          <div className="flex items-center gap-12 cursor-pointer" onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}>
            <div className="flex flex-col">
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
          <Button variant="ghost" onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)} className="text-[10px] font-bold uppercase tracking-widest h-10 px-6">
            {isAnalysisExpanded ? "Minimize Diagnostics" : "Expand Diagnostics"}
          </Button>
        </div>
      </div>
    </div>
  );
}
