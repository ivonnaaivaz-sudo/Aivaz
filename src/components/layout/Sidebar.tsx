"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Wallet, 
  Lightbulb, 
  Cpu, 
  MessageSquare, 
  Milestone, 
  ShieldCheck 
} from "lucide-react";

const navigation = [
  { name: "Portfolio", href: "/portfolio", icon: LayoutDashboard },
  { name: "Accounts", href: "/accounts", icon: Wallet },
  { name: "Insights", href: "/insights", icon: Lightbulb },
  { name: "Simulator", href: "/simulator", icon: Cpu },
  { name: "Messenger", href: "/messenger", icon: MessageSquare },
  { name: "Strategy", href: "/strategy", icon: Milestone },
  { name: "Vault", href: "/vault", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar border-r border-sidebar-border z-40 flex flex-col">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 shadow-[0_0_15px_rgba(75,163,199,0.3)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-primary"
          >
            <path d="M12 3a6 6 0 0 0-9 6c0 4.97 4.03 9 9 9s9-4.03 9-9a6 6 0 0 0-9-6Z" />
            <path d="M12 18v3" />
            <path d="M15 17.5c.5.5 1 0 1-1" />
            <path d="M9 17.5c-.5.5-1 0-1-1" />
            <path d="M18 9h2.5" />
            <path d="M3.5 9H6" />
          </svg>
        </div>
        <span className="font-headline font-semibold text-xl tracking-tight text-foreground">
          AIVAZ <span className="text-primary">HERITAGE</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/portfolio");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative",
                isActive 
                  ? "text-primary bg-primary/5" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.name}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full shadow-[0_0_10px_rgba(75,163,199,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-sidebar-border">
        <div className="flex items-center gap-3 glass-card p-3 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-muted border border-white/10 overflow-hidden">
            <img src="https://picsum.photos/seed/user/100/100" alt="User" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">Julian Aivaz</p>
            <p className="text-xs text-muted-foreground truncate">Principal Head</p>
          </div>
        </div>
      </div>
    </aside>
  );
}