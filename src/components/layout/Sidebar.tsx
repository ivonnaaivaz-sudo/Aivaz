"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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
  const logo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar border-r border-sidebar-border z-40 flex flex-col">
      <div className="p-8 flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(75,163,199,0.2)] overflow-hidden transition-all duration-700 hover:shadow-[0_0_50px_rgba(75,163,199,0.4)] hover:border-primary/40 group">
          {logo && (
            <Image 
              src={logo.imageUrl} 
              alt={logo.description}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              data-ai-hint={logo.imageHint}
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-headline font-bold text-2xl tracking-tighter text-foreground leading-none">
            AIVAZ
          </span>
          <span className="text-[9px] font-bold tracking-[0.4em] text-primary uppercase mt-1.5 opacity-80">
            Heritage
          </span>
        </div>
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
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.name}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full shadow-[0_0_15px_rgba(75,163,199,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-sidebar-border">
        <div className="flex items-center gap-3 glass-card p-3 rounded-xl border-white/5 bg-white/[0.02]">
          <div className="w-10 h-10 rounded-full bg-muted border border-white/10 overflow-hidden relative">
            <Image 
              src="https://picsum.photos/seed/user-julian/100/100" 
              alt="User" 
              fill
              className="object-cover"
              data-ai-hint="person profile"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">Julian Aivaz</p>
            <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-widest">Principal Head</p>
          </div>
        </div>
      </div>
    </aside>
  );
}