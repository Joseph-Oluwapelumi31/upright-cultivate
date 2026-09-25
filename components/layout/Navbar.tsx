"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import UserMenu from "./UserMenu";

const navLinks = [
  { label: "Why us", href: "/#why" },
  { label: "Products", href: "/#products" },
  { label: "Industries", href: "/#industries" },
];

export default function Navbar({ user }: { user?: any }) {
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full bg-transparent h-20 py-7 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Container className="relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Upright Cultivate home"
            className="flex items-center gap-2 rounded-full bg-surface/90 px-6 py-4 shadow-sm"
            onClick={() => setMenuOpen(false)}
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
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-surface/90 px-2 py-2 shadow-sm ">
            <nav className="flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-primary transition-colors duration-200 hover:bg-surface hover:opacity-100 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/signin"
                  className="rounded-full px-4 py-2 text-primary transition-colors duration-200 hover:bg-surface hover:opacity-100 font-medium"
                >
                  Sign in
                </Link>
              )}
            </nav>

            {user ? (
              <UserMenu user={user} />
            ) : (
              <Button href="/supply" variant="primary">
                <p className="text-primary-foreground">Request supply plan</p>
              </Button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2 rounded-full bg-surface/90 p-2 shadow-sm">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-transparent text-primary transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative h-5 w-6">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-all duration-300 ${
                    menuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 h-0.5 w-full bg-current transition-opacity duration-300 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 h-0.5 w-full bg-current transition-all duration-300 ${
                    menuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <div
          id="mobile-menu"
          className={`fixed inset-x-0 top-24 mx-4 overflow-hidden rounded-3xl bg-surface shadow-lg transition-all duration-300 lg:hidden ${
            menuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col p-6" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-4 pb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-medium tracking-tight text-primary transition-colors hover:text-primary/70"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/signin"
                  className="text-2xl font-medium tracking-tight text-primary transition-colors hover:text-primary/70"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-6">
              {user ? (
                <div className="flex justify-center">
                  <UserMenu user={user} />
                </div>
              ) : (
                <Button
                  href="/supply"
                  variant="primary"
                  className="w-full text-center justify-center text-lg h-14"
                  onClick={() => setMenuOpen(false)}
                >
                  Request supply plan
                </Button>
              )}
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
}