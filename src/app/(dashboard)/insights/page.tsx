"use client";

import { useState } from "react";
import { personalizedWealthStrategy, type PersonalizedWealthStrategyOutput } from "@/ai/flows/personalized-wealth-strategy";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react";

export default function InsightsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PersonalizedWealthStrategyOutput | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const output = await personalizedWealthStrategy({
        financialData: "Portfolio value $142M. 26% liquidity. High concentration in tech equity. Irrevocable family trust established 2021. 3 dependent beneficiaries. Tax residency in New York.",
        existingEstatePlan: "Standard will and revocable living trust. No specific provisions for digital assets or cross-border inheritance."
      });
      setResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">Legacy Intelligence</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">AI Discovery Command</h1>
        <p className="text-muted-foreground">Synthesized account analysis for personalized wealth strategies.</p>
      </div>

      {!result && !loading && (
        <Card className="glass-panel border-primary/20 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
          <CardHeader className="relative text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 mx-auto mb-6 shadow-[0_0_30px_rgba(75,163,199,0.2)] group-hover:shadow-[0_0_50px_rgba(75,163,199,0.3)] transition-all">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline mb-2">Initialize Intelligent Discovery</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Aivaz AI will analyze all linked accounts, trust documents, and market data to identify hidden opportunities and estate blind spots.
            </CardDescription>
          </CardHeader>
          <CardFooter className="relative justify-center pb-12">
            <Button size="lg" onClick={generateInsights} className="px-8 shadow-2xl">
              Begin AI Synthesis
            </Button>
          </CardFooter>
        </Card>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Analyzing portfolio data and estate structures...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Strategy Synthesis</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={generateInsights}>
                <RefreshCw className="h-4 w-4 mr-2" /> Re-sync
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm leading-relaxed text-foreground italic">{result.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Strategic Moves
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" /> Estate Blind Spots
                  </h3>
                  <ul className="space-y-2">
                    {result.blindSpots.map((spot, i) => (
                      <li key={i} className="text-sm p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/20 transition-colors">
                        {spot}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}