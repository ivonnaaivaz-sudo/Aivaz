
"use client";

import { useState } from "react";
import { useUser, useDoc } from "@/firebase";
import { wealthScenarioSimulation, type WealthScenarioSimulationOutput } from "@/ai/flows/wealth-scenario-simulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Cpu, Loader2, LineChart, TrendingUp, Landmark, Users, AlertCircle, Sparkles, BrainCircuit } from "lucide-react";

export default function SimulatorPage() {
  const { user } = useUser();
  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WealthScenarioSimulationOutput | null>(null);

  const runSimulation = async () => {
    if (!scenario) return;
    setLoading(true);
    try {
      const output = await wealthScenarioSimulation({
        currentFinancialOverview: "Total portfolio $142M. 60% technology equities, 20% real estate. Current tax bracket 37%. Resident of Florida.",
        familyDNADynamics: dna ? JSON.stringify(dna.personalProfile.psychologicalProfile) : "Founder-led, succession tension detected between G1 and G2.",
        scenarioDescription: scenario
      });
      setResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">Matrix Simulator v2.0</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Generational Simulation Matrix</h1>
        <p className="text-muted-foreground">Simulate the combined impact of financial market events and complex family social dynamics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-panel sticky top-8 border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Scenario Input
              </CardTitle>
              <CardDescription>Define a hybrid event (e.g., a market crash during a succession conflict).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea 
                placeholder="Describe the financial and social scenario..." 
                className="min-h-[200px] bg-white/[0.02] border-white/10 focus-visible:ring-primary/30 text-sm leading-relaxed"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
              />
              
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Legacy Templates</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Tech Rally + G3 Early Payout",
                    "Tax Reform + Trust Dissolution",
                    "Real Estate Crash + Sibling Feud",
                    "IPO Event + Succession Gap",
                    "Global Recession + Philanthropic Pivot"
                  ].map((tag) => (
                    <Button 
                      key={tag} 
                      variant="outline" 
                      size="sm" 
                      className="text-[10px] h-7 px-3 bg-white/5 hover:bg-primary/10 border-white/5"
                      onClick={() => setScenario(`Model a hybrid scenario involving ${tag.toLowerCase()}...`)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full shadow-[0_0_20px_rgba(75,163,199,0.2)] h-12" 
                onClick={runSimulation}
                disabled={loading || !scenario}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cpu className="mr-2 h-4 w-4" />}
                Execute Matrix Simulation
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {!result && !loading ? (
            <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-white/[0.01]">
              <div className="p-4 rounded-full bg-white/5 mb-4">
                <LineChart className="h-10 w-10 opacity-20" />
              </div>
              <p className="text-sm font-medium">Input a hybrid scenario to generate legacy projections</p>
            </div>
          ) : loading ? (
            <div className="h-full min-h-[500px] border border-white/5 rounded-2xl flex flex-col items-center justify-center bg-white/[0.01] space-y-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary/10 animate-ping absolute inset-0" />
                <div className="w-24 h-24 rounded-full border border-primary/20 flex items-center justify-center bg-primary/5">
                  <Cpu className="h-10 w-10 text-primary animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-3 max-w-xs">
                <p className="font-headline font-bold text-2xl tracking-tight">Processing Matrix</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Synthesizing financial liabilities with generational emotional friction points...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel border-primary/20 bg-primary/5">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Projected Wealth</p>
                    <p className="text-2xl font-headline font-bold">{result?.projectedWealth}</p>
                    <TrendingUp className="h-4 w-4 text-primary absolute top-6 right-6" />
                  </CardContent>
                </Card>
                <Card className="glass-panel border-amber-500/20 bg-amber-500/5">
                  <CardContent className="p-6 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/60">Tax & Estate</p>
                    <p className="text-2xl font-headline font-bold">{result?.projectedTaxObligations}</p>
                    <Landmark className="h-4 w-4 text-amber-500 absolute top-6 right-6" />
                  </CardContent>
                </Card>
                <Card className={`glass-panel border-white/10 ${result?.riskLevel === 'Critical' ? 'bg-red-500/5' : ''}`}>
                  <CardContent className="p-6 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Strategic Risk</p>
                    <p className="text-2xl font-headline font-bold">{result?.riskLevel}</p>
                    <AlertCircle className={`h-4 w-4 absolute top-6 right-6 ${result?.riskLevel === 'Critical' ? 'text-red-500' : 'text-muted-foreground'}`} />
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-panel border-white/5 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Simulation Summary</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest border-primary/30 text-primary">AI Synthesis</Badge>
                </div>
                <CardContent className="p-8">
                  <p className="text-lg font-headline font-medium leading-relaxed italic">
                    "{result?.scenarioSummary}"
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Social & Generational Impact
                  </CardTitle>
                  <CardDescription>How this scenario shifts family alignment and legacy stability.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 prose prose-invert max-w-none">
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line font-body">
                      {result?.socialImpactAnalysis}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest" onClick={() => setResult(null)}>Clear Matrix</Button>
                <Button variant="secondary" className="text-[10px] font-bold uppercase tracking-widest h-10 px-6">Share with Advisor</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
