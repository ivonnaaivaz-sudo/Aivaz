"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const brandLogo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/onboarding"); 
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not establish credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/onboarding"); 
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Google verification failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 antialiased selection:bg-primary/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Card className="max-w-md w-full bg-white/[0.02] border-white/5 shadow-2xl backdrop-blur-xl relative z-10">
        <CardHeader className="text-center space-y-6 pt-10">
          <div className="mx-auto w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(75,163,199,0.1)] overflow-hidden relative">
            {brandLogo && (
              <Image 
                src={brandLogo.imageUrl} 
                alt="Aivaz Heritage Logo" 
                fill
                className="object-contain p-3"
                priority
              />
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-headline font-bold tracking-tighter text-white">Aivaz Heritage</CardTitle>
            <CardDescription className="text-slate-400 italic text-sm font-medium">Complex legacies, simplified</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Establish Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="principal@heritage.com" 
                className="bg-white/[0.03] border-white/10 text-white rounded-xl focus-visible:ring-primary/20 h-11 placeholder:text-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" dir="ltr" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Secure Passphrase</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-white/[0.03] border-white/10 text-white rounded-xl focus-visible:ring-primary/20 h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="mr-2 h-4 w-4" /> Create an account</>}
            </Button>
          </form>
          
          <div className="text-center">
            <Link href="/login" className="text-xs text-slate-500 hover:text-primary transition-colors font-medium">
              Already have an account? <span className="underline font-bold text-slate-300">Login</span>
            </Link>
          </div>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-tighter"><span className="bg-[#0b1224] px-4 text-slate-500 font-bold">Alternative Node</span></div>
          </div>
          
          <Button variant="outline" className="w-full h-11 rounded-xl bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05] hover:text-white transition-all text-xs font-bold uppercase tracking-widest" onClick={handleGoogleAuth} disabled={loading}>
            Register with Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center border-t border-white/5 py-6 bg-white/[0.01] rounded-b-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-primary/50" />
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">End-to-End Encrypted Session</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}