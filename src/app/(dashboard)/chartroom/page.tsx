
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
  LayoutGrid,
  Users,
  ArrowRight,
  ArrowDown,
  RefreshCw,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
  { id: 'o-1', type: 'opportunity', title: 'Markus Inheritance', value: 8400000, description: 'Incoming funds from legacy estate settlement.', relatedMembers: ['Markus'] },
  { id: 'o-2', type: 'opportunity', title: 'Industrial Dividends', value: 3200000, description: 'Surplus distribution from business operations.', relatedMembers: ['Markus', 'Elena'] },
  { id: 'n-1', type: 'need', title: 'Sophie London Residence', value: 6000000, description: 'Primary relocation and housing mandate.', relatedMembers: ['Sophie'] },
  { id: 'n-2', type: 'need', title: 'Next Gen Venture Fund', value: 4500000, description: 'Early-stage tech allocation for growth.', relatedMembers: ['Alexander'] },
  { id: 'b-1', type: 'blindspot', title: 'Future Tax Risk', description: 'Detected potential tax bill in transition path.', severity: 'Critical', relatedMembers: ['Markus', 'Sophie'] },
  { id: 'b-2', type: 'blindspot', title: 'Property Concentration', description: 'Real estate represents 55% of the total legacy.', severity: 'High', relatedMembers: ['Markus', 'Alexander'] },
];

const INITIAL_PAIRINGS: StrategicPairing[] = [
  {
    id: 'p-1',
    rank: 1,
    title: "The Succession Bridge",
    summary: "Leverages inheritance to fund the London mandate while neutralizing the Future Tax Risk.",
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
      logic: "Primary utility driver: Solves the relocation mandate and the critical tax risk simultaneously."
    }
  },
  {
    id: 'p-2',
    rank: 2,
    title: "G3 Growth Hybrid",
    summary: "Combines industrial dividends with remaining funds to scale the venture fund and diversify property holdings.",
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
      logic: "Utility driver: Shifts capital from concentration into high-growth areas."
    }
  }
];

export default function StrategicPairingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: profile } = useDoc(user ? `users/${user.uid}` : null);
  
  const [inputs, setInputs] = useState<InputItem[]>(INITIAL_INPUTS);
  const [pairings, setPairings] = useState<StrategicPairing[]>(INITIAL_PAIRINGS);
  const [activePairingId, setActivePairingId] = useState<string | null>(null);
  const [selectedInputIds, setSelectedInputIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewInputOpen, setIsNewInputOpen] = useState(false);
  const [newInput, setNewInput] = useState<Partial<InputItem>>({ type: 'opportunity' });
  
  const userRole = profile?.role || "Principal";
  const hasDetailedAccess = userRole === "Principal" || userRole === "Co-Principal";

  const opportunities = useMemo(() => inputs.filter(i => i.type === 'opportunity'), [inputs]);
  const needs = useMemo(() => inputs.filter(i => i.type === 'need'), [inputs]);
  const blindspots = useMemo(() => inputs.filter(i => i.type === 'blindspot'), [inputs]);

  const activePairing = useMemo(() => 
    pairings.find(p => p.id === activePairingId)
  , [activePairingId, pairings]);

  const displayedOpportunities = useMemo(() => {
    if (activePairing) return inputs.filter(i => activePairing.components.opportunities.includes(i.id));
    return inputs.filter(i => i.type === 'opportunity' && selectedInputIds.includes(i.id));
  }, [activePairing, inputs, selectedInputIds]);

  const displayedNeeds = useMemo(() => {
    if (activePairing) return inputs.filter(i => activePairing.components.needs.includes(i.id));
    return inputs.filter(i => i.type === 'need' && selectedInputIds.includes(i.id));
  }, [activePairing, inputs, selectedInputIds]);

  const displayedBlindspots = useMemo(() => {
    if (activePairing) return inputs.filter(i => activePairing.components.blindspots.includes(i.id));
    return inputs.filter(i => i.type === 'blindspot' && selectedInputIds.includes(i.id));
  }, [activePairing, inputs, selectedInputIds]);

  const toggleInputSelection = (id: string) => {
    if (activePairingId) setActivePairingId(null);
    setSelectedInputIds(prev => 
      prev.includes(id) ? prev.filter(iid => iid !== id) : [...prev, id]
    );
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
                {hasDetailedAccess ? `Relates to ${m}` : "Member Exposure"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  const handleCreatePair = () => {
    if (selectedInputIds.length === 0) return;
    
    const opps = inputs.filter(i => i.type === 'opportunity' && selectedInputIds.includes(i.id));
    const nds = inputs.filter(i => i.type === 'need' && selectedInputIds.includes(i.id));
    const bspots = inputs.filter(i => i.type === 'blindspot' && selectedInputIds.includes(i.id));

    const newPair: StrategicPairing = {
      id: `p-${Date.now()}`,
      rank: pairings.length + 1,
      title: opps.length > 0 ? `${opps[0].title} Bridge` : "Manual Strategic Pair",
      summary: `Manual compilation balancing ${opps.length} inflow(s) against ${nds.length + bspots.length} objective(s).`,
      utilityScore: 75 + Math.floor(Math.random() * 20),
      components: {
        opportunities: opps.map(o => o.id),
        needs: nds.map(n => n.id),
        blindspots: bspots.map(b => b.id)
      },
      analysis: {
        liquidityDelta: Math.floor(Math.random() * 5000000),
        riskReduction: 40 + Math.floor(Math.random() * 40),
        taxEfficiency: 50 + Math.floor(Math.random() * 40),
        familyAlignment: 60 + Math.floor(Math.random() * 30),
        logic: "Manual strategic coupling based on Principal oversight."
      }
    };

    setPairings([...pairings, newPair]);
    setSelectedInputIds([]);
    setActivePairingId(newPair.id);
    toast({ title: "Strategic Pair Created", description: "Your manual pairing has been ranked and added to the council list." });
  };

  const handleAddNewInput = () => {
    if (!newInput.title) return;
    const item: InputItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: newInput.type as any,
      title: newInput.title,
      value: Number(newInput.value) || 0,
      description: newInput.description || "",
      relatedMembers: ["Markus"],
      severity: newInput.type === 'blindspot' ? 'Medium' : undefined,
    };
    setInputs([...inputs, item]);
    setIsNewInputOpen(false);
    setNewInput({ type: 'opportunity' });
    toast({ title: "Input Registered", description: `Added ${item.title} to the strategic engine.` });
  };

  const createAutomaticPairing = (e: React.MouseEvent, blindspotId: string) => {
    e.stopPropagation();
    const matchingPairing = pairings.find(p => p.components.blindspots.includes(blindspotId));
    if (matchingPairing) {
      setActivePairingId(matchingPairing.id);
      setSelectedInputIds([]);
      toast({
        title: "AI Strategy Drafted",
        description: `Drafting ${matchingPairing.title} to neutralize the alert.`,
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-slate-50 antialiased">
      <header className="h-16 border-b border-slate-200 px-12 flex items-center justify-between shrink-0 bg-white z-[60]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Strategic Pairings Engine</span>
          </div>
          <Badge variant="outline" className="text-[8px] border-primary/20 text-primary uppercase">Protocol: {userRole}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            disabled={selectedInputIds.length === 0}
            onClick={handleCreatePair}
            className="h-9 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-primary text-white shadow-lg"
          >
            Create a pair
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 shadow-sm">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-1">Inputs</h2>
              <p className="text-[10px] text-muted-foreground italic">Click points to pair.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsNewInputOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-20">
            <section className="space-y-3">
              <h3 className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2 px-1">
                <TrendingUp className="h-3 w-3" /> Opportunities
              </h3>
              {opportunities.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleInputSelection(item.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer shadow-sm space-y-2",
                    selectedInputIds.includes(item.id) ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/10" : "bg-white border-slate-100 hover:border-emerald-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-bold text-slate-900">{item.title}</p>
                    <MemberTags members={item.relatedMembers} />
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold">+€{(item.value! / 1000000).toFixed(1)}M</p>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <h3 className="text-[9px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2 px-1">
                <Users className="h-3 w-3" /> Family Needs
              </h3>
              {needs.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleInputSelection(item.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer shadow-sm space-y-2",
                    selectedInputIds.includes(item.id) ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/10" : "bg-white border-slate-100 hover:border-amber-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-bold text-slate-900">{item.title}</p>
                    <MemberTags members={item.relatedMembers} />
                  </div>
                  <p className="text-[10px] text-red-500 font-bold">-€{(item.value! / 1000000).toFixed(1)}M</p>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <h3 className="text-[9px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-2 px-1">
                <ShieldAlert className="h-3 w-3" /> System Alerts
              </h3>
              {blindspots.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleInputSelection(item.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer shadow-sm space-y-2",
                    selectedInputIds.includes(item.id) ? "bg-red-50 border-red-500 ring-2 ring-red-500/10" : "bg-red-50/50 border-red-100 hover:border-red-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-bold text-red-900">{item.title}</p>
                    <Badge className="text-[7px] uppercase bg-red-100 text-red-600 border-none">{item.severity}</Badge>
                  </div>
                  <p className="text-[9px] text-red-700/70 italic leading-tight">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <MemberTags members={item.relatedMembers} />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => createAutomaticPairing(e, item.id)}
                      className="h-6 text-[8px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-100"
                    >
                      Solve <Sparkles className="ml-1 h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-12 bg-white/30">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 bg-transparent">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-headline font-bold text-slate-900">Capital Balancing</h1>
                  <p className="text-xs text-muted-foreground italic">Matching strategic opportunities with legacy risks and family needs.</p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[9px] py-1 px-3">
                {pairings.length} Optimized Plans
              </Badge>
            </div>

            {/* Vertical Drafting Canvas */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-slate-400" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Drafting Canvas</h3>
                </div>
                {(activePairing || selectedInputIds.length > 0) && (
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => { setActivePairingId(null); setSelectedInputIds([]); }}
                    className="h-6 text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500"
                   >
                     <X className="mr-1 h-2.5 w-2.5" /> Clear Canvas
                   </Button>
                )}
              </div>
              
              <div className="p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-white space-y-8 shadow-inner min-h-[350px] flex flex-col justify-center">
                {activePairing || selectedInputIds.length > 0 ? (
                  <div className="animate-in fade-in duration-500">
                    <div className="space-y-4">
                      <p className="text-[9px] font-bold uppercase text-emerald-600 text-center tracking-widest">Strategic Inflows</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {displayedOpportunities.map(item => (
                          <div key={item.id} className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 flex items-center gap-2 shadow-sm">
                            <TrendingUp className="h-3 w-3" /> {item.title}
                          </div>
                        ))}
                        {displayedOpportunities.length === 0 && <p className="text-[10px] text-slate-300 italic">Select opportunity...</p>}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 my-8">
                      <ArrowDown className="h-5 w-5 text-slate-300 animate-bounce" />
                    </div>

                    <div className="space-y-4">
                      <p className="text-[9px] font-bold uppercase text-amber-600 text-center tracking-widest">Proposed Outflows & Actions</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {displayedNeeds.map(item => (
                          <div key={item.id} className="px-4 py-3 rounded-2xl bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-700 flex items-center gap-2 shadow-sm">
                            <Users className="h-3 w-3" /> {item.title}
                          </div>
                        ))}
                        {displayedBlindspots.map(item => (
                          <div key={item.id} className="px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-[10px] font-bold text-red-700 flex items-center gap-2 shadow-sm">
                            <ShieldAlert className="h-3 w-3" /> {item.title}
                          </div>
                        ))}
                        {displayedNeeds.length === 0 && displayedBlindspots.length === 0 && <p className="text-[10px] text-slate-300 italic">Select need or risk...</p>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4 opacity-40">
                    <RefreshCw className="h-8 w-8 mx-auto text-slate-300" />
                    <p className="text-sm font-medium text-slate-500 px-20">Click items in the sidebar to pair them manually, or select a ranked plan below.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {pairings.map((pairing) => (
                <Card 
                  key={pairing.id} 
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 border cursor-pointer group rounded-2xl",
                    activePairingId === pairing.id ? "border-primary shadow-lg ring-4 ring-primary/5" : "border-slate-200 hover:border-primary/20 shadow-sm"
                  )}
                  onClick={() => { setActivePairingId(pairing.id); setSelectedInputIds([]); }}
                >
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
                          <CardTitle className="text-xl font-headline font-bold group-hover:text-primary transition-colors text-slate-900">
                            {pairing.title}
                          </CardTitle>
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{pairing.summary}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Impact Score</p>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-amber-500" />
                          <span className="text-3xl font-headline font-bold text-slate-900">{pairing.utilityScore}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 pt-4">
                    <Accordion type="single" collapsible className="w-full border-t border-slate-100 pt-4" onClick={(e) => e.stopPropagation()}>
                      <AccordionItem value="details" className="border-none">
                        <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-primary hover:no-underline py-2">
                          View Strategic Diagnostic
                        </AccordionTrigger>
                        <AccordionContent className="pt-6 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                              { label: "Net Inflow", val: `+€${(pairing.analysis.liquidityDelta / 1000000).toFixed(1)}M`, color: "text-emerald-600", progress: 85 },
                              { label: "Risk Reduction", val: `${pairing.analysis.riskReduction}%`, color: "text-primary", progress: pairing.analysis.riskReduction },
                              { label: "Tax Efficiency", val: `${pairing.analysis.taxEfficiency}%`, color: "text-blue-600", progress: pairing.analysis.taxEfficiency },
                              { label: "Family Alignment", val: `${pairing.analysis.familyAlignment}%`, color: "text-purple-600", progress: pairing.analysis.familyAlignment },
                            ].map((stat, i) => (
                              <div key={i} className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">{stat.label}</p>
                                <div className="flex items-baseline gap-1">
                                  <span className={cn("text-xl font-headline font-bold", stat.color)}>{stat.val}</span>
                                </div>
                                <Progress value={stat.progress} className="h-1" />
                              </div>
                            ))}
                          </div>
                          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 italic text-sm text-slate-700">
                            <strong>Strategic Logic:</strong> {pairing.analysis.logic}
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
        (!activePairing && selectedInputIds.length === 0) && "opacity-50 pointer-events-none"
      )}>
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">Active Scenario</p>
            <p className="text-sm font-bold flex items-center gap-2 text-primary">
              <Package className="h-4 w-4" /> {activePairing ? activePairing.title : selectedInputIds.length > 0 ? "Drafting Manual Strategy..." : "None Selected"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleCreatePair}
            disabled={selectedInputIds.length === 0 || isSubmitting}
            className="h-10 px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl"
          >
            Create a pair
          </Button>
        </div>
      </div>

      <Dialog open={isNewInputOpen} onOpenChange={setIsNewInputOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">Register Legacy Input</DialogTitle>
            <DialogDescription>
              Add a new opportunity, family need, or system risk to the strategic engine.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Input Type</Label>
              <Select value={newInput.type} onValueChange={(val: any) => setNewInput({...newInput, type: val})}>
                <SelectTrigger className="rounded-xl h-10">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opportunity">Opportunity (Inflow)</SelectItem>
                  <SelectItem value="need">Family Need (Outflow)</SelectItem>
                  <SelectItem value="blindspot">System Alert (Risk)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title</Label>
              <Input 
                placeholder="e.g. Zurich Property Sale" 
                className="rounded-xl h-10"
                value={newInput.title || ""}
                onChange={(e) => setNewInput({...newInput, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Value (EUR)</Label>
              <Input 
                type="number"
                placeholder="e.g. 5000000" 
                className="rounded-xl h-10"
                value={newInput.value || ""}
                onChange={(e) => setNewInput({...newInput, value: Number(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
              <Textarea 
                placeholder="Briefly describe the context..." 
                className="rounded-xl min-h-[80px]"
                value={newInput.description || ""}
                onChange={(e) => setNewInput({...newInput, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsNewInputOpen(false)} className="text-[11px] uppercase font-bold tracking-widest">Cancel</Button>
            <Button 
              onClick={handleAddNewInput}
              disabled={!newInput.title}
              className="text-[11px] uppercase font-bold tracking-widest px-8"
            >
              Register Terminal Input
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
