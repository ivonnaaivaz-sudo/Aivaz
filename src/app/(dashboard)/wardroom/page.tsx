
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  User, 
  Send, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight,
  BrainCircuit,
  MessageSquare
} from "lucide-react";

// Mock data for the strategy sidebar
const STRATEGY_METRICS = [
  { label: "Consolidated Alignment", value: "78%", status: "Stable" },
  { label: "Succession Window", value: "Q4 2028", status: "Target" },
  { label: "G2 Engagement", value: "Low", status: "Focus" }
];

const MOCK_MESSAGES = [
  {
    id: "m1",
    senderId: "advisor-1",
    senderName: "Robert Chen (Advisor)",
    text: "Julian, we need to finalize the side-letter for the Alpine PE fund by Friday. Marcus has raised a few points regarding G3 inclusion.",
    type: "text",
    timestamp: "2024-11-06T08:00:00.000Z",
  },
  {
    id: "m2",
    senderId: "julian-1",
    senderName: "Julian Aivaz",
    text: "I've seen Marcus's notes. I agree with adding a provision for the educational trust, but we need to ensure it doesn't trigger a tax event in Singapore.",
    type: "text",
    timestamp: "2024-11-06T09:00:00.000Z",
  },
  {
    id: "m3",
    senderId: "aivaz-ai",
    senderName: "Aivaz AI",
    text: "Strategic Insight: Shifting 5% of tech holdings into the G2 trust would satisfy the tax threshold while securing the liquidity bridge.",
    type: "recommendation",
    timestamp: "2024-11-06T10:00:00.000Z",
  }
];

export default function WardroomPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [inputText, setInputText] = useState("");
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const messagesQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "messages"), orderBy("timestamp", "asc"), limit(50));
  }, [user, db]);

  const { data: realMessages } = useCollection(messagesQuery);
  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  const messages = useMemo(() => {
    if (!realMessages || realMessages.length === 0) return MOCK_MESSAGES;
    return [...MOCK_MESSAGES, ...realMessages];
  }, [realMessages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user || !db) return;
    try {
      const msgRef = doc(collection(db, "users", user.uid, "messages"));
      await setDoc(msgRef, {
        senderId: user.uid,
        senderName: user.displayName || "Julian Aivaz",
        text: inputText,
        type: "text",
        timestamp: new Date().toISOString()
      });
      setInputText("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 max-w-7xl mx-auto">
      {/* Strategy Feed (Bloomberg Side) */}
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
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Active Insights</CardTitle>
          </CardHeader>
          <ScrollArea className="h-full">
            <CardContent className="space-y-4">
              {[
                { title: "Trust Optimization", impact: "High", icon: BrainCircuit },
                { title: "Risk Variance Alert", impact: "Medium", icon: AlertCircle },
                { title: "G2 Transition", impact: "Strategic", icon: TrendingUp }
              ].map((insight, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 group hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-1">
                    <insight.icon className="h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-bold">{insight.title}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Synthesized from family dynamics...</p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-[9px] mt-2 font-bold uppercase text-primary">
                    Send to Wardroom <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      {/* Main Terminal Chat */}
      <Card className="flex-1 glass-panel flex flex-col border-white/5 overflow-hidden shadow-3xl">
        <CardHeader className="border-b border-white/5 py-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Strategy Wardroom</p>
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Secure Multi-Gen Terminal</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-white/5 text-[9px]">Aivaz Heritage Repository Active</Badge>
        </CardHeader>

        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-8">
            {messages.map((msg) => {
              const isCurrentUser = msg.senderId === user?.uid || msg.senderName === "Julian Aivaz";
              const isAI = msg.senderName.includes('AI');
              return (
                <div key={msg.id} className={`flex gap-4 max-w-[85%] ${isCurrentUser ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                    isAI ? 'bg-primary/20 border-primary/40' : 
                    isCurrentUser ? 'bg-primary/20 border-primary/20' : 'bg-muted border-white/10'
                  }`}>
                    {isAI ? <Sparkles className="h-4 w-4 text-primary" /> : <User className={`h-4 w-4 ${isCurrentUser ? 'text-primary' : 'text-muted-foreground'}`} />}
                  </div>
                  <div className={`space-y-1 flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                      {msg.senderName}
                    </span>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                      isAI ? 'bg-primary/5 border-primary/30 italic text-primary/90' :
                      isCurrentUser ? 'bg-primary/10 border-primary/20 text-foreground rounded-tr-none' : 
                      'bg-white/5 border-white/5 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/5 bg-background/30">
          <div className="flex items-center gap-2 bg-background/50 border border-white/5 rounded-2xl px-4 py-2">
            <Input 
              placeholder="Type strategy message..." 
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" className="rounded-full h-8 w-8" onClick={handleSendMessage} disabled={!inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
