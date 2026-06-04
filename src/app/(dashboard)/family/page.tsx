
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, Mail, Phone, MoreVertical } from "lucide-react";

const familyMembers = [
  { 
    name: "Julian Aivaz", 
    role: "Principal Founder", 
    status: "Active", 
    email: "julian@aivaz-heritage.com",
    avatar: "https://picsum.photos/seed/julian/100/100"
  },
  { 
    name: "Marcus Aivaz", 
    role: "Next Generation", 
    status: "Engaged", 
    email: "marcus@aivaz-heritage.com",
    avatar: "https://picsum.photos/seed/marcus/100/100"
  },
  { 
    name: "Robert Chen", 
    role: "Trustee / Advisor", 
    status: "Active", 
    email: "robert@global-advisors.com",
    avatar: "https://picsum.photos/seed/robert/100/100"
  },
];

export default function FamilyPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Family Office Ecosystem</h1>
          <p className="text-muted-foreground">Manage family members, stakeholders, and trusted advisors.</p>
        </div>
        <Button className="shadow-[0_0_15px_rgba(75,163,199,0.3)]">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Stakeholder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <Card key={member.name} className="glass-panel border-white/5 hover:border-primary/20 transition-all group">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <Avatar className="h-14 w-14 border border-white/10 group-hover:border-primary/30 transition-all">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{member.name}</CardTitle>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{member.role}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-muted-foreground">{member.status}</span>
                </div>
                <Badge variant="outline" className="text-[9px] bg-primary/5 border-primary/20">Authorized Access</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" size="sm" className="text-[10px] h-8 bg-white/5 border-white/10">
                  <Mail className="mr-2 h-3 w-3" /> Message
                </Button>
                <Button variant="outline" size="sm" className="text-[10px] h-8 bg-white/5 border-white/10">
                  <Shield className="mr-2 h-3 w-3" /> Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Access Control & Governance</CardTitle>
          <CardDescription>Configure hierarchical access for family members and external partners.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">Military Grade Encryption Active</p>
                <p className="text-xs text-muted-foreground">All family communications and documents are secured end-to-end.</p>
              </div>
            </div>
            <Button variant="link" className="text-primary text-xs font-bold uppercase tracking-widest">Audit Logs</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
