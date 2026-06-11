
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, limit, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Shield, 
  User, 
  Send, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  Search,
  ExternalLink,
  Users2,
  Gavel,
  Zap,
  Lock,
  Video,
  Phone,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  History,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type TrackMode = 'governance' | 'direct';

const STRATEGY_METRICS = [
  { label: "Consolidated Alignment", value: "78%", status: "Stable" },
  { label: "Succession Window", value: "Q4 2028", status: "Target" },
  { label: "G2 Engagement", value: "Low", status: "Focus" }
];

const MOCK_STRATEGY_DECISIONS = [
  {
    id: "dec-1",
    type: "PROPOSAL",
    context: "Upcoming Q4 Payout: $5.2M (Aivaz Logistics)",
    proposal: "Invest $3M into Fixed Income to hedge current Tech Equity over-concentration and improve alignment to 82%.",
    delegation: "Execute via @Marcus (Successor Portfolio)",
    status: "VOTING",
    votes: { yes: 2, no: 0 }
  }
];

export default function WardroomPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [trackMode, setTrackMode] = useState<TrackMode>('governance');
  const [isProposalOpen, setIsProposalOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const messagesQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "users", user.uid, "messages"), 
      orderBy("timestamp", "asc"), 
      limit(100)
    );
  }, [user, db]);

  const { data: realMessages } = useCollection(messagesQuery);

  const messages = useMemo(() => {
    return realMessages;
  }, [realMessages]);

  useEffect(() => {
    if (scrollRef.current && mounted) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, trackMode, mounted]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user || !db) return;
    try {
      const msgRef = collection(db, "users", user.uid, "messages");
      await addDoc(msgRef, {
        senderId: user.uid,
        senderName: user.displayName || "Julian Aivaz",
        text: inputText,
        type: "text",
        track: trackMode,
        timestamp: new Date().toISOString()
      });
      setInputText("");
    } catch (e) {
      console.error(e);
    }
  };

  const executeProposal = (id: string) => {
    toast({
      title: "Proposal Executed",
      description: "Transfer initiated to Strongroom for final biometric authorization.",
    });
  };

  const formatTime = (timestamp: string) => {
    if (!mounted) return "";
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 max-w-[1800px] mx-auto">
      {/* Strategy Sidebar */}
      <div className="w-80 flex flex-col gap-6 shrink-0">
        <Card className="glass-panel border-white/5 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Strategic Pulse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {STRATEGY_METRICS.map((metric) => (
              <div key={metric.label} className="flex justify-between items-end border-b border-white/5 pb-2">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">{metric.label}</p>
                  <p className="text-lg font-headline font-bold">{metric.value}</p>
                </div>
                <Badge variant="outline" className="text-[8px] bg-white/5">{metric.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 flex-1 overflow-hidden">
          <CardHeader className="border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-glow">Stakeholders</CardTitle>
              <Users2 className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input placeholder="Search family..." className="pl-7 bg-background/50 border-white/5 text-[10px] h-7" />
            </div>
          </CardHeader>
          <ScrollArea className="h-full">
            <CardContent className="p-2 space-y-1">
              {[
                { name: "Julian Aivaz", role: "Principal", status: "online" },
                { name: "Marcus Aivaz", role: "Next Gen", status: "online" },
                { name: "Robert Chen", role: "Advisor", status: "offline" },
                { name: "Elena Aivaz", role: "Foundation", status: "offline" }
              ].map((person, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    {person.status === 'online' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate">{person.name}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{person.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      {/* Main Terminal Chat */}
      <Card className={cn(
        "flex-1 glass-panel flex flex-col border-white/5 overflow-hidden shadow-3xl transition-all duration-700",
        trackMode === 'governance' ? "ring-1 ring-primary/20 shadow-[0_0_50px_rgba(75,163,199,0.1)]" : ""
      )}>
        <CardHeader className="border-b border-white/5 py-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Strategy Wardroom</p>
                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Decision Terminal Active</span>
              </div>
            </div>

            <Tabs value={trackMode} onValueChange={(v) => setTrackMode(v as TrackMode)} className="bg-white/5 p-1 rounded-xl">
              <TabsList className="bg-transparent border-none">
                <TabsTrigger value="governance" className="text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Gavel className="mr-2 h-3 w-3" /> Governance Track
                </TabsTrigger>
                <TabsTrigger value="direct" className="text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-white/10 data-[state=active]:text-foreground">
                  <ShieldCheck className="mr-2 h-3 w-3" /> Direct Track
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-4">
             {trackMode === 'governance' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Captain AI Active</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 bg-white/5 border-white/10 text-[9px] font-bold uppercase tracking-widest">
                <Video className="mr-2 h-3.5 w-3.5" /> Call
              </Button>
              <Badge variant="outline" className="bg-white/5 text-[9px] font-mono border-white/10 hidden sm:block">AES-256</Badge>
            </div>
          </div>
        </CardHeader>

        {/* Persistent Executive Brief (Collapsible Proposal) */}
        {trackMode === 'governance' && MOCK_STRATEGY_DECISIONS.map((dec) => (
          <Collapsible
            key={dec.id}
            open={isProposalOpen}
            onOpenChange={setIsProposalOpen}
            className="border-b border-white/5 bg-primary/[0.02] shadow-sm relative z-10"
          >
            <div className="flex items-center justify-between px-8 py-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-[8px] font-bold uppercase">Proposal v1.0</Badge>
                <p className="text-xs font-bold text-muted-foreground">{dec.context}</p>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {isProposalOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="px-8 pb-6 pt-2">
                <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 shadow-lg backdrop-blur-md">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div className="md:col-span-3 space-y-3">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Strategic Executive Brief</h4>
                       <p className="text-sm font-headline font-medium leading-relaxed italic text-foreground/90">
                         "{dec.proposal}"
                       </p>
                       <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                         <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {dec.delegation}</span>
                         <span className="flex items-center gap-1.5 text-primary/70"><Users2 className="h-3 w-3" /> Consensus: {dec.votes.yes} Yes / {dec.votes.no} No</span>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest shadow-xl" onClick={() => executeProposal(dec.id)}>
                        <Check className="mr-2 h-3 w-3" /> Execute
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest bg-white/5">
                        Modify Strategy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        <ScrollArea className="flex-1 px-8" ref={scrollRef}>
          <div className="py-8 space-y-8">
            {messages?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <MessageSquare className="h-12 w-12 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Begin family discussion</p>
              </div>
            )}
            
            {messages?.map((msg) => {
              const isCurrentUser = msg.senderId === user?.uid || msg.senderName === "Julian Aivaz";
              const isAI = msg.senderName === "Captain" || msg.senderName.includes('AI');
              
              if (trackMode === 'direct' && msg.track === 'governance') return null;
              if (trackMode === 'governance' && msg.track === 'direct') return null;

              return (
                <div key={msg.id} className={cn(
                  "flex gap-5 max-w-[85%] animate-in fade-in slide-in-from-bottom-2",
                  isCurrentUser ? 'ml-auto flex-row-reverse' : ''
                )}>
                  <div className={cn(
                    "w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-300",
                    isAI ? 'bg-primary/20 border-primary/40' : 
                    isCurrentUser ? 'bg-primary/20 border-primary/20' : 'bg-muted border-white/10'
                  )}>
                    {isAI ? <Sparkles className="h-4 w-4 text-primary" /> : <User className={`h-4 w-4 ${isCurrentUser ? 'text-primary' : 'text-muted-foreground'}`} />}
                  </div>
                  <div className={cn(
                    "space-y-1.5 flex flex-col",
                    isCurrentUser ? 'items-end' : 'items-start'
                  )}>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 px-1">
                      {isAI ? "Captain" : msg.senderName} • {formatTime(msg.timestamp)}
                    </span>
                    <div className={cn(
                      "p-4 rounded-2xl text-[13px] leading-relaxed border shadow-sm transition-all",
                      isAI ? 'bg-primary/5 border-primary/30 italic text-primary/90 rounded-tl-none' :
                      isCurrentUser ? 'bg-primary/10 border-primary/10 text-foreground rounded-tr-none' : 
                      'bg-white/5 border-white/5 rounded-tl-none'
                    )}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-white/5 bg-background/40">
          <div className="flex items-center gap-3 bg-background/50 border border-white/5 rounded-2xl px-5 py-3 shadow-xl focus-within:border-primary/50 transition-colors">
            <Input 
              placeholder={trackMode === 'governance' ? "Propose a strategic move or vote..." : "Secure message to family..."} 
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm placeholder:opacity-30" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" className="rounded-full h-9 w-9 shadow-lg" onClick={handleSendMessage} disabled={!inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-3">
             <div className="h-px flex-1 bg-white/5" />
             <p className="text-[8px] text-muted-foreground/30 font-bold uppercase tracking-[0.4em]">
               {trackMode === 'governance' ? "Governance Audit Active" : "Private Encryption Path"}
             </p>
             <div className="h-px flex-1 bg-white/5" />
          </div>
        </div>
      </Card>
    </div>
  );
}
