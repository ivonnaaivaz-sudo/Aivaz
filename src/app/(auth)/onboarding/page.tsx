
"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useStorage } from "@/firebase";
import { doc, collection, writeBatch, query, where, getDocs, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { extractFamilyDNA } from "@/ai/flows/extract-family-dna";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Sparkles, 
  BrainCircuit, 
  ArrowRight, 
  Loader2, 
  Landmark, 
  Users, 
  Camera,
  ImagePlus,
  User,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

// Hartmann Seed Data - The "Hartmann Standard"
const HARTMANN_SEED = {
  dna: {
    personalProfile: {
      roleInFamily: "Principal Founder",
      generationalStage: "1st Generation (G1)",
      primaryLocation: "Munich, Germany",
      otherLocations: ["Singapore", "London", "Zurich"],
      psychologicalProfile: {
        biggestHeadache: "Fragmentation of authority and the tension between traditional industrial values and G3's push for ESG and tech-led growth.",
        currentPriorities: ["Consolidation of €42M idle cash", "Formalizing the Hartmann Family Charter", "Resolving the Asia vs. Europe relocation debate"],
        emotionalFrictionPoints: ["Dr. Markus's control-oriented management vs. Sophie's impact-driven autonomy", "Alexander's high-risk tech appetite vs. family capital preservation"],
        advisorBlindSpots: ["Advisors focus on tax structures in Luxembourg but ignore the deep emotional rift regarding the family's geographic future."]
      },
      financialSnapshot: {
        estimatedNetWorth: "€380M (Aggregated)",
        primaryAssetClasses: ["Commercial Real Estate", "Chemical Manufacturing", "Private Equity"]
      },
      aiSummary: "The Hartmann legacy is at a pivotal crossroads. Dr. Markus Hartmann's industrial era is transitioning into a fragmented global portfolio, requiring a move from patriarch-led control to institutional governance."
    },
    familyProfile: {
      familyName: "Hartmann Heritage",
      currentGenerationalStage: "1st Generation Transitioning to 3rd",
      geographicFootprint: ["Germany", "Singapore", "United Kingdom", "Switzerland", "Cayman Islands"],
      wealthSource: "Specialty Chemicals & Industrial Infrastructure",
      estimatedTotalNetWorth: "€380M",
      history: {
        summary: "Founded in Munich by Dr. Markus Hartmann, the family wealth grew from a specialized chemicals firm into a diversified industrial and real estate empire.",
        keyHoldings: ["Hartmann Specialty Chem", "Munich-Singapore Real Estate Trust"],
        notableTransitions: ["1992 Foundation", "2008 Singapore Expansion", "2024 Institutional Pivot"]
      },
      relationalDynamics: {
        keyFrictionPoints: ["Succession transparency between G1 and G2", "Risk tolerance variance", "Geographic relocation"],
        alignmentLevel: "Medium-High",
        successionReadinessScore: 42
      },
      familyLegacyNarrative: "The Hartmann family represents the quintessential European industrial legacy facing the complexity of the 21st century. Their DNA is a blend of traditional German precision and emerging global impacts."
    }
  },
  timeline: [
    { title: "Foundation of Hartmann Specialty Chem", date: "1992", type: "financial", status: "completed", description: "Established our independent path in Munich." },
    { title: "Singapore Strategic Pivot", date: "2008", type: "vision", status: "completed", description: "Expansion into Asian markets." },
    { title: "Securing G2 Trusts", date: "2024", type: "succession", status: "completed", description: "Formal capitalization of family trusts." },
    { title: "Family Council Formalization", date: "2026", type: "succession", status: "in-progress", description: "Transition to shared governance." },
    { title: "Hartmann Heritage Foundation", date: "2027", type: "philanthropy", status: "target", description: "Establishment of a permanent philanthropic vehicle." }
  ],
  assets: [
    { name: "Hartmann Specialty Chem", type: "Other", appraisalValue: 95000000, location: "Munich, Germany", description: "Core industrial business.", documentCount: 12 },
    { name: "Munich-Singapore Property Trust", type: "Real Estate", appraisalValue: 171000000, location: "Global", description: "Diversified real estate holdings.", documentCount: 24 }
  ]
};

type Step = {
  id: string;
  title: string;
  question: string;
  type: "choice" | "radio" | "multi-select" | "textarea" | "input" | "image-picker" | "personal-details";
  options?: { id: string; label: string; icon?: any; description?: string }[];
  placeholder?: string;
  branch?: string;
  condition?: (answers: Record<string, any>) => boolean;
  maxSelect?: number;
  optional?: boolean;
};

const allSteps: Step[] = [
  {
    id: "gateway",
    title: "Legacy Gateway",
    question: "How would you like to start your journey?",
    type: "choice",
    options: [
      { id: "create", label: "Establish New Legacy", icon: Landmark, description: "Start from scratch as the primary node." },
      { id: "join", label: "Join Existing Legacy", icon: Users, description: "Enter a family invite code to collaborate." }
    ]
  },
  {
    id: "origin",
    title: "Family Roots",
    question: "Where is your family primarily established?",
    type: "input",
    placeholder: "e.g. Munich, Germany (Optional)",
    optional: true
  },
  {
    id: "company",
    title: "Legacy Enterprise",
    question: "What is the name of your primary family business?",
    type: "input",
    placeholder: "Company name (Optional)",
    optional: true
  },
  {
    id: "ai_consent",
    condition: (ans) => !!ans.company && ans.company.length > 2,
    title: "Intelligence Protocol",
    question: "Authorize AI Synthesis?",
    type: "choice",
    options: [
      { id: "authorized", label: "Authorize AI Analysis", icon: BrainCircuit, description: "Allow Aivaz to scan public records for your enterprise." },
      { id: "manual", label: "Manual Entry Only", icon: Shield, description: "Restrict AI logic to data provided strictly within this session." }
    ]
  },
  {
    id: "q1",
    title: "Core Identity",
    question: "Which generation best describes your position in the family’s journey?",
    type: "radio",
    options: [
      { id: "First Generation", label: "First Generation (Founder / Creator)" },
      { id: "Second Generation", label: "Second Generation" },
      { id: "Third Generation or Later", label: "Third Generation or Later" }
    ]
  },
  {
    id: "q2",
    title: "Core Identity",
    question: "What best describes your current role?",
    type: "radio",
    options: [
      { id: "Principal", label: "Principal / Primary decision maker" },
      { id: "Spouse", label: "Spouse / Partner" },
      { id: "Adult Child", label: "Adult Child / Next-Gen" },
      { id: "Other", label: "Other" }
    ]
  },
  // Branch A: Founder
  {
    id: "q3A",
    branch: "First Generation",
    title: "Strategic Focus",
    question: "Which of these has taken up most of your mental energy recently? (Top 2)",
    type: "multi-select",
    maxSelect: 2,
    options: [
      { id: "preserving", label: "Protecting and preserving what we built" },
      { id: "growing", label: "Growing the wealth further" },
      { id: "succession", label: "Preparing the next gen for succession" },
      { id: "risk", label: "Minimizing taxes and risks" }
    ]
  },
  {
    id: "q4A",
    branch: "First Generation",
    title: "Decision Logic",
    question: "What usually guides your major financial decisions? (Top 2)",
    type: "multi-select",
    maxSelect: 2,
    options: [
      { id: "stability", label: "Capital preservation and stability" },
      { id: "growth", label: "Long-term growth potential" },
      { id: "control", label: "Maintaining family control and privacy" },
      { id: "harmony", label: "Family harmony and unity" }
    ]
  },
  // Branch B: Second Gen
  {
    id: "q3B",
    branch: "Second Generation",
    title: "Role Dynamics",
    question: "What has been the most challenging part of your role between generations?",
    type: "multi-select",
    options: [
      { id: "respect", label: "Balancing respect for parents' views with own" },
      { id: "visibility", label: "Getting sufficient visibility into assets" },
      { id: "alignment", label: "Aligning with siblings" },
      { id: "identity", label: "Defining own financial identity" }
    ]
  },
  {
    id: "q4B",
    branch: "Second Generation",
    title: "Reflections",
    question: "Thinking about past decisions, what felt right and what felt difficult?",
    type: "textarea",
    placeholder: "Share your perspective..."
  },
  // Branch C: Third Gen
  {
    id: "q3C",
    branch: "Third Generation or Later",
    title: "Transparency",
    question: "How much visibility do you currently have into the family wealth?",
    type: "radio",
    options: [
      { id: "limited", label: "Very limited / Almost none" },
      { id: "partial", label: "Partial visibility" },
      { id: "good", label: "Good visibility" }
    ]
  },
  {
    id: "q4C",
    branch: "Third Generation or Later",
    condition: (ans) => ans.q3C !== "good",
    title: "Friction Points",
    question: "Which of these have you experienced?",
    type: "multi-select",
    options: [
      { id: "frustration", label: "Frustration with lack of transparency" },
      { id: "views", label: "Different investment views from parents" },
      { id: "involvement", label: "Desire for more involvement in decisions" },
      { id: "inheritance", label: "Concerns about how inheritance is handled" }
    ]
  },
  // Universal
  {
    id: "q6",
    title: "Decision Architecture",
    question: "How are major wealth decisions typically made in your family?",
    type: "radio",
    options: [
      { id: "One person", label: "One person decides most things" },
      { id: "Small group", label: "A small group discusses and decides" },
      { id: "Collaborative/Tense", label: "Collaborative but can be tense" },
      { id: "Fragmented", label: "Quite fragmented" }
    ]
  },
  {
    id: "q7",
    title: "Risk Profile",
    question: "How would you describe your comfort with investment risk?",
    type: "radio",
    options: [
      { id: "stability", label: "Prefer stability and sleep-well-at-night" },
      { id: "balanced", label: "Balanced – some growth with caution" },
      { id: "risk", label: "Comfortable with higher risk for higher returns" }
    ]
  },
  {
    id: "q8",
    title: "Objectives",
    question: "What is one thing you hope AIVAZ will help your family with?",
    type: "textarea",
    placeholder: "e.g. Unified planning, smoother succession..."
  },
  {
    id: "personal_details",
    title: "Identification",
    question: "Finalize your Principal record.",
    type: "personal-details"
  },
  {
    id: "visuals",
    title: "Visual Identity",
    question: "Personalize your heritage node.",
    type: "image-picker",
    optional: true
  }
];

export default function OnboardingPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [familyCode, setFamilyCode] = useState("");
  const [joiningFamily, setJoiningFamily] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [dashboardBg, setDashboardBg] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const brandLogo = PlaceHolderImages.find(img => img.id === 'brand-logo');
  const currentStep = allSteps[currentStepIndex];

  const getNextValidStepIndex = (fromIndex: number, currentAnswers: any) => {
    for (let i = fromIndex + 1; i < allSteps.length; i++) {
      const step = allSteps[i];
      if (step.branch && !currentAnswers.q1?.startsWith(step.branch)) continue;
      if (step.condition && !step.condition(currentAnswers)) continue;
      return i;
    }
    return -1;
  };

  const getPrevValidStepIndex = (fromIndex: number, currentAnswers: any) => {
    for (let i = fromIndex - 1; i >= 0; i--) {
      const step = allSteps[i];
      if (step.branch && !currentAnswers.q1?.startsWith(step.branch)) continue;
      if (step.condition && !step.condition(currentAnswers)) continue;
      return i;
    }
    return 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'bg') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') {
        setProfilePhoto(file);
        setProfilePreview(reader.result as string);
      } else {
        setDashboardBg(file);
        setBgPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleMultiSelect = (stepId: string, optionId: string, max?: number) => {
    const current = answers[stepId] || [];
    let next;
    if (current.includes(optionId)) {
      next = current.filter((id: string) => id !== optionId);
    } else {
      if (max && current.length >= max) return;
      next = [...current, optionId];
    }
    setAnswers({ ...answers, [stepId]: next });
  };

  const handleNext = async () => {
    if (currentStep.id === 'gateway' && answers.gateway === 'join' && !joiningFamily) {
      setLoading(true);
      try {
        const uppercaseCode = familyCode.toUpperCase();
        if (uppercaseCode === 'HARTMANN-1987') {
          setJoiningFamily({ id: 'legacy-hartmann-1987', name: 'Hartmann Heritage', isSeed: true });
          toast({ title: "Archival Code Accepted", description: "Synchronizing with the Hartmann Heritage vault." });
          setCurrentStepIndex(getNextValidStepIndex(currentStepIndex, answers));
        } else {
          const q = query(collection(db, "families"), where("inviteCode", "==", uppercaseCode));
          const snapshot = await getDocs(q);
          if (snapshot.empty) {
            toast({ variant: "destructive", title: "Invalid Code", description: "This invite code does not match any existing heritage node." });
            setLoading(false);
            return;
          }
          const familyDoc = snapshot.docs[0];
          setJoiningFamily({ id: familyDoc.id, ...familyDoc.data() });
          toast({ title: "Node Located", description: `Synchronizing with the ${familyDoc.data().name} legacy.` });
          setCurrentStepIndex(getNextValidStepIndex(currentStepIndex, answers));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
      return;
    }

    const nextIndex = getNextValidStepIndex(currentStepIndex, answers);
    if (nextIndex !== -1) {
      setCurrentStepIndex(nextIndex);
    } else {
      setLoading(true);
      try {
        if (user && db) {
          // Trigger synthesis for non-seed users
          let dnaResult = null;
          if (!joiningFamily?.isSeed) {
            dnaResult = await extractFamilyDNA({ 
              surveyData: answers,
              userName: answers.fullName || user.displayName || undefined
            });
          }

          let profileUrl = null;
          let bgUrl = null;

          if (profilePhoto) {
            const profileRef = ref(storage, `users/${user.uid}/profile-photo.jpg`);
            await uploadBytes(profileRef, profilePhoto);
            profileUrl = await getDownloadURL(profileRef);
          }

          if (dashboardBg) {
            const bgRef = ref(storage, `users/${user.uid}/dashboard-background.jpg`);
            await uploadBytes(bgRef, dashboardBg);
            bgUrl = await getDownloadURL(bgRef);
          }

          const batch = writeBatch(db);
          let targetFamilyId = joiningFamily?.id;

          if (answers.gateway === 'create') {
            const familyRef = doc(collection(db, "families"));
            targetFamilyId = familyRef.id;
            batch.set(familyRef, {
              name: `${dnaResult?.familyProfile?.familyName || 'Family'} Heritage`,
              inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
              members: [user.uid],
              createdAt: new Date().toISOString()
            });
          } else if (targetFamilyId) {
            const familyRef = doc(db, "families", targetFamilyId);
            if (joiningFamily?.isSeed) {
               batch.set(familyRef, {
                 name: 'Hartmann Heritage',
                 inviteCode: 'HARTMANN-1987',
                 members: arrayUnion(user.uid),
                 createdAt: new Date().toISOString()
               }, { merge: true });
            } else {
              batch.update(familyRef, { members: arrayUnion(user.uid) });
            }
          }
          
          const userRef = doc(db, "users", user.uid);
          batch.set(userRef, {
            uid: user.uid,
            displayName: answers.fullName || user.displayName,
            hasCompletedProfiling: true,
            familyId: targetFamilyId,
            role: answers.q2,
            dob: answers.dob,
            onboardingData: answers,
            profilePhotoUrl: profileUrl,
            dashboardBackgroundUrl: bgUrl,
            updatedAt: new Date().toISOString()
          }, { merge: true });

          const dnaRef = doc(db, "users", user.uid, "dna", "current");
          const finalDna = joiningFamily?.isSeed ? HARTMANN_SEED.dna : dnaResult;
          batch.set(dnaRef, finalDna);

          // Seed sub-collections
          if (joiningFamily?.isSeed) {
            HARTMANN_SEED.timeline.forEach((event) => {
              const eventRef = doc(collection(db, "users", user.uid, "timeline"));
              batch.set(eventRef, event);
            });
            HARTMANN_SEED.assets.forEach((asset) => {
              const assetRef = doc(collection(db, "users", user.uid, "assets"));
              batch.set(assetRef, asset);
            });
          } else if (dnaResult?.initialTimeline) {
            dnaResult.initialTimeline.forEach((event) => {
              const eventRef = doc(collection(db, "users", user.uid, "timeline"));
              batch.set(eventRef, event);
            });
          }

          await batch.commit();
          router.push("/dashboard");
        }
      } catch (e) {
        console.error("Synthesis failed:", e);
        toast({ variant: "destructive", title: "Synthesis Error", description: "Could not finalize legacy profile." });
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex(getPrevValidStepIndex(currentStepIndex, answers));
  };

  const nextStepPossible = getNextValidStepIndex(currentStepIndex, answers) !== -1;
  const progress = ((currentStepIndex + 1) / allSteps.length) * 100;

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 selection:bg-primary/30 antialiased font-body">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="mx-auto w-24 h-24 rounded-full bg-[#020617] border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(75,163,199,0.1)] overflow-hidden relative">
            {brandLogo && (
              <Image 
                src={brandLogo.imageUrl} 
                alt="Aivaz Logo" 
                fill
                className="object-cover scale-150"
                priority
              />
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Legacy Discovery</h1>
            <p className="text-slate-400 max-w-sm text-sm">Let's get to know your family's unique architecture.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 px-1">
            <span>Synthesis Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-white/5" />
        </div>

        <Card className="bg-white/[0.02] border-white/5 shadow-2xl backdrop-blur-xl rounded-3xl overflow-hidden relative">
          <CardHeader className="space-y-1 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">
                  {currentStep.title} {currentStep.optional && "(Optional)"}
                </span>
              </div>
            </div>
            <CardTitle className="text-2xl font-headline text-white leading-tight mt-2">{currentStep.question}</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {currentStep.type === "personal-details" ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Principal Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                      placeholder="e.g. Dr. Markus Hartmann"
                      className="pl-12 h-12 bg-white/[0.03] border-white/10 text-white rounded-xl"
                      value={answers.fullName || ""}
                      onChange={(e) => setAnswers({...answers, fullName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                      type="date"
                      className="pl-12 h-12 bg-white/[0.03] border-white/10 text-white rounded-xl"
                      value={answers.dob || ""}
                      onChange={(e) => setAnswers({...answers, dob: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            ) : currentStep.type === "image-picker" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Principal Portrait</Label>
                  <div 
                    onClick={() => profileInputRef.current?.click()}
                    className="aspect-square rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/40 transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group overflow-hidden relative"
                  >
                    {profilePreview ? (
                      <Image src={profilePreview} alt="Preview" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="space-y-2">
                        <Camera className="h-8 w-8 text-slate-500 group-hover:text-primary transition-colors mx-auto" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Select Photo</p>
                      </div>
                    )}
                    <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Legacy Background</Label>
                  <div 
                    onClick={() => bgInputRef.current?.click()}
                    className="aspect-square rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/40 transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group overflow-hidden relative"
                  >
                    {bgPreview ? (
                      <Image src={bgPreview} alt="Preview" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="space-y-2">
                        <ImagePlus className="h-8 w-8 text-slate-500 group-hover:text-primary transition-colors mx-auto" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Select Background</p>
                      </div>
                    )}
                    <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'bg')} />
                  </div>
                </div>
              </div>
            ) : currentStep.type === "choice" || currentStep.id === "ai_consent" ? (
              <RadioGroup value={answers[currentStep.id]} onValueChange={(val) => setAnswers({...answers, [currentStep.id]: val})} className="grid gap-4">
                {currentStep.options?.map((opt) => (
                  <div key={opt.id}>
                    <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                    <Label htmlFor={opt.id} className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] peer-data-[state=checked]:border-primary/50 peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        {opt.icon && <opt.icon className="h-6 w-6 text-primary" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-white">{opt.label}</span>
                        <span className="text-xs text-slate-500">{opt.description}</span>
                      </div>
                    </Label>
                  </div>
                ))}
                {currentStep.id === 'gateway' && answers.gateway === 'join' && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Family Invite Code</Label>
                    <Input 
                      placeholder="e.g. HART-7A"
                      className="mt-2 bg-white/[0.03] border-white/10 text-white rounded-xl h-12 text-center font-mono text-lg tracking-widest uppercase placeholder:text-slate-700"
                      value={familyCode}
                      onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                    />
                  </div>
                )}
              </RadioGroup>
            ) : currentStep.type === "radio" ? (
              <RadioGroup value={answers[currentStep.id]} onValueChange={(val) => setAnswers({...answers, [currentStep.id]: val})} className="grid gap-3">
                {currentStep.options?.map((opt) => (
                  <div key={opt.id}>
                    <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                    <Label htmlFor={opt.id} className="flex items-center p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] peer-data-[state=checked]:border-primary/50 peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all text-sm font-semibold text-white">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : currentStep.type === "multi-select" ? (
               <div className="grid gap-3">
                 {currentStep.options?.map((opt) => (
                   <div 
                    key={opt.id} 
                    onClick={() => toggleMultiSelect(currentStep.id, opt.id, currentStep.maxSelect)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                      (answers[currentStep.id] || []).includes(opt.id) 
                        ? "bg-primary/10 border-primary/50 text-white" 
                        : "bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/[0.03]"
                    )}
                   >
                     <span className="text-sm font-semibold">{opt.label}</span>
                     {(answers[currentStep.id] || []).includes(opt.id) && <CheckCircle2 className="h-4 w-4 text-primary" />}
                   </div>
                 ))}
               </div>
            ) : currentStep.type === "input" ? (
              <div className="space-y-4">
                <Input 
                  placeholder={currentStep.placeholder}
                  className="h-14 bg-white/[0.03] border-white/10 text-white rounded-xl text-lg px-6 focus-visible:ring-primary/20 placeholder:text-slate-700"
                  value={answers[currentStep.id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [currentStep.id]: e.target.value })}
                />
              </div>
            ) : (
              <Textarea 
                placeholder={currentStep.placeholder}
                className="min-h-[180px] bg-white/[0.02] border-white/10 rounded-2xl text-white placeholder:text-slate-700 text-sm leading-relaxed"
                value={answers[currentStep.id] || ""}
                onChange={(e) => setAnswers({ ...answers, [currentStep.id]: e.target.value })}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-white/5 pt-6 pb-6 px-8 bg-white/[0.01]">
            <Button variant="ghost" onClick={handlePrev} disabled={currentStepIndex === 0 || loading} className="text-slate-500 hover:text-white hover:bg-white/5 rounded-xl font-bold uppercase text-[11px] tracking-widest">
              Previous
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={
                (currentStep.id === 'gateway' && answers.gateway === 'join' && !familyCode) || 
                (currentStep.type === 'radio' && !answers[currentStep.id]) ||
                (currentStep.type === 'choice' && !answers[currentStep.id]) ||
                (currentStep.type === 'personal-details' && (!answers.fullName || !answers.dob)) ||
                (currentStep.type === 'multi-select' && (!answers[currentStep.id] || answers[currentStep.id].length === 0)) ||
                loading
              }
              className="px-8 rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white font-bold uppercase text-[11px] tracking-widest h-11"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {!nextStepPossible ? "Complete Synthesis" : (currentStep.optional && !answers[currentStep.id] ? "Skip for now" : "Continue")}
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
