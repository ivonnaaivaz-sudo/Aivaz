"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  LayoutGrid,
  Zap,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertTriangle
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
  logic: string;
  category: string;
  isCritical?: boolean;
}

const PROPOSED_ACTIONS: DecisionCard[] = [
  {
    id: 'a-1',
    type: 'action',
    title: "G3 London Property",
    description: "Lump-sum capital expenditure for Sophie's primary residence in London.",
    impactMetric: "-€6.0M Liquidity",
    logic: "Sophie's professional relocation mandate.",
    category: "Real Estate"
  },
  {
    id: 'a-2',
    type: 'action',
    title: "Industrial Tech R&D",
    description: "Self-funding a new chemical synthesis lab in Munich.",
    impactMetric: "-€12.0M Capex",
    logic: "Core business preservation through innovation.",
    category: "Business"
  }
];

const STRATEGIC_OFFSETS: DecisionCard[] = [
  {
    id: 'o-1',
    type: 'offset',
    title: "Concentration Hedge",
    description: "Immediate liquidation of €15M in stagnant commercial real estate to rebalance tech exposure.",
    impactMetric: "+€15.0M Liquidity",
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
    logic: "Preserves dry powder for market volatility while satisfying the housing need.",
    category: "Strategy"
  },
  {
    id: 'o-3',
    type: 'offset',
    title: "Venture Buy-In Hedge",
    description: "Convert the R&D budget into a venture-style buy-in with tax credits in Singapore.",
    impactMetric: "+22% Tax Efficiency",
    logic: "Offsets capex drain through cross-jurisdictional heritage credits.",
    category: "Tax"
  }
];

export default function DecisionSandboxPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [pairedIds, setPairedIds] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSynergies = useMemo(() => {
    return Object.entries(pairedIds).map(([actionId, offsetId]) => {
      const action = PROPOSED_ACTIONS.find(c => c.id === actionId);
      const offset = STRATEGIC_OFFSETS.find(c => c.id === offsetId);
      return { action, offset };
    });
  }, [pairedIds]);

  const handlePairing = (actionId: string, offsetId: string) => {
    setPairedIds(prev => {
      if (prev[actionId] === offsetId) {
        const next = { ...prev };
        delete next[actionId];
        return next;
      }
      return { ...prev, [actionId]: offsetId };
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
            senderName: "Strategic Sandbox",
            text: `DECISION PACKAGE: ${synergy.action.title} + ${synergy.offset.title}. Resolution Logic: ${synergy.offset.logic}`,
            type: "recommendation",
            timestamp: new Date().toISOString(),
            track: "strategy"
          });
        }
      }
      toast({ title: "Package Transmitted", description: "Strategic decisions have been sent to the Wardroom for Council validation." });
      setPairedIds({});
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-body antialiased">
      {/* 1. Decision Hub Header */}
      <div className="h-20 bg-white border-b border-slate-200 px-12 flex items-center justify-between z-30 sticky top-0 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Strategic Decision Hub</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <p className="text-sm font-medium text-slate-500 italic">
            {activeSynergies.length > 0 
              ? `${activeSynergies.length} Strategic Pairings Active.` 
              : "Analyze Proposed Actions and identify Strategic Offsets to maintain heritage stability."}
          </p>
        </div>
        <Button 
          disabled={activeSynergies.length === 0 || isSubmitting}
          onClick={handleSendToWardroom}
          className="bg-primary text-white h-10 px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
        >
          {isSubmitting ? "Transmitting..." : "Send to Wardroom"}
        </Button>
      </div>

      {/* 2. Professional Workspace */}
      <div className="flex-1 overflow-auto p-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Column 1: Proposed Actions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <LayoutGrid className="h-4 w-4 text-slate-400" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Proposed Actions</h2>
              </div>
              <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-slate-400">Cash Outflow</Badge>
            </div>
            
            <div className="space-y-4">
              {PROPOSED_ACTIONS.map((action) => {
                const isPaired = !!pairedIds[action.id];
                return (
                  <Card 
                    key={action.id}
                    className={cn(
                      "border transition-all duration-300 relative shadow-sm",
                      isPaired ? "border-primary ring-1 ring-primary/10" : "border-slate-200 hover:border-slate-300"
                    )}
                  >
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
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Awaiting Offset</span>
                        {isPaired && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              <Button variant="ghost" className="w-full border border-dashed border-slate-300 text-slate-400 h-12 rounded-xl hover:bg-white hover:border-slate-400 transition-all flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Add New Action</span>
              </Button>
            </div>
          </div>

          {/* Column 2: Strategic Offsets */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-primary/60" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Strategic Offsets</h2>
              </div>
              <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-emerald-600 border-emerald-100 bg-emerald-50/50">Stability Track</Badge>
            </div>

            {/* Critical Insights Priority Section */}
            <div className="space-y-4">
              {STRATEGIC_OFFSETS.map((offset) => {
                const pairedActionId = Object.keys(pairedIds).find(key => pairedIds[key] === offset.id);
                const isPaired = !!pairedActionId;
                
                return (
                  <Card 
                    key={offset.id}
                    onClick={() => {
                      // Logic: Pair with first available unpaired action or cycle through
                      const targetActionId = offset.id === 'o-1' || offset.id === 'o-2' ? 'a-1' : 'a-2';
                      handlePairing(targetActionId, offset.id);
                    }}
                    className={cn(
                      "border transition-all duration-300 cursor-pointer relative shadow-sm overflow-hidden",
                      offset.isCritical ? "border-amber-200 bg-amber-50/30" : "border-slate-200 hover:border-primary/20 bg-white",
                      isPaired && "border-primary bg-primary/[0.02]"
                    )}
                  >
                    {offset.isCritical && (
                      <div className="absolute top-0 right-0 p-2">
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn(
                            "text-[8px] uppercase tracking-widest",
                            offset.isCritical ? "border-amber-400 text-amber-600" : "border-slate-100"
                          )}>
                            {offset.isCritical ? "Critical Insight" : offset.category}
                          </Badge>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">{offset.impactMetric}</span>
                      </div>
                      <CardTitle className="text-sm font-bold tracking-tight text-slate-900 mt-2">{offset.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className={cn(
                        "text-[11px] leading-relaxed font-medium",
                        isPaired ? "text-slate-900" : "text-slate-600"
                      )}>
                        "{offset.description}"
                      </p>
                      
                      {isPaired && (
                        <div className="pt-3 border-t border-primary/10 flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-primary animate-in slide-in-from-bottom-2">
                          <span>Decision Package Active</span>
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

      {/* 3. Synthesis Summary Footer */}
      {activeSynergies.length > 0 && (
        <div className="h-24 bg-white border-t border-slate-200 px-12 flex items-center justify-between z-30 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] animate-in slide-in-from-bottom-full duration-500">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1">Active Decisions</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-headline font-bold text-slate-900">
                  {activeSynergies[0].action?.title} <ArrowRight className="inline h-3 w-3 mx-1 text-primary" /> {activeSynergies[0].offset?.title}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex flex-col">
              <p className="text-[9px] font-bold uppercase text-emerald-600 tracking-widest mb-1">Stability Outlook</p>
              <p className="text-sm font-headline font-bold text-emerald-600 uppercase">Optimized</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic max-w-md text-right">
            Pairing offsets will mitigate the cash drain by securing long-term yield.
          </p>
        </div>
      )}
    </div>
  );
}
