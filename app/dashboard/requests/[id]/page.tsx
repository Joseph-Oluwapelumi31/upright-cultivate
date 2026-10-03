import { requireCustomer } from "@/lib/auth/authorization";
import { getSupplyRequestForUser } from "@/actions/supply-request-queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Store, MapPin, Package, FileSignature, ReceiptText } from "lucide-react";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function DashboardRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCustomer();
  const { id } = await params;
  const request = await getSupplyRequestForUser(user.id, id);

  if (!request) {
    notFound();
  }

  // Create a basic timeline based on the status
  const statuses = ['DRAFT', 'PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'CONVERTED'];
  const currentIndex = statuses.indexOf(request.status);
  const activeTimeline = request.status === 'REJECTED' || request.status === 'CANCELLED' 
    ? [request.status] 
    : ['SUBMITTED', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED'];
    
  // Find related quotes and orders
  const activeQuote = request.quotes?.[0]; // Simplified for v1
  const activeOrder = activeQuote?.order;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <Link href="/dashboard/requests" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
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
        <div className="flex items-center gap-3">
          <StatusBadge status={request.status} size="xl" />
          {request.status === 'DRAFT' && (
            <Button href={`/supply?request=${request.id}`} variant="primary">Edit Draft</Button>
          )}
        </div>
      </div>

      {/* Basic Timeline */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Request Progress</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between">
          {activeTimeline.map((step, idx) => {
            const stepIndex = statuses.indexOf(step);
            const isCompleted = stepIndex <= currentIndex;
            const isCurrent = stepIndex === currentIndex;
            
            return (
              <div key={step} className="flex items-center gap-3 sm:flex-1">
                <div className={`flex items-center justify-center size-8 rounded-full border-2 text-xs font-bold shrink-0 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-border text-muted-foreground'
                }`}>
                  {idx + 1}
                </div>
                <div className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.replace('_', ' ')}
                </div>
                {idx < activeTimeline.length - 1 && (
                  <div className="hidden sm:block flex-1 h-px bg-border mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Details */}
        <Card className="flex flex-col">
          <div className="p-6 border-b border-border bg-muted/20 flex items-center gap-3">
            <Store className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Business Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Business Name</span>
              <span className="font-medium text-foreground">{request.business.name}</span>
            </div>
            <div>
              <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Business Type</span>
              <span className="text-foreground capitalize">{request.business.type.toLowerCase().replace('_', ' ')}</span>
            </div>
            {request.business.contactName && (
              <div>
                <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Contact</span>
                <span className="text-foreground">{request.business.contactName} ({request.business.contactPhone || 'No phone'})</span>
              </div>
            )}
          </div>
        </Card>

        {/* Location Details */}
        <Card className="flex flex-col">
          <div className="p-6 border-b border-border bg-muted/20 flex items-center gap-3">
            <MapPin className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Delivery Information</h2>
          </div>
          <div className="p-6 space-y-4">
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
      </div>

      {/* Products */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20 flex items-center gap-3">
          <Package className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Requested Products</h2>
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

      {/* Customer Notes */}
      {request.notes && (
        <Card className="p-6 bg-muted/10">
          <h2 className="text-sm font-semibold mb-2 text-foreground uppercase tracking-wider">Additional Notes</h2>
          <p className="text-sm text-foreground whitespace-pre-wrap">{request.notes}</p>
        </Card>
      )}
      
      {/* Related Commercial Records */}
      {(activeQuote || activeOrder) && (
        <div className="mt-4 border-t border-border pt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Commercial Records</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {activeQuote && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      <FileSignature className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Quote</h3>
                      <p className="text-xs text-muted-foreground">{activeQuote.referenceNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={activeQuote.status} />
                </div>
                <div className="text-2xl font-display font-medium text-foreground mb-4">
                  {activeQuote.currency} {activeQuote.total.toString()}
                </div>
                <Button href={`/dashboard/quotes/${activeQuote.id}`} variant="secondary" className="w-full">
                  View Quote
                </Button>
              </Card>
            )}

            {activeOrder && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      <ReceiptText className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Order</h3>
                      <p className="text-xs text-muted-foreground">{activeOrder.orderNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={activeOrder.status} />
                </div>
                <div className="text-2xl font-display font-medium text-foreground mb-4">
                  {activeOrder.currency} {activeOrder.total.toString()}
                </div>
                <Button href={`/dashboard/orders/${activeOrder.id}`} variant="secondary" className="w-full">
                  View Order
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
