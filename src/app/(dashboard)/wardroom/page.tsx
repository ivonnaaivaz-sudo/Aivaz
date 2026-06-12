
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  MessageSquare, 
  Users2,
  Gavel,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Check,
  UserPlus,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type TrackMode = 'governance' | 'direct';

const HARTMANN_METRICS = [
  { label: "Family Alignment", value: "84.2%", status: "Stable", icon: Users2, color: "text-primary" },
  { label: "G2/G3 Readiness", value: "42%", status: "At Risk", icon: TrendingUp, color: "text-amber-500" },
  { label: "Legacy Preservation", value: "92%", status: "High", icon: ShieldCheck, color: "text-emerald-500" }
];

const HARTMANN_DECISIONS = [
  {
    id: "dec-hartmann",
    type: "PROPOSAL",
    context: "Deployment of €42M Idle Cash Reserve",
    proposal: "Allocate €20M into Alexander's Tech Venture Fund and €12M into Sophie's ESG Global Infrastructure Trust to diversify from German Real Estate. Improve alignment from 42% to 68%.",
    delegation: "Execute via Hartmann Family Council",
    status: "VOTING",
    votes: { yes: 1, no: 1 },
    isAligned: false,
    alignmentNote: "Pending G1 Principal Approval"
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

  useEffect(() => { setMounted(true); }, []);

  const messagesQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "messages"), orderBy("timestamp", "asc"), limit(100));
  }, [user, db]);

  const { data: realMessages } = useCollection(messagesQuery);

  const messages = useMemo(() => {
    if (!realMessages || realMessages.length === 0) {
      return [
        { id: 'h1', senderName: 'Captain', text: 'Alert: €42M idle cash detected. Fragmentation of accounts in Luxembourg and Cayman causing 5% annual yield loss.', track: 'governance', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'h2', senderName: 'Alexander Hartmann', text: 'The Munich real estate market is softening. We need to deploy that cash into my London growth portfolio. Now.', track: 'governance', timestamp: new Date(Date.now() - 3000000).toISOString() },
        { id: 'h3', senderName: 'Sophie Hartmann', text: 'Growth isn’t everything, Alex. The Singapore office needs ESG retrofitting and we should shift to impact funds.', track: 'governance', timestamp: new Date(Date.now() - 2400000).toISOString() },
        { id: 'h4', senderName: 'Dr. Markus Hartmann', text: 'I built this family on industrial stability. I am not throwing €20M into unproven startups without a formal charter.', track: 'governance', timestamp: new Date(Date.now() - 1800000).toISOString() },
      ];
    }
    return realMessages;
  }, [realMessages]);

  useEffect(() => {
    if (scrollRef.current && mounted) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) { viewport.scrollTop = viewport.scrollHeight; }
    }
  }, [messages, trackMode, mounted]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user || !db) return;
    try {
      const msgRef = collection(db, "users", user.uid, "messages");
      await addDoc(msgRef, {
        senderId: user.uid,
        senderName: "Dr. Markus Hartmann",
        text: inputText,
        type: "text",
        track: trackMode,
        timestamp: new Date().toISOString()
      });
      setInputText("");
    } catch (e) { console.error(e); }
  };

  const executeProposal = (id: string) => {
    toast({ 
      title: "Proposal Executed", 
      description: "Cash deployment protocol initiated. Rebalancing Hartmann Portfolio via institutional charter.",
    });
  };

  const formatTime = (ts: string) => {
    if (!mounted) return "";
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-8 max-w-[1800px] mx-auto animate-in fade-in duration-700">
      {/* Sidebar: Hartmann Pulse & Stakeholders */}
      <div className="w-80 flex flex-col gap-6 shrink-0">
        <Card className="glass-panel border-white/5 bg-primary/5">
          <CardHeader className="pb-2 border-b border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Relational Pulse</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {HARTMANN_METRICS.map((metric) => (
              <div key={metric.label} className="flex justify-between items-end border-b border-white/5 pb-2 group cursor-help">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <metric.icon className={cn("h-3 w-3", metric.color)} />
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{metric.label}</p>
                  </div>
                  <p className="text-xl font-headline font-bold">{metric.value}</p>
                </div>
                <Badge variant="outline" className={cn(
                  "text-[8px] font-bold uppercase px-2 py-0",
                  metric.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/5 text-primary border-primary/20'
                )}>
                  {metric.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 flex-1 overflow-hidden">
          <CardHeader className="border-b border-white/5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Stakeholders</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 hover:text-primary">
              <UserPlus className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <ScrollArea className="h-full">
            <CardContent className="p-2 space-y-1">
              {[
                { name: "Dr. Markus", role: "Principal (G1)", status: "online" },
                { name: "Elena", role: "Philanthropy (G1)", status: "away" },
                { name: "Sophie", role: "ESG Lead (G3)", status: "online" },
                { name: "Alexander", role: "Tech Lead (G3)", status: "online" },
                { name: "Lina", role: "Associate (G3)", status: "offline" },
                { name: "Robert Chen", role: "Lead Advisor", status: "online" }
              ].map((person, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                      <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className={cn(
                      "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-sidebar-background",
                      person.status === 'online' ? 'bg-emerald-500' : 
                      person.status === 'away' ? 'bg-amber-500' : 'bg-muted-foreground'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate group-hover:text-primary transition-colors">{person.name}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter opacity-60">{person.role}</p>
                  </div>
                </div>
              ))}
              <div className="p-4 mt-4 border-t border-white/5">
                <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest bg-white/5 border-white/10">
                  <UserPlus className="mr-2 h-3.5 w-3.5" /> Invite Member
                </Button>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      {/* Main Interaction Hub */}
      <Card className="flex-1 glass-panel flex flex-col border-white/5 overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-white/5 py-4 flex flex-row items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">Hartmann Wardroom</p>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">End-to-End Secure</span>
                </div>
              </div>
            </div>
            <Tabs value={trackMode} onValueChange={(v) => setTrackMode(v as TrackMode)} className="bg-white/5 p-1 rounded-xl">
              <TabsList className="bg-transparent border-none">
                <TabsTrigger value="governance" className="text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6">
                  <Gavel className="mr-2 h-3 w-3" /> Strategic Governance
                </TabsTrigger>
                <TabsTrigger value="direct" className="text-[9px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6">
                  <ShieldCheck className="mr-2 h-3 w-3" /> Direct Channel
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-4">
             <Badge variant="outline" className="bg-white/5 text-[9px] font-bold opacity-60">Session ID: HRT-4.0</Badge>
          </div>
        </CardHeader>

        {/* Governance Proposal Overlay */}
        {trackMode === 'governance' && HARTMANN_DECISIONS.map((dec) => (
          <Collapsible key={dec.id} open={isProposalOpen} onOpenChange={setIsProposalOpen} className="border-b border-white/5 bg-primary/[0.03] transition-all">
            <div className="flex items-center justify-between px-8 py-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[9px] font-bold uppercase">Active Proposal: Capital Deployment</Badge>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase hover:bg-white/5">
                  {isProposalOpen ? "Hide Details" : "View Proposal"}
                  {isProposalOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="px-8 pb-8 pt-2">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Strategic Context</p>
                    <p className="text-base font-headline font-medium leading-relaxed italic text-foreground/90">"{dec.proposal}"</p>
                  </div>
                  <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <div className="flex-1 space-y-2">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground">Alignment Impact</p>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '68%' }} />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-primary">
                        <span>Current: 42%</span>
                        <span>Target: 68%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-10 text-[10px] font-bold uppercase bg-white/5 border-white/10 hover:bg-primary/10">Request Review</Button>
                      <Button size="sm" className="h-10 text-[10px] font-bold uppercase shadow-xl px-6" onClick={() => executeProposal(dec.id)}>
                        <Check className="mr-2 h-4 w-4" /> Execute Deployment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        <ScrollArea className="flex-1 px-8" ref={scrollRef}>
          <div className="py-10 space-y-10">
            <div className="flex flex-col items-center justify-center space-y-4 opacity-30 pb-4">
              <Shield className="h-8 w-8 text-primary" />
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary">Multi-Generational Strategy Vault</p>
                <p className="text-[9px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">Established Munich Axis 2026.06.12</p>
              </div>
            </div>
            
            {messages.map((msg: any) => {
              const isCurrentUser = msg.senderName.includes("Markus");
              const isAI = msg.senderName === "Captain";
              const isRecommendation = msg.type === "recommendation";
              
              if (trackMode === 'governance' && msg.track === 'direct') return null;
              
              return (
                <div key={msg.id} className={cn("flex gap-5 max-w-[85%]", isCurrentUser ? 'ml-auto flex-row-reverse' : '')}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border transition-all shadow-sm",
                    isAI ? 'bg-primary/20 border-primary/40' : 
                    isCurrentUser ? 'bg-primary/20 border-primary/20' : 'bg-muted border-white/10'
                  )}>
                    {isAI ? <Sparkles className="h-5 w-5 text-primary" /> : <User className="h-5 w-5" />}
                  </div>
                  <div className={cn("space-y-2 flex flex-col", isCurrentUser ? 'items-end' : 'items-start')}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{msg.senderName}</span>
                      <span className="text-[9px] text-muted-foreground/40">•</span>
                      <span className="text-[9px] text-muted-foreground/40 font-mono">{formatTime(msg.timestamp)}</span>
                    </div>
                    
                    {isRecommendation ? (
                      <Card className="glass-panel border-primary/30 bg-primary/5 p-5 space-y-4 relative group max-w-sm overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Sparkles className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-[9px] font-bold uppercase">AI Recommendation</Badge>
                          <p className="text-sm font-bold leading-relaxed">{msg.text.includes('recommendation: ') ? msg.text.split('recommendation: ')[1] : msg.text}</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="h-8 text-[9px] font-bold bg-white/10 border-white/10 flex-1" onClick={() => window.location.href = '/insights'}>
                            View Insight
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 text-[9px] font-bold bg-white/10 border-white/10 flex-1" onClick={() => window.location.href = '/chart-room'}>
                            Analyze Gap
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      <div className={cn(
                        "p-4 rounded-2xl text-[13px] leading-relaxed border shadow-sm transition-all",
                        isAI ? 'bg-primary/5 border-primary/30 italic text-primary/90 font-medium' : 
                        isCurrentUser ? 'bg-primary/10 border-primary/10 rounded-tr-none' : 'bg-white/5 border-white/5 rounded-tl-none'
                      )}>
                        {msg.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Action Input Area */}
        <div className="p-6 border-t border-white/5 bg-black/40 shrink-0">
          <div className="flex items-center gap-4 bg-background/50 border border-white/5 rounded-2xl px-6 py-4 shadow-2xl focus-within:border-primary/30 transition-all">
            <Input 
              placeholder={trackMode === 'governance' ? "Propose a strategic move to the Council..." : "Send a secure direct message..."}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground/40" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
            />
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                <Users2 className="h-4 w-4" />
              </Button>
              <Button size="icon" className="rounded-xl h-10 w-10 shadow-lg" onClick={handleSendMessage} disabled={!inputText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 opacity-30">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-bold uppercase tracking-widest">Charter Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[8px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
