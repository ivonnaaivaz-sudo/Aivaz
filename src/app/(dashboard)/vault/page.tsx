
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  Search, 
  FileText, 
  Lock, 
  MoreHorizontal, 
  Download, 
  Upload, 
  Grid, 
  List, 
  FolderPlus,
  Eye,
  Gavel,
  Book,
  Anchor,
  Scale,
  Scroll,
  UserPlus,
  Users2,
  Mail,
  ShieldAlert,
  MoreVertical
} from "lucide-react";

const documents = [
  { name: "Aivaz_Irrevocable_Trust_2021.pdf", type: "Legal", date: "Oct 12, 2024", size: "2.4 MB", security: "High" },
  { name: "Global_Strategy_Q3_Review.pdf", type: "Investment", date: "Nov 02, 2024", size: "1.1 MB", security: "Medium" },
  { name: "Heritage_Foundation_Bylaws.docx", type: "Legal", date: "Aug 21, 2024", size: "840 KB", security: "High" },
  { name: "Family_Office_Audit_GS_2023.pdf", type: "Finance", date: "Jan 15, 2024", size: "12.8 MB", security: "High" },
  { name: "Identity_Passports_Principal_Group.zip", type: "Sensitive", date: "Dec 05, 2024", size: "4.2 MB", security: "Military" },
];

const bedrockDocs = [
  {
    title: "Family Mission Statement",
    icon: Anchor,
    content: "To preserve and grow the Aivaz intellectual and financial capital through principled governance, fostering a legacy of innovation and social responsibility across all successive generations.",
    footer: "Finalized Oct 2024 • Immutable"
  },
  {
    title: "Investment Philosophy",
    icon: Scale,
    content: "We prioritize risk-adjusted perpetuity over short-term alpha. Our core mandate is global jurisdictional diversification and the maintenance of a 5% liquidity bridge for generational education and transition.",
    footer: "Revised Nov 2024 • Primary Source"
  },
  {
    title: "Core Heritage Values",
    icon: Scroll,
    content: "Discretion as security. Innovation as survival. Unified decision-making through the Family Council. We view wealth not as an end, but as the infrastructure for human potential.",
    footer: "Signed by G1 & G2 • Governance Bedrock"
  }
];

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

export default function VaultPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("bedrock");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "admin") {
      setActiveTab("admin");
    }
  }, [searchParams]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Strongroom Level 4</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Strongroom</h1>
          <p className="text-muted-foreground">The encrypted bedrock of family governance, administration, and asset documentation.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'admin' ? (
             <Button size="sm" className="shadow-[0_0_15px_rgba(75,163,199,0.3)]">
               <UserPlus className="mr-2 h-4 w-4" /> Invite Stakeholder
             </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="glass-card">
                <FolderPlus className="mr-2 h-4 w-4" /> New Folder
              </Button>
              <Button size="sm" className="shadow-[0_0_15px_rgba(75,163,199,0.3)]">
                <Upload className="mr-2 h-4 w-4" /> Secure Upload
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="bedrock" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
            <Gavel className="mr-2 h-3.5 w-3.5" /> Governance Bedrock
          </TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
            <Users2 className="mr-2 h-3.5 w-3.5" /> Administration
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-white/10 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
            <Book className="mr-2 h-3.5 w-3.5" /> Digital Vault
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bedrock" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bedrockDocs.map((doc, i) => (
              <Card key={i} className="glass-panel border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent group hover:border-primary/20 transition-all flex flex-col h-full">
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-primary/30 transition-colors">
                    <doc.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg font-headline font-bold text-foreground/90">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="font-serif italic text-lg leading-relaxed text-muted-foreground/80">
                    "{doc.content}"
                  </p>
                </CardContent>
                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{doc.footer}</span>
                  <Lock className="h-3 w-3 text-muted-foreground/20" />
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-center gap-6">
            <div className="p-3 rounded-full bg-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Immutable Charter Protocol Active</p>
              <p className="text-xs text-muted-foreground mt-1">These documents serve as the primary source of truth for AI recommendation engine and governance audits.</p>
            </div>
            <Button variant="outline" size="sm" className="bg-white/5 text-[10px] font-bold uppercase tracking-widest">
              Audit Governance History
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="admin" className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
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

            <Card className="glass-panel border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center space-y-4 group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <UserPlus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">Add New Member</p>
                <p className="text-[10px] text-muted-foreground mt-1 px-4">Expand the family lineage or invite a trusted professional advisor.</p>
              </div>
            </Card>
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
                    <ShieldAlert className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Military Grade Encryption Active</p>
                    <p className="text-xs text-muted-foreground">All communications and document access within this administrative track are secured end-to-end.</p>
                  </div>
                </div>
                <Button variant="link" className="text-primary text-xs font-bold uppercase tracking-widest">Audit Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel md:col-span-1 border-white/5">
              <CardHeader>
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-2">
                {[
                  { label: "All Documents", count: 42, active: true },
                  { label: "Trusts & Wills", count: 8, active: false },
                  { label: "Identity Docs", count: 12, active: false },
                  { label: "Real Estate", count: 15, active: false },
                  { label: "Advisor Notes", count: 7, active: false },
                ].map((cat, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    className={`w-full justify-between text-[11px] font-bold py-6 px-4 uppercase tracking-widest ${cat.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5'}`}
                  >
                    {cat.label}
                    <Badge variant="secondary" className="ml-auto text-[9px] font-mono">{cat.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-panel md:col-span-3 border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search secure vault..." className="bg-background/50 border-white/5 pl-10 text-sm h-10" />
                </div>
                <div className="flex border border-white/5 rounded-lg overflow-hidden">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none bg-white/5">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none">
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                          <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{doc.type}</span>
                            <span className="text-muted-foreground opacity-20">•</span>
                            <span className="text-[10px] text-muted-foreground">{doc.date}</span>
                            <span className="text-muted-foreground opacity-20">•</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter ${doc.security === 'Military' ? 'border-primary text-primary shadow-[0_0_8px_rgba(75,163,199,0.3)]' : 'border-white/10'}`}>
                          <Lock className="h-3 w-3 mr-1" /> {doc.security}
                        </Badge>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
