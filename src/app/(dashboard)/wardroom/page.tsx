
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
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type TrackMode = 'governance' | 'direct';

const HARTMANN_METRICS = [
  { label: "Cash Idle", value: "€42.0M", status: "Alert" },
  { label: "RE Exposure", value: "55%", status: "High" },
  { label: "Succession Sync", value: "42%", status: "At Risk" }
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
        { id: 'h1', senderName: 'Captain', text: 'Alert: €42M idle cash detected. Fragmentation of accounts in Luxembourg and Cayman causing 5% annual yield loss.', track: 'governance', timestamp: new Date().toISOString() },
        { id: 'h2', senderName: 'Alexander Hartmann', text: 'The Munich real estate market is softening. We need to deploy that cash into my London growth portfolio. Now.', track: 'governance', timestamp: new Date().toISOString() },
        { id: 'h3', senderName: 'Sophie Hartmann', text: 'Growth isn’t everything, Alex. The Singapore office needs ESG retrofitting and we should shift to impact funds.', track: 'governance', timestamp: new Date().toISOString() },
        { id: 'h4', senderName: 'Dr. Markus Hartmann', text: 'I built this family on industrial stability. I am not throwing €20M into unproven startups without a formal charter.', track: 'governance', timestamp: new Date().toISOString() },
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
    toast({ title: "Proposal Executed", description: "Cash deployment protocol initiated. Rebalancing Hartmann Portfolio." });
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 max-w-[1800px] mx-auto">
      <div className="w-80 flex flex-col gap-6 shrink-0">
        <Card className="glass-panel border-white/5 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Hartmann Pulse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {HARTMANN_METRICS.map((metric) => (
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
            <CardTitle className="text-xs font-bold uppercase tracking-widest">Stakeholders</CardTitle>
          </CardHeader>
          <ScrollArea className="h-full">
            <CardContent className="p-2 space-y-1">
              {["Dr. Markus", "Elena", "Sophie", "Alexander", "Lina", "Robert Chen (Advisor)"].map((person, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><User className="h-4 w-4" /></div>
                  <p className="text-[11px] font-bold">{person}</p>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      <Card className="flex-1 glass-panel flex flex-col border-white/5 overflow-hidden">
        <CardHeader className="border-b border-white/5 py-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-primary" />
              <div><p className="text-sm font-bold">Hartmann Wardroom</p><span className="text-[9px] text-emerald-500 font-bold uppercase">End-to-End Secure</span></div>
            </div>
            <Tabs value={trackMode} onValueChange={(v) => setTrackMode(v as TrackMode)} className="bg-white/5 p-1 rounded-xl">
              <TabsList className="bg-transparent border-none">
                <TabsTrigger value="governance" className="text-[9px] font-bold uppercase tracking-widest"><Gavel className="mr-2 h-3 w-3" /> Governance</TabsTrigger>
                <TabsTrigger value="direct" className="text-[9px] font-bold uppercase tracking-widest"><ShieldCheck className="mr-2 h-3 w-3" /> Direct</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        {trackMode === 'governance' && HARTMANN_DECISIONS.map((dec) => (
          <Collapsible key={dec.id} open={isProposalOpen} onOpenChange={setIsProposalOpen} className="border-b border-white/5 bg-primary/[0.02]">
            <div className="flex items-center justify-between px-8 py-3">
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-[8px] font-bold uppercase">Proposal: Cash Deployment</Badge>
              <CollapsibleTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0">{isProposalOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button></CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="px-8 pb-6 pt-2">
                <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6">
                  <p className="text-sm font-headline font-medium leading-relaxed italic">"{dec.proposal}"</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="h-8 text-[9px] font-bold uppercase" onClick={() => executeProposal(dec.id)}><Check className="mr-2 h-3 w-3" /> Execute Deployment</Button>
                    <Button variant="outline" size="sm" className="h-8 text-[9px] font-bold uppercase">Request G1 Review</Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        <ScrollArea className="flex-1 px-8" ref={scrollRef}>
          <div className="py-8 space-y-8">
            {messages.map((msg: any) => {
              const isCurrentUser = msg.senderName.includes("Markus");
              const isAI = msg.senderName === "Captain";
              if (trackMode === 'governance' && msg.track === 'direct') return null;
              return (
                <div key={msg.id} className={cn("flex gap-5 max-w-[85%]", isCurrentUser ? 'ml-auto flex-row-reverse' : '')}>
                  <div className={cn("w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border", isAI ? 'bg-primary/20 border-primary/40' : 'bg-muted border-white/10')}>
                    {isAI ? <Sparkles className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={cn("space-y-1.5 flex flex-col", isCurrentUser ? 'items-end' : 'items-start')}>
                    <span className="text-[9px] font-bold uppercase text-muted-foreground/50">{msg.senderName}</span>
                    <div className={cn("p-4 rounded-2xl text-[13px] leading-relaxed border shadow-sm", isAI ? 'bg-primary/5 border-primary/30 italic text-primary/90' : isCurrentUser ? 'bg-primary/10 border-primary/10' : 'bg-white/5 border-white/5')}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-white/5 bg-background/40">
          <div className="flex items-center gap-3 bg-background/50 border border-white/5 rounded-2xl px-5 py-3 shadow-xl">
            <Input placeholder="Message the Hartmann Family Council..." className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
            <Button size="icon" className="rounded-full h-9 w-9" onClick={handleSendMessage} disabled={!inputText.trim()}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
