
"use client";

import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  AlertTriangle,
  Euro
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FamilyCalendar, type FamilyEvent } from "@/components/dashboard/FamilyCalendar";

const MOCK_EVENTS: FamilyEvent[] = [
  { id: "1", title: "Hartmann Family Council", date: "2026-06-12", eventType: "GOVERNANCE", priority: "URGENT", description: "Reviewing the €42M cash reserve deployment proposal.", memberAccess: ["Dr. Markus", "Elena", "Sophie", "Alexander"] },
  { id: "2", title: "Specialty Chem Dividend", date: "2026-06-25", eventType: "FINANCIAL", priority: "NORMAL", description: "Q2 Dividend distribution for Hartmann Specialty Chem.", memberAccess: ["All Stakeholders"] },
  { id: "3", title: "Heritage Gala Munich", date: "2026-07-15", eventType: "SOCIAL", priority: "NORMAL", description: "Annual family philanthropic event in Munich.", memberAccess: ["All Family"] },
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
        <Image src="https://picsum.photos/seed/munich/1200/400" alt="Hartmann Heritage" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8">
          <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">Hartmann Heritage Deck</Badge>
          <h2 className="text-3xl font-headline font-bold text-white">Command Center</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { label: "Total Hartmann AUM", value: "€380M", change: "Aggregated", icon: TrendingUp, color: "text-primary" },
          { label: "Idle Capital", value: "€42.0M", change: "ALERT", icon: AlertTriangle, color: "text-amber-500" },
          { label: "RE Exposure", value: "55%", change: "Concentrated", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Succession Sync", value: "42%", change: "Needs Action", icon: Activity, color: "text-amber-500" },
          { label: "Compliance Grade", value: "A+", change: "Stable", icon: ShieldCheck, color: "text-emerald-500" }
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

      <Link href="/academy" className="block group">
        <Card className="glass-panel border-primary/20 bg-primary/5 p-8 flex items-center justify-between transition-all hover:bg-primary/10 cursor-pointer">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Strategic Insight</span>
            </div>
            <h3 className="text-xl font-headline font-bold">Review Hartmann Governance Charter</h3>
            <p className="text-sm text-muted-foreground">Transitioning from patriarchal control to institutional value-based decision making.</p>
          </div>
          <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <ArrowRight className="h-6 w-6" />
          </div>
        </Card>
      </Link>
    </div>
  );
}
