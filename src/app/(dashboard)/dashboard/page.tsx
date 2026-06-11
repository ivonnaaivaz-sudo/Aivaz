"use client";

import { useState } from "react";
import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { 
  TrendingUp, 
  ShieldCheck, 
  Globe,
  Calendar as CalendarIcon,
  HeartPulse,
  ChevronDown,
  RefreshCw,
  Lock,
  Sparkles,
  Zap,
  Users,
  BookOpen,
  ArrowRight,
  Activity
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FamilyCalendar, type FamilyEvent } from "@/components/dashboard/FamilyCalendar";

const MOCK_EVENTS: FamilyEvent[] = [
  {
    id: "1",
    title: "Succession Charter Review",
    date: "2024-11-15",
    eventType: "GOVERNANCE",
    priority: "URGENT",
    description: "Final walkthrough of the Gen-2 decision-making framework.",
    memberAccess: ["julian", "marcus"]
  },
  {
    id: "2",
    title: "PE Distribution (Alpine Fund)",
    date: "2024-12-01",
    eventType: "FINANCIAL",
    priority: "NORMAL",
    description: "Quarterly yield distribution scheduled for Aivaz Holding Co.",
    memberAccess: ["julian", "elena"]
  },
  {
    id: "3",
    title: "Family Reunion (Aspen)",
    date: "2024-12-24",
    eventType: "SOCIAL",
    priority: "INFORMATIONAL",
    description: "Annual heritage gathering and philanthropic mission update.",
    memberAccess: ["all"]
  },
  {
    id: "4",
    title: "G2 Transition Workshop",
    date: "2024-11-20",
    eventType: "MILESTONE",
    priority: "URGENT",
    description: "Intensive session for Next Gen leadership preparation.",
    memberAccess: ["marcus", "sarah"]
  },
  {
    id: "5",
    title: "Quarterly Tax Filing",
    date: "2024-11-10",
    eventType: "FINANCIAL",
    priority: "URGENT",
    description: "Consolidated filing for all offshore entities.",
    memberAccess: ["julian", "robert"]
  }
];

const familyPhotos = [
  { id: 1, url: "https://picsum.photos/seed/aspen1/1200/400", title: "Winter Estate 2024", hint: "luxury cabin" },
  { id: 2, url: "https://picsum.photos/seed/yacht/1200/400", title: "Adriatic Expedition", hint: "luxury yacht" },
  { id: 3, url: "https://picsum.photos/seed/london1/1200/400", title: "London Townhouse Gala", hint: "classic architecture" }
];

export default function DashboardPage() {
  const { user } = useUser();
  const { data: dna, loading: dnaLoading } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  const [showEngagement, setShowEngagement] = useState(false);

  if (dnaLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32">
      {/* Hero Media Header */}
      <div className="relative group">
        <Carousel className="w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <CarouselContent>
            {familyPhotos.map((photo) => (
              <CarouselItem key={photo.id}>
                <div className="relative h-[400px] w-full">
                  <Image 
                    src={photo.url} 
                    alt={photo.title} 
                    fill 
                    className="object-cover"
                    data-ai-hint={photo.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <Badge className="mb-2 bg-primary/20 text-primary border-primary/30 backdrop-blur-md">Family Archive</Badge>
                    <h2 className="text-3xl font-headline font-bold text-white drop-shadow-lg">{photo.title}</h2>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Carousel>
      </div>

      {/* Global Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 hover:bg-transparent flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src="https://picsum.photos/seed/family/100/100" />
                  <AvatarFallback>AF</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-bold flex items-center gap-2">
                    {dna?.familyProfile?.familyName || "Aivaz Family"} <ChevronDown className="h-3 w-3" />
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                    Institutional Tier
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-panel w-56">
              <DropdownMenuLabel>Switch Entity</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Aivaz Family Trust</DropdownMenuItem>
              <DropdownMenuItem>Heritage Logistics Co.</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
              <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              All 12 Entities Synced
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              3 Members Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Last Updated</p>
            <p className="text-xs font-medium flex items-center gap-2 justify-end cursor-pointer group">
              Today, 09:42 AM <RefreshCw className="h-3 w-3 text-primary group-hover:rotate-180 transition-transform duration-500" />
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 py-1.5 px-3 rounded-full">
            <Lock className="h-3 w-3" />
            Privacy Mode Active
          </Badge>
        </div>
      </div>

      {/* Executive Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[
          { label: "Net Worth", value: "$142.4M", change: "+2.4%", icon: TrendingUp, color: "text-primary" },
          { label: "Legacy Alignment", value: "78%", change: "Needs Engagement", icon: ShieldCheck, color: "text-amber-500" },
          { label: "Geopolitical Risk", value: "Moderate", change: "Stable", icon: Globe, color: "text-emerald-500" },
          { label: "Next Milestone", value: "Gen-2", change: "Target: 2028", icon: CalendarIcon, color: "text-primary" },
          { label: "Overall Health", value: "84/100", change: "v4.2 Stable", icon: HeartPulse, color: "text-emerald-500" }
        ].map((stat, i) => (
          <Card key={i} className="glass-panel border-white/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stat.value}</div>
              <div className={`text-[9px] font-bold mt-1 uppercase tracking-tighter ${stat.color}/80`}>
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Succession Engagement Module */}
      <Dialog open={showEngagement} onOpenChange={setShowEngagement}>
        <DialogTrigger asChild>
          <Card className="glass-panel border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen className="h-24 w-24" />
            </div>
            <CardContent className="p-8 flex items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Strategic Insight</span>
                </div>
                <h3 className="text-xl font-headline font-bold">Hey, do you want to know some info about organizing better succession legacies?</h3>
                <p className="text-sm text-muted-foreground">Discover the psychological frameworks used by the world's most enduring family offices.</p>
              </div>
              <Button size="icon" className="rounded-full h-12 w-12 shrink-0 shadow-lg">
                <ArrowRight className="h-6 w-6" />
              </Button>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="glass-panel border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Succession Legacy Framework</DialogTitle>
            <DialogDescription>
              Deep-dive into multi-generational stability and intellectual capital growth.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Intellectual Capital", desc: "Prioritize the transfer of wisdom and decision-making frameworks over pure financial assets." },
                { title: "Governance Charters", desc: "Establish formal Family Councils to manage risk tolerance and internal alignment." },
                { title: "G2 Integration", desc: "How to effectively bridge the gap between founder vision and successor operational styles." },
                { title: "Emotional Ownership", desc: "Developing a sense of shared responsibility and brand stewardship within the family." }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="font-bold text-sm mb-1 text-primary">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-4">
              <Zap className="h-6 w-6 text-primary shrink-0" />
              <p className="text-sm italic text-foreground/80">"The greatest risk to a family legacy is not market volatility, but a lack of human-centric governance." — Aivaz Core</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Primary Calendar View */}
      <FamilyCalendar events={MOCK_EVENTS} />

      {/* Persistent Quick Actions Bar */}
      <div className="fixed bottom-0 left-[280px] right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-white/5 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Legacy Ready Actions</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest" asChild>
              <Link href="/simulator">
                <Activity className="mr-2 h-3.5 w-3.5" /> Run New Simulation
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest">
              <BookOpen className="mr-2 h-3.5 w-3.5" /> Generate Charter
            </Button>
            <Button size="sm" className="shadow-lg text-[10px] font-bold uppercase tracking-widest" asChild>
              <Link href="/insights">
                <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Review Alignment Report
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
