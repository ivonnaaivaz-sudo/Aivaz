
"use client";

import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Eye, Globe, Lock, Cpu, BrainCircuit, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const handleRetakeDiscovery = async () => {
    if (!user || !db) return;
    
    try {
      // We don't necessarily need to wipe the data, just flip the flag to allow re-entry
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        hasCompletedProfiling: false
      });
      
      toast({
        title: "Session Reset",
        description: "Redirecting to Psychological Discovery...",
      });
      
      router.push("/onboarding");
    } catch (e) {
      console.error("Error resetting discovery:", e);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">Manage your legacy platform settings and security protocols.</p>
      </div>

      <div className="grid gap-6">
        <Card className="glass-panel border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Legacy Foundation</CardTitle>
            </div>
            <CardDescription>
              Your Family DNA was extracted during your initial session. You can re-run this process to update your core values and friction points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleRetakeDiscovery}
              className="w-full sm:w-auto shadow-xl bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Re-take Psychological Discovery
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Configure biometric overrides and document encryption levels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">Two-Factor Legacy Authentication</Label>
                <p className="text-xs text-muted-foreground">Require secondary confirmation for major trust decisions.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">Stealth Mode Browsing</Label>
                <p className="text-xs text-muted-foreground">Disable tracking of internal document access across the family group.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              AI Core Synthesis
            </CardTitle>
            <CardDescription>Customize the intensity and focus of AI legacy extraction.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">Real-time DNA Extraction</Label>
                <p className="text-xs text-muted-foreground">Continuously update family DNA based on new messenger interactions and documents.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">Friction Point Notifications</Label>
                <p className="text-xs text-muted-foreground">Alert the Principal immediately when AI detects emotional bottlenecks.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10">Cancel</Button>
          <Button className="shadow-lg px-8">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
