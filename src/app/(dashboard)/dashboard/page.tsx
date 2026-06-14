
"use client";

import { useUser, useDoc, useCollection, useFirestore } from "@/firebase";
import { useMemo, useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShieldCheck, 
  ChevronRight,
  History,
  CheckCircle2,
  Clock,
  Flag,
  Compass,
  AlertTriangle,
  FileText,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FamilyCalendar, type FamilyEvent } from "@/components/dashboard/FamilyCalendar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const MOCK_EVENTS: FamilyEvent[] = [
  { id: "1", title: "Hartmann Family Council", date: "2026-06-12", eventType: "GOVERNANCE", priority: "URGENT", description: "Reviewing the €42M cash reserve deployment proposal.", memberAccess: ["Dr. Markus", "Elena", "Sophie", "Alexander"] },
  { id: "2", title: "Specialty Chem Dividend", date: "2026-06-25", eventType: "FINANCIAL", priority: "NORMAL", description: "Q2 Dividend distribution for Hartmann Specialty Chem.", memberAccess: ["All Stakeholders"] },
  { id: "3", title: "Heritage Gala Munich", date: "2026-07-15", eventType: "SOCIAL", priority: "NORMAL", description: "Annual family philanthropic event in Munich.", memberAccess: ["All Family"] },
];

const HARTMANN_TIMELINE = [
  { id: "h-1", title: "Foundation", date: "1992", type: "financial", status: "completed" },
  { id: "h-2", title: "Singapore Pivot", date: "2008", type: "vision", status: "completed" },
  { id: "h-3", title: "Trust Setup", date: "2024", type: "succession", status: "completed" },
  { id: "h-4", title: "Governance", date: "2026", type: "succession", status: "in-progress" },
  { id: "h-5", title: "Legacy Target", date: "2027", type: "philanthropy", status: "target" }
];

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: dna, loading: dnaLoading } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  const heroImage = PlaceHolderImages.find(img => img.id === 'heritage-hero');
  const captainAvatar = PlaceHolderImages.find(img => img.id === 'captain-avatar');
  
  const [captainInput, setCaptainInput] = useState("");

  const timelineQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "timeline"), orderBy("date", "asc"));
  }, [user, db]);
  
  const { data: realEvents } = useCollection(timelineQuery);
  const timelineEvents = realEvents && realEvents.length > 0 ? realEvents : HARTMANN_TIMELINE;

  const firstName = user?.displayName?.split(" ")[0] || "Markus";
  
  const handleSendToCaptain = () => {
    toast({
      title: "Transmission Established",
      description: "The Captain is processing your vision for the Hartmann legacy.",
    });
    setCaptainInput("");
  };

  if (dnaLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32">
      {/* Welcome Header with Image */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-lg min-h-[350px] flex items-end">
        {heroImage && (
          <Image 
            src={heroImage.imageUrl}
            alt="Family Heritage"
            fill
            className="object-cover"
            priority
            data-ai-hint="heritage family"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        
        <div className="relative z-10 w-full p-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">Heritage Node Secure</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="font-headline text-4xl font-bold tracking-tighter text-white">
                Welcome back, {firstName}
              </h1>
              <p className="text-base text-white/80 font-medium max-w-xl">
                The Aivaz engine has synchronized your latest portfolio and alignment data.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[120px]">
              <p className="text-[8px] text-white/70 uppercase font-bold tracking-widest mb-1">AUM Sync</p>
              <p className="text-xl font-headline font-bold text-white tracking-tighter">€380M</p>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[120px]">
              <p className="text-[8px] text-white/70 uppercase font-bold tracking-widest mb-1">Alignment</p>
              <p className="text-xl font-headline font-bold text-emerald-400 tracking-tighter">84.2%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {/* Timeline Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Generational Trajectory</h2>
              </div>
              <Link href="/heritage-timeline">
                <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest h-7">Full Archive <ChevronRight className="ml-1 h-3 w-3" /></Button>
              </Link>
            </div>
            <Card className="glass-panel border-white/5 shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <ScrollArea className="w-full pb-4">
                  <div className="flex relative">
                    <div className="absolute top-[23px] left-4 right-4 h-0.5 bg-slate-100" />
                    <div className="flex gap-8 min-w-full">
                      {timelineEvents.map((event: any, i: number) => (
                        <div key={i} className="flex flex-col gap-2 min-w-[150px] relative z-10 group">
                          <div className={cn(
                            "text-[8px] font-bold uppercase tracking-widest mb-1",
                            event.status === 'completed' ? 'text-primary' : event.status === 'in-progress' ? 'text-amber-500' : 'text-slate-400'
                          )}>
                            {event.date}
                          </div>
                          <div className={cn(
                            "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all bg-white",
                            event.status === 'completed' ? 'border-primary text-primary' : 
                            event.status === 'in-progress' ? 'border-amber-500 text-amber-500' : 
                            'border-slate-200 text-slate-200'
                          )}>
                            {event.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : 
                             event.status === 'in-progress' ? <Clock className="h-4 w-4 animate-pulse" /> : 
                             <Flag className="h-4 w-4" />}
                          </div>
                          <div className="pt-1">
                            <p className="text-[11px] font-bold text-slate-900 leading-tight">{event.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">{event.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Compass className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Strategic Council Tracks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/chart-room" className="group">
                <Card className="border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all h-full bg-white rounded-3xl">
                  <CardContent className="p-8 space-y-4">
                    <div className="p-2 w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Stress-Test G3 Exposure</h3>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">Analyze a downside scenario on tech-growth holdings to protect core legacy capital.</p>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest gap-2 pt-2">
                      Enter Chart Room <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/vault" className="group">
                <Card className="border-slate-200 shadow-sm hover:shadow-md hover:border-blue-600/30 transition-all h-full bg-white rounded-3xl">
                  <CardContent className="p-8 space-y-4">
                    <div className="p-2 w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Governance Charter</h3>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">Formalize Hartmann industrial norms to resolve authority rifts between generations.</p>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-blue-600 uppercase tracking-widest gap-2 pt-2">
                      Open Strongroom <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          <FamilyCalendar events={MOCK_EVENTS} />
        </div>

        <div className="lg:col-span-4 space-y-10">
          <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Heritage Pulse</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Family Wealth</p>
                  <p className="text-3xl font-headline font-bold text-white tracking-tighter">€380.0M</p>
                </div>
                <Badge variant="outline" className="text-[8px] border-white/10 text-slate-400 font-bold uppercase tracking-widest">Aggregated</Badge>
              </div>
              <div>
                <Link href="/bridge">
                  <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 text-[10px] font-bold uppercase tracking-widest rounded-xl h-11 shadow-lg">
                    Manage Portfolio Axis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AI Captain Component */}
          <Card className="border-slate-200 shadow-lg bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src={captainAvatar?.imageUrl} />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">Talk to the Captain</CardTitle>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase mt-0.5">Strategic Advisor Active</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-slate-600 italic leading-relaxed font-medium">
                Anything on your mind today, {firstName}? Share a thought to update our legacy strategy.
              </p>
              <div className="space-y-3">
                <Textarea 
                  placeholder="Share a vision, worry, or new goal..."
                  className="bg-slate-50 border-slate-100 min-h-[100px] resize-none focus-visible:ring-primary/20 rounded-xl text-xs"
                  value={captainInput}
                  onChange={(e) => setCaptainInput(e.target.value)}
                />
                <Button 
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-10 text-[10px] font-bold uppercase tracking-widest shadow-md"
                  onClick={handleSendToCaptain}
                  disabled={!captainInput.trim()}
                >
                  Discuss with Aivaz <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">AI Intelligence</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Relational Alert</p>
                <p className="text-xs font-semibold leading-relaxed text-slate-700">12% Alignment gap: Risk tolerance variance between G1 and G3.</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10">
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1">Capital Efficiency</p>
                <p className="text-xs font-semibold leading-relaxed text-slate-700">€42M Cash idle in MS Trust. Opportunity cost identified.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
