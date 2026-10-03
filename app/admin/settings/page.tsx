import { requireAdmin } from "@/lib/auth/authorization";
import { Card } from "@/components/ui/Card";
import { Shield, Mail, User as UserIcon, Key } from "lucide-react";

export default async function AdminSettingsPage() {
  const user = await requireAdmin();

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground mb-1">
            Settings
          </h1>
          <p className="text-body text-muted-foreground">
            Manage your admin account settings.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-full">
              <UserIcon className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Profile Overview</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Name</label>
              <div className="font-medium text-foreground p-3 bg-muted/30 rounded-button border border-border">
                {user.name}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Email Address</label>
              <div className="font-medium text-foreground flex items-center gap-2 p-3 bg-muted/30 rounded-button border border-border">
                <Mail className="size-4 text-muted-foreground" />
                {user.email}
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 md:p-8 bg-surface border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-full">
              <Shield className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Authorization & Role</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-button border border-primary/10">
              <Key className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-primary uppercase text-sm tracking-wider mb-1">
                  {user.role} Privilege
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your account has administrative access to manage supply requests, quotes, orders, and view customers.
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground border-t border-border pt-4 mt-2">
              For security reasons, changing your email or password is only available through a formal request to IT support.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
