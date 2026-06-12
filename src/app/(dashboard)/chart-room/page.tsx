
"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, addDoc, where } from "firebase/firestore";
import { wealthScenarioSimulation, type WealthScenarioSimulationOutput } from "@/ai/flows/wealth-scenario-simulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cpu, 
  Loader2, 
  Activity, 
  PlusCircle, 
  MapPin, 
  ArrowDownToLine,
  Sparkles,
  Bot,
  X,
  History,
  Share2,
  FolderOpen,
  ChevronRight,
  LayoutGrid,
  Zap,
  ArrowRight,
  ShieldAlert,
  Wallet,
  Home,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Scaling
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Project Logic
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const projectsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "projects"), orderBy("createdAt", "desc"));
  }, [user, db]);
  const { data: projects } = useCollection(projectsQuery);

  // Table of Truth State
  const [activeCardIds, setActiveCardIds] = useState<string[]>(['source-1']);
  const [viewMode, setViewMode] = useState<'current' | 'alternate'>('current');
  const [isCaptainExpanded, setIsCaptainExpanded] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simLogs, setSimLogs] = useState<SimulationLog[]>([]);

  // Simulation Logic based on active cards
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
    } else if (hasSource && hasStrat && !hasExp) {
      liquidity = 100;
      debt = 5;
      story = "Optimizing for future inflows through leveraged reinvestment.";
    }

    return { liquidity, debt, tension, story };
  }, [activeCardIds]);

  const toggleCard = (id: string) => {
    setActiveCardIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
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
        context: "Table of Truth: " + (activeCardIds.length > 1 ? "Multi-Card Strategy" : "Baseline"),
        result: output
      };

      setSimLogs(prev => [newLog, ...prev]);
      setIsCaptainExpanded(true);
      toast({ title: "Simulation Captured", description: "The council can now review the delta in the Wardroom." });
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
        text: `SANDBOX ALERT: ${log.context}. Result: ${log.result.scenarioSummary}. Risk: ${log.result.riskLevel}. This path is ready for Hartmann Council validation.`,
        type: "recommendation",
        timestamp: new Date().toISOString()
      });
      toast({ title: "Transmitted", description: "Results sent to the Wardroom." });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scaling className="h-4 w-4 text-primary" />
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-[0.2em] text-[9px] font-bold">Table of Truth v1.0</Badge>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">Chart Room</h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest opacity-60">Visual Strategic Orchestration</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <Activity className={cn("h-5 w-5", metrics.tension ? "text-red-500 animate-pulse" : "text-emerald-500")} />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Inheritance Stability</p>
            <p className={cn("text-xl font-headline font-bold", metrics.tension ? "text-red-500" : "text-primary")}>
              {metrics.liquidity}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Project Navigator */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="glass-panel border-white/5 bg-white/40 shadow-sm overflow-hidden h-[600px] flex flex-col">
            <CardHeader className="p-4 border-b border-black/5 bg-muted/20">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-primary" />
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Heritage Projects</CardTitle>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-2">
              <div className="space-y-1">
                {projects?.map((project) => (
                  <div 
                    key={project.id}
                    className={cn(
                      "p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between group",
                      activeProjectId === project.id ? "bg-white shadow-sm border border-primary/20" : "hover:bg-white/40"
                    )}
                    onClick={() => setActiveProjectId(project.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", activeProjectId === project.id ? "bg-primary shadow-[0_0_8px_rgba(75,163,199,0.5)]" : "bg-muted-foreground/30")} />
                      <p className={cn("text-xs font-bold", activeProjectId === project.id ? "text-primary" : "text-slate-700")}>{project.title}</p>
                    </div>
                    <ChevronRight className={cn("h-3 w-3 transition-all", activeProjectId === project.id ? "text-primary translate-x-0" : "opacity-0 -translate-x-2")} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
          
          <Card className="glass-panel border-white/5 bg-white/40 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">Captain's Brief</h3>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Drag cards to the center of the Portfolio Floor. I'll highlight the "Tension Lines" and project the Hartmann story.
            </p>
          </Card>
        </div>

        {/* Center: The Table of Truth Canvas */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative h-[650px] w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-slate-700">
            {/* The Portfolio Floor */}
            <div className={cn(
              "absolute inset-0 transition-all duration-1000 opacity-20",
              metrics.tension ? "bg-red-500 animate-pulse" : "bg-emerald-500"
            )} style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
            
            <div className="absolute inset-0 p-8 flex flex-col">
              {/* Top: Card Pool */}
              <div className="flex justify-center gap-4 z-20">
                {INITIAL_CARDS.map(card => {
                  const isActive = activeCardIds.includes(card.id);
                  return (
                    <div 
                      key={card.id}
                      onClick={() => toggleCard(card.id)}
                      className={cn(
                        "w-44 p-4 rounded-2xl border cursor-pointer transition-all duration-500 transform",
                        isActive 
                          ? "bg-white border-primary shadow-2xl -translate-y-2 scale-105" 
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {card.type === 'source' ? <Wallet className={cn("h-4 w-4", isActive ? "text-primary" : "text-white/40")} /> : 
                         card.type === 'expenditure' ? <Home className={cn("h-4 w-4", isActive ? "text-red-500" : "text-white/40")} /> : 
                         <TrendingUp className={cn("h-4 w-4", isActive ? "text-emerald-500" : "text-white/40")} />}
                        <Badge variant="outline" className={cn("text-[7px] uppercase", isActive ? "border-primary text-primary" : "border-white/20 text-white/40")}>
                          {card.type}
                        </Badge>
                      </div>
                      <p className={cn("text-[10px] font-bold leading-tight", isActive ? "text-slate-900" : "text-white/60")}>{card.title}</p>
                      <p className={cn("text-[8px] mt-1 opacity-60", isActive ? "text-slate-600" : "text-white/40")}>{card.impactLabel}</p>
                    </div>
                  );
                })}
              </div>

              {/* Center: The Active Sandbox */}
              <div className="flex-1 relative flex items-center justify-center">
                {/* Tension Lines (SVG) */}
                {metrics.tension && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <line 
                      x1="50%" y1="20%" x2="50%" y2="80%" 
                      stroke="url(#tension-grad)" 
                      strokeWidth="4" 
                      strokeDasharray="8 8" 
                      className="animate-[dash_2s_linear_infinite]" 
                    />
                    <defs>
                      <linearGradient id="tension-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
                
                <div className="relative group">
                  <div className={cn(
                    "w-64 h-64 rounded-full border-4 flex flex-col items-center justify-center text-center p-8 transition-all duration-1000",
                    metrics.tension ? "border-red-500/50 bg-red-500/10" : "border-primary/50 bg-primary/10"
                  )}>
                    <div className="relative">
                      <div className={cn("absolute -inset-4 rounded-full blur-xl opacity-20", metrics.tension ? "bg-red-500" : "bg-primary")} />
                      {metrics.tension ? <AlertTriangle className="h-12 w-12 text-red-500 mb-2" /> : <ShieldAlert className="h-12 w-12 text-primary mb-2" />}
                    </div>
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Hartmann Portfolio</p>
                    <p className="text-white/60 text-[9px] mt-1">€380M AUM STABILITY</p>
                    
                    {/* Floating Indicators */}
                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 animate-in slide-in-from-right duration-700">
                      <p className="text-[8px] text-white/60 uppercase font-bold">Liquidity</p>
                      <p className="text-sm font-bold text-white">{metrics.liquidity}%</p>
                    </div>
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 animate-in slide-in-from-left duration-700">
                      <p className="text-[8px] text-white/60 uppercase font-bold">Debt</p>
                      <p className="text-sm font-bold text-white">€{metrics.debt}M</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: The Story Bar */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Heritage Path Story</span>
                  </div>
                  <p className="text-white text-sm font-headline italic leading-relaxed">
                    "{metrics.story}"
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white text-[10px] h-9" onClick={handleRunSimulation}>
                    <Cpu className="mr-2 h-4 w-4" /> Run Matrix
                  </Button>
                  <Button size="sm" className="bg-primary text-white text-[10px] h-9">
                    Promote to Wardroom
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comparison Toggle Section */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="ghost" 
              className={cn("text-[10px] uppercase font-bold tracking-widest h-10 px-8 rounded-full", viewMode === 'current' ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground")}
              onClick={() => { setViewMode('current'); setActiveCardIds(['source-1', 'exp-1']); }}
            >
              Mom's Path
            </Button>
            <div className="h-px w-12 bg-muted" />
            <Button 
              variant="ghost" 
              className={cn("text-[10px] uppercase font-bold tracking-widest h-10 px-8 rounded-full", viewMode === 'alternate' ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground")}
              onClick={() => { setViewMode('alternate'); setActiveCardIds(['source-1', 'exp-1', 'strat-1']); }}
            >
              Daughter's Path
            </Button>
          </div>
        </div>

        {/* Right: The Captain & Archive */}
        <div className="lg:col-span-3 space-y-6">
          <div className="sticky top-8 space-y-6">
            <div className="flex flex-col items-end gap-4">
              <div className="relative group cursor-pointer" onClick={() => setIsCaptainExpanded(!isCaptainExpanded)}>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                <Avatar className="h-20 w-20 border-4 border-white shadow-2xl relative transition-transform group-hover:scale-110">
                  <AvatarImage src={captainImg?.imageUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary text-white"><Bot className="h-10 w-10" /></AvatarFallback>
                </Avatar>
              </div>

              <div className={cn(
                "w-full transition-all duration-500 transform origin-top-right",
                isCaptainExpanded ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
              )}>
                <Card className="glass-panel border-2 border-primary/20 shadow-2xl overflow-hidden rounded-[2rem]">
                  <div className="p-4 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Captain's Proposal</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCaptainExpanded(false)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm font-medium leading-relaxed text-slate-800">
                      "Markus, I've noticed a synergy. If you combine the Daughter's mortgage strategy with your inheritance, you preserve the Hartmann liquidity floor for future G3 tech shifts."
                    </p>
                    <Button 
                      className="w-full text-[10px] font-bold uppercase h-10 rounded-xl shadow-lg"
                      onClick={() => { setActiveCardIds(['source-1', 'exp-1', 'strat-1']); setIsCaptainExpanded(false); }}
                    >
                      Apply Synergetic View
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="glass-panel border-white/5 bg-white/40 shadow-sm flex flex-col h-[350px]">
              <CardHeader className="p-4 border-b border-black/5 bg-muted/20">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Simulation Archive</CardTitle>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {simLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center">
                      <RefreshCw className="h-8 w-8 mb-2" />
                      <p className="text-[10px] uppercase font-bold tracking-widest">No matrix logs yet</p>
                    </div>
                  ) : (
                    simLogs.map((log) => (
                      <div key={log.id} className="p-4 rounded-2xl bg-white border border-black/5 hover:border-primary/30 transition-all space-y-2 group">
                        <div className="flex justify-between items-start">
                          <p className="text-[9px] font-bold text-primary uppercase tracking-tighter truncate max-w-[120px]">{log.context}</p>
                          <Badge variant="outline" className="text-[7px] uppercase">{log.result.riskLevel}</Badge>
                        </div>
                        <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">{log.result.scenarioSummary}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-black/5">
                          <span className="text-[8px] text-muted-foreground font-mono">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-[8px] font-bold uppercase p-0 hover:text-primary"
                            onClick={() => handleShareLog(log)}
                          >
                            <Share2 className="mr-1 h-3 w-3" /> Share
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              {simLoading && (
                <div className="p-4 border-t border-black/5 bg-primary/5 flex items-center justify-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-primary animate-pulse">Orchestrating Matrix...</span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -16;
          }
        }
      `}</style>
    </div>
  );
}
