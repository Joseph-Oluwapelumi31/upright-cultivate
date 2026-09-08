import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="bg-[var(--deep-moss)] py-16 text-[var(--white)]">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-[var(--font-bricolage)] text-2xl font-semibold"
            >
              Upright.
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-[var(--white)]/60">
              Fresh leafy greens and culinary herbs grown closer to the
              businesses that need them.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--citron)]">
              Explore
            </p>

            <div className="flex flex-col gap-3 text-sm text-[var(--white)]/70">
              <Link href="#products">Products</Link>
              <Link href="#how-it-works">How it works</Link>
              <Link href="#industries">Industries</Link>
              <Link href="#supply-planner">Supply planner</Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--citron)]">
              Contact
            </p>

            <div className="flex flex-col gap-3 text-sm text-[var(--white)]/70">
              <a href="mailto:ifetola@outlook.com">
                ifetola@outlook.com
              </a>
              <span>Lagos, Nigeria</span>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--white)]/10 pt-6 text-xs text-[var(--white)]/40">
          © {new Date().getFullYear()} Upright Cultivate. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}