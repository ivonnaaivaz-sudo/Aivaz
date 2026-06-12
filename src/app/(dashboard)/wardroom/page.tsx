
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, addDoc, doc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  User, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Users2,
  Video,
  Plus,
  Search,
  Paperclip,
  CheckCircle2,
  XCircle,
  FileText,
  UserPlus,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Thread = {
  id: string;
  name: string;
  type: 'group' | 'direct' | 'ai';
  lastMessage: string;
  members: string[];
  unread?: boolean;
};

const HARTMANN_THREADS: Thread[] = [
  { id: 't1', name: 'Family Council (Governance)', type: 'group', lastMessage: 'Markus: The charter is ready for review.', members: ['Markus', 'Elena', 'Robert'], unread: true },
  { id: 't2', name: 'G2 Trust & Liquidity', type: 'ai', lastMessage: 'AI: Proposal for $3M hedge generated.', members: ['Markus', 'Sophie', 'Alexander', 'AI'], unread: false },
  { id: 't3', name: 'Singapore Expansion', type: 'group', lastMessage: 'Sophie: ESG targets updated.', members: ['Sophie', 'Elena'], unread: false },
  { id: 't4', name: 'Alexander Hartmann', type: 'direct', lastMessage: 'Dad, check the London report.', members: ['Markus', 'Alexander'], unread: false },
];

export default function WardroomPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [activeThreadId, setActiveThreadId] = useState('t1');
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const messagesQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "messages"), orderBy("timestamp", "asc"), limit(100));
  }, [user, db]);

  const { data: realMessages } = useCollection(messagesQuery);

  const activeThread = useMemo(() => 
    HARTMANN_THREADS.find(t => t.id === activeThreadId) || HARTMANN_THREADS[0]
  , [activeThreadId]);

  const messages = useMemo(() => {
    // In a real app, we'd filter by thread ID. For the demo, we show a mix.
    const mockData = [
      { id: 'h1', senderName: 'Captain (AI)', text: 'STRATEGY ALERT: €42M idle cash reserve detected. Opportunity cost: €2.1M annually.', type: 'recommendation', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'h2', senderName: 'Alexander Hartmann', text: 'I vote for the London tech deployment. We need to move fast.', type: 'text', timestamp: new Date(Date.now() - 3000000).toISOString() },
      { id: 'h3', senderName: 'Sophie Hartmann', text: 'Wait, we should look at the ESG impact first. Can the AI draft a sustainability comparison?', type: 'text', timestamp: new Date(Date.now() - 2400000).toISOString() },
      { id: 'h4', senderName: 'Dr. Markus Hartmann', text: 'The industrial stability of this family is paramount. I am reviewing the charter now.', type: 'text', timestamp: new Date(Date.now() - 1800000).toISOString() },
    ];
    
    if (!realMessages || realMessages.length === 0) return mockData;
    return [...mockData, ...realMessages];
  }, [realMessages]);

  useEffect(() => {
    if (scrollRef.current && mounted) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) { viewport.scrollTop = viewport.scrollHeight; }
    }
  }, [messages, activeThreadId, mounted]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user || !db) return;
    try {
      const msgRef = collection(db, "users", user.uid, "messages");
      await addDoc(msgRef, {
        senderId: user.uid,
        senderName: "Dr. Markus Hartmann",
        text: inputText,
        type: "text",
        threadId: activeThreadId,
        timestamp: new Date().toISOString()
      });
      setInputText("");
    } catch (e) { console.error(e); }
  };

  const startVideoMeeting = () => {
    toast({ 
      title: "Encrypted Meeting Started", 
      description: "Inviting Hartmann Council members to secure video link...",
    });
  };

  const formatTime = (ts: string) => {
    if (!mounted) return "";
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-4 max-w-[1800px] mx-auto overflow-hidden">
      {/* Sidebar: Threads & Members */}
      <Card className="w-80 flex flex-col glass-panel border-white/5 bg-black/20 shrink-0">
        <CardHeader className="p-4 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-headline">Wardroom</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search tracks..." className="pl-9 h-9 bg-background/50 border-white/5 text-xs" />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {HARTMANN_THREADS.map((thread) => (
              <div 
                key={thread.id} 
                onClick={() => setActiveThreadId(thread.id)}
                className={cn(
                  "p-3 rounded-xl flex gap-3 cursor-pointer transition-all group",
                  activeThreadId === thread.id ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5 border border-transparent"
                )}
              >
                <div className="relative">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border",
                    thread.type === 'ai' ? "bg-primary/20 border-primary/30" : "bg-white/5 border-white/10"
                  )}>
                    {thread.type === 'ai' ? <Sparkles className="h-5 w-5 text-primary" /> : <Users2 className="h-5 w-5" />}
                  </div>
                  {thread.unread && <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-black" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className={cn("text-xs font-bold truncate", activeThreadId === thread.id ? "text-primary" : "text-foreground")}>
                      {thread.name}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{thread.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-white/5">
          <Button variant="outline" className="w-full h-9 text-[10px] font-bold uppercase tracking-widest bg-white/5 border-white/10" asChild>
            <div className="flex items-center justify-center gap-2 cursor-pointer">
              <UserPlus className="h-3.5 w-3.5" />
              <span>Add Family Member</span>
            </div>
          </Button>
        </div>
      </Card>

      {/* Main Messenger Hub */}
      <Card className="flex-1 glass-panel flex flex-col border-white/5 overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-white/5 py-3 px-6 flex flex-row items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border",
              activeThread.type === 'ai' ? "bg-primary/20 border-primary/30 shadow-[0_0_15px_rgba(75,163,199,0.2)]" : "bg-white/5 border-white/10"
            )}>
              {activeThread.type === 'ai' ? <Sparkles className="h-5 w-5 text-primary" /> : <Users2 className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">{activeThread.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[8px] h-4 border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-1.5 uppercase font-bold tracking-widest">
                  Secure Session
                </Badge>
                <span className="text-[9px] text-muted-foreground font-medium truncate">{activeThread.members.join(', ')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest bg-white/5 border-white/10" onClick={startVideoMeeting}>
              <Video className="mr-2 h-3.5 w-3.5 text-primary" /> Video Meeting
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 px-6" ref={scrollRef}>
          <div className="py-8 space-y-8">
            <div className="flex flex-col items-center justify-center space-y-3 opacity-20">
              <Shield className="h-6 w-6 text-primary" />
              <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-center">Multi-Generational Encrypted Stream</p>
            </div>

            {messages.map((msg: any) => {
              const isCurrentUser = msg.senderName.includes("Markus");
              const isAI = msg.senderName.includes("AI") || msg.senderName === "Captain (AI)";
              const isRecommendation = msg.type === "recommendation";

              return (
                <div key={msg.id} className={cn("flex gap-4 max-w-[85%] animate-in fade-in duration-300", isCurrentUser ? 'ml-auto flex-row-reverse' : '')}>
                  <Avatar className="h-8 w-8 border border-white/10 shrink-0">
                    <AvatarFallback className={cn("text-[10px] font-bold", isAI ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                      {isAI ? <Sparkles className="h-4 w-4" /> : msg.senderName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("space-y-1.5 flex flex-col", isCurrentUser ? 'items-end' : 'items-start')}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{msg.senderName}</span>
                      <span className="text-[9px] text-muted-foreground/30 font-mono">{formatTime(msg.timestamp)}</span>
                    </div>

                    {isRecommendation ? (
                      <Card className="glass-panel border-primary/30 bg-primary/5 p-4 space-y-4 relative group max-w-md overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Sparkles className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-bold uppercase">Strategic Recommendation</Badge>
                            <Badge variant="outline" className="text-[8px] border-amber-500/30 text-amber-500">Action Required</Badge>
                          </div>
                          <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-[9px] font-bold bg-white/10 border-white/10 flex-1 hover:border-primary/50 transition-colors">
                            <FileText className="mr-1.5 h-3 w-3" /> Draft Memo
                          </Button>
                          <Button size="sm" className="h-8 text-[9px] font-bold flex-1 shadow-md bg-primary hover:bg-primary/90">
                            <CheckCircle2 className="mr-1.5 h-3 w-3" /> Approve Move
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      <div className={cn(
                        "p-3 px-4 rounded-2xl text-[13px] leading-relaxed border transition-all",
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
        <div className="p-4 px-6 border-t border-white/5 bg-black/40 shrink-0">
          <div className="flex items-center gap-3 bg-background/50 border border-white/5 rounded-2xl p-2 pl-4 focus-within:border-primary/30 transition-all shadow-inner">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input 
              placeholder={activeThread.type === 'ai' ? "Prompt Aivaz to draft or simulate..." : "Type a secure message..."}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm h-9 placeholder:text-muted-foreground/30" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
            />
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className={cn("h-8 w-8 transition-colors", activeThread.type === 'ai' ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button size="icon" className="rounded-xl h-8 w-8 bg-primary hover:bg-primary/90 shadow-lg" onClick={handleSendMessage} disabled={!inputText.trim()}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-6 opacity-30">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-emerald-500" />
              <span className="text-[7px] font-bold uppercase tracking-[0.2em]">Hartmann Charter v4.0 Active</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
