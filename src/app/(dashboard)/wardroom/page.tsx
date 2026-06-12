"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Send, 
  Sparkles, 
  Users2,
  Video,
  Plus,
  Search,
  Paperclip,
  CheckCircle2,
  FileText,
  UserPlus,
  MoreVertical,
  ChevronRight,
  Smile
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

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
  { id: 't2', name: 'G2 Trust & Liquidity', type: 'ai', lastMessage: 'AI: Proposal for €3M hedge generated.', members: ['Markus', 'Sophie', 'Alexander', 'AI'], unread: false },
  { id: 't3', name: 'Singapore Expansion', type: 'group', lastMessage: 'Sophie: ESG targets updated.', members: ['Sophie', 'Elena'], unread: false },
  { id: 't4', name: 'Alexander Hartmann', type: 'direct', lastMessage: 'Dad, check the London report.', members: ['Markus', 'Alexander'], unread: false },
];

const FAMILY_PRESENCE = [
  { name: "Dr. Markus", role: "Principal", status: "online", avatar: "https://picsum.photos/seed/markus/100/100" },
  { name: "Elena", role: "Philanthropy", status: "online", avatar: "https://picsum.photos/seed/elena/100/100" },
  { name: "Sophie", role: "ESG Lead", status: "away", avatar: "https://picsum.photos/seed/sophie/100/100" },
  { name: "Alexander", role: "Growth", status: "online", avatar: "https://picsum.photos/seed/alexander/100/100" },
  { name: "Lina", role: "Next Gen", status: "offline", avatar: "https://picsum.photos/seed/lina/100/100" },
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
    <div className="h-[calc(100vh-100px)] flex flex-col gap-6 max-w-[1800px] mx-auto animate-in fade-in duration-700">
      {/* Ecosystem Presence Bar */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex items-center justify-between p-5 px-10 shrink-0 rounded-[2rem] border-b border-slate-100/50">
        <div className="flex items-center gap-10">
          <div className="pr-10 border-r border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">Council Status</p>
            <h3 className="text-sm font-bold flex items-center gap-2.5 text-slate-900">
              <Users2 className="h-4.5 w-4.5 text-primary" />
              Ecosystem Active
            </h3>
          </div>
          <div className="flex items-center gap-6">
            {FAMILY_PRESENCE.map((member) => (
              <div key={member.name} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="relative">
                  <Avatar className="h-11 w-11 border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] ring-1 ring-slate-100 group-hover:ring-primary/50 group-hover:scale-105 transition-all duration-300">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-[11px] font-bold">{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm",
                    member.status === 'online' ? "bg-emerald-500" : member.status === 'away' ? "bg-amber-500" : "bg-slate-300"
                  )} />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-primary transition-colors tracking-tighter">{member.name.split(' ')[0]}</span>
              </div>
            ))}
            <Link href="/dna">
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 group transition-all duration-300">
                <UserPlus className="h-5 w-5 text-slate-400 group-hover:text-primary" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="h-11 px-8 text-[12px] font-bold uppercase tracking-widest border-slate-200 hover:bg-slate-50 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 rounded-xl" onClick={startVideoMeeting}>
            <Video className="mr-2.5 h-4.5 w-4.5 text-primary" /> Start Secure Meeting
          </Button>
        </div>
      </Card>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar: Threads */}
        <Card className="w-85 flex flex-col border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-slate-50/80 backdrop-blur-sm shrink-0 rounded-[2.5rem] overflow-hidden border border-slate-100">
          <CardHeader className="p-8 pb-6 border-b border-slate-100 bg-white/40 space-y-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-headline font-bold text-slate-900 tracking-tight">Tracks</CardTitle>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-slate-100 transition-all">
                <Plus className="h-6 w-6 text-slate-600" />
              </Button>
            </div>
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input placeholder="Search tracks..." className="pl-11 h-11 bg-white border-slate-200/60 text-sm rounded-2xl focus-visible:ring-primary/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {HARTMANN_THREADS.map((thread) => (
                <div 
                  key={thread.id} 
                  onClick={() => setActiveThreadId(thread.id)}
                  className={cn(
                    "p-5 rounded-[2rem] flex gap-4 cursor-pointer transition-all duration-500 border",
                    activeThreadId === thread.id 
                      ? "bg-white border-primary/20 shadow-[0_10px_25px_rgba(75,163,199,0.12)] scale-[1.02] translate-x-1" 
                      : "bg-transparent border-transparent hover:bg-white/60 hover:translate-x-1"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-[1.25rem] flex items-center justify-center border transition-all duration-500",
                      thread.type === 'ai' 
                        ? (activeThreadId === thread.id ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-primary/10 border-primary/20 text-primary")
                        : "bg-white border-slate-200"
                    )}>
                      {thread.type === 'ai' ? <Sparkles className="h-6 w-6" /> : <Users2 className={cn("h-6 w-6", activeThreadId === thread.id ? "text-primary" : "text-slate-500")} />}
                    </div>
                    {thread.unread && <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full border-2 border-white shadow-md animate-pulse" />}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className={cn("text-[15px] font-bold truncate tracking-tight", activeThreadId === thread.id ? "text-primary" : "text-slate-800")}>
                        {thread.name}
                      </p>
                    </div>
                    <p className={cn("text-[12px] truncate leading-tight opacity-70", activeThreadId === thread.id ? "text-primary/80 font-medium" : "text-slate-500")}>
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Main Messenger Hub */}
        <Card className="flex-1 flex flex-col border-none shadow-[0_15px_50px_rgba(0,0,0,0.06)] bg-white overflow-hidden rounded-[3rem] border border-slate-100 relative">
          <CardHeader className="border-b border-slate-100/60 py-5 px-10 flex flex-row items-center justify-between bg-white/80 backdrop-blur-md shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-14 h-14 rounded-[1.5rem] flex items-center justify-center border transition-all duration-500",
                activeThread.type === 'ai' ? "bg-primary/10 border-primary/20 shadow-[0_0_25px_rgba(75,163,199,0.2)]" : "bg-slate-50 border-slate-100"
              )}>
                {activeThread.type === 'ai' ? <Sparkles className="h-7 w-7 text-primary" /> : <Users2 className="h-7 w-7 text-slate-600" />}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 tracking-tight">{activeThread.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] h-5 px-2.5 font-bold uppercase tracking-widest shadow-sm">
                    Secure Channel
                  </Badge>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter truncate opacity-70">
                    {activeThread.members.length} Members Online
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full hover:bg-slate-100 transition-colors">
                <MoreVertical className="h-6 w-6 text-slate-400" />
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 bg-white" ref={scrollRef}>
            <div className="py-12 px-12 space-y-12">
              <div className="flex flex-col items-center justify-center space-y-5 opacity-20 py-6 select-none">
                <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="h-px w-80 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
                <p className="text-[11px] uppercase font-bold tracking-[0.6em] text-center text-slate-600">Hartmann Heritage Encryption</p>
              </div>

              {messages.map((msg: any) => {
                const isCurrentUser = msg.senderName.includes("Markus");
                const isAI = msg.senderName.includes("AI") || msg.senderName === "Captain (AI)";
                const isRecommendation = msg.type === "recommendation";

                return (
                  <div key={msg.id} className={cn("flex gap-6 max-w-[85%] animate-in fade-in slide-in-from-bottom-4 duration-700", isCurrentUser ? 'ml-auto flex-row-reverse' : '')}>
                    <div className="shrink-0 pt-1">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-1 ring-slate-100">
                        <AvatarFallback className={cn("text-[12px] font-bold", isAI ? "bg-primary text-white shadow-md" : "bg-slate-100 text-slate-500")}>
                          {isAI ? <Sparkles className="h-5 w-5" /> : msg.senderName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className={cn("space-y-2.5 flex flex-col", isCurrentUser ? 'items-end' : 'items-start')}>
                      <div className="flex items-center gap-4 px-2">
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest leading-none">{msg.senderName}</span>
                        <span className="text-[11px] text-slate-300 font-bold font-mono tracking-tighter leading-none">{formatTime(msg.timestamp)}</span>
                      </div>

                      {isRecommendation ? (
                        <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.04] to-transparent p-7 space-y-6 relative group max-w-xl overflow-hidden shadow-[0_20px_50px_rgba(75,163,199,0.15)] rounded-[2rem] ring-2 ring-primary/10">
                          <div className="absolute -top-6 -right-6 p-12 opacity-5 group-hover:opacity-10 transition-all duration-700 rotate-12 group-hover:rotate-0 group-hover:scale-110">
                            <Sparkles className="h-24 w-24 text-primary" />
                          </div>
                          <div className="space-y-4 relative">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-primary text-white border-transparent text-[10px] font-bold uppercase tracking-[0.2em] h-6 px-3 shadow-lg shadow-primary/20">AI Strategy</Badge>
                              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                            <p className="text-[15px] font-bold text-slate-900 leading-relaxed italic border-l-4 border-primary/40 pl-5 py-1">
                              "{msg.text}"
                            </p>
                          </div>
                          <div className="flex gap-4 relative">
                            <Button variant="outline" size="sm" className="h-10 text-[11px] font-bold bg-white border-slate-200/80 flex-1 hover:border-primary/40 hover:text-primary shadow-sm hover:shadow-md rounded-2xl transition-all duration-300">
                              <FileText className="mr-2.5 h-4 w-4" /> Open Strategic Track
                            </Button>
                            <Button size="sm" className="h-10 text-[11px] font-bold flex-1 shadow-[0_10px_20px_rgba(75,163,199,0.3)] bg-primary hover:bg-primary/90 text-white rounded-2xl transition-all duration-300 transform active:scale-95">
                              <CheckCircle2 className="mr-2.5 h-4 w-4" /> Approve & Execute
                            </Button>
                          </div>
                        </Card>
                      ) : (
                        <div className={cn(
                          "p-5 px-7 rounded-[2.25rem] text-[15px] leading-relaxed shadow-sm transition-all border font-medium",
                          isCurrentUser 
                            ? 'bg-primary/10 border-primary/20 text-slate-900 rounded-tr-none shadow-[0_4px_15px_rgba(75,163,199,0.05)]' 
                            : 'bg-slate-50 border-slate-100 text-slate-700 rounded-tl-none shadow-[0_4px_15px_rgba(0,0,0,0.02)]'
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

          <div className="p-8 px-12 border-t border-slate-100/60 bg-white/50 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-5 bg-white border-2 border-slate-100 rounded-[2.5rem] p-4 px-7 focus-within:border-primary/40 focus-within:ring-[8px] focus-within:ring-primary/5 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <Button variant="ghost" size="icon" className="h-11 w-11 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all duration-300">
                <Paperclip className="h-6 w-6" />
              </Button>
              <Input 
                placeholder={activeThread.type === 'ai' ? "Command Aivaz to synthesize..." : "Write a secure message..."}
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-lg font-medium h-12 placeholder:text-slate-300 placeholder:italic" 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
              />
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className={cn("h-11 w-11 rounded-full transition-all duration-500 hover:scale-110", activeThread.type === 'ai' ? "text-primary bg-primary/10 shadow-sm" : "text-slate-400 hover:text-primary")}>
                  <Sparkles className="h-6 w-6" />
                </Button>
                <div className="h-10 w-0.5 bg-slate-100 rounded-full mx-1" />
                <Button size="icon" className="rounded-[1.5rem] h-13 w-13 bg-primary hover:bg-primary/90 shadow-[0_12px_30px_rgba(75,163,199,0.4)] text-white transition-all duration-500 transform active:scale-90 hover:scale-105" onClick={handleSendMessage} disabled={!inputText.trim()}>
                  <Send className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100/50 shadow-sm">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-slate-400">Hartmann Heritage Secure Node</p>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
