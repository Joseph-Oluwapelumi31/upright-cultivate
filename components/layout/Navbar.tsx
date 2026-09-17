"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

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
      <Container className="relative hidden lg:block ">
        <div className="flex items-center justify-between">
          {/* Logo */}
        <Link
          href="#"
          aria-label="Upright Cultivate home"
          className="flex items-center gap-2.5 rounded-full border border-white/30 bg-background p-4 md:px-4 md:py-2.5 text-xl font-medium text-primary transition-colors duration-200 hover:bg-white/70"
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
        <div className="flex items-center gap-2 rounded-full bg-surface/90 px-2 py-2 shadow-sm ">
          <nav
            className="flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2.5 text-primary transition-colors duration-200 hover:bg-surface hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button
            href="#supply-planner"
            variant="primary"
          >
            <p className="text-primary-foreground">Request supply plan</p>
          </Button>
        </div>

        </div>
      </Container>
    </header>
  );
}