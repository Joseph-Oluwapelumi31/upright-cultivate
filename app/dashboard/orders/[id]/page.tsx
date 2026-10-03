import { getCustomerOrder } from "@/actions/customer-order-queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Store, MapPin, FileSignature } from "lucide-react";
import { Card } from "@/components/ui/Card";
import OrderStatusTimeline from "@/components/dashboard/order/OrderStatusTimeline";
import { StatusBadge } from "@/components/ui/StatusBadge";

const formatCurrency = (amount: number | string, currency = "NGN") => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(Number(amount));
};

export default async function DashboardOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getCustomerOrder(id);

  if (!order) {
    notFound();
  }

  const { business, location, quote, items } = order;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link 
          href="/dashboard/orders" 
          className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Back to orders"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-display font-medium text-foreground">
                {order.orderNumber}
              </h1>
              <StatusBadge status={order.status} size="lg" />
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              Placed {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Order Context */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Order Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex gap-3">
                <Store className="size-5 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Business</div>
                  <div className="text-muted-foreground">{business.name}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="size-5 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Delivery Location</div>
                  <div className="text-muted-foreground">{location.name}</div>
                  {location.address && (
                    <div className="text-muted-foreground text-xs mt-0.5">{location.address}</div>
                  )}
                </div>
              </div>
              {quote && (
                <div className="flex gap-3">
                  <FileSignature className="size-5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Source Quote</div>
                    <Link href={`/dashboard/quotes/${quote.id}`} className="text-primary hover:underline">
                      {quote.referenceNumber}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Order Items */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Order Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Product</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Quantity</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Unit Price</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-muted/10">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{item.productNameSnapshot}</div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {item.quantity.toString()} {item.unit}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap text-muted-foreground">
                        {formatCurrency(item.unitPrice.toString(), order.currency)}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap font-medium text-foreground">
                        {formatCurrency(item.lineTotal.toString(), order.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Status Timeline */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Order Status</h2>
            <OrderStatusTimeline currentStatus={order.status as any} />
          </Card>

          {/* Pricing Breakdown */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Financial Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(order.subtotal.toString(), order.currency)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Additional Charges</span>
                <span className="font-medium text-foreground">{formatCurrency(order.additionalCharges?.toString() || "0", order.currency)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">{formatCurrency(order.total.toString(), order.currency)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
