
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Shield, Sparkles, BrainCircuit, ArrowRight, Loader2 } from "lucide-react";

const steps = [
  {
    id: "stage",
    title: "Generational Context",
    question: "Where does your family currently stand in its wealth journey?",
    options: [
      { id: "gen1", label: "First Generation Founder-Led", description: "Currently building and controlling the primary assets." },
      { id: "gen2", label: "Second Generation Transition", description: "In the process of transferring leadership or assets." },
      { id: "gen3", label: "Multi-Generational Stewardship", description: "Managing legacy across three or more generations." }
    ]
  },
  {
    id: "friction",
    title: "Legacy Psychology",
    question: "What is your primary concern regarding the future of your family legacy?",
    options: [
      { id: "alignment", label: "Successor Alignment", description: "Concern that the next generation doesn't share core family values." },
      { id: "complexity", label: "Asset Complexity", description: "Worried that the structure has become too fragmented to manage." },
      { id: "control", label: "Maintaining Control", description: "Hesitant to relinquish decision-making power." }
    ]
  },
  {
    id: "values",
    title: "Core Drivers",
    question: "What defines 'success' for your family legacy over the next 50 years?",
    options: [
      { id: "growth", label: "Continued Exponential Growth", description: "Expanding the family enterprise and footprint." },
      { id: "harmony", label: "Family Unity & Harmony", description: "Prioritizing relational health over pure financial returns." },
      { id: "impact", label: "Philanthropic Impact", description: "Being defined by social contribution and legacy works." }
    ]
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLoading(true);
      try {
        if (user && db) {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            hasCompletedProfiling: true,
            onboardingData: answers,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          router.push("/portfolio");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(75,163,199,0.2)]">
            <BrainCircuit className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold">Psychological Discovery</h1>
          <p className="text-muted-foreground max-w-sm">Aivaz needs to understand the human architecture behind your wealth to serve as a true legacy partner.</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-muted-foreground px-1">
            <span>Profile Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        <Card className="glass-panel border-white/5 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">{step.title}</span>
            </div>
            <CardTitle className="text-2xl font-headline">{step.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[step.id]} 
              onValueChange={(val) => setAnswers(prev => ({ ...prev, [step.id]: val }))}
              className="space-y-4"
            >
              {step.options.map((opt) => (
                <div key={opt.id} className="relative">
                  <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                  <Label
                    htmlFor={opt.id}
                    className="flex flex-col gap-1 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 peer-data-[state=checked]:border-primary/50 peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <span className="font-bold text-base">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-white/5 pt-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0 || loading}
            >
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!answers[step.id] || loading}
              className="px-8 shadow-xl"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {currentStep === steps.length - 1 ? "Complete Synthesis" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50">
          <Shield className="h-3 w-3" />
          <span>Encrypted Legacy Session</span>
        </div>
      </div>
    </div>
  );
}
