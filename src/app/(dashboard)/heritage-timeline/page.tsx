
"use client";

import { useUser, useFirestore, useCollection } from "@/firebase";
import { useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  History, 
  Landmark, 
  Globe, 
  ShieldCheck, 
  Anchor, 
  Scale, 
  ScrollText,
  Quote
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const HARTMANN_ARCHIVE = [
  {
    year: "1992",
    milestone: "Foundation of Hartmann Specialty Chem",
    significance: "We established our independent path in a small Munich workspace. This was more than a business; it was Markus building a stable hearth for Elena and the future of our name.",
    type: "financial",
    status: "completed"
  },
  {
    year: "2008",
    milestone: "The Singapore Strategic Pivot",
    significance: "As our horizons broadened, we reached into Asian markets. This period marked our family's transition from a regional German entity to a global heritage node.",
    type: "vision",
    status: "completed"
  },
  {
    year: "2024",
    milestone: "Securing the G2 Educational Path",
    significance: "We formally capitalized the trusts for Sophie and Alexander. Our objective was to ensure they had the freedom to innovate while remaining anchored by our foundational security.",
    type: "succession",
    status: "completed"
  },
  {
    year: "2026",
    milestone: "Formalization of the Family Council",
    significance: "Current Phase: We are moving from a single-pillar leadership to a shared vault of responsibility. This ensures our values outlast any single individual.",
    type: "succession",
    status: "in-progress"
  },
  {
    year: "2027",
    milestone: "Launch of the Hartmann Heritage Foundation",
    significance: "Our Target: Establishing a permanent vehicle for our philanthropic values, ensuring our success leaves a meaningful footprint on the world.",
    type: "philanthropy",
    status: "target"
  }
];

export default function HeritageTimelinePage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const timelineQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "timeline"), orderBy("date", "asc"));
  }, [user, db]);
  
  const { data: realEvents, loading } = useCollection(timelineQuery);

  // For this high-fidelity view, we prioritize the Archivist's curated narrative
  const archiveItems = HARTMANN_ARCHIVE;

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-32 animate-in fade-in duration-700">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-10">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 tracking-[0.2em] font-bold uppercase text-[9px] px-3">
            Archive Node 01
          </Badge>
          <span className="text-slate-300">|</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocol: The Hartmann Standard</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-5xl font-bold tracking-tighter text-slate-900">Our Heritage Journey</h1>
          <p className="text-xl text-slate-500 italic font-serif max-w-3xl leading-relaxed">
            "We preserve not just the capital, but the character that created it."
          </p>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">The Hartmann Chronology</h2>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-3xl">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="w-[120px] text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-8 py-6">Year</TableHead>
                <TableHead className="w-[300px] text-[10px] font-bold uppercase tracking-widest text-slate-400">Milestone</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pr-8">Family Significance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archiveItems.map((item, i) => (
                <TableRow key={i} className="border-slate-100 group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-8 py-8 align-top">
                    <span className="font-headline font-bold text-xl text-slate-900">{item.year}</span>
                  </TableCell>
                  <TableCell className="py-8 align-top">
                    <div className="space-y-2">
                      <p className="font-bold text-slate-800 leading-snug">{item.milestone}</p>
                      <Badge variant="outline" className="text-[8px] uppercase tracking-tighter opacity-50 px-2 py-0 border-slate-200">
                        {item.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="pr-8 py-8 align-top">
                    <p className="font-serif text-base leading-relaxed text-slate-600 italic">
                      {item.significance}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-slate-900 text-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <ScrollText className="h-24 w-24" />
          </div>
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Legacy Note: Risk Philosophy</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-4">
            <p className="text-lg font-serif italic leading-relaxed text-slate-300">
              "The stability we cultivated in the 1990s was a response to the fragmentation we witnessed elsewhere. This history is why we maintain a Low/Preservation appetite today—we build for centuries, not quarters."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Informs: Psychological Architecture</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white rounded-3xl flex flex-col justify-center p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto">
            <Anchor className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-headline font-bold text-xl text-slate-900">Archival Integrity</h3>
            <p className="text-sm text-slate-500 leading-relaxed px-6">
              Our history is synchronized across all Hartmann nodes. These records serve as the single source of truth for our Family Council.
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Immutable Ledger</span>
            <ShieldCheck className="h-4 w-4" />
          </div>
        </Card>
      </div>
    </div>
  );
}
