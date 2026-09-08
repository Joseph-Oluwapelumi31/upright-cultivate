"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Why us", href: "#why" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
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
  }, []);

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
          className="flex items-center gap-2.5 rounded-full border border-white/30 bg-white/55 px-4 py-2.5 text-xl font-medium shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-200 hover:bg-white/70 max-[650px]:text-[17px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
        >
          <svg
            width="27"
            height="27"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2L15 6H9L12 2Z"
              fill="var(--primary)"
            />

            <path
              d="M12 22V8"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M12 12C12 9 9 7 6 7C6 10 9 12 12 12Z"
              stroke="var(--primary)"
              strokeWidth="1.6"
            />

            <path
              d="M12 15C12 12 15 10 18 10C18 13 15 15 12 15Z"
              stroke="var(--primary)"
              strokeWidth="1.6"
            />
          </svg>

          Upright Cultivate
        </Link>

        {/* Desktop navigation */}
        <div className="flex items-center gap-2 rounded-full bg-(--white)/90 px-2 py-2 shadow-sm backdrop-blur-sm max-[900px]:hidden">
          <nav
            className="flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2.5 text-[13px] text-(--deep-moss) opacity-80 transition-all duration-200 hover:bg-(--cream) hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="#contact"
            className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-(--primary) px-5 py-2.5 text-[13px] font-medium text-(--primary-foreground) transition-transform duration-180 hover:-translate-y-0.5"
          >
            Request supply plan
          </Link>
        </div>
      </div>
    </header>
  );
}