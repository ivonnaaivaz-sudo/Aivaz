
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
    <div className="h-[calc(100vh-100px)] flex flex-col gap-6 max-w-[1800px] mx-auto animate-in fade-in duration-500">
      {/* Ecosystem Presence Bar */}
      <Card className="border border-slate-200 shadow-sm bg-white flex items-center justify-between p-4 px-8 shrink-0 rounded-2xl">
        <div className="flex items-center gap-10">
          <div className="pr-10 border-r border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Council Status</p>
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
              <Users2 className="h-4 w-4 text-primary" />
              Ecosystem Active
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {FAMILY_PRESENCE.map((member) => (
              <div key={member.name} className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-primary/40 transition-all">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-[10px] font-bold">{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                    member.status === 'online' ? "bg-emerald-500" : member.status === 'away' ? "bg-amber-500" : "bg-slate-300"
                  )} />
                </div>
                <span className="text-[9px] font-bold uppercase text-slate-400 group-hover:text-primary transition-colors tracking-tight">{member.name.split(' ')[0]}</span>
              </div>
            ))}
            <Link href="/dna">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all">
                <UserPlus className="h-4 w-4 text-slate-400 group-hover:text-primary" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="h-9 px-6 text-[11px] font-bold uppercase tracking-widest border-slate-200 hover:bg-slate-50 rounded-xl" onClick={startVideoMeeting}>
            <Video className="mr-2 h-4 w-4 text-primary" /> Start Secure Meeting
          </Button>
        </div>
      </Card>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar: Threads */}
        <Card className="w-80 flex flex-col border border-slate-200 shadow-sm bg-slate-50/50 shrink-0 rounded-2xl overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-headline font-bold text-slate-900">Tracks</CardTitle>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100">
                <Plus className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search tracks..." className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm rounded-xl focus-visible:ring-primary/20" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {HARTMANN_THREADS.map((thread) => (
                <div 
                  key={thread.id} 
                  onClick={() => setActiveThreadId(thread.id)}
                  className={cn(
                    "p-4 rounded-xl flex gap-3 cursor-pointer transition-all border",
                    activeThreadId === thread.id 
                      ? "bg-white border-primary/20 shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-white/40"
                  )}
                >
                  <div className="shrink-0">
                    <div className={cn(
                      "w-11 h-11 rounded-lg flex items-center justify-center border",
                      thread.type === 'ai' 
                        ? (activeThreadId === thread.id ? "bg-primary text-white border-primary" : "bg-primary/10 border-primary/20 text-primary")
                        : "bg-white border-slate-200"
                    )}>
                      {thread.type === 'ai' ? <Sparkles className="h-5 w-5" /> : <Users2 className={cn("h-5 w-5", activeThreadId === thread.id ? "text-primary" : "text-slate-500")} />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={cn("text-sm font-bold truncate tracking-tight", activeThreadId === thread.id ? "text-primary" : "text-slate-800")}>
                        {thread.name}
                      </p>
                      {thread.unread && <div className="h-2 w-2 bg-primary rounded-full" />}
                    </div>
                    <p className={cn("text-[11px] truncate leading-tight opacity-70", activeThreadId === thread.id ? "text-primary/80" : "text-slate-500")}>
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Main Messenger Hub */}
        <Card className="flex-1 flex flex-col border border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl relative">
          <CardHeader className="border-b border-slate-200 py-4 px-8 flex flex-row items-center justify-between bg-white shrink-0 z-10">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border",
                activeThread.type === 'ai' ? "bg-primary/5 border-primary/20" : "bg-slate-50 border-slate-200"
              )}>
                {activeThread.type === 'ai' ? <Sparkles className="h-6 w-6 text-primary" /> : <Users2 className="h-6 w-6 text-slate-600" />}
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 tracking-tight">{activeThread.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className="bg-primary/5 text-primary border-primary/20 text-[9px] h-4 px-2 font-bold uppercase tracking-widest">
                    Secure Node
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    {activeThread.members.length} Members
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-50">
              <MoreVertical className="h-5 w-5 text-slate-400" />
            </Button>
          </CardHeader>
          
          <ScrollArea className="flex-1 bg-white" ref={scrollRef}>
            <div className="py-10 px-10 space-y-10">
              <div className="flex flex-col items-center justify-center space-y-4 opacity-10 py-6 select-none">
                <Shield className="h-6 w-6 text-slate-600" />
                <div className="h-px w-64 bg-slate-300" />
                <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-slate-600">Hartmann Legacy Encryption</p>
              </div>

              {messages.map((msg: any) => {
                const isCurrentUser = msg.senderName.includes("Markus");
                const isAI = msg.senderName.includes("AI") || msg.senderName === "Captain (AI)";
                const isRecommendation = msg.type === "recommendation";

                return (
                  <div key={msg.id} className={cn("flex gap-4 max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-300", isCurrentUser ? 'ml-auto flex-row-reverse' : '')}>
                    <div className="shrink-0 pt-1">
                      <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                        <AvatarFallback className={cn("text-[11px] font-bold", isAI ? "bg-primary text-white" : "bg-slate-100 text-slate-500")}>
                          {isAI ? <Sparkles className="h-4 w-4" /> : msg.senderName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className={cn("space-y-1.5 flex flex-col", isCurrentUser ? 'items-end' : 'items-start')}>
                      <div className="flex items-center gap-3 px-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-300 font-bold font-mono">{formatTime(msg.timestamp)}</span>
                      </div>

                      {isRecommendation ? (
                        <Card className="border border-primary/30 bg-primary/5 p-6 space-y-5 rounded-2xl max-w-lg shadow-sm">
                          <div className="space-y-3">
                            <Badge className="bg-primary text-white border-transparent text-[9px] font-bold uppercase tracking-widest h-5 px-2">AI Track</Badge>
                            <p className="text-[14px] font-bold text-slate-900 leading-relaxed border-l-2 border-primary/30 pl-4 py-1">
                              {msg.text}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" size="sm" className="h-9 text-[10px] font-bold bg-white border-slate-200 flex-1 hover:border-primary/30 hover:text-primary rounded-xl transition-all">
                              <FileText className="mr-2 h-3.5 w-3.5" /> Review Proposal
                            </Button>
                            <Button size="sm" className="h-9 text-[10px] font-bold flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all shadow-sm">
                              <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Execute
                            </Button>
                          </div>
                        </Card>
                      ) : (
                        <div className={cn(
                          "p-4 px-6 rounded-2xl text-[14px] leading-relaxed border shadow-sm transition-all",
                          isCurrentUser 
                            ? 'bg-primary/10 border-primary/20 text-slate-900 rounded-tr-none' 
                            : 'bg-slate-50 border-slate-100 text-slate-700 rounded-tl-none'
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

          <div className="p-6 px-10 border-t border-slate-200 bg-white shrink-0">
            <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-2 px-4 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/5 transition-all shadow-sm">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input 
                placeholder={activeThread.type === 'ai' ? "Instruct the Aivaz Engine..." : "Type a secure message..."}
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium h-10 placeholder:text-slate-300 placeholder:italic" 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
              />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-xl", activeThread.type === 'ai' ? "text-primary bg-primary/5" : "text-slate-400 hover:text-primary")}>
                  <Sparkles className="h-5 w-5" />
                </Button>
                <div className="h-6 w-px bg-slate-200 mx-1" />
                <Button size="icon" className="rounded-xl h-10 w-10 bg-primary hover:bg-primary/90 text-white transition-all shadow-sm" onClick={handleSendMessage} disabled={!inputText.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <div className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-slate-400">
                <Shield className="h-3 w-3 text-emerald-500" />
                Solid Channel: Hartmann heritage node active
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

