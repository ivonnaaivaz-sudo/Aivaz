
"use client";

import { useState } from "react";
import { wealthScenarioSimulation, type WealthScenarioSimulationOutput } from "@/ai/flows/wealth-scenario-simulation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Cpu, Loader2, LineChart, TrendingUp, Landmark, Calculator, Users } from "lucide-react";

export default function SimulatorPage() {
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WealthScenarioSimulationOutput | null>(null);

  const runSimulation = async () => {
    if (!scenario) return;
    setLoading(true);
    try {
      const output = await wealthScenarioSimulation({
        currentFinancialOverview: "Total portfolio $142M. 60% technology equities, 20% real estate, 20% fixed income. Current tax bracket 37%. Resident of Florida.",
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Generational Simulation Matrix</h1>
        <p className="text-muted-foreground">AI-driven modeling for financial outcomes, tax implications, and family social dynamics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-panel sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Input Scenario</CardTitle>
              <CardDescription>Describe a market event or a family social dynamic transition.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="e.g., 'Model a 20% market downturn alongside a 3rd generation succession conflict...'" 
                className="min-h-[150px] bg-background/50 border-white/10"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {['Inflation Spike', 'Tech Rally', 'Tax Reform', 'Trust Dissolution', 'Family Feud', 'Succession Gap'].map((tag) => (
                  <Button 
                    key={tag} 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-7 px-2"
                    onClick={() => setScenario(`Model a scenario focusing on ${tag.toLowerCase()}...`)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              <Button 
                className="w-full shadow-lg mt-4" 
                onClick={runSimulation}
                disabled={loading || !scenario}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cpu className="mr-2 h-4 w-4" />}
                Execute Matrix Simulation
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {!result && !loading ? (
            <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-white/[0.02]">
              <LineChart className="h-12 w-12 mb-4 opacity-20" />
              <p>Enter a scenario to begin simulation</p>
            </div>
          ) : loading ? (
            <div className="h-full min-h-[400px] border-2 border-white/5 rounded-2xl flex flex-col items-center justify-center bg-white/[0.02] space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
                <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
                  <Cpu className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="font-headline font-semibold text-lg">AI Matrix Processing</p>
                <p className="text-sm text-muted-foreground">Calculating financial projections and family dynamic impacts...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="glass-panel border-primary/10">
                <CardHeader>
                  <Badge className="w-fit mb-2">Matrix Output</Badge>
                  <CardTitle className="text-2xl">{result?.scenarioSummary}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Projected Wealth</span>
                    </div>
                    <p className="text-xl font-headline font-bold">{result?.projectedWealth}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Landmark className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Tax Obligations</span>
                    </div>
                    <p className="text-xl font-headline font-bold">{result?.projectedTaxObligations}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Generational Impact Analysis</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {result?.impactAnalysis}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
