import { requireCustomer } from "@/lib/auth/authorization";
import { getSupplyRequestsForUser } from "@/actions/supply-request-queries";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FileText, FileSignature, Package, FileClock } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function DashboardOverviewPage() {
  const user = await requireCustomer();
  
  // Fetch data in parallel
  const [requestsResult, quotes, orders] = await Promise.all([
    getSupplyRequestsForUser(user.id),
    prisma.quote.findMany({
      where: { business: { userId: user.id } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { business: { userId: user.id } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const requests = requestsResult.items;

  // Summaries
  const pendingRequests = requests.filter(r => ['DRAFT', 'PENDING', 'SUBMITTED', 'UNDER_REVIEW'].includes(r.status));
  const activeQuotes = quotes.filter(q => ['DRAFT', 'SENT'].includes(q.status));
  const activeOrders = orders.filter(o => !['COMPLETED', 'CANCELLED'].includes(o.status));

  // Recent activity logic (combine latest 5 items)
  const activity = [
    ...requests.map(r => ({ type: 'request' as const, id: r.id, ref: r.referenceNumber, date: r.createdAt, status: r.status })),
    ...quotes.map(q => ({ type: 'quote' as const, id: q.id, ref: q.referenceNumber, date: q.createdAt, status: q.status })),
    ...orders.map(o => ({ type: 'order' as const, id: o.id, ref: o.orderNumber, date: o.createdAt, status: o.status }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  return (
    <div className="flex flex-col gap-10">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-medium text-foreground mb-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-muted-foreground text-body">
            Manage your supply plans, review quotes, and track active orders.
          </p>
        </div>
        <div className="shrink-0 mt-4 md:mt-0">
          <Button href="/supply" variant="primary">
            <p className="text-primary-foreground">Create Supply Plan</p>
          </Button>
        </div>
      </div>

      {/* Summaries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 2. Request Summary */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/5 rounded-md text-primary">
              <FileText className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">Requests</h3>
          </div>
          <div className="text-3xl font-display font-medium text-foreground mb-1">
            {pendingRequests.length}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Pending supply requests
          </p>
          <Link href="/dashboard/requests" className="text-sm font-medium text-primary hover:underline mt-auto">
            View all requests &rarr;
          </Link>
        </Card>

        {/* 3. Quote Summary */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/5 rounded-md text-primary">
              <FileSignature className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">Quotes</h3>
          </div>
          <div className="text-3xl font-display font-medium text-foreground mb-1">
            {activeQuotes.length}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Active quotes to review
          </p>
          <Link href="/dashboard/quotes" className="text-sm font-medium text-primary hover:underline mt-auto">
            View all quotes &rarr;
          </Link>
        </Card>

        {/* 4. Order Summary */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/5 rounded-md text-primary">
              <Package className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">Orders</h3>
          </div>
          <div className="text-3xl font-display font-medium text-foreground mb-1">
            {activeOrders.length}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Active delivery orders
          </p>
          <Link href="/dashboard/orders" className="text-sm font-medium text-primary hover:underline mt-auto">
            View all orders &rarr;
          </Link>
        </Card>

        {/* 5. Supply Plan Summary */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/5 rounded-md text-primary">
              <FileClock className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">Recurring</h3>
          </div>
          <div className="text-3xl font-display font-medium text-foreground mb-1">
            {requests.filter(r => r.isRecurring && r.status === 'ACCEPTED').length}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Active recurring supply plans
          </p>
          <Link href="/dashboard/requests" className="text-sm font-medium text-primary hover:underline mt-auto">
            Manage plans &rarr;
          </Link>
        </Card>
      </div>

      {/* 6. Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
          Recent Activity
        </h2>
        {activity.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No recent activity.</p>
            <Button href="/supply" variant="primary">Start Your First Plan</Button>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-card border border-border bg-surface">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-4 font-medium text-muted-foreground">Reference</th>
                  <th className="p-4 font-medium text-muted-foreground">Type</th>
                  <th className="p-4 font-medium text-muted-foreground">Status</th>
                  <th className="p-4 font-medium text-muted-foreground">Date</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activity.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium text-foreground">{item.ref}</td>
                    <td className="p-4 text-muted-foreground capitalize">{item.type}</td>
                    <td className="p-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.date.toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/${item.type}s/${item.id}`} className="text-primary hover:underline font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
