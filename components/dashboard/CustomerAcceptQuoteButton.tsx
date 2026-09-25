"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { acceptQuote } from "@/actions/customer-quote";
import Button from "@/components/ui/Button";
import { Check, AlertCircle } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

export default function CustomerAcceptQuoteButton({
  quoteId,
  referenceNumber,
  totalFormatted,
}: {
  quoteId: string;
  referenceNumber: string;
  totalFormatted: string;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen && !isPending) {
        setIsModalOpen(false);
      }
    };
    
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        document.getElementById("accept-quote-confirm-btn")?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isPending]);

  const handleAccept = () => {
    setError(null);
    const formData = new FormData();
    formData.append("quoteId", quoteId);

    startTransition(async () => {
      const result = await acceptQuote({ success: false, message: "" }, formData);
      if (result.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)} 
        variant="primary"
        className="py-1 h-9"
      >
        <Check className="size-4 mr-2" />
        Accept Quote
      </Button>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accept-modal-title"
        >
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 id="accept-modal-title" className="text-xl font-bold text-foreground mb-4">Accept Quote</h2>
              
              <p className="text-body text-muted-foreground mb-6">
                You're accepting quote <strong className="text-foreground">{referenceNumber}</strong> for <strong className="text-foreground">{totalFormatted}</strong>.
              </p>
              
              <div className="flex gap-3 p-3 bg-secondary/10 text-secondary text-sm rounded-lg mb-6 border border-secondary/20">
                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                <p>
                  This confirms your acceptance of the quoted products, quantities, pricing and terms.
                </p>
              </div>

              {error && (
                <div className="mb-6">
                  <Alert variant="error">{error}</Alert>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAccept}
                  isLoading={isPending}
                  disabled={isPending}
                  variant="primary"
                >
                  <span id="accept-quote-confirm-btn" tabIndex={-1}>
                    {isPending ? "Accepting Quote..." : "Accept Quote"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
