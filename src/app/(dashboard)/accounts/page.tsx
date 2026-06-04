"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw, ExternalLink } from "lucide-react";

const accounts = [
  { id: 1, name: "Aivaz Family Trust", institution: "Morgan Stanley", balance: "$45,200,000", type: "Irrevocable Trust", status: "Active" },
  { id: 2, name: "Offshore Strategic Reserve", institution: "UBS Zurich", balance: "$28,150,000", type: "Private Banking", status: "Synchronized" },
  { id: 3, name: "Real Estate Holding Co", institution: "Chase Private Client", balance: "$12,400,000", type: "Business Account", status: "Pending" },
  { id: 4, name: "Julian Aivaz Individual Portfolio", institution: "Goldman Sachs", balance: "$56,750,230", type: "Investment Account", status: "Active" },
];

export default function AccountsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Omni-Account Aggregator</h1>
          <p className="text-muted-foreground">Unified visibility into individual and trust accounts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="glass-card">
            <RefreshCw className="mr-2 h-4 w-4" /> Sync All
          </Button>
          <Button size="sm" className="shadow-[0_0_15px_rgba(75,163,199,0.3)]">
            <Plus className="mr-2 h-4 w-4" /> Link Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Accounts", value: "12" },
          { label: "Entities Tracked", value: "4" },
          { label: "Avg Yield", value: "4.2%" },
          { label: "Last Audit", value: "2d ago" }
        ].map((stat, i) => (
          <Card key={i} className="glass-panel">
            <CardContent className="p-4 pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">{stat.label}</p>
              <p className="text-2xl font-headline font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-panel border-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Linked Financial Institutions</CardTitle>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Account Name</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Institution</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Type</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="text-right text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Balance</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((acc) => (
                <TableRow key={acc.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="font-medium py-4">{acc.name}</TableCell>
                  <TableCell className="text-muted-foreground">{acc.institution}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary-foreground font-normal">
                      {acc.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${acc.status === 'Active' || acc.status === 'Synchronized' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-xs">{acc.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-headline font-semibold text-foreground">{acc.balance}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}