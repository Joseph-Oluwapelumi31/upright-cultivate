"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, ShoppingCart, Store, MapPin, Settings, FileSignature, ShoppingBag, Receipt } from "lucide-react";
import UserMenu from "@/components/layout/UserMenu";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Requests", href: "/dashboard/requests", icon: ShoppingCart },
  { name: "Quotes", href: "/dashboard/quotes", icon: FileSignature },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { name: "Businesses", href: "/dashboard/businesses", icon: Store },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardShell({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-surface transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-foreground">
            Upright Cultivate
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-button px-3 py-2 text-sm font-medium transition-colors ${isActive
                  ? "bg-primary/5 text-primary"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
              >
                <item.icon
                  className={`size-5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 lg:px-8">
          <button
            type="button"
            className="text-foreground/60 hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-expanded={sidebarOpen}
            aria-controls="mobile-sidebar"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="size-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 items-center justify-end">
            <UserMenu user={user} />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
