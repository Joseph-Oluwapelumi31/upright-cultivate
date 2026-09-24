import { requireCustomer } from "@/lib/auth/authorization";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCustomer(); // Protected server-side

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Container>
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1">
            <nav className="flex flex-col gap-1 bg-surface rounded-card p-4 border border-border shadow-sm">
              <div className="px-4 py-2 mb-2 border-b border-border/50">
                <h2 className="font-display font-medium text-foreground text-base">Dashboard</h2>
              </div>
              <Link href="/dashboard" className="px-4 py-2 rounded-md hover:bg-primary/5 font-medium text-sm text-primary transition-colors">
                Overview
              </Link>
              <Link href="/dashboard/businesses" className="px-4 py-2 rounded-md hover:bg-primary/5 font-medium text-sm text-primary transition-colors">
                Businesses
              </Link>
              <Link href="/dashboard/requests" className="px-4 py-2 rounded-md hover:bg-primary/5 font-medium text-sm text-primary transition-colors">
                Supply Requests
              </Link>
            </nav>
          </aside>
          <main className="flex-1 bg-surface rounded-card p-6 md:p-8 border border-border shadow-sm">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
