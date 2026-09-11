"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const navLinks = [
  { label: "Why us", href: "#why" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
];

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Show navbar when scrolling up, hide when scrolling down
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
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

  useEffect(() => {
    if (menuOpen) {
      firstLinkRef.current?.focus();
    }
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-md lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile navigation */}
      <div
        className={`fixed left-0 right-0 top-0 z-50 py-7 transition-transform duration-300 lg:hidden ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Container className="relative lg:hidden">
          <div className="flex items-center justify-between">
            <Link
              href="#"
              aria-label="Upright Cultivate home"
              className="flex size-14 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/55 text-primary transition-colors duration-200 hover:bg-white/70"
            >
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                priority
                className="size-8"
              />
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/55 text-primary backdrop-blur-xl transition-colors duration-200 hover:bg-white/70"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <div
            className={`absolute left-5 right-5 top-[calc(100%+12px)] origin-top transition-[transform,opacity] duration-300 sm:left-8 sm:right-8 lg:left-12 lg:right-12 ${
              menuOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
            }`}
          >
            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              aria-hidden={!menuOpen}
              inert={!menuOpen ? true : undefined}
              className="rounded-3xl border border-white/30 bg-white/65 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-2xl px-4 py-3.5 text-sm font-medium text-(--primary) opacity-80 transition-colors duration-200 hover:bg-white/60 hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                ))}

                <Button
                  href="#supply-planner"
                  variant="primary"
                  className="mt-2 w-full text-sm"
                  onClick={closeMenu}
                >
                  Request supply plan
                </Button>
              </div>
            </nav>
          </div>
        </Container>
      </div>
    </>
  );
}