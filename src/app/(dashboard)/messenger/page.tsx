
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Shield, User, MoreVertical, Search, Paperclip, Send, Sparkles, ExternalLink, MessageSquare } from "lucide-react";

export default function MessengerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "messages"), orderBy("timestamp", "asc"), limit(50));
  }, [user, db]);

  const { data: messages } = useCollection(messagesQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user || !db) return;

    try {
      const msgRef = doc(collection(db, "users", user.uid, "messages"));
      await setDoc(msgRef, {
        senderId: user.uid,
        senderName: user.displayName || "Principal",
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
            {/* Demo sub-chats */}
            {["Robert Chen (Advisor)", "Marcus Aivaz"].map((name, i) => (
              <div key={i} className="p-3 rounded-xl flex gap-3 cursor-pointer hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 border border-white/10" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{name}</p>
                  <p className="text-xs text-muted-foreground truncate">Secure line ready</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="flex-1 glass-panel flex flex-col border-white/5">
        <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-4">
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
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2 opacity-30 pb-4">
              <Shield className="h-6 w-6 text-primary" />
              <p className="text-[10px] uppercase font-bold tracking-tighter">Secure multi-generational session established</p>
            </div>
            
            {!messages?.length && (
              <div className="text-center py-20 text-muted-foreground/30">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Beginning of Secure Heritage History</p>
              </div>
            )}

            {messages?.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 max-w-[85%] ${msg.senderId === user?.uid ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${msg.senderId === user?.uid ? 'bg-primary/20 border-primary/20' : 'bg-muted border-white/10'}`}>
                  <User className={`h-4 w-4 ${msg.senderId === user?.uid ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                
                <div className="space-y-1 flex flex-col">
                  <span className={`text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-1 ${msg.senderId === user?.uid ? 'text-right' : ''}`}>
                    {msg.senderName} • {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}
                  </span>
                  
                  {msg.type === "recommendation" ? (
                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-3 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-bold uppercase">AI Recommendation Shared</Badge>
                      <p className="text-sm font-bold leading-relaxed">{msg.text.split('Shared a recommendation: ')[1]}</p>
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
                      msg.senderId === user?.uid 
                        ? 'bg-primary/10 border-primary/20 text-foreground' 
                        : 'bg-white/5 border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 bg-background/50 border border-white/5 rounded-2xl px-4 py-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Paperclip className="h-5 w-5" />
            </Button>
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
        </div>
      </Card>
    </div>
  );
}
