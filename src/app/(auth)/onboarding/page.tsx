
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, collection, writeBatch } from "firebase/firestore";
import { extractFamilyDNA } from "@/ai/flows/extract-family-dna";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Shield, Sparkles, BrainCircuit, ArrowRight, Loader2, UserCircle2 } from "lucide-react";

const steps = [
  {
    id: "role",
    title: "Your Role",
    question: "What is your primary role in the family ecosystem?",
    type: "radio",
    options: [
      { id: "Founder", label: "Founder / Principal", icon: UserCircle2, description: "The primary builder and decision-maker." },
      { id: "Next Generation", label: "Next Generation Successor", icon: Sparkles, description: "Preparing for or managing the transition of leadership." },
      { id: "Advisor", label: "Trusted Family Advisor", icon: Shield, description: "Supporting the family's strategic legacy goals." }
    ]
  },
  {
    id: "locations",
    title: "Geography & Assets",
    question: "Where are the family members and primary assets located?",
    type: "textarea",
    placeholder: "e.g., Family in NY and Singapore, assets in Switzerland and Cayman..."
  },
  {
    id: "friction",
    title: "Current Friction",
    question: "What is the biggest 'headache' or friction point right now?",
    type: "textarea",
    placeholder: "e.g., Hesitation to pass control, conflicting values between generations..."
  },
  {
    id: "priorities",
    title: "Legacy Priorities",
    question: "What defines success for your family over the next 50 years?",
    type: "textarea",
    placeholder: "e.g., Unity, social impact, exponential growth of intellectual capital..."
  },
  {
    id: "overlooked",
    title: "Advisor Gaps",
    question: "What have your traditional advisors (banks, lawyers) overlooked?",
    type: "textarea",
    placeholder: "e.g., They focus on tax but ignore the emotional dynamics between siblings..."
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
          // 1. Run AI Extraction
          const dnaResult = await extractFamilyDNA({ surveyData: answers });

          // 2. Persist to Firestore
          const batch = writeBatch(db);
          
          // User Profile
          const userRef = doc(db, "users", user.uid);
          batch.set(userRef, {
            uid: user.uid,
            hasCompletedProfiling: true,
            role: answers.role,
            onboardingData: answers,
            updatedAt: new Date().toISOString()
          }, { merge: true });

          // Family DNA
          const dnaRef = doc(db, "users", user.uid, "dna", "current");
          batch.set(dnaRef, dnaResult);

          // Initial Timeline Events
          if (dnaResult.initialTimeline) {
            dnaResult.initialTimeline.forEach((event) => {
              const eventRef = doc(collection(db, "users", user.uid, "timeline"));
              batch.set(eventRef, event);
            });
          }

          await batch.commit();
          router.push("/dashboard");
        }
      } catch (e) {
        console.error("Onboarding failed:", e);
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
            {step.type === "radio" ? (
              <RadioGroup 
                value={answers[step.id]} 
                onValueChange={(val) => setAnswers(prev => ({ ...prev, [step.id]: val }))}
                className="grid grid-cols-1 gap-4"
              >
                {step.options?.map((opt) => (
                  <div key={opt.id} className="relative">
                    <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                    <Label
                      htmlFor={opt.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 peer-data-[state=checked]:border-primary/50 peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <opt.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base">{opt.label}</span>
                        <span className="text-xs text-muted-foreground">{opt.description}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                <Textarea 
                  placeholder={step.placeholder}
                  className="min-h-[150px] bg-white/[0.02] border-white/10"
                  value={answers[step.id] || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))}
                />
              </div>
            )}
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
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Extracting DNA...</span>
                </div>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? "Begin Synthesis" : "Continue"}
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
