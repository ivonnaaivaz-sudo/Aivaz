"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Edit3
} from "lucide-react";

const documents = [
  { name: "Hartmann_Legacy_Trust_2024.pdf", type: "Legal", date: "Jan 12, 2026", size: "3.4 MB", security: "High" },
  { name: "Munich_Real_Estate_Q4_Audit.pdf", type: "Investment", date: "Jun 02, 2026", size: "2.1 MB", security: "Medium" },
  { name: "Heritage_Foundation_Bylaws_Swiss.docx", type: "Legal", date: "Aug 21, 2024", size: "1.2 MB", security: "High" },
  { name: "Chemical_Logistics_Valuation_2025.pdf", type: "Finance", date: "Dec 15, 2025", size: "15.8 MB", security: "High" },
  { name: "Identity_Passports_Hartmann_Group.zip", type: "Sensitive", date: "Jun 05, 2026", size: "4.8 MB", security: "Military" },
];

const bedrockDocs = [
  {
    title: "Family Mission Statement",
    icon: Anchor,
    content: "To preserve the Hartmann industrial precision while transitioning to a global institutional legacy, fostering unity through generational transparency and Swiss-influenced governance.",
    footer: "Finalized Oct 2024 • Immutable"
  },
  {
    title: "Investment Philosophy",
    icon: Scale,
    content: "We prioritize industrial stability and multi-jurisdictional resilience. Our core mandate is to rebalance concentrated real estate into liquid global tech infrastructure while maintaining a €42M stability reserve.",
    footer: "Revised Jun 2026 • Primary Source"
  },
  {
    title: "Core Heritage Values",
    icon: Scroll,
    content: "Precision as security. Industrial heritage as identity. Unified decision-making through the Hartmann Family Council. We view our €380M AUM as the infrastructure for future generations.",
    footer: "Signed by G1 & G3 • Governance Bedrock"
  }
];

export default function VaultPage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Strongroom Level 4</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Strongroom</h1>
          <p className="text-muted-foreground">The encrypted bedrock of Hartmann governance and industrial documentation.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="glass-card bg-white/[0.02]">
            <FolderPlus className="mr-2 h-4 w-4" /> New Folder
          </Button>
          <Button size="sm" className="shadow-[0_0_15px_rgba(75,163,199,0.3)]">
            <Upload className="mr-2 h-4 w-4" /> Secure Upload
          </Button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Gavel className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-headline font-bold uppercase tracking-widest text-foreground/80">Governance Bedrock</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bedrockDocs.map((doc, i) => (
            <Card key={i} className="glass-panel border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent group hover:border-primary/20 transition-all flex flex-col h-full cursor-pointer">
              <CardHeader className="pb-4 relative">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-primary/30 transition-colors">
                  <doc.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg font-headline font-bold text-foreground/90">{doc.title}</CardTitle>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="h-4 w-4 text-primary" />
                </div>
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
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Book className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-headline font-bold uppercase tracking-widest text-foreground/80">Digital Vault</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 px-4">Categories</p>
            {[
              { label: "All Documents", count: 58, active: true },
              { label: "Industrial Trusts", count: 14, active: false },
              { label: "Identity Docs", count: 18, active: false },
              { label: "Munich Property", count: 22, active: false },
              { label: "Advisor Notes", count: 12, active: false },
            ].map((cat, i) => (
              <Button 
                key={i} 
                variant="ghost" 
                className={`w-full justify-between text-[11px] font-bold py-6 px-4 uppercase tracking-widest rounded-xl transition-all ${cat.active ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(75,163,199,0.1)]' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
              >
                {cat.label}
                <Badge variant="secondary" className="ml-auto text-[9px] font-mono bg-white/5">{cat.count}</Badge>
              </Button>
            ))}
          </div>

          <Card className="glass-panel md:col-span-3 border-white/5 overflow-hidden flex flex-col bg-black/20">
            <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4 bg-white/[0.02]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search secure vault..." className="bg-background/50 border-white/5 pl-10 text-sm h-10 rounded-lg focus-visible:ring-primary/30" />
              </div>
              <div className="flex border border-white/5 rounded-lg overflow-hidden bg-background/50">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none bg-white/10">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none hover:bg-white/5">
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all shadow-sm">
                        <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{doc.type}</span>
                          <span className="text-muted-foreground opacity-20">•</span>
                          <span className="text-[10px] text-muted-foreground">{doc.date}</span>
                          <span className="text-muted-foreground opacity-20">•</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter h-6 px-2 flex items-center gap-1.5 ${doc.security === 'Military' ? 'border-primary/50 text-primary shadow-[0_0_10px_rgba(75,163,199,0.2)] bg-primary/5' : 'border-white/10 text-muted-foreground'}`}>
                        <Lock className="h-3 w-3" /> {doc.security}
                      </Badge>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary">
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
      </section>

      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-center gap-6 backdrop-blur-md">
        <div className="p-3 rounded-full bg-primary/20 shadow-[0_0_15px_rgba(75,163,199,0.2)]">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Immutable Charter Protocol Active</p>
          <p className="text-xs text-muted-foreground mt-1">These documents and files serve as the immutable source of truth for the Hartmann recommendation engine and generational governance audits.</p>
        </div>
        <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
          Audit Vault History
        </Button>
      </div>
    </div>
  );
}
