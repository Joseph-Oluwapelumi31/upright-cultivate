import { requireCustomer } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default async function DashboardSettingsPage() {
  const user = await requireCustomer();
  
  const profile = await prisma.customerProfile.findUnique({
    where: { userId: user.id }
  });

  const initialData = {
    name: user.name || "",
    phone: profile?.phone || null,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-display font-medium text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground text-body">Manage your account preferences and personal information.</p>
      </div>

      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
        <SettingsForm initialData={initialData} />
      </Card>
      
      <Card className="p-6 md:p-8 bg-surface">
        <h2 className="text-xl font-semibold mb-2">Account Email</h2>
        <p className="text-muted-foreground text-sm mb-4">Your email address is used for sign-in and cannot be changed.</p>
        <div className="p-3 bg-muted/50 rounded-md border border-border inline-block">
          <span className="text-foreground font-medium">{user.email}</span>
        </div>
      </Card>
    </div>
  );
}
