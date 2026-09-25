import { requireAdmin } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Users, FileText, FileSignature, Package, AlertCircle } from "lucide-react";

export default async function AdminOverviewPage() {
  const user = await requireAdmin();
  
  // Fetch stats in parallel
  const [
    totalCustomers,
    pendingRequests,
    recentRequests,
    recentOrders
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.supplyRequest.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
    prisma.supplyRequest.findMany({ include: { business: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.order.findMany({ include: { business: true }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <h1 className="text-3xl font-display font-medium text-foreground mb-1">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-body">
          Platform overview, attention areas, and recent activities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/5 rounded-md text-primary">
              <Users className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">Customers</h3>
          </div>
          <div className="text-3xl font-display font-medium text-foreground mb-1">
            {totalCustomers}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Registered customer accounts
          </p>
        </Card>

        <Card className="flex flex-col p-6 border-l-4 border-l-warning">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-warning/10 rounded-md text-warning">
              <AlertCircle className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">Action Needed</h3>
          </div>
          <div className="text-3xl font-display font-medium text-foreground mb-1">
            {pendingRequests}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Requests awaiting review
          </p>
          <Link href="/admin/requests?status=SUBMITTED" className="text-sm font-medium text-primary hover:underline mt-4">
            Review now &rarr;
          </Link>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
            <h2 className="text-xl font-semibold text-foreground">Recent Requests</h2>
            <Link href="/admin/requests" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          {recentRequests.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No recent requests.</Card>
          ) : (
            <div className="flex flex-col gap-3">
              {recentRequests.map(req => (
                <Card key={req.id} className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                  <div>
                    <Link href={`/admin/requests/${req.id}`} className="font-medium text-foreground hover:underline">
                      {req.referenceNumber}
                    </Link>
                    <p className="text-sm text-muted-foreground">{req.business.name}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                    {req.status}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
            <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No recent orders.</Card>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map(order => (
                <Card key={order.id} className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                  <div>
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-foreground hover:underline">
                      {order.orderNumber}
                    </Link>
                    <p className="text-sm text-muted-foreground">{order.business.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{order.currency} {order.total.toString()}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-info/10 text-info border border-info/20 mt-1">
                      {order.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
