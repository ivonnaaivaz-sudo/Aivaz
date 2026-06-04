
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Eye, Globe, Lock, Cpu } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">Manage your legacy platform settings and security protocols.</p>
      </div>

      <div className="grid gap-6">
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
