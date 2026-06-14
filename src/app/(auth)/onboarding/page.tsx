
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { doc, collection, writeBatch, query, where, getDocs, arrayUnion, updateDoc, setDoc } from "firebase/firestore";
import { extractFamilyDNA } from "@/ai/flows/extract-family-dna";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Shield, Sparkles, BrainCircuit, ArrowRight, Loader2, UserCircle2, Landmark, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  {
    id: "gateway",
    title: "Legacy Gateway",
    question: "Do you want to establish a new legacy or join an existing one?",
    type: "choice",
    options: [
      { id: "create", label: "Establish New Legacy", icon: Landmark, description: "Start from scratch as the primary node." },
      { id: "join", label: "Join Existing Legacy", icon: Users, description: "Enter a family invite code to collaborate." }
    ]
  },
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
    id: "accountFor",
    title: "Stakeholder Scope",
    question: "Who is this legacy account primarily for?",
    type: "radio",
    options: [
      { id: "Just me", label: "Individual Principal", icon: UserCircle2, description: "Focused on my personal legacy and planning." },
      { id: "Family", label: "The Whole Family", icon: Sparkles, description: "Collaborative hub for all generational stakeholders." },
      { id: "Trustee", label: "Trust or Trustee", icon: Shield, description: "Management and governance focus for entities." }
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
  const [familyCode, setFamilyCode] = useState("");
  const [joiningFamily, setJoiningFamily] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleNext = async () => {
    // Special validation for joining family
    if (steps[currentStep].id === 'gateway' && answers.gateway === 'join' && !joiningFamily) {
      setLoading(true);
      try {
        const q = query(collection(db, "families"), where("inviteCode", "==", familyCode.toUpperCase()));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          toast({ variant: "destructive", title: "Invalid Code", description: "This invite code does not match any existing heritage node." });
          setLoading(false);
          return;
        }
        const familyDoc = snapshot.docs[0];
        setJoiningFamily({ id: familyDoc.id, ...familyDoc.data() });
        toast({ title: "Node Located", description: `Synchronizing with the ${familyDoc.data().name} legacy.` });
        setCurrentStep(prev => prev + 1);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLoading(true);
      try {
        if (user && db) {
          // 1. Run AI Extraction
          const dnaResult = await extractFamilyDNA({ 
            surveyData: answers,
            userName: user.displayName || undefined
          });

          // 2. Persist to Firestore
          const batch = writeBatch(db);
          
          let targetFamilyId = joiningFamily?.id;

          // If establishing new legacy, create Family document
          if (answers.gateway === 'create') {
            const familyRef = doc(collection(db, "families"));
            targetFamilyId = familyRef.id;
            const newFamilyName = `${dnaResult.familyProfile.familyName || 'Hartmann'} Heritage`;
            batch.set(familyRef, {
              name: newFamilyName,
              inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
              members: [user.uid],
              createdAt: new Date().toISOString()
            });
          } else if (targetFamilyId) {
            // If joining, add UID to existing family members array
            const familyRef = doc(db, "families", targetFamilyId);
            batch.update(familyRef, {
              members: arrayUnion(user.uid)
            });
          }
          
          // User Profile
          const userRef = doc(db, "users", user.uid);
          batch.set(userRef, {
            uid: user.uid,
            hasCompletedProfiling: true,
            familyId: targetFamilyId,
            role: answers.role,
            generationalStage: dnaResult.personalProfile.generationalStage,
            onboardingData: answers,
            updatedAt: new Date().toISOString()
          }, { merge: true });

          // Family DNA (Personalized)
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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 selection:bg-primary/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(75,163,199,0.2)]">
            <BrainCircuit className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-white">Legacy Discovery</h1>
          <p className="text-slate-400 max-w-sm text-sm">Aivaz is synthesizing the human architecture behind your heritage to serve as your strategic partner.</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 px-1">
            <span>Synthesis Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-white/5" />
        </div>

        <Card className="bg-white/[0.02] border-white/5 shadow-2xl backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">{step.title}</span>
            </div>
            <CardTitle className="text-2xl font-headline text-white">{step.question}</CardTitle>
            {joiningFamily && (
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest pt-2 flex items-center gap-2">
                <Shield className="h-3 w-3" /> Linked to: {joiningFamily.name}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {step.id === 'gateway' ? (
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
                      className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] peer-data-[state=checked]:border-primary/50 peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <opt.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-white">{opt.label}</span>
                        <span className="text-xs text-slate-500">{opt.description}</span>
                      </div>
                    </Label>
                  </div>
                ))}

                {answers.gateway === 'join' && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Family Invite Code</Label>
                    <Input 
                      placeholder="e.g. HART-7A"
                      className="mt-2 bg-white/[0.03] border-white/10 text-white rounded-xl h-12 text-center font-mono text-lg tracking-widest uppercase"
                      value={familyCode}
                      onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                    />
                  </div>
                )}
              </RadioGroup>
            ) : step.type === "radio" ? (
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
                      className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] peer-data-[state=checked]:border-primary/50 peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <opt.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-white">{opt.label}</span>
                        <span className="text-xs text-slate-500">{opt.description}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                <Textarea 
                  placeholder={step.placeholder}
                  className="min-h-[180px] bg-white/[0.02] border-white/10 focus-visible:ring-primary/30 rounded-2xl text-white placeholder:text-slate-700"
                  value={answers[step.id] || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-white/5 pt-6 pb-6 px-8">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0 || loading}
              className="text-slate-500 hover:text-white hover:bg-white/5"
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={(step.id === 'gateway' && answers.gateway === 'join' && !familyCode) || (!answers[step.id] && step.id !== 'gateway') || loading}
              className="px-8 rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white font-bold"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synchronizing...</span>
                </div>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? "Complete Synthesis" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-600">
          <Shield className="h-3 w-3" />
          <span>Encrypted Legacy Session</span>
        </div>
      </div>
    </div>
  );
}
