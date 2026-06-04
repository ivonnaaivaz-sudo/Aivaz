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
  <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
    <defs>
      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#e0f2fe', stopOpacity: 0.3 }} />
        <stop offset="50%" style={{ stopColor: '#7dd3fc', stopOpacity: 0.1 }} />
        <stop offset="100%" style={{ stopColor: '#0ea5e9', stopOpacity: 0.2 }} />
      </linearGradient>
      <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <radialGradient id="ringShade" cx="50%" cy="50%" r="50%">
        <stop offset="85%" style={{ stopColor: 'white', stopOpacity: 0 }} />
        <stop offset="92%" style={{ stopColor: 'white', stopOpacity: 0.4 }} />
        <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
      </radialGradient>
    </defs>
    
    {/* Outer Seal Ripple - simulating the wax/glass melt */}
    <path 
      d="M50 5 C75 5 95 20 95 50 C95 80 75 95 50 95 C25 95 5 80 5 50 C5 20 25 5 50 5" 
      fill="url(#glassGradient)" 
      stroke="rgba(255,255,255,0.15)" 
      strokeWidth="0.5" 
    />
    
    {/* Concentric Glass Ridges */}
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="38" fill="url(#ringShade)" />

    {/* The Detailed Turtle */}
    <g transform="translate(25, 20) scale(0.5)" filter="url(#innerGlow)">
      {/* Head */}
      <path d="M50 0 C54 0 58 4 58 10 C58 16 54 20 50 20 C46 20 42 16 42 10 C42 4 46 0 50 0Z" fill="rgba(125, 211, 252, 0.4)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      
      {/* Flippers */}
      <path d="M25 30 L5 20 Q0 15 5 10 Q10 5 25 25" fill="rgba(125, 211, 252, 0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <path d="M75 30 L95 20 Q100 15 95 10 Q90 5 75 25" fill="rgba(125, 211, 252, 0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <path d="M25 100 L5 115 Q0 120 10 125 Q20 130 30 110" fill="rgba(125, 211, 252, 0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <path d="M75 100 L95 115 Q100 120 90 125 Q80 130 70 110" fill="rgba(125, 211, 252, 0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

      {/* Main Shell */}
      <path 
        d="M50 25 C80 25 100 45 100 75 C100 105 80 120 50 120 C20 120 0 105 0 75 C0 45 20 25 50 25Z" 
        fill="rgba(125, 211, 252, 0.15)" 
        stroke="rgba(255,255,255,0.6)" 
        strokeWidth="2" 
      />

      {/* Hexagonal Shell Pattern - Geometric Etching */}
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none">
        {/* Center Hexagons */}
        <path d="M50 45 L65 53 L65 70 L50 78 L35 70 L35 53 Z" />
        <path d="M50 78 L65 86 L65 103 L50 111 L35 103 L35 86 Z" />
        
        {/* Radiating Lines */}
        <path d="M50 45 L50 25 M35 53 L15 45 M65 53 L85 45 M35 70 L10 75 M65 70 L90 75 M35 86 L15 100 M65 86 L85 100 M50 111 L50 120" />
        
        {/* Outer Ring Patterns */}
        <path d="M20 45 L10 55 L10 70 L20 80" />
        <path d="M80 45 L90 55 L90 70 L80 80" />
      </g>
    </g>

    {/* Surface Reflection Highlights */}
    <path d="M20 30 Q30 15 50 15" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
    <circle cx="75" cy="25" r="1.5" fill="white" fillOpacity="0.4" />
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
          <div className="relative mb-2 flex items-center justify-center">
            <div className="relative transition-all duration-700 hover:scale-105 active:scale-95">
              <GlassStampLogo />
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center -mt-2">
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