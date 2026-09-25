import { requireCustomer } from "@/lib/auth/authorization";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCustomer(); // Protected server-side

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}
