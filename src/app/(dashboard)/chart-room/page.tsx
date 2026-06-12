
"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  LayoutGrid,
  Zap,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  X,
  PlusCircle,
  Loader2,
  Trash2,
  ArrowRightLeft
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
  logic: string;
  category: string;
  isCritical?: boolean;
  isUserGenerated?: boolean;
}

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
    category: "Real Estate"
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
    category: "Business"
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
  const [pairedIds, setPairedIds] = useState<Record<string, string>>({}); // ActionId -> OffsetId
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [isAddOffsetOpen, setIsAddOffsetOpen] = useState(false);

  // New Card Form States
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

  const handlePairing = (actionId: string, offsetId: string) => {
    setPairedIds(prev => {
      // If this action is already paired with THIS offset, unpair them
      if (prev[actionId] === offsetId) {
        const next = { ...prev };
        delete next[actionId];
        return next;
      }
      // Otherwise, pair them (overwriting any previous pairing for this action)
      return { ...prev, [actionId]: offsetId };
    });
  };

  const handleAddAction = () => {
    const id = `user-a-${Date.now()}`;
    const val = parseFloat(newAction.value) || 0;
    const action: DecisionCard = {
      id,
      type: 'action',
      title: newAction.title,
      description: newAction.description,
      impactMetric: `${val >= 0 ? '+' : ''}€${(val / 1000000).toFixed(1)}M Liquidity`,
      liquidityValue: val,
      riskDelta: parseFloat(newAction.riskDelta) || 0,
      logic: "User-defined proposed action.",
      category: newAction.category,
      isUserGenerated: true
    };
    setProposedActions(prev => [...prev, action]);
    setNewAction({ title: "", description: "", value: "0", riskDelta: "0", category: "Capital Event" });
    setIsAddActionOpen(false);
    toast({ title: "Proposed Action Added", description: "The outflow event has been added to the board." });
  };

  const handleAddOffset = () => {
    const id = `user-o-${Date.now()}`;
    const val = parseFloat(newOffset.value) || 0;
    const offset: DecisionCard = {
      id,
      type: 'offset',
      title: newOffset.title,
      description: newOffset.description,
      impactMetric: `${val >= 0 ? '+' : ''}€${(val / 1000000).toFixed(1)}M Liquidity`,
      liquidityValue: val,
      riskDelta: parseFloat(newOffset.riskDelta) || 0,
      logic: "User-defined strategic offset.",
      category: newOffset.category,
      isUserGenerated: true
    };
    setStrategicOffsets(prev => [...prev, offset]);
    setNewOffset({ title: "", description: "", value: "0", riskDelta: "0", category: "Custom Strategy" });
    setIsAddOffsetOpen(false);
    toast({ title: "Strategic Offset Created", description: "Your custom strategy has been added to the board." });
  };

  const handleDismissAction = (id: string) => {
    setProposedActions(prev => prev.filter(a => a.id !== id));
    setPairedIds(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDismissOffset = (id: string) => {
    setStrategicOffsets(prev => prev.filter(o => o.id !== id));
    setPairedIds(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (next[key] === id) delete next[key];
      });
      return next;
    });
  };

  const handleSendToWardroom = async () => {
    if (!user || !db || activeSynergies.length === 0) return;
    setIsSubmitting(true);
    try {
      const msgRef = collection(db, "users", user.uid, "messages");
      for (const synergy of activeSynergies) {
        if (synergy.action && synergy.offset) {
          await addDoc(msgRef, {
            senderId: "aivaz-system",
            senderName: "Decision Sandbox",
            text: `STABILIZED PACKAGE: ${synergy.action.title} + ${synergy.offset.title}. Net Impact: €${((synergy.action.liquidityValue + synergy.offset.liquidityValue) / 1000000).toFixed(1)}M. Risk Delta: ${synergy.action.riskDelta + synergy.offset.riskDelta > 0 ? '+' : ''}${synergy.action.riskDelta + synergy.offset.riskDelta}%`,
            type: "recommendation",
            timestamp: new Date().toISOString(),
            track: "strategy"
          });
        }
      }
      toast({ title: "Packages Transmitted", description: "Paired decisions have been sent to the Wardroom for council validation." });
      setPairedIds({});
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-body antialiased">
      {/* Header */}
      <div className="h-20 bg-white border-b border-slate-200 px-12 flex items-center justify-between z-30 sticky top-0 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Decision Sandbox</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <p className="text-sm font-medium text-slate-500 italic">
            Pair proposed actions with strategic offsets to reach a Stabilized State.
          </p>
        </div>
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

      {/* Main Board */}
      <div className="flex-1 overflow-auto p-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Column 1: Proposed Actions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <LayoutGrid className="h-4 w-4 text-slate-400" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Proposed Actions</h2>
              </div>
              <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest gap-2 text-slate-500 hover:bg-slate-100">
                    <PlusCircle className="h-3.5 w-3.5" /> Add New Action
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Propose Capital Event</DialogTitle>
                    <DialogDescription>Define a new expenditure or portfolio move that requires stabilization.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Title</Label>
                      <Input placeholder="e.g. Zurich HQ Renovation" value={newAction.title} onChange={e => setNewAction({...newAction, title: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Impact (€) - Use negative for outflow</Label>
                      <Input type="number" placeholder="-5000000" value={newAction.value} onChange={e => setNewAction({...newAction, value: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Risk Delta (0-100)</Label>
                      <Input type="number" value={newAction.riskDelta} onChange={e => setNewAction({...newAction, riskDelta: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Explain the rationale..." value={newAction.description} onChange={e => setNewAction({...newAction, description: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddAction}>Register Action</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-4">
              {proposedActions.map((action) => {
                const pairedOffsetId = pairedIds[action.id];
                const isPaired = !!pairedOffsetId;
                return (
                  <Card 
                    key={action.id}
                    className={cn(
                      "border transition-all duration-300 relative shadow-sm group",
                      isPaired ? "border-primary ring-1 ring-primary/10 bg-primary/[0.01]" : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-slate-300 hover:text-red-500"
                        onClick={() => handleDismissAction(action.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-slate-100">{action.category}</Badge>
                        <span className="text-[10px] font-bold text-red-600">{action.impactMetric}</span>
                      </div>
                      <CardTitle className="text-sm font-bold tracking-tight text-slate-900 mt-2">{action.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[11px] text-slate-500 leading-relaxed italic mb-4">"{action.description}"</p>
                      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">
                          {isPaired ? "Stabilization Active" : "Pending Offset"}
                        </span>
                        {isPaired && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Column 2: Strategic Offsets */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-primary/60" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Strategic Offsets</h2>
              </div>
              <Dialog open={isAddOffsetOpen} onOpenChange={setIsAddOffsetOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest gap-2 text-primary hover:bg-primary/5">
                    <PlusCircle className="h-3.5 w-3.5" /> Add New Offset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Define Strategic Offset</DialogTitle>
                    <DialogDescription>Input a custom financial or structural strategy to counter proposed actions.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Title</Label>
                      <Input placeholder="e.g. Asset-Backed Credit Line" value={newOffset.title} onChange={e => setNewOffset({...newOffset, title: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Impact (€)</Label>
                      <Input type="number" placeholder="5000000" value={newOffset.value} onChange={e => setNewOffset({...newOffset, value: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Risk Delta (-100 to 100)</Label>
                      <Input type="number" value={newOffset.riskDelta} onChange={e => setNewOffset({...newOffset, riskDelta: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Explain the mechanics..." value={newOffset.description} onChange={e => setNewOffset({...newOffset, description: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddOffset}>Register Offset</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {strategicOffsets.map((offset) => {
                const pairedActionId = Object.keys(pairedIds).find(key => pairedIds[key] === offset.id);
                const isPaired = !!pairedActionId;
                
                return (
                  <Card 
                    key={offset.id}
                    onClick={() => {
                      // Smart pairing: find first unpaired action or default to a-1
                      const targetActionId = proposedActions.find(a => !pairedIds[a.id])?.id || proposedActions[0].id;
                      handlePairing(targetActionId, offset.id);
                    }}
                    className={cn(
                      "border transition-all duration-300 cursor-pointer relative shadow-sm overflow-hidden group",
                      offset.isCritical ? "border-amber-200 bg-amber-50/30" : "border-slate-200 hover:border-primary/20 bg-white",
                      isPaired && "border-primary bg-primary/[0.02]"
                    )}
                  >
                    <div className="absolute top-2 right-2 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {offset.isCritical && <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-slate-300 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismissOffset(offset.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className={cn(
                          "text-[8px] uppercase tracking-widest",
                          offset.isCritical ? "border-amber-400 text-amber-600" : "border-slate-100"
                        )}>
                          {offset.isCritical ? "AI Critical Insight" : offset.category}
                        </Badge>
                        <span className="text-[10px] font-bold text-emerald-600">{offset.impactMetric}</span>
                      </div>
                      <CardTitle className="text-sm font-bold tracking-tight text-slate-900 mt-2">{offset.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                        "{offset.description}"
                      </p>
                      {isPaired && (
                        <div className="pt-3 border-t border-primary/10 flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-primary">
                          <span className="flex items-center gap-1.5"><ArrowRightLeft className="h-3 w-3" /> Coupled with {proposedActions.find(a => a.id === pairedActionId)?.title}</span>
                          <CheckCircle2 className="h-3 w-3" />
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

      {/* Decision Summary Bar */}
      {activeSynergies.length > 0 && (
        <div className="h-24 bg-white border-t border-slate-200 px-12 flex items-center justify-between z-30 shadow-[0_-4px_25px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-500">
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-1">Portfolio Balance</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-headline font-bold text-slate-900">
                  {activeSynergies.length} Pairings Active
                </p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-slate-100" />
            
            <div className="flex flex-col">
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-1">Net Drafting Impact</p>
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                  <span className={cn("text-xl font-headline font-bold", netImpact.liquidity >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {netImpact.liquidity >= 0 ? '+' : ''}€{(netImpact.liquidity / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Net Liquidity</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xl font-headline font-bold", netImpact.risk <= 0 ? "text-emerald-600" : "text-amber-600")}>
                    {netImpact.risk > 0 ? '+' : ''}{netImpact.risk}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Risk Shift</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Stabilized State Detected</p>
              <p className="text-[11px] text-slate-500 italic">Financial deltas balanced across drafting board.</p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/5 border border-primary/20">
              <ArrowRight className="h-5 w-5 text-primary animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
