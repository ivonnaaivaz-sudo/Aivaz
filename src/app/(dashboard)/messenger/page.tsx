"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, User, MoreVertical, Search, Paperclip, Send } from "lucide-react";

export default function MessengerPage() {
  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 max-w-7xl mx-auto">
      <Card className="w-80 glass-panel flex flex-col border-white/5">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">Messenger</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 bg-background/50 border-white/5 text-sm h-9" />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {[
              { name: "Family Office Group", msg: "The rebalancing report is ready.", time: "10:24 AM", active: true },
              { name: "Robert Chen (Advisor)", msg: "Proposed trust amendment doc.", time: "Yesterday", active: false },
              { name: "Marcus Aivaz", msg: "Let's review the Swiss holdings.", time: "2 days ago", active: false },
              { name: "Strategy Core AI", msg: "New insight detected for trust-A4.", time: "Mon", active: false },
            ].map((chat, i) => (
              <div key={i} className={`p-3 rounded-xl flex gap-3 cursor-pointer transition-colors ${chat.active ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5'}`}>
                <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 border border-white/10" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold truncate">{chat.name}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="flex-1 glass-panel flex flex-col border-white/5">
        <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Family Office Group</p>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Encrypted Session</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </Button>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2 opacity-30 pb-4">
              <Shield className="h-6 w-6 text-primary" />
              <p className="text-[10px] uppercase font-bold tracking-tighter">End-to-end encrypted channel established</p>
            </div>
            
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm leading-relaxed">
                Good morning Julian. I've analyzed the recent movement in the Swiss Franc. We should discuss hedging strategies during our next call.
              </div>
            </div>

            <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 border border-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-sm leading-relaxed text-foreground">
                Agreed, Robert. Can you upload the proposal to the Vault first? I'll review it tonight.
              </div>
            </div>

            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm leading-relaxed">
                Proposal uploaded. Also, Strategy Core AI flagged a potential tax inefficiency in Trust-B2 based on the new legislative draft.
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 bg-background/50 border border-white/5 rounded-2xl px-4 py-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input placeholder="Type a secure message..." className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm" />
            <Button size="icon" className="rounded-full shadow-lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}