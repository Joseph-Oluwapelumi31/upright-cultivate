"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Why us", href: "#why" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Contact", href: "#contact" },
];

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  // Show navbar when scrolling up, hide when scrolling down
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Don't hide the navbar while the mobile menu is open
      if (menuOpen) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  // Lock page scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-md min-[901px]:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile navigation */}
      <div
        className={`fixed left-0 right-0 top-0 z-50 px-6 py-7 transition-transform duration-300 min-[901px]:hidden ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Menu button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="cursor-pointer rounded-full border border-white/30 bg-white/55 p-3 text-[var(--primary)] shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-200 hover:bg-white/70"
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`absolute left-6 right-6 top-[calc(100%+12px)] origin-top transition-all duration-300 ${
            menuOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
          }`}
        >
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="rounded-3xl border border-white/30 bg-white/65 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3.5 text-sm font-medium text-[var(--deep-moss)] opacity-80 transition-all duration-200 hover:bg-white/60 hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="#contact"
                onClick={closeMenu}
                className="mt-2 inline-flex min-h-[46px] items-center justify-center rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Request supply plan
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}