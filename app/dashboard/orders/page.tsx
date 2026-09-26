import { getCustomerOrders } from "@/actions/customer-order-queries";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const formatCurrency = (amount: number | string, currency = "NGN") => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(Number(amount));
};

export default async function DashboardOrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <h1 className="text-3xl font-display font-medium text-foreground mb-1">Orders</h1>
        <p className="text-muted-foreground text-body">Track and manage your commercial orders.</p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-foreground">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            When you accept a quote, it will become an order here.
          </p>
          <Button href="/dashboard/quotes" variant="primary">View Quotes</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="hidden md:block overflow-hidden rounded-card border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Order #</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Quote Ref</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Business</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Total</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Date</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Status</th>
                  <th scope="col" className="p-4 text-right"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium text-foreground">{order.orderNumber}</td>
                    <td className="p-4 text-muted-foreground">{order.quote.referenceNumber}</td>
                    <td className="p-4 text-muted-foreground">{order.business.name}</td>
                    <td className="p-4 font-medium">{formatCurrency(order.total.toString(), order.currency)}</td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/orders/${order.id}`} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {orders.map(order => (
              <Card key={order.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-foreground">{order.orderNumber}</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(order.total.toString(), order.currency)}</div>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                    {order.status}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="text-foreground">{order.business.name}</div>
                  <div className="text-muted-foreground">Quote: {order.quote.referenceNumber}</div>
                  <div className="text-muted-foreground mt-1">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="pt-2 border-t border-border flex justify-end">
                  <Link href={`/dashboard/orders/${order.id}`} className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
                    View Details &rarr;
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
