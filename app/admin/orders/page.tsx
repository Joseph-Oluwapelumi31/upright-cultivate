import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminOrders } from "@/actions/admin-order-queries";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Search } from "lucide-react";
import { OrderStatus } from "@/lib/generated/prisma/client";
import { StatusBadge } from "@/components/ui/StatusBadge";

const formatCurrency = (amount: number | string, currency = "NGN") => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(Number(amount));
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();
  
  const params = await searchParams;
  const search = params.search || "";
  const status = (params.status || "ALL") as OrderStatus | "ALL";
  const sort = (params.sort || "newest") as "newest" | "oldest";
  const page = parseInt(params.page || "1");
  const limit = 10;

  const { items: orders, total, totalPages } = await getAdminOrders({
    search,
    status,
    sort,
    page,
    limit,
  });

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground mb-1">
            Order Management
          </h1>
          <p className="text-body text-muted-foreground">
            Manage commercial orders across all businesses.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-muted/10">
        <form className="flex flex-col md:flex-row gap-4" method="GET" action="/admin/orders">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              name="search"
              defaultValue={search}
              placeholder="Search order number, business, customer or location..."
              className="pl-9"
              aria-label="Search orders"
            />
          </div>
          <div className="flex gap-4">
            <Select name="status" defaultValue={status} className="w-full md:w-48" aria-label="Filter by Status">
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY">Ready</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
            <Select name="sort" defaultValue={sort} className="w-full md:w-40" aria-label="Sort Order">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </Select>
            <Button type="submit" variant="secondary">Filter</Button>
          </div>
        </form>
      </Card>

      {/* Results */}
      {orders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/5 border-dashed">
          <p className="text-lg font-medium text-foreground mb-2">No orders found</p>
          <p className="text-muted-foreground mb-6 max-w-md">
            No orders match your current filters. Try adjusting your search criteria.
          </p>
          <Button href="/admin/orders" variant="secondary">Clear Filters</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Desktop Table view */}
          <Card className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Order Number</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Date</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Customer</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Business</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Location</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Total</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Status</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{order.orderNumber}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-foreground">{order.business.user.name}</td>
                      <td className="p-4 text-foreground">{order.business.name}</td>
                      <td className="p-4 text-foreground">{order.location.name}</td>
                      <td className="p-4 font-medium">{formatCurrency(order.total.toString(), order.currency)}</td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline font-medium">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Card view */}
          <div className="md:hidden flex flex-col gap-4">
            {orders.map(order => (
              <Card key={order.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block mb-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-foreground text-lg">{order.orderNumber}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div>
                  <span className="text-foreground font-medium block">{formatCurrency(order.total.toString(), order.currency)}</span>
                  <span className="text-foreground">{order.business.name}</span>
                  <span className="text-muted-foreground text-sm block">{order.business.user.name} &middot; {order.location.name}</span>
                </div>
                <div className="pt-2 border-t border-border mt-1">
                  <Button href={`/admin/orders/${order.id}`} variant="secondary" className="w-full">
                    Review Order
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="text-sm text-muted-foreground">
                Showing page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button href={`/admin/orders?search=${search}&status=${status}&sort=${sort}&page=${page - 1}`} variant="secondary">
                    Previous
                  </Button>
                )}
                {page < totalPages && (
                  <Button href={`/admin/orders?search=${search}&status=${status}&sort=${sort}&page=${page + 1}`} variant="secondary">
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
