"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Landmark, Users, Trophy, AlertCircle, Clock } from "lucide-react";

export type FamilyEvent = {
  id: string;
  title: string;
  date: string;
  eventType: 'GOVERNANCE' | 'FINANCIAL' | 'SOCIAL' | 'MILESTONE';
  priority: 'URGENT' | 'NORMAL' | 'INFORMATIONAL';
  description: string;
  memberAccess: string[];
};

const typeConfig = {
  GOVERNANCE: { icon: Users, color: "text-blue-500", label: "Governance" },
  FINANCIAL: { icon: Landmark, color: "text-emerald-500", label: "Financial" },
  SOCIAL: { icon: Trophy, color: "text-amber-500", label: "Social" },
  MILESTONE: { icon: Calendar, color: "text-primary", label: "Milestone" },
};

const priorityConfig = {
  URGENT: "border-red-500/50 bg-red-500/10 text-red-500",
  NORMAL: "border-primary/20 bg-primary/5 text-primary",
  INFORMATIONAL: "border-white/10 bg-white/5 text-muted-foreground",
};

export function FamilyCalendar({ events }: { events: FamilyEvent[] }) {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  return (
    <Card className="glass-panel border-white/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Family Calendar
          </CardTitle>
          <Badge variant="outline" className="text-[8px] opacity-50">Sync Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedEvents.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">No upcoming events scheduled.</p>
        ) : (
          sortedEvents.map((event) => {
            const config = typeConfig[event.eventType];
            return (
              <div key={event.id} className="flex gap-3 group relative">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors`}>
                    <config.icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="w-px flex-1 bg-white/5 my-1 group-last:hidden" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold leading-none">{event.title}</p>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">{event.date}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{event.description}</p>
                  <div className="flex gap-1.5 mt-2">
                    <Badge variant="outline" className={`text-[7px] font-bold uppercase tracking-tighter ${priorityConfig[event.priority]}`}>
                      {event.priority}
                    </Badge>
                    <Badge variant="outline" className="text-[7px] font-bold uppercase tracking-tighter border-white/5 bg-white/[0.02]">
                      {config.label}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
