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

const GlassStampLogo = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
    <defs>
      <linearGradient id="stampBase" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.15 }} />
        <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.05 }} />
      </linearGradient>
      <linearGradient id="stampEdge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.4 }} />
        <stop offset="50%" style={{ stopColor: 'white', stopOpacity: 0.05 }} />
        <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.4 }} />
      </linearGradient>
      <filter id="glassBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
      </filter>
    </defs>
    
    {/* The Outer Stamp Ring */}
    <circle cx="50" cy="50" r="46" fill="none" stroke="url(#stampEdge)" strokeWidth="0.5" strokeOpacity="0.2" />
    
    {/* The Glass Disc */}
    <circle cx="50" cy="50" r="43" fill="url(#stampBase)" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
    
    {/* Inner "Pressed" Bezel */}
    <circle cx="50" cy="50" r="38" fill="none" stroke="black" strokeWidth="0.5" strokeOpacity="0.1" />
    <circle cx="50" cy="50" r="37.5" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />

    {/* Stamped Turtle Icon */}
    <g transform="translate(32, 32) scale(0.36)" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Shell */}
      <path 
        d="M50 15 C75 15 95 35 95 60 C95 85 75 98 50 98 C25 98 5 85 5 60 C5 35 25 15 50 15Z" 
        strokeOpacity="0.8"
      />
      {/* Etched Pattern */}
      <path d="M50 20 V90 M20 60 H80 M30 35 L70 85 M70 35 L30 85" strokeOpacity="0.3" />
      {/* Head */}
      <circle cx="50" cy="8" r="7" strokeOpacity="0.8" />
      {/* Flippers */}
      <path d="M15 35 L5 25 M85 35 L95 25 M15 85 L5 95 M85 85 L95 95" strokeOpacity="0.5" />
    </g>

    {/* Surface Reflection */}
    <path 
      d="M25 35 Q35 25 50 25 Q65 25 75 35" 
      fill="none" 
      stroke="white" 
      strokeWidth="0.5" 
      strokeOpacity="0.1" 
      filter="url(#glassBlur)"
    />
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
          <div className="relative w-[130px] h-[130px] mb-2 flex items-center justify-center">
            <div className="relative w-full h-full rounded-full flex items-center justify-center transition-all duration-700">
              <GlassStampLogo />
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
