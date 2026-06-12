
"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, writeBatch } from "firebase/firestore";
import { generateFamilyRecommendations } from "@/ai/flows/family-recommendations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ShieldAlert, CheckCircle2, RefreshCw, MessageSquare, ExternalLink, Info, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const MOCK_RECOMMENDATIONS = [
  {
    id: "mock-1",
    title: "Generational Liquidity Bridge",
    description: "Shift 5% of the primary technology equity holdings into a structured G2/G3 educational trust. This buffers against near-term market volatility while ensuring succession capital is ring-fenced from business operations.",
    targetMember: "@Marcus & Next Gen",
    impact: "Strategic Stability",
    category: "Succession",
    priority: "High",
    link: "/strategy",
    createdAt: "2024-11-06T10:00:00.000Z",
    isDemo: true
  },
  {
    id: "mock-2",
    title: "Governance Charter Formalization",
    description: "Your DNA indicates a high alignment but low transparency on risk tolerance. We recommend establishing a formal Family Council charter to define decision-making thresholds for G2 principals.",
    targetMember: "Family Council",
    impact: "Conflict Reduction",
    category: "Governance",
    priority: "Medium",
    link: "/dna",
    createdAt: "2024-11-05T14:30:00.000Z",
    isDemo: true
  },
  {
    id: "mock-3",
    title: "Philanthropic Consolidation",
    description: "Merge the existing private foundations into a single 'Heritage Impact Fund'. This increases administrative efficiency and allows for larger, legacy-defining social impact projects aligned with your core values.",
    targetMember: "@Elena",
    impact: "Efficiency & Brand",
    category: "Philanthropy",
    priority: "Low",
    link: "/vault",
    createdAt: "2024-11-04T09:15:00.000Z",
    isDemo: true
  }
];

export default function InsightsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  
  const recommendationsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "recommendations"), orderBy("createdAt", "desc"));
  }, [user, db]);

  const { data: realRecommendations } = useCollection(recommendationsQuery);

  const isDemoMode = !realRecommendations || realRecommendations.length === 0;
  const recommendations = isDemoMode ? MOCK_RECOMMENDATIONS : realRecommendations;

  const runDiscovery = async () => {
    if (!user || !db) return;
    
    if (!dna) {
      toast({
        variant: "destructive",
        title: "Profiling Required",
        description: "Please complete the Psychological Discovery session to run real AI synthesis.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateFamilyRecommendations({
        familyDNA: dna,
        portfolioSummary: "Aggregate Net Worth: €380M. Commercial Real Estate: 55%, Industrial Chemicals: 25%. Primary owner Dr. Markus (G1) 65%."
      });

      const batch = writeBatch(db);
      result.recommendations.forEach((rec) => {
        const recRef = doc(collection(db, "users", user.uid, "recommendations"));
        batch.set(recRef, {
          ...rec,
          createdAt: new Date().toISOString()
        });
      });
      await batch.commit();

      toast({
        title: "Intelligence Updated",
        description: "Aivaz has synthesized new Hartmann-level recommendations.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Discovery Failed",
        description: "Could not synthesize family intelligence at this time.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDiscuss = async (rec: any) => {
    if (!user || !db) return;
    
    try {
      const msgRef = collection(db, "users", user.uid, "messages");
      await addDoc(msgRef, {
        senderId: user.uid,
        senderName: user.displayName || "Dr. Markus Hartmann",
        text: `Proposed a strategic track for council review: ${rec.title}. Target: ${rec.targetMember}. Focus: ${rec.impact}`,
        type: "recommendation",
        track: "governance",
        recommendationId: rec.id || rec.title,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Shared with Council",
        description: "This recommendation has been opened as a strategic track in the Wardroom.",
      });
      
      router.push("/wardroom");
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!mounted) return "";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">Strategic Discovery</Badge>
            <div className="h-px flex-1 bg-white/5 min-w-[50px]" />
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Intelligence Terminal</h1>
          <p className="text-muted-foreground italic">Actionable, Hartmann-level strategic insights synthesized from your generational DNA.</p>
        </div>
        <Button size="lg" onClick={runDiscovery} disabled={loading} className="shadow-2xl">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Execute Discovery
        </Button>
      </div>

      {isDemoMode && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3 text-amber-500/80 text-sm">
          <Info className="h-4 w-4" />
          <span>Showing Heritage sample data. Complete the Hartmann Discovery to synthesize real generational recommendations.</span>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
            <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5">
              <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-headline font-bold text-xl">Synthesizing Hartmann DNA...</p>
            <p className="text-sm text-muted-foreground">Mapping generational alignment and estate opportunities.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations?.map((rec) => (
          <Card key={rec.id} className={`glass-panel border-white/5 hover:border-primary/20 transition-all flex flex-col group ${rec.isDemo ? 'opacity-80' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest ${rec.priority === 'High' ? 'border-amber-500/50 text-amber-500' : 'text-primary'}`}>
                    {rec.priority} Priority • {rec.category}
                  </Badge>
                  {rec.isDemo && <Badge variant="secondary" className="text-[8px] uppercase tracking-tighter bg-white/5 border-white/10">Heritage Demo</Badge>}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{formatDate(rec.createdAt)}</span>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{rec.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{rec.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Target</p>
                  <p className="text-sm font-bold text-foreground truncate">{rec.targetMember}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Impact</p>
                  <p className="text-sm font-bold text-primary truncate">{rec.impact}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 h-10"
                onClick={() => handleDiscuss(rec)}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Open Strategic Track
              </Button>
              {rec.link && (
                <Button variant="ghost" size="sm" className="px-3 h-10" onClick={() => router.push(rec.link)}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
