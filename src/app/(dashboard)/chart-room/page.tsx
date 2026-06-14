"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Sparkles, 
  Zap,
  ShieldCheck,
  Package,
  Trophy,
  ShieldAlert,
  Plus,
  TrendingUp,
  Info,
  ChevronDown,
  LayoutGrid,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface InputItem {
  id: string;
  type: 'opportunity' | 'need' | 'blindspot';
  title: string;
  value?: number;
  description: string;
  relatedMembers: string[];
  severity?: 'Critical' | 'High' | 'Medium';
}

interface StrategicPairing {
  id: string;
  rank: number;
  title: string;
  summary: string;
  utilityScore: number;
  components: {
    opportunities: string[];
    needs: string[];
    blindspots: string[];
  };
  analysis: {
    liquidityDelta: number;
    riskReduction: number;
    taxEfficiency: number;
    familyAlignment: number;
    logic: string;
  };
}

const MEMBERS = [
  { name: "Markus", color: "bg-blue-500", avatar: "https://picsum.photos/seed/markus/100/100" },
  { name: "Elena", color: "bg-purple-500", avatar: "https://picsum.photos/seed/elena/100/100" },
  { name: "Sophie", color: "bg-emerald-500", avatar: "https://picsum.photos/seed/sophie/100/100" },
  { name: "Alexander", color: "bg-amber-500", avatar: "https://picsum.photos/seed/alexander/100/100" },
];

const INITIAL_INPUTS: InputItem[] = [
  { id: 'o-1', type: 'opportunity', title: 'Markus Inheritance', value: 8400000, description: 'Incoming liquidity from G1 estate settlement.', relatedMembers: ['Markus'] },
  { id: 'o-2', type: 'opportunity', title: 'Specialty Chem Dividend', value: 3200000, description: 'Surplus Q2 industrial distribution.', relatedMembers: ['Markus', 'Elena'] },
  { id: 'n-1', type: 'need', title: 'Sophie London Residence', value: 6000000, description: 'G3 primary relocation and stability mandate.', relatedMembers: ['Sophie'] },
  { id: 'n-2', type: 'need', title: 'Alexander Venture Fund', value: 4500000, description: 'Early-stage tech allocation for G3 growth.', relatedMembers: ['Alexander'] },
  { id: 'b-1', type: 'blindspot', title: 'Inheritance Tax Gap (G1-G3)', description: 'Detected €8.4M exposure in transition path.', severity: 'Critical', relatedMembers: ['Markus', 'Sophie'] },
  { id: 'b-2', type: 'blindspot', title: 'Real Estate Concentration', description: 'Munich holdings represent 55% of legacy.', severity: 'High', relatedMembers: ['Markus', 'Alexander'] },
];

const GENERATED_PAIRINGS: StrategicPairing[] = [
  {
    id: 'p-1',
    rank: 1,
    title: "The Succession Bridge",
    summary: "Leverages Markus's Inheritance to fund Sophie's London mandate while fully neutralizing the G1-G3 Tax Gap.",
    utilityScore: 96,
    components: {
      opportunities: ['o-1'],
      needs: ['n-1'],
      blindspots: ['b-1']
    },
    analysis: {
      liquidityDelta: 2400000,
      riskReduction: 85,
      taxEfficiency: 98,
      familyAlignment: 94,
      logic: "Primary utility driver: Solves high-priority G3 relocation and the most critical tax risk simultaneously."
    }
  },
  {
    id: 'p-2',
    rank: 2,
    title: "G3 Growth Hybrid",
    summary: "Combines industrial dividends with remaining inheritance to scale Alexander's tech fund and diversify Munich real estate.",
    utilityScore: 88,
    components: {
      opportunities: ['o-1', 'o-2'],
      needs: ['n-2'],
      blindspots: ['b-2']
    },
    analysis: {
      liquidityDelta: 7100000,
      riskReduction: 62,
      taxEfficiency: 75,
      familyAlignment: 82,
      logic: "Utility driver: Shifts capital from industrial concentration into high-growth tech, satisfying G3 risk appetite."
    }
  },
  {
    id: 'p-3',
    rank: 3,
    title: "The Stability Reserve",
    summary: "Allocates all incoming liquidity to the Hartmann Stability Reserve, prioritizing cash drag reduction over immediate G3 expansion.",
    utilityScore: 74,
    components: {
      opportunities: ['o-1', 'o-2'],
      needs: [],
      blindspots: ['b-2']
    },
    analysis: {
      liquidityDelta: 11600000,
      riskReduction: 40,
      taxEfficiency: 50,
      familyAlignment: 65,
      logic: "Utility driver: Maximum liquidity retention, but lower family alignment due to deferred G3 needs."
    }
  }
];

export default function StrategicPairingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: profile } = useDoc(user ? `users/${user.uid}` : null);
  
  const [inputs] = useState<InputItem[]>(INITIAL_INPUTS);
  const [activePairingId, setActivePairingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userRole = profile?.role || "Principal";
  const hasDetailedAccess = userRole === "Principal" || userRole === "Co-Principal";

  const opportunities = useMemo(() => inputs.filter(i => i.type === 'opportunity'), [inputs]);
  const needs = useMemo(() => inputs.filter(i => i.type === 'need'), [inputs]);
  const blindspots = useMemo(() => inputs.filter(i => i.type === 'blindspot'), [inputs]);

  const activePairing = useMemo(() => 
    GENERATED_PAIRINGS.find(p => p.id === activePairingId)
  , [activePairingId]);

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
                {hasDetailedAccess ? `Relates to ${m}` : "Member Exposure"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  const handleCommit = async () => {
    if (!user || !db || !activePairing) return;
    setIsSubmitting(true);
    try {
      const msgRef = collection(db, "users", user.uid, "messages");
      await addDoc(msgRef, {
        senderId: user.uid,
        senderName: "Dr. Markus Hartmann",
        text: `Transmitted Ranked Strategy: ${activePairing.title} (Utility: ${activePairing.utilityScore}/100). Summary: ${activePairing.summary}`,
        type: "recommendation",
        track: "governance",
        timestamp: new Date().toISOString()
      });
      toast({ title: "Strategy Transmitted", description: "The pairing has been sent to the Council Wardroom for final approval." });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-white antialiased">
      <header className="h-16 border-b border-slate-200 px-12 flex items-center justify-between shrink-0 bg-white z-[60]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Strategic Pairings Engine</span>
          </div>
          <Badge variant="outline" className="text-[8px] border-primary/20 text-primary uppercase">Access: {userRole}</Badge>
        </div>
        <Button 
          disabled={!activePairing || isSubmitting}
          onClick={handleCommit}
          className="h-9 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-primary text-white shadow-lg"
        >
          {isSubmitting ? "Transmitting..." : "Send to Wardroom"}
        </Button>
      </header>

      <div className="flex-1 overflow-hidden flex">
        <aside className="w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-200 bg-white">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-1">Strategy Inputs</h2>
            <p className="text-[10px] text-muted-foreground italic">The pieces of the Hartmann puzzle.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-20">
            <section className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" /> Opportunities
                </h3>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full"><Plus className="h-3 w-3" /></Button>
              </div>
              {opportunities.map(item => (
                <div key={item.id} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-bold">{item.title}</p>
                    <MemberTags members={item.relatedMembers} />
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold">+€{(item.value! / 1000000).toFixed(1)}M</p>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2">
                  <Users className="h-3 w-3" /> Needs & Wants
                </h3>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full"><Plus className="h-3 w-3" /></Button>
              </div>
              {needs.map(item => (
                <div key={item.id} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-bold">{item.title}</p>
                    <MemberTags members={item.relatedMembers} />
                  </div>
                  <p className="text-[10px] text-red-600 font-bold">-€{(item.value! / 1000000).toFixed(1)}M</p>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
                  <ShieldAlert className="h-3 w-3" /> AI Blindspots
                </h3>
              </div>
              {blindspots.map(item => (
                <div key={item.id} className="p-3 rounded-xl bg-red-50/30 border border-red-100 shadow-sm space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-bold text-red-900">{item.title}</p>
                    <Badge className="text-[7px] uppercase bg-red-100 text-red-600 border-none">{item.severity}</Badge>
                  </div>
                  <p className="text-[9px] text-red-700/70 italic leading-tight">"{item.description}"</p>
                  <MemberTags members={item.relatedMembers} />
                </div>
              ))}
            </section>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-slate-50/30 p-12">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-headline font-bold text-slate-900">Ranked Strategy Pairings</h1>
                  <p className="text-xs text-muted-foreground italic">Aivaz matches your capital opportunities with heritage risks and family needs.</p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[9px] py-1 px-3">
                {GENERATED_PAIRINGS.length} Optimized Options
              </Badge>
            </div>

            <div className="space-y-6">
              {GENERATED_PAIRINGS.map((pairing) => (
                <Card 
                  key={pairing.id} 
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 border-2 cursor-pointer group",
                    activePairingId === pairing.id ? "border-primary shadow-xl ring-4 ring-primary/5" : "border-slate-200 hover:border-primary/40 shadow-sm"
                  )}
                  onClick={() => setActivePairingId(pairing.id)}
                >
                  <div className={cn(
                    "absolute top-0 left-0 w-1.5 h-full",
                    pairing.rank === 1 ? "bg-primary" : pairing.rank === 2 ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold text-lg",
                          pairing.rank === 1 ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                        )}>
                          #{pairing.rank}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-headline font-bold group-hover:text-primary transition-colors">
                            {pairing.title}
                          </CardTitle>
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{pairing.summary}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Utility Score</p>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-amber-500" />
                          <span className="text-3xl font-headline font-bold text-slate-900">{pairing.utilityScore}</span>
                          <span className="text-xs text-slate-400 font-bold">/100</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 pt-4">
                    <div className="flex flex-wrap gap-2 mb-8">
                      {pairing.components.opportunities.map(id => (
                        <Badge key={id} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] flex items-center gap-1.5 py-1 px-3">
                          <Zap className="h-3 w-3" /> {inputs.find(i => i.id === id)?.title}
                        </Badge>
                      ))}
                      {pairing.components.needs.map(id => (
                        <Badge key={id} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] flex items-center gap-1.5 py-1 px-3">
                          <Users className="h-3 w-3" /> {inputs.find(i => i.id === id)?.title}
                        </Badge>
                      ))}
                      {pairing.components.blindspots.map(id => (
                        <Badge key={id} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px] flex items-center gap-1.5 py-1 px-3">
                          <ShieldAlert className="h-3 w-3" /> {inputs.find(i => i.id === id)?.title}
                        </Badge>
                      ))}
                    </div>

                    <Accordion type="single" collapsible className="w-full border-t border-slate-100 pt-4">
                      <AccordionItem value="details" className="border-none">
                        <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-primary hover:no-underline py-2">
                          View Detailed Diagnostic Breakdown
                        </AccordionTrigger>
                        <AccordionContent className="pt-6 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                              { label: "Net Liquidity", val: `+€${(pairing.analysis.liquidityDelta / 1000000).toFixed(1)}M`, unit: "Retention", color: "text-emerald-600", progress: 85 },
                              { label: "Risk Reduction", val: `${pairing.analysis.riskReduction}%`, unit: "Stabilization", color: "text-primary", progress: pairing.analysis.riskReduction },
                              { label: "Tax Efficiency", val: `${pairing.analysis.taxEfficiency}%`, unit: "Optimization", color: "text-blue-600", progress: pairing.analysis.taxEfficiency },
                              { label: "DNA Alignment", val: `${pairing.analysis.familyAlignment}%`, unit: "Harmony", color: "text-purple-600", progress: pairing.analysis.familyAlignment },
                            ].map((stat, i) => (
                              <div key={i} className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">{stat.label}</p>
                                <div className="flex items-baseline gap-1">
                                  <span className={cn("text-xl font-headline font-bold", stat.color)}>{stat.val}</span>
                                </div>
                                <Progress value={stat.progress} className="h-1" />
                                <p className="text-[8px] font-bold uppercase text-slate-400">{stat.unit}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 italic text-sm leading-relaxed text-slate-700">
                            <div className="flex gap-3">
                              <Info className="h-5 w-5 text-primary shrink-0" />
                              <p><span className="font-bold text-primary">Strategic Logic:</span> {pairing.analysis.logic}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      <div className={cn(
        "h-20 border-t border-slate-200 bg-white flex items-center justify-between px-12 z-[70] transition-all",
        !activePairing && "opacity-50 pointer-events-none"
      )}>
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">Active Selection</p>
            <p className="text-sm font-bold flex items-center gap-2 text-primary">
              <Package className="h-4 w-4" /> {activePairing?.title || "No Selection"}
            </p>
          </div>
          <div className="h-8 w-px bg-slate-100" />
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <p className="text-[9px] font-bold uppercase text-slate-400">Total Portfolio Alpha</p>
              <span className="text-lg font-bold text-emerald-600">+2.4%</span>
            </div>
            <div className="flex flex-col">
              <p className="text-[9px] font-bold uppercase text-slate-400">Monte Carlo VaR</p>
              <span className="text-lg font-bold text-slate-900">€11.2M</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
             <p className="text-[9px] font-bold uppercase text-slate-400">TPA Phase</p>
             <p className="text-xs font-bold uppercase text-primary tracking-widest">Execution Balance</p>
          </div>
          <Button 
            onClick={handleCommit}
            disabled={!activePairing || isSubmitting}
            className="h-10 px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl"
          >
            {isSubmitting ? "Transmitting..." : "Send Solution to Wardroom"}
          </Button>
        </div>
      </div>
    </div>
  );
}