import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const exploreLinks = [
  { label: "Why us", href: "/#why" },
  { label: "Products", href: "/#products" },
  { label: "Growing system", href: "/#growing-system" },
  { label: "Industries", href: "/#industries" },
  { label: "FAQ", href: "/#faq" },
];

const businessLinks = [
  { label: "Request a supply plan", href: "/supply" },
  { label: "Our produce", href: "/#products" },
  { label: "Supply process", href: "/#growing-system" },
  { label: "For restaurants & hospitality", href: "/#industries" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <Container className="py-16 sm:py-20">
        {/* Main footer */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="Upright Cultivate home"
            >
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />

              <span className="text-base font-medium tracking-[-0.02em]">
                Upright Cultivate
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/65">
              Fresh, locally grown produce for businesses that need reliable
              quality, consistent supply, and shorter farm-to-kitchen
              distances.
            </p>

            <div className="mt-7">
              <Button variant="accent" href="/supply">
                <p className="text-accent-foreground font-medium">Plan your supply</p>
              </Button>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/40">
              Explore
            </h3>

            <nav className="mt-5 flex flex-col gap-3.5" aria-label="Explore">
              {exploreLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm text-primary-foreground/65 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* For businesses */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/40">
              For businesses
            </h3>

            <nav
              className="mt-5 flex flex-col gap-3.5"
              aria-label="For businesses"
            >
              {businessLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm text-primary-foreground/65 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/40">
              Contact
            </h3>

            <div className="mt-5 space-y-5">
              {/* WhatsApp */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-primary-foreground/40">
                  <MessageCircle size={15} strokeWidth={1.8} />
                  <span className="text-xs">WhatsApp</span>
                </div>

                <div className="flex flex-col gap-1">
                  <a
                    href="https://wa.me/2349163875845"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                  >
                    +234 916 387 5845
                  </a>

                  <a
                    href="https://wa.me/2349051787913"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                  >
                    +234 905 178 7913
                  </a>
                </div>

                <p className="mt-2 text-xs text-primary-foreground/35">
                  Fastest response.
                </p>
              </div>

              {/* Email */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-primary-foreground/40">
                  <Mail size={15} strokeWidth={1.8} />
                  <span className="text-xs">Email</span>
                </div>

                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:pelumi@maitechstudio.net"
                    className="w-fit text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                  >
                    pelumi@maitechstudio.net
                  </a>

                  <a
                    href="mailto:ifetola@maitechstudio.net"
                    className="w-fit text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                  >
                    ifetola@maitechstudio.net
                  </a>
                </div>

                <p className="mt-2 text-xs text-primary-foreground/35">
                  We reply within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business details */}
        <div className="mt-14 border-t border-primary-foreground/10 pt-7">
          <div className="grid gap-5 text-xs text-primary-foreground/35 sm:grid-cols-3">
            <div>
              <p className="text-primary-foreground/25">
                Registered business
              </p>
              <p className="mt-1">Upright Cultivate</p>
            </div>

            <div>
              <p className="text-primary-foreground/25">
                Business registration
              </p>
              <p className="mt-1">RC / BN XXXXXXXX</p>
            </div>

            <div>
              <p className="text-primary-foreground/25">Service area</p>
              <p className="mt-1">Lagos &amp; surrounding areas</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col gap-4 border-t border-primary-foreground/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-primary-foreground/30">
            © {new Date().getFullYear()} Upright Cultivate. All rights
            reserved.
          </p>

          <p className="text-xs text-primary-foreground/30">
            Grown closer. Delivered fresher.
          </p>
        </div>
      </Container>
    </footer>
  );
}