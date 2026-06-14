
"use client";

import { useState, useMemo } from "react";
import { useUser, useDoc, useFirestore } from "@/firebase";
import { doc, updateDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Shield, 
  Mail, 
  ShieldCheck, 
  Settings2,
  Key,
  Eye,
  Activity,
  Lock,
  Copy,
  CheckCircle2,
  RefreshCw
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
import { useToast } from "@/hooks/use-toast";

const INITIAL_MEMBERS = [
  { id: "m1", name: "Dr. Markus Hartmann", role: "Principal", status: "Active", alignment: 92, location: "Munich", avatar: "https://picsum.photos/seed/markus/100/100" },
  { id: "m2", name: "Elena Hartmann", role: "Co-Principal", status: "Engaged", alignment: 88, location: "Zurich", avatar: "https://picsum.photos/seed/elena/100/100" },
  { id: "m3", name: "Sophie Hartmann", role: "Active Member", status: "Active", alignment: 65, location: "Singapore", avatar: "https://picsum.photos/seed/sophie/100/100" },
  { id: "m4", name: "Alexander Hartmann", role: "Active Member", status: "Critical", alignment: 42, location: "London", avatar: "https://picsum.photos/seed/alexander/100/100" },
  { id: "m5", name: "Lina Hartmann", role: "Limited Member", status: "Onboarding", alignment: 75, location: "Munich", avatar: "https://picsum.photos/seed/lina/100/100" },
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
  const db = useFirestore();
  const { toast } = useToast();
  const { data: profile } = useDoc(user ? `users/${user.uid}` : null);
  const { data: family } = useDoc(profile?.familyId ? `families/${profile.familyId}` : null);
  
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  const userRole = profile?.role || "Principal";
  const canManage = userRole === "Principal" || userRole === "Active Member";

  const handleUpdateRole = (id: string, newRole: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    setIsManageOpen(false);
  };

  const handleCopyCode = () => {
    if (family?.inviteCode) {
      navigator.clipboard.writeText(family.inviteCode);
      toast({ title: "Code Copied", description: "Invite code copied to your secure clipboard." });
    }
  };

  const handleGenerateInvite = async () => {
    if (!profile?.familyId) return;
    setGeneratingCode(true);
    try {
      const familyRef = doc(db, "families", profile.familyId);
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await updateDoc(familyRef, { inviteCode: newCode });
      toast({ title: "Invite Established", description: "New alphanumeric code generated for the heritage node." });
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingCode(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">Ecosystem Overview</Badge>
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">{family?.name || "Hartmann Family Council"}</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-slate-900">The Heritage Principals</h1>
          <p className="text-muted-foreground italic text-sm">Managing the human architecture and multi-tiered access protocols.</p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)} className="shadow-xl bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-8 font-bold text-[11px] uppercase tracking-widest">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Stakeholder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member.name} className="border border-slate-200 shadow-sm bg-white hover:border-primary/20 transition-all group overflow-hidden rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <Avatar className="h-14 w-14 border border-slate-100 group-hover:border-primary/30 transition-all">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate group-hover:text-primary transition-colors text-slate-900">{member.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{member.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-[8px] bg-slate-50 border-slate-200 text-slate-500">{member.location}</Badge>
                <div className="p-1 rounded bg-emerald-50">
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
                <Progress value={member.alignment} className="h-1 bg-slate-100" />
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

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" size="sm" className="text-[10px] h-8 bg-white border-slate-200 text-slate-600 rounded-lg">
                  <Mail className="mr-2 h-3 w-3" /> Message
                </Button>
                <Button variant="outline" size="sm" className="text-[10px] h-8 bg-white border-slate-200 text-slate-600 rounded-lg">
                  <Shield className="mr-2 h-3 w-3" /> Access
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-slate-200 shadow-sm bg-white relative overflow-hidden rounded-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900">
          <Lock className="h-32 w-32" />
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Privacy Shield Active</span>
          </div>
          <CardTitle className="text-lg text-slate-900">Governance Access Protocol</CardTitle>
          <CardDescription>
            Dr. Markus Hartmann (Principal) controls the multi-generational data siloing and encryption levels for the heritage archive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">Institutional Encryption</p>
                <p className="text-xs text-slate-500">Limited and Active members are automatically filtered from raw individual account balances.</p>
              </div>
            </div>
            <Button variant="link" className="text-primary text-xs font-bold uppercase tracking-widest">View Access Logs</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invite Stakeholder Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-slate-900">Invite Legacy Member</DialogTitle>
            <DialogDescription>
              Share this secure code with family members to link them to the {family?.name || "Hartmann Heritage"}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-10 flex flex-col items-center gap-6">
            {family?.inviteCode ? (
              <div className="space-y-4 w-full">
                <div className="p-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group hover:border-primary/40 transition-all">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invite Code</p>
                  <p className="text-4xl font-headline font-bold text-primary tracking-tighter">{family.inviteCode}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCopyCode} className="flex-1 rounded-xl h-11 bg-primary text-white font-bold uppercase text-[10px] tracking-widest">
                    <Copy className="mr-2 h-4 w-4" /> Copy Secure Code
                  </Button>
                  <Button variant="outline" onClick={handleGenerateInvite} disabled={generatingCode} className="rounded-xl h-11 border-slate-200 text-slate-400 hover:text-primary px-4">
                    <RefreshCw className={cn("h-4 w-4", generatingCode && "animate-spin")} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
                  <UserPlus className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-sm text-slate-500 px-10">No active invite code found for this heritage node. Generate one below to begin onboarding.</p>
                <Button onClick={handleGenerateInvite} disabled={generatingCode} className="w-full h-11 rounded-xl bg-primary text-white font-bold uppercase text-[10px] tracking-widest shadow-lg">
                  {generatingCode ? "Synchronizing..." : "Establish Invite Protocol"}
                </Button>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
             <Shield className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-amber-700 leading-relaxed font-medium">Codes expire after use or 24 hours. Regenerate to maintain protocol security.</p>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsInviteOpen(false)} className="text-[11px] uppercase font-bold tracking-widest text-slate-400">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Management Dialog */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-slate-900">Manage Governance Level</DialogTitle>
            <DialogDescription>
              Adjust heritage access permissions for {selectedMember?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Governance Role</Label>
              <Select defaultValue={selectedMember?.role} onValueChange={(val) => setSelectedMember({...selectedMember, role: val})}>
                <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ROLE_DEFINITIONS).map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-slate-500 italic leading-relaxed mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                "{ROLE_DEFINITIONS[selectedMember?.role as keyof typeof ROLE_DEFINITIONS] || "Select a role to see its description."}"
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Granular Overrides</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-100">
                      <Eye className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Visible Member Tags</span>
                  </div>
                  <Switch defaultChecked={selectedMember?.role !== "Limited Member"} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-100">
                      <Activity className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Simulation Authority</span>
                  </div>
                  <Switch defaultChecked={selectedMember?.role === "Principal" || selectedMember?.role === "Co-Principal" || selectedMember?.role === "Active Member"} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsManageOpen(false)} className="text-[11px] uppercase font-bold tracking-widest text-slate-400">Cancel</Button>
            <Button 
              onClick={() => handleUpdateRole(selectedMember.id, selectedMember.role)} 
              className="text-[11px] uppercase font-bold tracking-widest px-8 bg-primary text-white rounded-xl h-11 shadow-lg"
            >
              Update Protocol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
