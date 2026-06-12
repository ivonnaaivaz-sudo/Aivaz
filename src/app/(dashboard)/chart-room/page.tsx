"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, addDoc } from "firebase/firestore";
import { wealthScenarioSimulation, type WealthScenarioSimulationOutput } from "@/ai/flows/wealth-scenario-simulation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cpu, 
  Loader2, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Bot,
  History,
  Share2,
  FolderOpen,
  Zap,
  ShieldAlert,
  Wallet,
  Home,
  TrendingUp,
  AlertTriangle,
  Scaling,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type HeritageCard = {
  id: string;
  title: string;
  type: 'source' | 'expenditure' | 'strategy';
  value: number; // in Millions
  description: string;
  impactLabel: string;
};

const INITIAL_CARDS: HeritageCard[] = [
  { 
    id: 'source-1', 
    title: "Dr. Markus's Inheritance", 
    type: 'source', 
    value: 15, 
    description: "The primary source of funds for the current legacy cycle.",
    impactLabel: "Liquidity Source"
  },
  { 
    id: 'exp-1', 
    title: "Mom's Proposal: Buy Flat", 
    type: 'expenditure', 
    value: 6, 
    description: "Lump-sum capital expenditure for G3 property in London.",
    impactLabel: "40% Liquidity Drain"
  },
  { 
    id: 'strat-1', 
    title: "Daughter's Hedge: Mortgage", 
    type: 'strategy', 
    value: 1.5, 
    description: "15-year mortgage + Dividend reinvestment strategy.",
    impactLabel: "Liquidity Retention"
  }
];

type SimulationLog = {
  id: string;
  timestamp: string;
  context: string;
  result: WealthScenarioSimulationOutput;
};

export default function TableOfTruthPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  const captainImg = PlaceHolderImages.find(img => img.id === 'captain-avatar');

  // UI State
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [activeCardIds, setActiveCardIds] = useState<string[]>(['source-1']);
  const [simLoading, setSimLoading] = useState(false);
  const [simLogs, setSimLogs] = useState<SimulationLog[]>([]);
  const [isCaptainActive, setIsCaptainActive] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Firestore Queries
  const projectsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "projects"), orderBy("createdAt", "desc"));
  }, [user, db]);
  const { data: projects } = useCollection(projectsQuery);

  // Table Logic
  const metrics = useMemo(() => {
    const active = INITIAL_CARDS.filter(c => activeCardIds.includes(c.id));
    const hasSource = active.some(c => c.type === 'source');
    const hasExp = active.some(c => c.id === 'exp-1');
    const hasStrat = active.some(c => c.id === 'strat-1');

    let liquidity = 100;
    let debt = 0;
    let tension = false;
    let story = "Establishing the Hartmann Heritage Canvas...";

    if (hasSource && hasExp && !hasStrat) {
      liquidity = 60;
      tension = true;
      story = "Choosing Mom's path results in a 40% immediate liquidity drain with no debt offset.";
    } else if (hasSource && hasExp && hasStrat) {
      liquidity = 90;
      debt = 15;
      tension = false;
      story = "By choosing the mortgage strategy, you keep €13.5M in liquidity at the cost of a managed 15-year obligation.";
    }

    return { liquidity, debt, tension, story };
  }, [activeCardIds]);

  const toggleCard = (id: string) => {
    setActiveCardIds(prev => {
      const isRemoving = prev.includes(id);
      const next = isRemoving ? prev.filter(c => c !== id) : [...prev, id];
      // Auto-trigger Captain if tension rises
      if (!isRemoving && id === 'exp-1' && !prev.includes('strat-1')) {
        setIsCaptainActive(true);
      }
      return next;
    });
  };

  const handleRunSimulation = async () => {
    if (!user || !db) return;
    setSimLoading(true);
    try {
      const output = await wealthScenarioSimulation({
        currentFinancialOverview: `Table of Truth Session. Liquidity: ${metrics.liquidity}%. Debt Exposure: ${metrics.debt}%.`,
        familyDNADynamics: dna ? JSON.stringify(dna.familyProfile.relationalDynamics) : "Tension between G1 preservation and G3 growth.",
        scenarioDescription: metrics.story
      });
      
      const newLog: SimulationLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        context: activeProjectId ? "Project: " + activeProjectId : "General Simulation",
        result: output
      };

      setSimLogs(prev => [newLog, ...prev]);
      toast({ title: "Simulation Captured", description: "Strategic delta saved to archive." });
    } catch (e) {
      console.error(e);
    } finally {
      setSimLoading(false);
    }
  };

  const handleShareLog = async (log: SimulationLog) => {
    if (!user || !db) return;
    try {
      const msgRef = collection(db, "users", user.uid, "messages");
      await addDoc(msgRef, {
        senderId: "aivaz-captain",
        senderName: "Captain (AI)",
        text: `SANDBOX ALERT: ${log.result.scenarioSummary}. Risk Level: ${log.result.riskLevel}. Path ready for Wardroom validation.`,
        type: "recommendation",
        timestamp: new Date().toISOString()
      });
      toast({ title: "Transmitted", description: "Sent to Wardroom for Council discussion." });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fixed inset-0 top-[0px] left-[280px] bg-[#020617] text-slate-200 overflow-hidden flex font-body">
      {/* 1. Project Drawer (Left) */}
      <div className={cn(
        "bg-[#0f172a]/50 border-r border-white/5 transition-all duration-500 flex flex-col z-30 backdrop-blur-md",
        isLeftDrawerOpen ? "w-80" : "w-16"
      )}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between h-16 shrink-0">
          {isLeftDrawerOpen && <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Heritage Projects</span>}
          <Button variant="ghost" size="icon" onClick={() => setIsLeftDrawerOpen(!isLeftDrawerOpen)} className="h-8 w-8 hover:bg-white/5">
            {isLeftDrawerOpen ? <ChevronLeft className="h-4 w-4" /> : <FolderOpen className="h-4 w-4 text-primary" />}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isLeftDrawerOpen ? (
              projects?.map((project) => (
                <div 
                  key={project.id}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3",
                    activeProjectId === project.id ? "bg-white/10 text-primary" : "hover:bg-white/5 text-slate-400"
                  )}
                  onClick={() => setActiveProjectId(project.id)}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full", activeProjectId === project.id ? "bg-primary" : "bg-slate-600")} />
                  <span className="text-xs font-bold truncate">{project.title}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <Scaling className="h-4 w-4 text-slate-600" />
                <Zap className="h-4 w-4 text-slate-600" />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 2. Central Table of Truth Canvas */}
      <div className="flex-1 relative flex flex-col">
        {/* The Portfolio Floor */}
        <div className={cn(
          "absolute inset-0 transition-all duration-1000",
          metrics.tension ? "bg-red-950/20" : "bg-emerald-950/10"
        )} style={{ 
          backgroundImage: 'radial-gradient(circle at center, rgba(30,58,138,0.1) 0%, transparent 80%), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 80px 80px, 80px 80px'
        }} />

        {/* Header Bar */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 z-20 backdrop-blur-sm bg-black/10">
          <div className="flex items-center gap-4">
            <Scaling className="h-4 w-4 text-primary" />
            <h1 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">The Table of Truth</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase text-slate-500">Liquidity:</span>
              <span className={cn("text-xs font-bold font-mono", metrics.tension ? "text-red-500" : "text-emerald-500")}>{metrics.liquidity}%</span>
            </div>
            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
              <span className="text-[9px] font-bold uppercase text-slate-500">Debt:</span>
              <span className="text-xs font-bold font-mono text-primary">€{metrics.debt}M</span>
            </div>
          </div>
        </div>

        {/* Active Boardroom Canvas */}
        <div className="flex-1 relative flex items-center justify-center p-20">
          {/* Tension Line (SVG) */}
          {metrics.tension && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <line 
                x1="30%" y1="50%" x2="70%" y2="50%" 
                stroke="url(#tension-grad)" 
                strokeWidth="2" 
                strokeDasharray="4 4" 
                className="animate-[dash_1s_linear_infinite]" 
              />
              <defs>
                <linearGradient id="tension-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* Cards Container */}
          <div className="relative z-20 flex gap-12">
            {INITIAL_CARDS.map(card => {
              const isActive = activeCardIds.includes(card.id);
              return (
                <div 
                  key={card.id}
                  onClick={() => toggleCard(card.id)}
                  className={cn(
                    "w-60 p-6 rounded-2xl border transition-all duration-700 cursor-pointer transform group relative",
                    isActive 
                      ? "bg-white/10 border-primary shadow-[0_0_50px_rgba(75,163,199,0.15)] scale-105" 
                      : "bg-black/40 border-white/5 opacity-40 hover:opacity-100 grayscale hover:grayscale-0"
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg", isActive ? "bg-primary/20" : "bg-white/5")}>
                      {card.type === 'source' ? <Wallet className="h-4 w-4" /> : 
                       card.type === 'expenditure' ? <Home className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                    </div>
                    <Badge variant="outline" className="text-[7px] border-white/10 uppercase tracking-widest">{card.type}</Badge>
                  </div>
                  <h3 className="font-headline font-bold text-sm mb-1">{card.title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{card.impactLabel}</p>
                  
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <Zap className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Ghost Card creation */}
            <div className="w-60 h-[160px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-600 hover:border-primary/40 hover:text-primary transition-all cursor-pointer group">
              <Plus className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Add Life Move</span>
            </div>
          </div>
        </div>

        {/* Footer: Resolution Story Bar */}
        <div className="h-24 bg-black/40 border-t border-white/5 px-10 flex items-center justify-between gap-10 backdrop-blur-sm z-20">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Strategic Narrative</span>
            </div>
            <p className="text-sm font-headline italic text-slate-300 leading-relaxed max-w-3xl">
              "{metrics.story}"
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="border-white/10 bg-white/5 text-[10px] font-bold uppercase h-10 px-6 hover:bg-white/10"
              onClick={handleRunSimulation}
              disabled={simLoading || activeCardIds.length < 2}
            >
              {simLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Cpu className="h-4 w-4 mr-2" />}
              Run Matrix
            </Button>
            <Button className="bg-primary text-white text-[10px] font-bold uppercase h-10 px-6 shadow-lg">
              Validate Strategy
            </Button>
          </div>
        </div>

        {/* Captain Pop-up Interaction */}
        {isCaptainActive && (
          <div className="absolute right-10 bottom-32 z-40 animate-in slide-in-from-right duration-500">
            <Card className="w-80 bg-slate-900 border-2 border-primary/40 shadow-2xl rounded-3xl overflow-hidden">
              <div className="p-4 bg-primary/10 border-b border-primary/20 flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={captainImg?.imageUrl} className="object-cover" />
                    <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Captain's Proposal</p>
                  <p className="text-xs font-bold text-white">Synergy Detected</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto h-6 w-6 text-slate-400" onClick={() => setIsCaptainActive(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "Markus, notice the liquidity bridge. If we activate the **Mortgage Strategy**, we preserve the core floor while satisfying the G3 tech mandate."
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 text-[9px] font-bold uppercase h-8" onClick={() => { toggleCard('strat-1'); setIsCaptainActive(false); }}>
                    Apply Move
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-[9px] font-bold uppercase h-8 border-white/10">
                    Ignore
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* 3. Simulation Archive (Right) */}
      <div className={cn(
        "bg-[#0f172a]/50 border-l border-white/5 transition-all duration-500 flex flex-col z-30 backdrop-blur-md",
        isRightDrawerOpen ? "w-80" : "w-16"
      )}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between h-16 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setIsRightDrawerOpen(!isRightDrawerOpen)} className="h-8 w-8 hover:bg-white/5">
            {isRightDrawerOpen ? <ChevronRight className="h-4 w-4" /> : <History className="h-4 w-4 text-primary" />}
          </Button>
          {isRightDrawerOpen && <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Simulation Archive</span>}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-3">
            {isRightDrawerOpen ? (
              simLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all space-y-3 group">
                  <div className="flex justify-between items-start">
                    <p className="text-[9px] font-bold text-primary uppercase tracking-tighter truncate max-w-[120px]">{log.context}</p>
                    <Badge variant="outline" className="text-[7px] uppercase border-white/10">{log.result.riskLevel}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{log.result.scenarioSummary}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full h-8 text-[8px] font-bold uppercase border border-white/5 hover:bg-primary/10 hover:text-primary mt-2"
                    onClick={() => handleShareLog(log)}
                  >
                    <Share2 className="mr-2 h-3 w-3" /> Transmit to Council
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-6 py-4 opacity-30">
                <History className="h-4 w-4" />
                <Share2 className="h-4 w-4" />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -8;
          }
        }
      `}</style>
    </div>
  );
}
