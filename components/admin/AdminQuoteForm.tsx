"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuote, updateQuote } from "@/actions/admin-quote";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FormField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Package, Store, MapPin } from "lucide-react";

export default function AdminQuoteForm({ request, quote }: { request: any; quote?: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Initialize quote items from quote (if editing) or request (if creating)
  const [items, setItems] = useState(
    quote
      ? quote.items.map((item: any) => ({
          productId: item.productId,
          productName: item.productNameSnapshot,
          unit: item.unit,
          requestedQuantity: request.items.find((r: any) => r.productId === item.productId)?.quantity.toString() || "-",
          quotedQuantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
        }))
      : request.items.map((item: any) => ({
          productId: item.productId,
          productName: item.productNameSnapshot,
          unit: item.unit,
          requestedQuantity: item.quantity.toString(),
          quotedQuantity: item.quantity.toString(),
          unitPrice: "",
        }))
  );

  const [additionalCharges, setAdditionalCharges] = useState(quote?.additionalCharges?.toString() || "");
  const [validUntil, setValidUntil] = useState(
    quote?.validUntil ? new Date(quote.validUntil).toISOString().split("T")[0] : ""
  );
  const [notes, setNotes] = useState(quote?.notes || "");
  const [adminNotes, setAdminNotes] = useState(quote?.adminNotes || "");

  const handleItemChange = (index: number, field: keyof typeof items[0], value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Calculate Subtotal & Total for preview only
  const previewSubtotal = items.reduce((acc: number, item: any) => {
    const q = parseFloat(item.quotedQuantity) || 0;
    const p = parseFloat(item.unitPrice) || 0;
    return acc + (q * p);
  }, 0);
  
  const previewTotal = previewSubtotal + (parseFloat(additionalCharges) || 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData();
    if (quote) {
      formData.append("quoteId", quote.id);
    } else {
      formData.append("requestId", request.id);
    }
    if (validUntil) formData.append("validUntil", validUntil);
    if (notes) formData.append("notes", notes);
    if (adminNotes) formData.append("adminNotes", adminNotes);
    if (additionalCharges) formData.append("additionalCharges", additionalCharges);
    
    // Map items to match Zod schema
    const submitItems = items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quotedQuantity,
      unitPrice: item.unitPrice,
    }));
    
    formData.append("items", JSON.stringify(submitItems));

    startTransition(async () => {
      const action = quote ? updateQuote : createQuote;
      const result = await action({ success: false, message: "" }, formData);
      if (result.success) {
        if (quote) {
          router.push(`/admin/quotes/${quote.id}`);
        } else {
          router.push(`/admin/requests/${request.id}`);
        }
        router.refresh();
      } else {
        setError(result.message);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Context Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4 bg-muted/10">
          <div className="flex items-center gap-2 mb-3">
            <Store className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Customer Context</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Business:</span> <span className="font-medium text-foreground">{request.business.name}</span></div>
            <div><span className="text-muted-foreground">Contact:</span> <span className="text-foreground">{request.user.name}</span></div>
          </div>
        </Card>
        
        <Card className="p-4 bg-muted/10">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Delivery Context</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Location:</span> <span className="font-medium text-foreground">{request.location.name}</span></div>
            <div><span className="text-muted-foreground">Address:</span> <span className="text-foreground">{request.location.address}</span></div>
          </div>
        </Card>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {/* Quote Items */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
          <Package className="size-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Quote Items</h2>
        </div>
        
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="p-4 font-medium text-muted-foreground">Product</th>
                <th scope="col" className="p-4 font-medium text-muted-foreground">Requested</th>
                <th scope="col" className="p-4 font-medium text-muted-foreground">Quote Qty</th>
                <th scope="col" className="p-4 font-medium text-muted-foreground">Unit Price (₦)</th>
                <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item: any, index: number) => {
                const lineTotal = (parseFloat(item.quotedQuantity) || 0) * (parseFloat(item.unitPrice) || 0);
                return (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{item.productName}</td>
                    <td className="p-4 text-muted-foreground">{item.requestedQuantity} {item.unit}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Input 
                          type="text"
                          inputMode="decimal"
                          value={item.quotedQuantity}
                          onChange={(e) => handleItemChange(index, "quotedQuantity", e.target.value)}
                          className="w-24 h-9"
                          aria-label={`Quote quantity for ${item.productName}`}
                          required
                        />
                        <span className="text-muted-foreground">{item.unit}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Input 
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                        className="w-32 h-9"
                        aria-label={`Unit price for ${item.productName}`}
                        required
                      />
                    </td>
                    <td className="p-4 text-right font-medium text-foreground">
                      {formatCurrency(lineTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-border">
          {items.map((item: any, index: number) => {
            const lineTotal = (parseFloat(item.quotedQuantity) || 0) * (parseFloat(item.unitPrice) || 0);
            return (
              <div key={index} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-foreground">{item.productName}</h4>
                    <p className="text-xs text-muted-foreground">Requested: {item.requestedQuantity} {item.unit}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-muted-foreground mb-1">Line Total</span>
                    <span className="font-medium text-foreground">{formatCurrency(lineTotal)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground" htmlFor={`item-${index}-qty`}>Quote Qty ({item.unit})</Label>
                    <Input 
                      id={`item-${index}-qty`}
                      type="text"
                      inputMode="decimal"
                      value={item.quotedQuantity}
                      onChange={(e) => handleItemChange(index, "quotedQuantity", e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground" htmlFor={`item-${index}-price`}>Unit Price (₦)</Label>
                    <Input 
                      id={`item-${index}-price`}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {fieldErrors.items && (
          <div className="p-4 bg-error/5 text-error text-sm border-t border-error/20">
            {fieldErrors.items[0]}
          </div>
        )}
      </Card>

      {/* Quote Details & Summary */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <Card className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground border-b border-border pb-2">Terms & Notes</h3>
            
            <FormField
              label="Valid Until (Optional)"
              error={fieldErrors.validUntil?.[0]}
              description="After this date, the quote will expire."
            >
              {(props) => (
                <Input 
                  {...props}
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              )}
            </FormField>

            <FormField
              label="Customer Notes"
              error={fieldErrors.notes?.[0]}
              description="Visible to the customer on their quote."
            >
              {({ error, ...props }) => (
                <textarea 
                  {...props}
                  className={`flex w-full rounded-md border bg-transparent px-3 py-2 text-small transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] ${error ? "border-error focus-visible:ring-error" : "border-border hover:border-border-strong"}`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Terms, conditions, or special notes..."
                />
              )}
            </FormField>

            <FormField
              label="Admin Notes"
              error={fieldErrors.adminNotes?.[0]}
              description="Internal notes. Not visible to the customer."
            >
              {({ error, ...props }) => (
                <textarea 
                  {...props}
                  className={`flex w-full rounded-md border bg-transparent px-3 py-2 text-small transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] bg-muted/10 ${error ? "border-error focus-visible:ring-error" : "border-border hover:border-border-strong"}`}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes about margin or negotiation..."
                />
              )}
            </FormField>
          </Card>
        </div>

        <Card className="p-6 lg:sticky lg:top-6">
          <h3 className="font-semibold text-foreground mb-4">Pricing Summary</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(previewSubtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center gap-4 py-2">
              <Label className="text-sm text-muted-foreground whitespace-nowrap" htmlFor="additional-charges">Additional Charges (₦)</Label>
              <div className="flex flex-col items-end">
                <Input 
                  id="additional-charges"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(e.target.value)}
                  className={`w-32 h-9 text-right ${fieldErrors.additionalCharges ? "border-error" : ""}`}
                />
                {fieldErrors.additionalCharges && (
                  <span className="text-xs text-error mt-1">{fieldErrors.additionalCharges[0]}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total Preview</span>
              <span className="text-xl font-display font-bold text-foreground">{formatCurrency(previewTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-right">
              Final totals are calculated securely by the server.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isPending} 
            isLoading={isPending}
            className="w-full"
          >
            {quote ? "Save Changes" : "Create Draft Quote"}
          </Button>
        </Card>
      </div>
    </form>
  );
}
