"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useDoc, useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Info, 
  Plus, 
  LayoutGrid,
  TrendingUp,
  AlertTriangle,
  Lock,
  FileText,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type CardType = 'manual' | 'ai';

interface SandboxCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  impactMetric: string;
  logic: string;
  category: string;
  color: string;
}

const INITIAL_MANUAL_PROPOSALS: SandboxCard[] = [
  {
    id: 'm-1',
    type: 'manual',
    title: "G3 London Property",
    description: "Lump-sum capital expenditure for Sophie's primary residence in London.",
    impactMetric: "-€6.0M Liquidity",
    logic: "Sophie's professional relocation mandate.",
    category: "Real Estate",
    color: "bg-amber-500"
  },
  {
    id: 'm-2',
    type: 'manual',
    title: "Industrial Tech R&D",
    description: "Self-funding a new chemical synthesis lab in Munich.",
    impactMetric: "-€12.0M Capex",
    logic: "Core business preservation through innovation.",
    category: "Business",
    color: "bg-blue-500"
  }
];

const INITIAL_AI_INSIGHTS: SandboxCard[] = [
  {
    id: 'ai-1',
    type: 'ai',
    title: "Dividend-Backed Mortgage",
    description: "Finance the London property via a 15-year interest-only loan backed by Specialty Chem dividends.",
    impactMetric: "+€5.4M Liquidity Retention",
    logic: "Preserves dry powder for market volatility while satisfying the housing need.",
    category: "Strategy",
    color: "bg-emerald-500"
  },
  {
    id: 'ai-2',
    type: 'ai',
    title: "Venture Buy-In Hedge",
    description: "Convert the R&D budget into a venture-style buy-in with tax credits in Singapore.",
    impactMetric: "+22% Tax Efficiency",
    logic: "Offsets capex drain through cross-jurisdictional heritage credits.",
    category: "Tax",
    color: "bg-primary"
  }
];

export default function DecisionSandboxPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [showFinancialImpact, setShowFinancialImpact] = useState(false);
  const [pairedIds, setPairedIds] = useState<Record<string, string>>({});
  const [sealing, setSealing] = useState(false);

  // Canvas State
  const [manualCards, setManualCards] = useState<SandboxCard[]>(INITIAL_MANUAL_PROPOSALS);
  const [aiCards, setAiCards] = useState<SandboxCard[]>(INITIAL_AI_INSIGHTS);

  const activeSynergies = useMemo(() => {
    return Object.entries(pairedIds).map(([mId, aiId]) => {
      const manual = manualCards.find(c => c.id === mId);
      const ai = aiCards.find(c => c.id === aiId);
      return { manual, ai };
    });
  }, [pairedIds, manualCards, aiCards]);

  const handlePairing = (manualId: string, aiId: string) => {
    setPairedIds(prev => {
      if (prev[manualId] === aiId) {
        const next = { ...prev };
        delete next[manualId];
        return next;
      }
      return { ...prev, [manualId]: aiId };
    });
  };

  const handleSealAgreement = async () => {
    if (!user || !db || activeSynergies.length === 0) return;
    setSealing(true);
    try {
      const msgRef = collection(db, "users", user.uid, "messages");
      for (const synergy of activeSynergies) {
        if (synergy.manual && synergy.ai) {
          await addDoc(msgRef, {
            senderId: "aivaz-system",
            senderName: "Decision Sandbox",
            text: `SYNERGY SEALED: ${synergy.manual.title} + ${synergy.ai.title}. Logical Resolution: ${synergy.ai.logic}`,
            type: "recommendation",
            timestamp: new Date().toISOString(),
            track: "strategy"
          });
        }
      }
      toast({ title: "Agreement Sealed", description: "Synergy packages transmitted to the Wardroom Council." });
      setPairedIds({});
    } catch (e) {
      console.error(e);
    } finally {
      setSealing(false);
    }
  };

  // Ambient UI feedback based on state
  const canvasIntensity = useMemo(() => {
    const pairings = Object.keys(pairedIds).length;
    if (pairings === 0) return "bg-slate-50";
    if (pairings === 1) return "bg-blue-50/30";
    return "bg-emerald-50/40";
  }, [pairedIds]);

  return (
    <div className={cn("fixed inset-0 top-0 left-[280px] transition-colors duration-1000 flex flex-col font-body antialiased", canvasIntensity)}>
      {/* 1. System Synthesis Header (The Captain's Banner) */}
      <div className="h-20 bg-white border-b border-slate-100 px-12 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Aivaz Synthesis</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <p className="text-sm font-medium text-slate-600 italic">
            {activeSynergies.length > 0 
              ? `Alignment detected: ${activeSynergies.length} synergy package(s) ready for Wardroom validation.`
              : "Awaiting decision pairing. Align human intentions with AI strategic insights."}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Switch 
              id="impact-mode" 
              checked={showFinancialImpact} 
              onCheckedChange={setShowFinancialImpact} 
            />
            <Label htmlFor="impact-mode" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 cursor-pointer">
              {showFinancialImpact ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              Financial Impact
            </Label>
          </div>
          <Button 
            disabled={activeSynergies.length === 0 || sealing}
            onClick={handleSealAgreement}
            className="bg-primary text-white h-10 px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            {sealing ? "Sealing..." : "Seal Agreement"}
          </Button>
        </div>
      </div>

      {/* 2. Collaborative Workspace (The Table) */}
      <div className="flex-1 overflow-hidden flex flex-col items-center justify-center p-12">
        <div className="max-w-6xl w-full grid grid-cols-2 gap-24 relative">
          
          {/* Tension Lines Overlay */}
          <div className="absolute inset-0 pointer-events-none z-0">
             {/* Dynamic lines between paired cards would go here */}
          </div>

          {/* Manual Proposals Column */}
          <div className="space-y-8 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                <LayoutGrid className="h-4 w-4 text-slate-400" />
              </div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Human Intentions</h2>
            </div>
            {manualCards.map((card) => {
              const isPaired = !!pairedIds[card.id];
              return (
                <Card 
                  key={card.id}
                  className={cn(
                    "w-80 border-2 transition-all duration-500 relative z-10 shadow-sm",
                    isPaired ? "border-emerald-500/30 ring-4 ring-emerald-500/5" : "border-slate-100 hover:border-primary/20"
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full", card.color)} />
                      <Badge variant="outline" className="text-[7px] uppercase tracking-widest border-slate-100">Intention</Badge>
                    </div>
                    <CardTitle className="text-sm font-bold tracking-tight text-slate-900">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[11px] text-slate-500 leading-relaxed italic">"{card.description}"</p>
                    {showFinancialImpact && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Exposure Impact</span>
                          <span className="text-amber-600">{card.impactMetric}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            <Button variant="ghost" className="w-80 border-2 border-dashed border-slate-200 text-slate-400 h-16 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group">
              <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">New Proposal</span>
            </Button>
          </div>

          {/* AI Strategic Insights Column */}
          <div className="space-y-8 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary/60">AI Resolution Tracks</h2>
            </div>
            {aiCards.map((card) => {
              const pairedManualId = Object.keys(pairedIds).find(key => pairedIds[key] === card.id);
              const isPaired = !!pairedManualId;
              
              return (
                <Card 
                  key={card.id}
                  onClick={() => {
                    // Simple pairing logic for the demo: pair top with top, bottom with bottom or similar
                    const targetManualId = card.id === 'ai-1' ? 'm-1' : 'm-2';
                    handlePairing(targetManualId, card.id);
                  }}
                  className={cn(
                    "w-80 border-2 transition-all duration-700 cursor-pointer relative z-10 shadow-sm",
                    isPaired ? "border-primary bg-primary/[0.02] ring-4 ring-primary/5 scale-105" : "border-slate-100 hover:border-primary/40 bg-white/60"
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className={cn("p-1.5 rounded-lg", isPaired ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                        <Zap className="h-3 w-3" />
                      </div>
                      <Badge variant="outline" className="text-[7px] uppercase tracking-widest border-primary/10 text-primary">Insight</Badge>
                    </div>
                    <CardTitle className="text-sm font-bold tracking-tight text-slate-900">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">"{card.description}"</p>
                    {showFinancialImpact && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-primary/60">Offset Capability</span>
                          <span className="text-emerald-600">{card.impactMetric}</span>
                        </div>
                      </div>
                    )}
                    {isPaired && (
                      <div className="pt-2 border-t border-primary/10 flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-primary animate-in slide-in-from-bottom-2">
                        <span>Synergy Package Active</span>
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

      {/* 3. Decision Footer (Synthesis Bar) */}
      <div className="h-28 bg-white border-t border-slate-200 px-12 flex items-center justify-between z-30 shadow-[0_-4px_15px_rgba(0,0,0,0.03)]">
        <div className="flex-1 max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Collaborative Synthesis</span>
          </div>
          <p className="text-sm font-headline font-medium text-slate-700 leading-relaxed max-w-3xl truncate">
            {activeSynergies.length > 0 
              ? `Bundling ${activeSynergies.length} package(s). Narrative: ${activeSynergies[0].manual?.title} resolved via ${activeSynergies[0].ai?.title}.`
              : "Select and pair human intentions with AI strategic insights to form a Decision Package."}
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <div className="flex flex-col items-end gap-1">
             <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Heritage Stability</p>
             <p className={cn("text-lg font-headline font-bold", activeSynergies.length > 0 ? "text-emerald-500" : "text-slate-400")}>
               {activeSynergies.length > 0 ? "OPTIMIZED" : "NEUTRAL"}
             </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
