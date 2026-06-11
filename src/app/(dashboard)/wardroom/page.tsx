"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Users, Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function WardroomHub() {
  const sections = [
    {
      title: "Family DNA",
      description: "Your synthesized heritage profile. Psychological insights, relational dynamics, and generational history.",
      href: "/dna",
      icon: Fingerprint,
      color: "text-primary",
      detail: "Archive No: AIVAZ-01"
    },
    {
      title: "Family Ecosystem",
      description: "Manage members, stakeholders, and trusted advisors. Control access hierarchy and governance.",
      href: "/family",
      icon: Users,
      color: "text-secondary",
      detail: "12 Entities Synced"
    }
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Family Governance</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight flex items-center gap-4">
          <Fingerprint className="h-10 w-10 text-primary" />
          Wardroom
        </h1>
        <p className="text-xl text-muted-foreground italic font-headline max-w-2xl leading-relaxed">
          The collaborative hub for your family's human architecture, focusing on alignment, trust, and values.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section) => (
          <Link href={section.href} key={section.title} className="group">
            <Card className="glass-panel border-white/5 hover:border-primary/30 transition-all duration-500 h-full flex flex-col overflow-hidden">
              <div className="h-2 w-full bg-primary/10 group-hover:bg-primary/30 transition-colors" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/20 transition-all duration-500`}>
                    <section.icon className={`h-8 w-8 ${section.color}`} />
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest opacity-50">{section.detail}</Badge>
                </div>
                <CardTitle className="text-3xl font-headline group-hover:text-primary transition-colors">{section.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed mt-4">{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-8 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  <Sparkles className="h-4 w-4" /> Synthesis Active
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all">
                  Open Section <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Heart, label: "Emotional Alignment", value: "Medium-High" },
          { icon: ShieldCheck, label: "Succession Readiness", value: "68%" },
          { icon: Sparkles, label: "Intellectual Capital", value: "Strong" },
        ].map((stat, i) => (
          <Card key={i} className="glass-panel">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
                <p className="text-xl font-headline font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
