"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { rejectQuote } from "@/actions/customer-quote";
import Button from "@/components/ui/Button";
import { X, AlertCircle } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

export default function CustomerRejectQuoteButton({
  quoteId,
}: {
  quoteId: string;
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
        document.getElementById("reject-quote-confirm-btn")?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isPending]);

  const handleReject = () => {
    setError(null);
    const formData = new FormData();
    formData.append("quoteId", quoteId);

    startTransition(async () => {
      const result = await rejectQuote({ success: false, message: "" }, formData);
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
        variant="ghost"
        className="py-1 h-9 text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible:ring-destructive"
      >
        <X className="size-4 mr-2" />
        Reject Quote
      </Button>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-modal-title"
        >
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 id="reject-modal-title" className="text-xl font-bold text-foreground mb-4">Reject Quote</h2>
              
              <div className="flex gap-3 p-3 bg-destructive/10 text-destructive text-sm rounded-lg mb-6 border border-destructive/20">
                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                <p>
                  Are you sure you want to reject this quote?
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
                  onClick={handleReject}
                  isLoading={isPending}
                  disabled={isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive"
                >
                  <span id="reject-quote-confirm-btn" tabIndex={-1}>
                    {isPending ? "Rejecting Quote..." : "Reject Quote"}
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
