
"use client";

import { useState } from "react";
import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Shield, 
  Mail, 
  ShieldCheck, 
  MoreVertical, 
  Activity, 
  Lock, 
  Settings2,
  Key,
  Eye,
  EyeOff
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const INITIAL_MEMBERS = [
  { id: "m1", name: "Dr. Markus Hartmann", role: "Principal", status: "Active", alignment: 92, location: "Munich", avatar: "https://picsum.photos/seed/markus/100/100" },
  { id: "m2", name: "Elena Hartmann", role: "Co-Principal", status: "Engaged", alignment: 88, location: "Zurich", avatar: "https://picsum.photos/seed/elena/100/100" },
  { id: "m3", name: "Sophie Hartmann", role: "Active Member", status: "Active", alignment: 65, location: "Singapore", avatar: "https://picsum.photos/seed/sophie/100/100" },
  { id: "m4", name: "Alexander Hartmann", role: "Active Member", status: "Critical", alignment: 42, location: "London", avatar: "https://picsum.photos/seed/alexander/100/100" },
  { id: "m5", name: "Lina Hartmann", role: "Limited Member", status: "Onboarding", alignment: 75, location: "Munich", avatar: "https://picsum.photos/seed/lina/100/100" },
  { id: "m6", name: "Robert Chen", role: "Advisor/Guest", status: "Active", alignment: 100, location: "Global", avatar: "https://picsum.photos/seed/robert/100/100" },
];

const ROLE_DEFINITIONS = {
  "Principal": "Full access to all accounts, private member data, and the total portfolio architecture.",
  "Co-Principal": "Near full access including cross-member visibility and governance oversight.",
  "Active Member": "Sees aggregate family views, their own private portfolio, and tagged blindspots.",
  "Limited Member": "High-level aggregated family view only. Individual asset details are hidden.",
  "Advisor/Guest": "Scoped access limited to specific assigned tracks and audited documents."
};

export default function FamilyPage() {
  const { user } = useUser();
  const { data: profile } = useDoc(user ? `users/${user.uid}` : null);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);

  // Default to Principal if no profile (for the prototype feel)
  const userRole = profile?.role || "Principal";
  const canManage = userRole === "Principal" || userRole === "Active Member";

  const handleUpdateRole = (id: string, newRole: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    setIsManageOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Ecosystem Overview</Badge>
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Hartmann Family Council</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">The Hartmann Principals</h1>
          <p className="text-muted-foreground italic text-sm">Managing the human architecture and multi-tiered access protocols.</p>
        </div>
        <Button className="shadow-[0_0_15px_rgba(75,163,199,0.3)]">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Stakeholder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member.name} className="glass-panel border-white/5 hover:border-primary/20 transition-all group overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <Avatar className="h-14 w-14 border border-white/10 group-hover:border-primary/30 transition-all">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">{member.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{member.role}</p>
                </div>
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
                {canManage && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[9px] font-bold uppercase tracking-widest text-primary"
                    onClick={() => {
                      setSelectedMember(member);
                      setIsManageOpen(true);
                    }}
                  >
                    <Settings2 className="mr-1 h-3 w-3" /> Manage
                  </Button>
                )}
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
          <CardTitle className="text-lg">Governance Access Protocol</CardTitle>
          <CardDescription>
            Dr. Markus Hartmann (Principal) controls the multi-generational data siloing and encryption levels for the heritage archive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">Institutional Encryption</p>
                <p className="text-xs text-muted-foreground">Limited and Active members are automatically filtered from raw individual account balances.</p>
              </div>
            </div>
            <Button variant="link" className="text-primary text-xs font-bold uppercase tracking-widest">View Access Logs</Button>
          </div>
        </CardContent>
      </Card>

      {/* Role Management Dialog */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">Manage Governance Level</DialogTitle>
            <DialogDescription>
              Adjust heritage access permissions for {selectedMember?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Governance Role</Label>
              <Select defaultValue={selectedMember?.role} onValueChange={(val) => setSelectedMember({...selectedMember, role: val})}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ROLE_DEFINITIONS).map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground italic leading-relaxed mt-2 p-3 bg-muted/30 rounded-lg border border-white/5">
                "{ROLE_DEFINITIONS[selectedMember?.role as keyof typeof ROLE_DEFINITIONS] || "Select a role to see its description."}"
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Granular Overrides</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Visible Member Tags</span>
                  </div>
                  <Switch defaultChecked={selectedMember?.role !== "Limited Member"} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Simulation Authority</span>
                  </div>
                  <Switch defaultChecked={selectedMember?.role === "Principal" || selectedMember?.role === "Co-Principal" || selectedMember?.role === "Active Member"} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsManageOpen(false)} className="text-[11px] uppercase font-bold tracking-widest">Cancel</Button>
            <Button 
              onClick={() => handleUpdateRole(selectedMember.id, selectedMember.role)} 
              className="text-[11px] uppercase font-bold tracking-widest px-8"
            >
              Update Protocol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
