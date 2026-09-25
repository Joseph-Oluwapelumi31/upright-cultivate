import { requireAdmin } from "@/lib/auth/authorization";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin(); // Protected server-side

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}
