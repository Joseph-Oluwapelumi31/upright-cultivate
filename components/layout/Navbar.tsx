"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Why us", href: "#why" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
        setMenuOpen(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full bg-transparent py-7 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex w-[min(calc(100%-48px),1200px)] items-center justify-between">
        {/* Logo */}
        <Link
          href="#"
          aria-label="Upright Cultivate home"
          className="flex items-center gap-2.5 rounded-full border border-white/30 bg-white/55 p-4 md:px-4 md:py-2.5 text-xl font-medium text-primary shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-colors duration-200 hover:bg-white/70 max-[650px]:text-[17px]"
        >
          <Image
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            priority
            className="h-8 w-8 shrink-0"
          />
              <span className="hidden md:block text-xl font-medium tracking-[-0.02em] text-primary">
                Upright Cultivate
              </span>
        </Link>

        {/* Desktop navigation + CTA */}
        <div className="flex items-center gap-2 rounded-full bg-surface/90 px-2 py-2 shadow-sm backdrop-blur-sm max-[900px]:hidden">
          <nav
            className="flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2.5 text-[13px] text-primary opacity-80 transition-colors duration-200 hover:bg-surface hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button
            href="#supply-planner"
            variant="primary"
            className="min-h-11 px-5 py-2.5 text-[13px]"
          >
            Request supply plan
          </Button>
        </div>

        
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[-1] bg-black/10 backdrop-blur-[2px] min-[901px]:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute left-4 right-4 top-full mt-3 rounded-3xl border border-white/30 bg-white/55 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl min-[901px]:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-[13px] font-medium text-(--primary) opacity-80 transition-colors duration-200 hover:bg-white/50 hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}

              <Button
                href="#supply-planner"
                variant="primary"
                className="mt-2 min-h-11 w-full px-5 py-2.5 text-[13px]"
                onClick={() => setMenuOpen(false)}
              >
                Request supply plan
              </Button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}