
"use client";

import { useState } from "react";
import { useUser, useDoc } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  FileText, 
  Lock, 
  Download, 
  Upload, 
  FolderPlus,
  Gavel,
  Anchor,
  Scale,
  Scroll,
  BarChart3,
  FileSpreadsheet,
  Activity,
  History,
  Calendar,
  Zap,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const documents = [
  { id: "d1", name: "Hartmann_Legacy_Trust_2024.pdf", type: "Legal", date: "Jan 12, 2026", size: "3.4 MB", security: "High" },
  { id: "d2", name: "Munich_Real_Estate_Q4_Audit.pdf", type: "Investment", date: "Jun 02, 2026", size: "2.1 MB", security: "Medium" },
  { id: "d3", name: "Heritage_Foundation_Bylaws_Swiss.docx", type: "Legal", date: "Aug 21, 2024", size: "1.2 MB", security: "High" },
  { id: "d4", name: "Chemical_Logistics_Valuation_2025.pdf", type: "Finance", date: "Dec 15, 2025", size: "15.8 MB", security: "High" },
  { id: "d5", name: "Identity_Passports_Hartmann_Group.zip", type: "Sensitive", date: "Jun 05, 2026", size: "4.8 MB", security: "Military" },
];

const bedrockDocs = [
  {
    title: "Family Mission Statement",
    icon: Anchor,
    content: "To preserve the Hartmann industrial precision while transitioning to a global institutional legacy, fostering unity through generational transparency.",
    footer: "Finalized Oct 2024 • Immutable"
  },
  {
    title: "Investment Philosophy",
    icon: Scale,
    content: "We prioritize industrial stability and multi-jurisdictional resilience. Our core mandate is to rebalance concentrated holdings while maintaining a €42M stability reserve.",
    footer: "Revised Jun 2026 • Primary Source"
  },
  {
    title: "Core Heritage Values",
    icon: Scroll,
    content: "Precision as security. Industrial heritage as identity. Unified decision-making through the Hartmann Family Council.",
    footer: "Signed by G1 & G3 • Governance Bedrock"
  }
];

const advancedAnalytics = [
  { name: "Aggregate Portfolio Attribution (Oct 2026)", type: "PDF", category: "Performance", size: "5.2 MB", icon: FileText },
  { name: "Hartmann Global Risk Model v4.2", type: "EXCEL", category: "Risk", size: "12.8 MB", icon: FileSpreadsheet },
  { name: "Principal Personal Assets Ledger", type: "EXCEL", category: "Private", size: "2.4 MB", icon: FileSpreadsheet },
  { name: "Currency Stress Test (Asia-EU Axis)", type: "PDF", category: "Risk", size: "1.8 MB", icon: Activity },
];

export default function VaultPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { data: profile } = useDoc(user ? `users/${user.uid}` : null);
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-12-31");

  const userRole = profile?.role || "Principal";
  const isPrincipal = userRole === 'Principal' || userRole === 'Co-Principal';

  const handleDownload = (name: string) => {
    toast({
      title: "Establishing Secure Stream",
      description: `Downloading ${name} via Hartmann Heritage Protocol...`,
    });
  };

  const handleDownloadReasoning = () => {
    toast({
      title: "Reasoning Package Compiled",
      description: `Strategic pairing logic from ${dateFrom} to ${dateTo} is ready for download.`,
    });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Strongroom Level 4</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-slate-900">Strongroom</h1>
          <p className="text-muted-foreground italic text-sm">The encrypted bedrock of Hartmann governance and documentation.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="bg-white border-slate-200 h-10 rounded-xl px-4 text-[11px] font-bold uppercase tracking-widest">
            <FolderPlus className="mr-2 h-4 w-4" /> New Folder
          </Button>
          <Button size="sm" className="shadow-lg h-10 rounded-xl px-6 text-[11px] font-bold uppercase tracking-widest">
            <Upload className="mr-2 h-4 w-4" /> Secure Upload
          </Button>
        </div>
      </div>

      {isPrincipal && (
        <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">Advanced Analytics</h2>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[9px] px-3 py-1 font-bold">
              Principal Oversight
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advancedAnalytics.map((report, i) => (
                  <Card key={i} className="bg-white border-slate-200 hover:border-primary/40 transition-all group cursor-pointer shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors border border-slate-100">
                          <report.icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate text-slate-800">{report.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{report.category}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-full" onClick={() => handleDownload(report.name)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-slate-900 text-white overflow-hidden shadow-xl border-none rounded-2xl">
                <CardHeader className="border-b border-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Strategic Logic Package
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-xs">Download the AI-synthesized reasoning for historical plans.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">From Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input 
                          type="date" 
                          value={dateFrom} 
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="bg-white/5 border-white/10 text-white pl-10 focus:ring-primary/40 rounded-xl h-10 text-sm w-full" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">To Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input 
                          type="date" 
                          value={dateTo} 
                          onChange={(e) => setDateTo(e.target.value)}
                          className="bg-white/5 border-white/10 text-white pl-10 focus:ring-primary/40 rounded-xl h-10 text-sm w-full" 
                        />
                      </div>
                    </div>
                    <Button onClick={handleDownloadReasoning} className="bg-primary hover:bg-primary/90 text-white px-8 rounded-xl h-10 shadow-lg font-bold text-[10px] uppercase tracking-widest w-full">
                      <Download className="mr-2 h-4 w-4" /> Package Logic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-primary" /> Risk Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Portfolio Risk (VaR)", val: "€11.2M", desc: "Estimated monthly drawdown risk." },
                    { label: "Stability Index", val: "0.82", desc: "Low correlation to global volatility." },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{stat.label}</span>
                        <span className="text-sm font-bold text-slate-900">{stat.val}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 italic">{stat.desc}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest border-slate-200 h-10 rounded-xl hover:bg-slate-50 transition-colors">
                    Stress-Test Matrix <ChevronRight className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Digital Vault Document Ledger */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">Encrypted Document Ledger</h2>
          </div>
          <div className="relative w-64">
            <Input placeholder="Search documents..." className="h-8 text-xs pl-8 rounded-lg" />
            <History className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-8">Document Name</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Classification</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vaulted On</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="border-slate-100 group hover:bg-slate-50 transition-colors">
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-primary/20 transition-all">
                        <FileText className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{doc.size}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-slate-50 border-slate-200">
                      {doc.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-medium">{doc.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Lock className={cn(
                        "h-3 w-3",
                        doc.security === 'Military' ? 'text-red-500' : 'text-emerald-500'
                      )} />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{doc.security}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary rounded-full" onClick={() => handleDownload(doc.name)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <Gavel className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">Governance Bedrock</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bedrockDocs.map((doc, i) => (
            <Card key={i} className="bg-white border-slate-200 hover:border-primary/30 transition-all flex flex-col h-full cursor-pointer shadow-sm group rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 relative">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
                  <doc.icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg font-headline font-bold text-slate-800">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="font-serif italic text-base leading-relaxed text-slate-500">
                  {doc.content}
                </p>
              </CardContent>
              <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{doc.footer}</span>
                <Lock className="h-3 w-3 text-slate-200" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-center gap-6">
        <div className="p-3 rounded-full bg-primary/20 shadow-sm">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">Charter Integrity Active</p>
          <p className="text-xs text-slate-500 mt-1">Immutable records serving as the single source of truth for the Hartmann council.</p>
        </div>
        <Button variant="outline" size="sm" className="bg-white border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:text-primary hover:border-primary/30 transition-all rounded-xl h-11 px-8 shadow-sm">
          Audit Ledger
        </Button>
      </div>
    </div>
  );
}
