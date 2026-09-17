import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

const exploreLinks = [
  { label: "Products", href: "#products" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Industries", href: "#industries" },
  { label: "Supply planner", href: "#supply-planner" },
];

export default function Footer() {
  return (
    <footer className="bg-white/55 backdrop-blur-xl  py-16 text-primary sm:py-20">
      <Container>
        {/* Main footer */}
        <div className="grid gap-12  md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label="Upright Cultivate home"
              className="inline-flex items-center gap-2.5"
            >
              <Image
                src="/logo.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 shrink-0"
              />

              <span className=" text-xl font-medium tracking-[-0.02em] text-primary">
                Upright Cultivate
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-foreground/60">
              Fresh leafy greens and culinary herbs grown closer to the
              businesses that need them.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">
              Explore
            </p>

            <nav
              aria-label="Footer navigation"
              className="flex flex-col gap-3"
            >
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-foreground/65 transition-colors duration-200 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">
              Contact
            </p>

            <div className="flex flex-col gap-3 text-sm text-foreground/65">
              <a
                href="mailto:ifetola@outlook.com"
                className="w-fit transition-colors duration-200 hover:text-primary"
              >
                ifetola@outlook.com
              </a>

              <span>Lagos, Nigeria</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-primary/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-foreground/40">
            © {new Date().getFullYear()} Upright Cultivate. All rights
            reserved.
          </p>

          <p className="text-foreground/30">
            Grown closer. Delivered fresher.
          </p>
        </div>
      </Container>
    </footer>
  );
}