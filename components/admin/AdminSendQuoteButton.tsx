"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { sendQuote } from "@/actions/admin-quote";
import Button from "@/components/ui/Button";
import { Send, AlertCircle } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

export default function AdminSendQuoteButton({
  quoteId,
  referenceNumber,
  businessName,
  totalFormatted,
  validUntilFormatted,
}: {
  quoteId: string;
  referenceNumber: string;
  businessName: string;
  totalFormatted: string;
  validUntilFormatted: string | null;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen && !isPending) {
        setIsModalOpen(false);
      }
    };
    
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      // Small delay to allow render before focus
      setTimeout(() => {
        document.getElementById("send-quote-confirm-btn")?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isPending]);

  const handleSend = () => {
    setError(null);
    const formData = new FormData();
    formData.append("quoteId", quoteId);

    startTransition(async () => {
      const result = await sendQuote({ success: false, message: "" }, formData);
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
        className="py-1 h-9"
      >
        <Send className="size-4 mr-2" />
        Send Quote
      </Button>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            ref={modalRef}
            className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-6">
              <h2 id="modal-title" className="text-xl font-bold text-foreground mb-4">Send Quote</h2>
              
              <p className="text-body text-muted-foreground mb-6">
                You're about to send <strong className="text-foreground">{referenceNumber}</strong> to <strong className="text-foreground">{businessName}</strong>.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold text-foreground">{totalFormatted}</span>
                </div>
                {validUntilFormatted && (
                  <div className="flex justify-between items-center text-sm border-t border-border pt-3">
                    <span className="text-muted-foreground">Valid until</span>
                    <span className="font-medium text-foreground">{validUntilFormatted}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 p-3 bg-secondary/10 text-secondary text-sm rounded-lg mb-6 border border-secondary/20">
                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                <p>
                  Once sent, this quote will become customer-facing and can no longer be edited as a draft.
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
                  onClick={handleSend}
                  isLoading={isPending}
                  disabled={isPending}
                >
                  <span id="send-quote-confirm-btn" tabIndex={-1}>Send Quote</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
