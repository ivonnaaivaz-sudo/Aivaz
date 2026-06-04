"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  PieChart,
  Landmark,
  Sparkles,
  Cpu,
  Target,
  History,
  ShieldCheck,
  MessageSquare,
  Users,
  Settings,
  Fingerprint,
  User
} from "lucide-react";
import Image from "next/image";

const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "Accounts", href: "/accounts", icon: Landmark },
  { name: "Insights", href: "/insights", icon: Sparkles },
];

const legacyNavigation = [
  { name: "Simulator", href: "/simulator", icon: Cpu },
  { name: "Strategy", href: "/strategy", icon: Target },
  { name: "Heritage Timeline", href: "/heritage-timeline", icon: History },
  { name: "Legacy Command", href: "/legacy-command", icon: ShieldCheck },
  { name: "Family DNA", href: "/dna", icon: Fingerprint },
];

const toolNavigation = [
  { name: "Messenger", href: "/messenger", icon: MessageSquare },
  { name: "Family", href: "/family", icon: Users },
];

const CrystalTurtleLogo = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-[0_0_15px_rgba(75,163,199,0.5)]">
    <defs>
      <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.4 }} />
      </linearGradient>
      <filter id="glass">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>
    </defs>
    {/* Shell */}
    <path 
      d="M50 20 C70 20 85 35 85 55 C85 75 70 85 50 85 C30 85 15 75 15 55 C15 35 30 20 50 20Z" 
      fill="url(#crystalGradient)" 
      stroke="white" 
      strokeWidth="0.5" 
      strokeOpacity="0.3"
    />
    {/* Shell Patterns */}
    <path d="M50 25 L50 80 M25 55 L75 55 M35 35 L65 75 M65 35 L35 75" stroke="white" strokeWidth="0.2" strokeOpacity="0.5" />
    {/* Head */}
    <circle cx="50" cy="15" r="7" fill="url(#crystalGradient)" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
    {/* Fins/Legs */}
    <ellipse cx="20" cy="35" rx="8" ry="4" fill="url(#crystalGradient)" transform="rotate(-30 20 35)" />
    <ellipse cx="80" cy="35" rx="8" ry="4" fill="url(#crystalGradient)" transform="rotate(30 80 35)" />
    <ellipse cx="25" cy="75" rx="7" ry="3" fill="url(#crystalGradient)" transform="rotate(30 25 75)" />
    <ellipse cx="75" cy="75" rx="7" ry="3" fill="url(#crystalGradient)" transform="rotate(-30 75 75)" />
  </svg>
);

export function Sidebar() {
  const pathname = usePathname();

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
      <div className="p-8 flex flex-col items-center gap-4">
        <div className="relative group flex flex-col items-center cursor-default">
          <div className="relative w-[120px] h-[120px] mb-2 flex items-center justify-center">
            <div className="relative w-full h-full rounded-full overflow-hidden border border-white/5 glass-panel bg-white/[0.02] flex items-center justify-center group-hover:border-primary/30 transition-all duration-700">
              <CrystalTurtleLogo />
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-headline font-bold text-2xl tracking-tighter text-foreground leading-none">
              AIVAZ
            </span>
            <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase mt-1 opacity-80">
              Heritage
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-6">
        <div>
          <p className="px-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">Main Sections</p>
          <nav className="space-y-1">
            {mainNavigation.map((item) => <NavItem key={item.name} item={item} />)}
          </nav>
        </div>

        <div>
          <p className="px-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">Legacy & Family</p>
          <nav className="space-y-1">
            {legacyNavigation.map((item) => <NavItem key={item.name} item={item} />)}
          </nav>
        </div>

        <div>
          <p className="px-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">Collaboration & Tools</p>
          <nav className="space-y-1">
            {toolNavigation.map((item) => <NavItem key={item.name} item={item} />)}
          </nav>
        </div>
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
        
        <div className="flex items-center gap-3 glass-card p-3 rounded-xl border-white/5 bg-white/[0.02]">
          <div className="w-8 h-8 rounded-full bg-muted border border-white/10 overflow-hidden relative flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate">Julian Aivaz</p>
            <p className="text-[9px] text-muted-foreground truncate uppercase font-bold tracking-widest">Principal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
