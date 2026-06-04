
"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, serverTimestamp, writeBatch } from "firebase/firestore";
import { generateFamilyRecommendations } from "@/ai/flows/family-recommendations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ShieldAlert, CheckCircle2, RefreshCw, MessageSquare, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function InsightsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  
  const recommendationsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "recommendations"), orderBy("createdAt", "desc"));
  }, [user, db]);

  const { data: recommendations } = useCollection(recommendationsQuery);

  const runDiscovery = async () => {
    if (!user || !db || !dna) return;
    setLoading(true);
    try {
      const result = await generateFamilyRecommendations({
        familyDNA: dna,
        portfolioSummary: "Aggregate Net Worth: $142.4M. Equities: 60%, Real Estate: 20%. Primary owner Julian (G1) 65%, Marcus (G2) 20%."
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
        description: "Aivaz has synthesized new family-level recommendations.",
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
      const msgRef = doc(collection(db, "users", user.uid, "messages"));
      await setDoc(msgRef, {
        senderId: user.uid,
        senderName: user.displayName || "Principal",
        text: `Shared a recommendation: ${rec.title}. Target: ${rec.targetMember}. Impact: ${rec.impact}`,
        type: "recommendation",
        recommendationId: rec.id,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Shared with Family",
        description: "The recommendation has been posted to the Family Group Chat.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">Legacy Intelligence</Badge>
            <div className="h-px flex-1 bg-white/5 min-w-[50px]" />
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">AI Discovery Command</h1>
          <p className="text-muted-foreground">Actionable, family-level strategic insights synthesized from your DNA.</p>
        </div>
        <Button size="lg" onClick={runDiscovery} disabled={loading || !dna} className="shadow-2xl">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Run Legacy Discovery
        </Button>
      </div>

      {!recommendations?.length && !loading && (
        <Card className="glass-panel border-dashed border-white/10 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <CardTitle className="mb-2">No Active Intelligence</CardTitle>
          <CardDescription className="max-w-md mx-auto mb-6">
            Run a Discovery session to generate hyper-personalized recommendations based on your family's unique generational dynamics.
          </CardDescription>
          <Button variant="outline" onClick={runDiscovery}>Initialize Synthesis</Button>
        </Card>
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
            <p className="font-headline font-bold text-xl">Synthesizing DNA & Portfolio...</p>
            <p className="text-sm text-muted-foreground">Aivaz is mapping generational alignment and estate opportunities.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations?.map((rec) => (
          <Card key={rec.id} className="glass-panel border-white/5 hover:border-primary/20 transition-all flex flex-col group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest ${rec.priority === 'High' ? 'border-amber-500/50 text-amber-500' : 'text-primary'}`}>
                  {rec.priority} Priority • {rec.category}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-mono">{new Date(rec.createdAt).toLocaleDateString()}</span>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{rec.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{rec.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Target Stakeholder</p>
                  <p className="text-sm font-bold text-foreground truncate">{rec.targetMember}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Legacy Impact</p>
                  <p className="text-sm font-bold text-primary truncate">{rec.impact}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                onClick={() => handleDiscuss(rec)}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Discuss with Family
              </Button>
              {rec.link && (
                <Button variant="ghost" size="sm" className="px-3" onClick={() => window.location.href = rec.link}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
