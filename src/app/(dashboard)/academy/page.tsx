"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, BookOpen, GraduationCap, PlayCircle, Trophy, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "The G2 Governance Framework",
    description: "A deep dive into institutionalizing family decision-making for successive generations.",
    duration: "45 mins",
    type: "Strategy",
    level: "Advanced",
  },
  {
    title: "Offshore Asset Privacy 101",
    description: "Understanding the regulatory landscape of Singapore and Swiss holdings.",
    duration: "30 mins",
    type: "Compliance",
    level: "Intermediate",
  },
  {
    title: "Philanthropic Legacy Design",
    description: "How to align family values with global social impact initiatives.",
    duration: "20 mins",
    type: "Impact",
    level: "Foundational",
  }
];

export default function AcademyPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">Heritage Academy</Badge>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight flex items-center gap-3">
          <Radio className="h-8 w-8 text-primary" />
          Legacy Radio & Academy
        </h1>
        <p className="text-muted-foreground italic">Intellectual capital growth for multi-generational success.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Live Advisory Channel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
                <Radio className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <div>
              <p className="font-bold">Principal Audio Briefing</p>
              <p className="text-xs text-muted-foreground mt-1">Weekly strategic summary for Family Heads.</p>
            </div>
            <Button size="sm" className="w-full">Tune In</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Recent Lessons</CardTitle>
            <CardDescription>Curated educational content for your family DNA profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course) => (
              <div key={course.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{course.title}</p>
                    <p className="text-xs text-muted-foreground">{course.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest opacity-50">{course.duration}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <PlayCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: GraduationCap, label: "Total Lessons", value: "24" },
          { icon: Trophy, label: "G2 Certifications", value: "3" },
          { icon: Globe, label: "Jurisdictions Covered", value: "6" },
          { icon: Lock, label: "Privacy Grade", value: "A+" },
        ].map((stat, i) => (
          <Card key={i} className="glass-panel">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
                <p className="text-lg font-headline font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
