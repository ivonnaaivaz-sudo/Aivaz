"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { 
  Compass,
  Map,
  MessageSquare,
  Lock,
  Settings,
  ShieldCheck
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TurtleIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="M19.07 4.93L4.93 19.07" />
    <path d="M4.93 4.93l14.14 14.14" />
    <path d="M12 7l5 5-5 5-5-5 5-5z" />
  </svg>
);

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const mainNav = [
    { name: "Bridge", href: "/bridge", icon: Compass },
    { name: "Chart Room", href: "/chart-room", icon: Map },
    { name: "Wardroom", href: "/wardroom", icon: MessageSquare },
    { name: "Strongroom", href: "/vault", icon: Lock },
  ];

  const settingsItem = { name: "Settings", href: "/settings", icon: Settings };

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative mb-2",
          isActive 
            ? "text-primary bg-primary/10 shadow-[0_0_20px_rgba(75,163,199,0.1)]" 
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        )}
      >
        <item.icon className={cn(
          "mr-4 h-5 w-5 transition-transform duration-300",
          isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
        )} />
        <span className="tracking-tight">{item.name}</span>
        {isActive && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full shadow-[0_0_15px_rgba(75,163,199,0.8)]" />
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar border-r border-sidebar-border z-40 flex flex-col">
      <Link href="/dashboard" className="p-10 flex flex-col items-center">
        <div className="flex flex-col items-center text-center cursor-pointer group">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(75,163,199,0.1)] group-hover:border-primary/30 transition-all duration-500">
            <TurtleIcon className="h-7 w-7 text-primary" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter text-foreground leading-none">
            AIVAZ
          </span>
          <span className="text-[9px] font-bold tracking-[0.4em] text-primary uppercase mt-2 opacity-60">
            Heritage
          </span>
        </div>
      </Link>

      <nav className="flex-1 px-6 py-4 overflow-y-auto scrollbar-hide flex flex-col">
        <div className="flex-1">
          {mainNav.map((item) => <NavItem key={item.name} item={item} />)}
        </div>
        <div className="mt-auto pt-4 border-t border-white/5">
          <NavItem item={settingsItem} />
        </div>
      </nav>

      <div className="p-6 border-t border-sidebar-border">
        <Link 
          href="/house"
          className={cn(
            "flex items-center gap-3 glass-card p-3 rounded-2xl border-white/5 bg-white/[0.02] group cursor-pointer hover:bg-white/5 transition-all",
            pathname === "/house" && "border-primary/30 bg-primary/5"
          )}
        >
          <div className="relative">
            <Avatar className="h-9 w-9 border border-white/10 group-hover:border-primary/30 transition-all">
              <AvatarImage src="https://picsum.photos/seed/julian/100/100" />
              <AvatarFallback>JA</AvatarFallback>
            </Avatar>
            {pathname === "/house" && (
              <div className="absolute -top-1 -right-1">
                <ShieldCheck className="h-3 w-3 text-primary fill-background" />
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate text-foreground group-hover:text-primary transition-colors">
              {user?.displayName || "Julian Aivaz"}
            </p>
            <p className="text-[9px] text-muted-foreground truncate uppercase font-bold tracking-widest opacity-60">
              {pathname === "/house" ? "Inside The House" : "Principal"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
