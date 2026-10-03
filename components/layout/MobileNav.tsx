"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { signOutAction } from "@/actions/auth";

const navLinks = [
  { label: "Why us", href: "/#why" },
  { label: "Products", href: "/#products" },
  { label: "Industries", href: "/#industries" },
];

export default function MobileNav({ user }: { user?: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Show navbar when scrolling up, hide when scrolling down.
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (menuOpen) return;

      const currentScrollY = window.scrollY;

      if (
        currentScrollY < lastScrollY ||
        currentScrollY <= 50
      ) {
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

  // Prevent the page from scrolling while the menu is open.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Move focus to the first navigation item when the menu opens.
  useEffect(() => {
    if (!menuOpen) return;

    const frame = window.requestAnimationFrame(() => {
      firstLinkRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);

    window.requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  };

  // Close the menu with Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 cursor-default bg-black/20 backdrop-blur-md lg:hidden"
        />
      )}

      {/* Mobile navigation */}
      <header
        className={`fixed inset-x-0 top-0 z-50 py-7 transition-transform duration-300 lg:hidden ${
          showNavbar || menuOpen
            ? "translate-y-0"
            : "-translate-y-full"
        }`}
      >
        <Container>
          <div className="relative">
            {/* Top navigation */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                aria-label="Upright Cultivate home"
                className="
                  flex size-14 shrink-0 items-center justify-center
                  rounded-full
                  border border-white/30
                  bg-surface/90
                  text-primary
                  backdrop-blur-xl
                  transition-colors duration-200
                  hover:bg-surface/70
                "
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
                className="
                  flex size-14 shrink-0 cursor-pointer items-center justify-center
                  rounded-full
                  border border-white/30
                  bg-surface/90
                  text-primary
                  backdrop-blur-xl
                  transition-colors duration-200
                  hover:bg-surface/70
                "
              >
                {menuOpen ? (
                  <X className="size-5" aria-hidden="true" />
                ) : (
                  <Menu className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Menu panel */}
            <div
              className={`
                absolute inset-x-0 top-[calc(100%+12px)]
                origin-top
                transition-[transform,opacity]
                duration-300
                ${
                  menuOpen
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
                }
              `}
            >
              <nav
                id="mobile-navigation"
                aria-label="Mobile navigation"
                aria-hidden={!menuOpen}
                inert={!menuOpen ? true : undefined}
                className="
                  rounded-3xl
                  border border-white/30
                  bg-white/95
                  p-4
                  shadow-sm
                  backdrop-blur-2xl
                "
              >
                <div className="flex flex-col gap-1">
                  {user && (
                    <div className="px-4 py-3 mb-2 border-b border-border/50">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-caption text-muted-foreground truncate">{user.email}</p>
                    </div>
                  )}

                  {navLinks.map((link, index) => (
                    <Link
                      key={link.href}
                      ref={
                        index === 0 ? firstLinkRef : undefined
                      }
                      href={link.href}
                      onClick={closeMenu}
                      className="
                        rounded-2xl
                        px-4 py-3.5
                        text-sm font-medium
                        text-primary
                        opacity-80
                        transition-colors duration-200
                        hover:bg-primary/5
                        hover:opacity-100
                      "
                    >
                      {link.label}
                    </Link>
                  ))}

                  {user ? (
                    <>
                      <Link
                        href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                        onClick={closeMenu}
                        className="
                          rounded-2xl
                          px-4 py-3.5
                          text-sm font-medium
                          text-primary
                          opacity-80
                          transition-colors duration-200
                          hover:bg-primary/5
                          hover:opacity-100
                        "
                      >
                        {user.role === "ADMIN" ? "Admin Dashboard" : "Dashboard"}
                      </Link>
                      <div className="mt-2 border-t border-border/50 pt-2">
                        <form action={signOutAction}>
                          <button
                            type="submit"
                            className="w-full text-left rounded-2xl px-4 py-3.5 text-sm font-medium text-error hover:bg-error/10 transition-colors"
                            onClick={() => {
                              // We let form submission handle the logic, but closing menu is nice UX
                              setTimeout(closeMenu, 100);
                            }}
                          >
                            Sign out
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        onClick={closeMenu}
                        className="
                          rounded-2xl
                          px-4 py-3.5
                          text-sm font-medium
                          text-primary
                          opacity-80
                          transition-colors duration-200
                          hover:bg-primary/5
                          hover:opacity-100
                        "
                      >
                        Sign in
                      </Link>
                      <Button
                        href="/supply"
                        variant="primary"
                        className="mt-2 w-full"
                        onClick={closeMenu}
                      >
                        Request supply plan
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}

