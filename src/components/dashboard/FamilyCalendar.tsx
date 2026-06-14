"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Landmark, 
  Users, 
  Trophy, 
  ChevronLeft, 
  ChevronRight,
  Info
} from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type FamilyEvent = {
  id: string;
  title: string;
  date: string; // ISO string format YYYY-MM-DD
  eventType: 'GOVERNANCE' | 'FINANCIAL' | 'SOCIAL' | 'MILESTONE';
  priority: 'URGENT' | 'NORMAL' | 'INFORMATIONAL';
  description: string;
  memberAccess: string[];
};

const typeConfig = {
  GOVERNANCE: { icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Governance" },
  FINANCIAL: { icon: Landmark, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Financial" },
  SOCIAL: { icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Social" },
  MILESTONE: { icon: CalendarIcon, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Milestone" },
};

const priorityConfig = {
  URGENT: "text-red-500",
  NORMAL: "text-primary",
  INFORMATIONAL: "text-muted-foreground",
};

export function FamilyCalendar({ events }: { events: FamilyEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  return (
    <Card className="glass-panel border-white/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-headline font-bold">Family Calendar</CardTitle>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 hover:bg-white/5">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-bold min-w-[120px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 hover:bg-white/5">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b border-white/5">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white/[0.02]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isToday = mounted && isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div 
                key={idx} 
                className={cn(
                  "min-h-[120px] p-2 border-r border-b border-white/5 transition-colors relative group",
                  !isCurrentMonth ? "bg-black/20 opacity-30" : "hover:bg-white/[0.02]",
                  isToday && "bg-primary/[0.03]"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                    isToday && "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(75,163,199,0.5)]"
                  )}>
                    {format(day, "d")}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map((event) => {
                    const config = typeConfig[event.eventType];
                    return (
                      <TooltipProvider key={event.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={cn(
                              "text-[10px] p-1.5 rounded border truncate cursor-pointer transition-all hover:scale-[1.02]",
                              config.bg, config.border, config.color,
                              event.priority === 'URGENT' && "font-bold ring-1 ring-red-500/20"
                            )}>
                              <div className="flex items-center gap-1">
                                <config.icon className="h-2.5 w-2.5 shrink-0" />
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="glass-panel border-white/10 p-3 max-w-xs">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className={cn("text-[8px] uppercase", config.bg, config.color, config.border)}>
                                  {config.label}
                                </Badge>
                                <span className={cn("text-[8px] font-bold", priorityConfig[event.priority])}>
                                  {event.priority}
                                </span>
                              </div>
                              <p className="text-xs font-bold">{event.title}</p>
                              <p className="text-[10px] text-muted-foreground leading-relaxed">{event.description}</p>
                              <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[8px] uppercase tracking-tighter text-muted-foreground">
                                  Access: {event.memberAccess.join(", ")}
                                </span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-center gap-6">
        {Object.entries(typeConfig).map(([type, config]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", config.bg.replace('/10', ''), "opacity-60")} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}