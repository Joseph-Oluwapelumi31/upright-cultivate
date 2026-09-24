"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { signOutAction } from "@/actions/auth";

export default function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const initials = user?.name 
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : <User className="size-4" />;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {initials}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 rounded-card border border-border bg-surface shadow-sm py-2 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 py-2 border-b border-border/50 mb-2">
            <p className="text-sm font-medium text-foreground truncate">{user.name || "User"}</p>
            <p className="text-caption text-muted-foreground truncate">{user.email}</p>
          </div>
          
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          
          <div className="mt-2 border-t border-border/50 pt-2 px-2">
            <form action={signOutAction}>
              <button 
                type="submit" 
                className="w-full text-left px-2 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-md transition-colors"
                role="menuitem"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
