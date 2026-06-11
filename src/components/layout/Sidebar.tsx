"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser, useDoc } from "@/firebase";
import { 
  Compass,
  Map,
  Waves,
  Anchor,
  Users,
  Fingerprint,
  MessageSquare,
  Radio,
  Lock,
  Settings,
  User,
  Flag,
  ChevronDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: dna } = useDoc(user ? `users/${user.uid}/dna/current` : null);

  const familyName = dna?.familyProfile?.familyName || "Aivaz Heritage";

  const sections = [
    {
      label: "Bridge",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: Compass },
      ]
    },
    {
      label: "Chart Room",
      items: [
        { name: "Strategy", href: "/strategy", icon: Map },
        { name: "Simulator", href: "/simulator", icon: Waves },
        { name: "Heritage Timeline", href: "/heritage-timeline", icon: Anchor },
      ]
    },
    {
      label: `Wardroom: ${familyName}`,
      items: [
        { name: "Members", href: "/family", icon: Users },
        { name: "Family DNA", href: "/dna", icon: Fingerprint },
      ]
    },
    {
      label: "Signal Deck",
      items: [
        { name: "Messenger", href: "/messenger", icon: MessageSquare },
      ]
    },
    {
      label: "Radio",
      items: [
        { name: "Academy", href: "/academy", icon: Radio },
      ]
    },
    {
      label: "Strongroom",
      items: [
        { name: "Digital Vault", href: "/vault", icon: Lock },
      ]
    }
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative",
          isActive 
            ? "text-primary bg-primary/10" 
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        )}
      >
        <item.icon className={cn(
          "mr-3 h-4 w-4 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )} />
        {item.name}
        {isActive && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-l-full shadow-[0_0_10px_rgba(75,163,199,0.6)]" />
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar border-r border-sidebar-border z-40 flex flex-col">
      <div className="p-10 flex flex-col items-center">
        <div className="flex flex-col items-center text-center cursor-default">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(75,163,199,0.2)]">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter text-foreground leading-none">
            AIVAZ
          </span>
          <span className="text-[9px] font-bold tracking-[0.4em] text-primary uppercase mt-2 opacity-80">
            Heritage
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-8 scrollbar-hide">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-4 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">
              {section.label}
            </p>
            <nav className="space-y-1">
              {section.items.map((item) => <NavItem key={item.name} item={item} />)}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-sidebar-border space-y-4">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
            pathname === "/settings" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Link>
        
        <div className="flex items-center gap-3 glass-card p-3 rounded-xl border-white/5 bg-white/[0.02] group cursor-pointer hover:bg-white/5 transition-all">
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarImage src="https://picsum.photos/seed/julian/100/100" />
            <AvatarFallback>JA</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate text-foreground">{user?.displayName || "Julian Aivaz"}</p>
            <p className="text-[9px] text-muted-foreground truncate uppercase font-bold tracking-widest">Principal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
