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
  MessageSquare,
  Search,
  ExternalLink,
  Users2
} from "lucide-react";

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

  useEffect(() => {
    if (scrollRef.current && mounted) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, mounted]);

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

  const formatTime = (timestamp: string) => {
    if (!mounted) return "";
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 max-w-7xl mx-auto">
      {/* Strategy Sidebar (Bloomberg Style) */}
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
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Stakeholders</CardTitle>
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
          <Badge variant="outline" className="bg-white/5 text-[9px] font-mono">ENCRYPTION: AES-256-GCM</Badge>
        </CardHeader>

        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center space-y-2 opacity-30 pb-4">
              <Shield className="h-6 w-6 text-primary" />
              <p className="text-[10px] uppercase font-bold tracking-tighter">Strategic session integrity verified</p>
            </div>
            
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
                      {msg.senderName} • {formatTime(msg.timestamp)}
                    </span>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                      isAI ? 'bg-primary/5 border-primary/30 italic text-primary/90 rounded-tl-none' :
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
              placeholder="Type strategy message or command..." 
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
