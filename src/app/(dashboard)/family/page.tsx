
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, Mail, ShieldCheck, MoreVertical, Activity, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const hartmannFamily = [
  { 
    name: "Dr. Markus Hartmann", 
    role: "G1 Founder / Principal", 
    status: "Active", 
    alignment: 92,
    location: "Munich",
    avatar: "https://picsum.photos/seed/markus/100/100"
  },
  { 
    name: "Elena Hartmann", 
    role: "G1 / Philanthropy Chair", 
    status: "Engaged", 
    alignment: 88,
    location: "Zurich",
    avatar: "https://picsum.photos/seed/elena/100/100"
  },
  { 
    name: "Sophie Hartmann", 
    role: "G3 / ESG lead", 
    status: "Active", 
    alignment: 65,
    location: "Singapore",
    avatar: "https://picsum.photos/seed/sophie/100/100"
  },
  { 
    name: "Alexander Hartmann", 
    role: "G3 / Tech & Growth", 
    status: "Critical", 
    alignment: 42,
    location: "London",
    avatar: "https://picsum.photos/seed/alexander/100/100"
  },
  { 
    name: "Lina Hartmann", 
    role: "G3 / Next Gen", 
    status: "Onboarding", 
    alignment: 75,
    location: "Munich",
    avatar: "https://picsum.photos/seed/lina/100/100"
  },
  { 
    name: "Robert Chen", 
    role: "Trusted Advisor", 
    status: "Active", 
    alignment: 100,
    location: "Global",
    avatar: "https://picsum.photos/seed/robert/100/100"
  },
];

export default function FamilyPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Ecosystem Overview</Badge>
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Hartmann Family Council</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">The Hartmann Principals</h1>
          <p className="text-muted-foreground italic text-sm">Managing the human architecture behind the €380M industrial legacy.</p>
        </div>
        <Button className="shadow-[0_0_15px_rgba(75,163,199,0.3)]">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Stakeholder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hartmannFamily.map((member) => (
          <Card key={member.name} className="glass-panel border-white/5 hover:border-primary/20 transition-all group overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <Avatar className="h-14 w-14 border border-white/10 group-hover:border-primary/30 transition-all">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">{member.name}</CardTitle>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{member.role}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-[8px] bg-white/5">{member.location}</Badge>
                <div className="p-1 rounded bg-white/5">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest">
                  <span className="text-muted-foreground">Alignment Score</span>
                  <span className={member.alignment < 50 ? 'text-red-500' : 'text-primary'}>{member.alignment}%</span>
                </div>
                <Progress value={member.alignment} className="h-1" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${
                    member.status === 'Active' ? 'bg-emerald-500' : 
                    member.status === 'Engaged' ? 'bg-blue-500' : 
                    member.status === 'Critical' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">{member.status}</span>
                </div>
                <Badge variant="outline" className="text-[8px] bg-primary/5 border-primary/20 uppercase">Auth Level 4</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <Button variant="outline" size="sm" className="text-[10px] h-8 bg-white/5 border-white/10">
                  <Mail className="mr-2 h-3 w-3" /> Secure Message
                </Button>
                <Button variant="outline" size="sm" className="text-[10px] h-8 bg-white/5 border-white/10">
                  <Shield className="mr-2 h-3 w-3" /> Access
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Lock className="h-32 w-32" />
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Privacy Shield Active</span>
          </div>
          <CardTitle className="text-lg">Aggregated Governance Oversight</CardTitle>
          <CardDescription>
            You are viewing aggregated Hartmann family data. Raw individual balances and private holdings remain siloed per the Hartmann Heritage Charter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">Military Grade Encryption</p>
                <p className="text-xs text-muted-foreground">Multi-generational data siloing is strictly enforced. No leakage between G1 and G3 accounts.</p>
              </div>
            </div>
            <Button variant="link" className="text-primary text-xs font-bold uppercase tracking-widest">View Privacy Logs</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
