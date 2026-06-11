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
  Activity,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FamilyCalendar, type FamilyEvent } from "@/components/dashboard/FamilyCalendar";

const MOCK_EVENTS: FamilyEvent[] = [
  { id: "1", title: "Quarterly Strategy Call", date: "2024-11-12", eventType: "GOVERNANCE", priority: "URGENT", description: "Reviewing year-end tax positions with Robert Chen.", memberAccess: ["Julian", "Marcus", "Robert"] },
  { id: "2", title: "Aivaz Logistics Payout", date: "2024-11-18", eventType: "FINANCIAL", priority: "URGENT", description: "$5.2M Q4 liquidity event distribution.", memberAccess: ["Julian", "Elena"] },
  { id: "june-1", title: "G2 Governance Summit", date: "2026-06-10", eventType: "GOVERNANCE", priority: "URGENT", description: "Finalizing G2 decision thresholds.", memberAccess: ["All Principals"] },
];

const familyPhotos = [
  { id: 1, url: "https://picsum.photos/seed/aspen1/1200/400", title: "Heritage Archive", hint: "luxury cabin" }
];

export default function DashboardPage() {
  const { user } = useUser();
  const { data: dna, loading: dnaLoading } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  if (dnaLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32">
      <div className="relative h-[240px] w-full rounded-3xl overflow-hidden border border-white/5">
        <Image src={familyPhotos[0].url} alt="Aivaz Heritage" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8">
          <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">Aivaz Heritage Repository</Badge>
          <h2 className="text-3xl font-headline font-bold text-white">G2 Transition Command</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { label: "Total AUM", value: "$50.0M", change: "Threshold Met", icon: TrendingUp, color: "text-primary" },
          { label: "Tech Exposure", value: "55%", change: "CONCENTRATED", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Alignment", value: "84.2%", change: "Stable", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "G2 Readiness", value: "Medium", change: "Training Active", icon: HeartPulse, color: "text-primary" },
          { label: "Liquidity", value: "5%", change: "Tight", icon: Activity, color: "text-amber-500" }
        ].map((stat, i) => (
          <Card key={i} className="glass-panel border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stat.value}</div>
              <div className={`text-[9px] font-bold mt-1 uppercase tracking-tighter ${stat.color}/80`}>{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FamilyCalendar events={MOCK_EVENTS} />

      <Card className="glass-panel border-primary/20 bg-primary/5 p-8 flex items-center justify-between group cursor-pointer" asChild>
        <Link href="/academy">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Succession Intelligence</span>
            </div>
            <h3 className="text-xl font-headline font-bold">Review G2 Governance Framework</h3>
            <p className="text-sm text-muted-foreground">Transitioning from Founder-led to Values-based institutional governance.</p>
          </div>
          <Button size="icon" className="rounded-full h-12 w-12"><ArrowRight className="h-6 w-6" /></Button>
        </Link>
      </Card>
    </div>
  );
}
