"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Eye
} from "lucide-react";

const documents = [
  { name: "Aivaz_Irrevocable_Trust_2021.pdf", type: "Legal", date: "Oct 12, 2024", size: "2.4 MB", security: "High" },
  { name: "Global_Strategy_Q3_Review.pdf", type: "Investment", date: "Nov 02, 2024", size: "1.1 MB", security: "Medium" },
  { name: "Heritage_Foundation_Bylaws.docx", type: "Legal", date: "Aug 21, 2024", size: "840 KB", security: "High" },
  { name: "Family_Office_Audit_GS_2023.pdf", type: "Finance", date: "Jan 15, 2024", size: "12.8 MB", security: "High" },
  { name: "Identity_Passports_Principal_Group.zip", type: "Sensitive", date: "Dec 05, 2024", size: "4.2 MB", security: "Military" },
];

export default function VaultPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Military Grade Security</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Digital Asset Vault</h1>
          <p className="text-muted-foreground">Secure, encrypted repository for critical family documentation.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="glass-card">
            <FolderPlus className="mr-2 h-4 w-4" /> New Folder
          </Button>
          <Button size="sm" className="shadow-[0_0_15px_rgba(75,163,199,0.3)]">
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-panel md:col-span-1 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Categories</CardTitle>
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
                className={`w-full justify-between text-xs font-medium py-6 px-4 ${cat.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              >
                {cat.label}
                <Badge variant="secondary" className="ml-auto text-[10px]">{cat.count}</Badge>
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
                        <span className="text-[10px] text-muted-foreground">{doc.size}</span>
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
    </div>
  );
}