import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminSupplyRequest } from "@/actions/admin-request-queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Store, MapPin, Package, User, FileSignature, ReceiptText } from "lucide-react";
import Button from "@/components/ui/Button";
import { AdminStatusForm, AdminNotesForm } from "@/components/admin/AdminRequestForms";

export default async function AdminRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const request = await getAdminSupplyRequest(id);

  if (!request) {
    notFound();
  }

  const activeQuote = request.quotes?.[0];
  const activeOrder = activeQuote?.order;

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div>
        <Link href="/admin/requests" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to Requests
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground mb-1">
            Request {request.referenceNumber}
          </h1>
          <p className="text-body text-muted-foreground">
            Submitted on {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary border border-secondary/20">
            {request.status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Business & Customer */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="flex flex-col">
              <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
                <Store className="size-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Business Information</h2>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Name</span>
                  <span className="font-medium text-foreground">{request.business.name}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Type</span>
                  <span className="text-foreground capitalize">{request.business.type.toLowerCase().replace('_', ' ')}</span>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col">
              <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
                <User className="size-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Customer Account</h2>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Name</span>
                  <span className="font-medium text-foreground">{request.user.name}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Email</span>
                  <span className="text-foreground">{request.user.email}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Phone</span>
                  <span className="text-foreground">{request.business.contactPhone || 'N/A'}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="flex flex-col">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
              <MapPin className="size-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Delivery Information</h2>
            </div>
            <div className="p-4 grid sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Location</span>
                <span className="font-medium text-foreground">{request.location.name}</span>
              </div>
              <div>
                <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Address</span>
                <span className="text-foreground">{request.location.address}, {request.location.city}</span>
              </div>
              <div>
                <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Delivery Frequency</span>
                <span className="text-foreground capitalize">{request.frequency || 'One-time'}</span>
              </div>
              {request.preferredDeliveryDate && (
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Preferred Start Date</span>
                  <span className="text-foreground">{new Date(request.preferredDeliveryDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
              <Package className="size-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Requested Products</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Product</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Quantity</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {request.items.map(item => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{item.productNameSnapshot}</td>
                      <td className="p-4 text-foreground">{item.quantity.toString()} {item.unit}</td>
                      <td className="p-4 text-muted-foreground max-w-xs truncate" title={item.notes || ''}>
                        {item.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {request.notes && (
            <Card className="p-4 bg-muted/10 border-dashed">
              <h2 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Customer Notes</h2>
              <p className="text-sm text-foreground whitespace-pre-wrap">{request.notes}</p>
            </Card>
          )}

          {(activeQuote || activeOrder) && (
            <div className="mt-2 border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Commercial Records</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {activeQuote && (
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileSignature className="size-4 text-muted-foreground" />
                        <h3 className="font-medium text-foreground">Quote {activeQuote.referenceNumber}</h3>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                        {activeQuote.status}
                      </span>
                    </div>
                    <div className="text-lg font-display font-medium text-foreground mb-3">
                      {activeQuote.currency} {activeQuote.total.toString()}
                    </div>
                    <Button href={`/admin/quotes/${activeQuote.id}`} variant="secondary" className="w-full py-1 text-sm">
                      View Quote
                    </Button>
                  </Card>
                )}
                {activeOrder && (
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ReceiptText className="size-4 text-muted-foreground" />
                        <h3 className="font-medium text-foreground">Order {activeOrder.orderNumber}</h3>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info border border-info/20">
                        {activeOrder.status}
                      </span>
                    </div>
                    <div className="text-lg font-display font-medium text-foreground mb-3">
                      {activeOrder.currency} {activeOrder.total.toString()}
                    </div>
                    <Button href={`/admin/orders/${activeOrder.id}`} variant="secondary" className="w-full py-1 text-sm">
                      View Order
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-4 border-l-4 border-l-primary">
            <h2 className="font-semibold text-foreground mb-4">Admin Actions</h2>
            <AdminStatusForm requestId={request.id} currentStatus={request.status} />
          </Card>

          <Card className="p-4 bg-muted/5">
            <AdminNotesForm requestId={request.id} initialNotes={request.adminNotes} />
          </Card>
        </div>
      </div>
    </div>
  );
}
