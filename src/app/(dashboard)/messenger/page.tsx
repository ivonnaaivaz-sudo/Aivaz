"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Shield, User, MoreVertical, Search, Paperclip, Send, Sparkles, ExternalLink } from "lucide-react";

const MOCK_MESSAGES = [
  {
    id: "m1",
    senderId: "advisor-1",
    senderName: "Robert Chen (Advisor)",
    text: "Markus, I've updated the roadmap with the Singapore expansion targets for 2026. We should coordinate the charter review for the legacy trust soon.",
    type: "text",
    timestamp: "2024-11-06T08:00:00.000Z",
  },
  {
    id: "m2",
    senderId: "markus-1",
    senderName: "Dr. Markus Hartmann",
    text: "Thanks Robert. Elena, have you had a chance to look at the Heritage Foundation bylaws? We want to ensure G3 is properly integrated into the philanthropic mission.",
    type: "text",
    timestamp: "2024-11-06T09:00:00.000Z",
  },
  {
    id: "m3",
    senderId: "marcus-1",
    senderName: "Sophie Hartmann",
    text: "I'm reviewing them now. I agree with the focus on intellectual capital growth. I'm also curious about the Liquidity Bridge recommendation Aivaz flagged today.",
    type: "text",
    timestamp: "2024-11-06T10:00:00.000Z",
  },
  {
    id: "m4",
    senderId: "hartmann-ai",
    senderName: "Hartmann Intelligence",
    text: "Shared a recommendation: Generational Liquidity Bridge. Target: @Sophie & Next Gen. Impact: Strategic Stability",
    type: "recommendation",
    recommendationId: "rec-1",
    timestamp: "2024-11-06T11:00:00.000Z",
  },
  {
    id: "m5",
    senderId: "markus-1",
    senderName: "Dr. Markus Hartmann",
    text: "The bridge makes sense. Let's move 5% of the tech holdings as suggested. It buffers the education trust against the volatility we're seeing in the supply chain sector.",
    type: "text",
    timestamp: "2024-11-06T12:00:00.000Z",
  }
];

export default function MessengerPage() {
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
        senderName: user.displayName || "Dr. Markus Hartmann",
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
      <Card className="w-80 glass-panel flex flex-col border-white/5">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">Messenger</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 bg-background/50 border-white/5 text-sm h-9" />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            <div className="p-3 rounded-xl flex gap-3 cursor-pointer bg-primary/10 border border-primary/20">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 border border-primary/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold truncate">Family Strategy Core</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">Active</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">End-to-end heritage channel</p>
              </div>
            </div>
            
            <div className="p-3 rounded-xl flex gap-3 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex-shrink-0 border border-white/10 flex items-center justify-center">
                <User className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Robert Chen (Advisor)</p>
                <p className="text-xs text-muted-foreground truncate">Tax report uploaded</p>
              </div>
            </div>

            <div className="p-3 rounded-xl flex gap-3 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex-shrink-0 border border-white/10 flex items-center justify-center">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Sophie Hartmann</p>
                <p className="text-xs text-muted-foreground truncate">Reviewing bylaws...</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>

      <Card className="flex-1 glass-panel flex flex-col border-white/5 overflow-hidden">
        <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Family Strategy Core</p>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Encryption Active</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </Button>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center space-y-2 opacity-30 pb-4">
              <Shield className="h-6 w-6 text-primary" />
              <p className="text-[10px] uppercase font-bold tracking-tighter">Secure multi-generational session established</p>
            </div>
            
            {messages.map((msg) => {
              const isCurrentUser = msg.senderId === user?.uid || msg.senderName === "Dr. Markus Hartmann";
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-4 max-w-[85%] ${isCurrentUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                    msg.senderName.includes('Intelligence') ? 'bg-primary/20 border-primary/40' : 
                    isCurrentUser ? 'bg-primary/20 border-primary/20' : 'bg-muted border-white/10'
                  }`}>
                    {msg.senderName.includes('Intelligence') ? <Sparkles className="h-4 w-4 text-primary" /> : <User className={`h-4 w-4 ${isCurrentUser ? 'text-primary' : 'text-muted-foreground'}`} />}
                  </div>
                  
                  <div className={`space-y-1 flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                      {msg.senderName} • {formatTime(msg.timestamp)}
                    </span>
                    
                    {msg.type === "recommendation" ? (
                      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-3 relative group overflow-hidden max-w-sm">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                          <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-bold uppercase">AI Recommendation Shared</Badge>
                        <p className="text-sm font-bold leading-relaxed">{msg.text.split('recommendation: ')[1] || msg.text}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-7 text-[9px] font-bold bg-white/5 border-white/10" onClick={() => window.location.href = '/insights'}>
                            <ExternalLink className="mr-1.5 h-3 w-3" /> View Insight
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-[9px] font-bold bg-white/5 border-white/10" onClick={() => window.location.href = '/simulator'}>
                            <Sparkles className="mr-1.5 h-3 w-3" /> Run Simulator
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                        isCurrentUser 
                          ? 'bg-primary/10 border-primary/20 text-foreground rounded-tr-none' 
                          : 'bg-white/5 border-white/5 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/5 bg-background/30 shrink-0">
          <div className="flex items-center gap-2 bg-background/50 border border-white/5 rounded-2xl px-4 py-2">
            <Input 
              placeholder="Type a secure message..." 
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" className="rounded-full shadow-lg" onClick={handleSendMessage} disabled={!inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[9px] text-center text-muted-foreground/40 mt-3 font-bold uppercase tracking-widest">
            End-to-end multi-generational encryption active
          </p>
        </div>
      </Card>
    </div>
  );
}
