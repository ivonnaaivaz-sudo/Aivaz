"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, addDoc } from "firebase/firestore";
import { wealthScenarioSimulation, type WealthScenarioSimulationOutput } from "@/ai/flows/wealth-scenario-simulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Wallet,
  Home,
  TrendingUp,
  X,
  LayoutGrid,
  Info
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
    description: "Primary source of funds for the current legacy cycle.",
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
    title: "Daughter's Hedge Strategy", 
    type: 'strategy', 
    value: 1.5, 
    description: "15-year mortgage + Dividend reinvestment plan.",
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
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(true);
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
      debt = 1.5;
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
        currentFinancialOverview: `Table of Truth Session. Liquidity: ${metrics.liquidity}%. Debt Exposure: ${metrics.debt}M.`,
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
    <div className="fixed inset-0 top-[0px] left-[280px] bg-slate-50 text-slate-900 overflow-hidden flex font-body antialiased">
      {/* 1. Project Drawer (Left) */}
      <div className={cn(
        "bg-white border-r border-slate-200 transition-all duration-500 flex flex-col z-30 shadow-sm",
        isLeftDrawerOpen ? "w-72" : "w-16"
      )}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between h-16 shrink-0">
          {isLeftDrawerOpen && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Heritage Projects</span>}
          <Button variant="ghost" size="icon" onClick={() => setIsLeftDrawerOpen(!isLeftDrawerOpen)} className="h-8 w-8 hover:bg-slate-50 text-slate-400">
            {isLeftDrawerOpen ? <ChevronLeft className="h-4 w-4" /> : <FolderOpen className="h-4 w-4 text-primary" />}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {isLeftDrawerOpen ? (
              projects?.map((project) => (
                <div 
                  key={project.id}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3",
                    activeProjectId === project.id ? "bg-primary/5 text-primary border border-primary/10" : "hover:bg-slate-50 text-slate-500 border border-transparent"
                  )}
                  onClick={() => setActiveProjectId(project.id)}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full", activeProjectId === project.id ? "bg-primary" : "bg-slate-300")} />
                  <span className="text-xs font-bold truncate">{project.title}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-6 py-4 opacity-40">
                <LayoutGrid className="h-4 w-4 text-slate-400" />
                <Zap className="h-4 w-4 text-slate-400" />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 2. Central Table of Truth Canvas */}
      <div className="flex-1 relative flex flex-col bg-slate-50">
        {/* The Portfolio Floor */}
        <div className={cn(
          "absolute inset-0 transition-all duration-1000",
          metrics.tension ? "bg-red-50" : "bg-slate-50"
        )} style={{ 
          backgroundImage: 'radial-gradient(circle at center, rgba(75,163,199,0.03) 0%, transparent 80%), linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 60px 60px, 60px 60px'
        }} />

        {/* Header Bar - Fixed and Docked */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-slate-200 z-20 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 tracking-[0.2em] font-bold uppercase text-[9px] px-3">
              Boardroom Table
            </Badge>
            <h1 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Hartmann Table of Truth</h1>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Liquidity:</span>
              <span className={cn("text-xs font-bold font-mono", metrics.tension ? "text-red-500" : "text-emerald-500")}>{metrics.liquidity}%</span>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-100 pl-8">
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Debt Exposure:</span>
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
                x1="35%" y1="50%" x2="65%" y2="50%" 
                stroke="#ef4444" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
                className="animate-[dash_1s_linear_infinite]" 
              />
            </svg>
          )}

          {/* Cards Container - Snapped to Grid */}
          <div className="relative z-20 flex gap-10">
            {INITIAL_CARDS.map(card => {
              const isActive = activeCardIds.includes(card.id);
              return (
                <Card 
                  key={card.id}
                  onClick={() => toggleCard(card.id)}
                  className={cn(
                    "w-64 border transition-all duration-700 cursor-pointer transform shadow-sm hover:shadow-md",
                    isActive 
                      ? "bg-white border-primary ring-1 ring-primary/20 scale-105" 
                      : "bg-white/80 border-slate-200 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("p-2 rounded-lg", isActive ? "bg-primary/10" : "bg-slate-100")}>
                        {card.type === 'source' ? <Wallet className="h-4 w-4 text-primary" /> : 
                         card.type === 'expenditure' ? <Home className="h-4 w-4 text-slate-400" /> : <TrendingUp className="h-4 w-4 text-primary" />}
                      </div>
                      <Badge variant="outline" className="text-[7px] border-slate-100 uppercase tracking-widest">{card.type}</Badge>
                    </div>
                    <CardTitle className="text-sm font-bold tracking-tight">{card.title}</CardTitle>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{card.impactLabel}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">"{card.description}"</p>
                  </CardContent>
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Ghost Card Creation */}
            <div className="w-64 h-[180px] border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-primary/40 hover:text-primary transition-all cursor-pointer group bg-white/40">
              <Plus className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Add Life Move</span>
            </div>
          </div>
        </div>

        {/* Footer: Resolution Story Bar - Docked */}
        <div className="h-28 bg-white border-t border-slate-200 px-12 flex items-center justify-between gap-12 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="flex-1 max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">Council Synthesis</span>
            </div>
            <p className="text-base font-headline font-medium italic text-slate-700 leading-relaxed">
              "{metrics.story}"
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Button 
              variant="outline" 
              className="border-slate-200 bg-slate-50 text-[10px] font-bold uppercase h-11 px-8 hover:bg-slate-100 rounded-xl"
              onClick={handleRunSimulation}
              disabled={simLoading || activeCardIds.length < 2}
            >
              {simLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Cpu className="h-4 w-4 mr-2" />}
              Run Matrix
            </Button>
            <Button className="bg-primary text-white text-[10px] font-bold uppercase h-11 px-8 shadow-lg shadow-primary/20 rounded-xl">
              Validate Strategy
            </Button>
          </div>
        </div>

        {/* Captain Pop-up Interaction - Integrated into the Grid */}
        {isCaptainActive && (
          <div className="absolute right-12 bottom-32 z-40 animate-in slide-in-from-right-4 duration-500">
            <Card className="w-80 bg-white border-2 border-primary/30 shadow-2xl rounded-[2rem] overflow-hidden">
              <div className="p-4 bg-primary/5 border-b border-primary/10 flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-primary shadow-sm">
                    <AvatarImage src={captainImg?.imageUrl} className="object-cover" />
                    <AvatarFallback><Bot className="h-6 w-6" /></AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Captain's Proposal</p>
                  <p className="text-xs font-bold text-slate-900">Synergy Strategy</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto h-7 w-7 text-slate-400 hover:text-primary" onClick={() => setIsCaptainActive(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "Markus, I've identified a liquidity gap. By activating the **Hedge Strategy**, we can preserve the core floor while satisfying the G3 tech mandate."
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 text-[9px] font-bold uppercase h-9 rounded-xl shadow-md" onClick={() => { toggleCard('strat-1'); setIsCaptainActive(false); }}>
                    Apply Move
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-[9px] font-bold uppercase h-9 border-slate-200 hover:bg-slate-50 rounded-xl">
                    Archive
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* 3. Simulation Archive (Right) - Docked and Light */}
      <div className={cn(
        "bg-white border-l border-slate-200 transition-all duration-500 flex flex-col z-30 shadow-sm",
        isRightDrawerOpen ? "w-80" : "w-16"
      )}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between h-16 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setIsRightDrawerOpen(!isRightDrawerOpen)} className="h-8 w-8 hover:bg-slate-50 text-slate-400">
            {isRightDrawerOpen ? <ChevronRight className="h-4 w-4" /> : <History className="h-4 w-4 text-primary" />}
          </Button>
          {isRightDrawerOpen && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Scenario Archive</span>}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {isRightDrawerOpen ? (
              simLogs.map((log) => (
                <Card key={log.id} className="p-4 bg-slate-50 border-slate-100 hover:border-primary/30 transition-all space-y-3 group shadow-none">
                  <div className="flex justify-between items-start">
                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest truncate max-w-[140px]">{log.context}</p>
                    <Badge variant="outline" className="text-[7px] uppercase border-slate-200 bg-white">{log.result.riskLevel}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight font-medium">{log.result.scenarioSummary}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-[8px] font-bold uppercase border-slate-200 bg-white hover:bg-primary hover:text-white mt-2 rounded-lg"
                    onClick={() => handleShareLog(log)}
                  >
                    <Share2 className="mr-2 h-3 w-3" /> Transmit to Council
                  </Button>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center gap-8 py-6 opacity-30">
                <History className="h-4 w-4 text-slate-400" />
                <Share2 className="h-4 w-4 text-slate-400" />
              </div>
            )}
            
            {isRightDrawerOpen && simLogs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <Info className="h-8 w-8 mb-3 text-slate-300" />
                <p className="text-[10px] font-bold uppercase tracking-widest">No Simulations Logged</p>
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
