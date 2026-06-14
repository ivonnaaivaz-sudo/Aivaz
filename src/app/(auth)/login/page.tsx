"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect through root logic to dashboard or onboarding
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials. Please verify your node access details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/"); 
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Google verification failed. Please try an alternative method.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 antialiased">
      <Card className="max-w-md w-full glass-panel border-white/5 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(75,163,199,0.1)]">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-headline font-bold tracking-tighter">Hartmann Heritage</CardTitle>
            <CardDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Secure Node Access Protocol</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Personnel Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="principal@hartmann.com" 
                className="bg-white/5 border-white/10 rounded-xl focus-visible:ring-primary/20 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" dir="ltr" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure Passphrase</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-white/5 border-white/10 rounded-xl focus-visible:ring-primary/20 h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><LogIn className="mr-2 h-4 w-4" /> Establish Connection</>}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-tighter"><span className="bg-background px-4 text-muted-foreground font-bold">Alternative Protocol</span></div>
          </div>
          
          <Button variant="outline" className="w-full h-11 rounded-xl bg-white/5 border-white/10 hover:bg-white/10" onClick={handleGoogleLogin} disabled={loading}>
            Authenticate with Google Node
          </Button>
        </CardContent>
        <CardFooter className="justify-center border-t border-white/5 pt-6 bg-slate-50/30 rounded-b-lg">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">End-to-End Encrypted Session</p>
        </CardFooter>
      </Card>
    </div>
  );
}
