"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { selectBusinessAction } from "@/actions/business-session";
import { deactivateBusinessAction, reactivateBusinessAction, deleteBusinessAction } from "@/actions/business";
import { Building2, MapPin, Map, Edit, Check, Trash, Power, PowerOff } from "lucide-react";

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    type: string;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    locations?: { id: string, name: string }[];
    isActive?: boolean;
    hasHistory?: boolean;
  };
  isSelected: boolean;
}

export function BusinessCard({ business, isSelected }: BusinessCardProps) {
  const router = useRouter();
  const [isPendingSelect, startTransitionSelect] = useTransition();
  const [isPendingDeactivate, startTransitionDeactivate] = useTransition();

  const handleSelect = () => {
    startTransitionSelect(async () => {
      await selectBusinessAction(business.id, "/dashboard/businesses");
    });
  };

  const handleDeactivate = () => {
    if (window.confirm("This business has history and cannot be deleted. Deactivate it instead? It will no longer be selectable for new requests.")) {
      startTransitionDeactivate(async () => {
        const result = await deactivateBusinessAction(business.id);
        if (result.success) {
          router.refresh();
        } else {
          alert("Failed to deactivate.");
        }
      });
    }
  };
  
  const handleReactivate = () => {
    startTransitionDeactivate(async () => {
      const result = await reactivateBusinessAction(business.id);
      if (result.success) {
        router.refresh();
      } else {
        alert("Failed to reactivate.");
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to permanently delete this business? This action cannot be undone.")) {
      startTransitionDeactivate(async () => {
        const result = await deleteBusinessAction(business.id);
        if (result.success) {
          router.refresh();
        } else {
          if (result.error === "HAS_HISTORY") {
            alert("Cannot delete business because it has supply history. Deactivate it instead.");
          } else if (result.error === "HAS_LOCATIONS") {
            alert("Cannot delete business because it has locations attached. Please delete locations first.");
          } else {
            alert("Failed to delete business.");
          }
        }
      });
    }
  };

  const isInactive = business.isActive === false;

  return (
    <div className={`rounded-card border bg-surface p-6 flex flex-col transition-colors ${isSelected ? 'border-primary shadow-sm ring-1 ring-primary/20' : (isInactive ? 'border-border opacity-70 bg-surface/50' : 'border-border hover:border-primary/30')}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className={`text-lg font-semibold ${isInactive ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{business.name}</h2>
            {isSelected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Check className="size-3" /> Selected
              </span>
            )}
            {isInactive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 text-neutral-600 px-2.5 py-0.5 text-xs font-medium">
                Deactivated
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-muted-foreground">{business.type.replace(/_/g, ' ')}</p>
        </div>
      </div>
      
      <div className="text-sm space-y-2 mb-6 flex-1">
        {business.contactName && (
          <div>
            <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Contact</span>
            <span className="text-foreground">{business.contactName}</span>
          </div>
        )}
        {business.contactPhone && (
          <div>
            <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Phone</span>
            <span className="text-foreground">{business.contactPhone}</span>
          </div>
        )}
        {business.contactEmail && (
          <div>
            <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Email</span>
            <span className="text-foreground">{business.contactEmail}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-auto border-t border-border pt-4">
        {!isSelected && !isInactive && (
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleSelect}
            disabled={isPendingSelect || isPendingDeactivate}
          >
            {isPendingSelect ? "Selecting..." : "Select"}
          </Button>
        )}
        
        <Button
          href={`/dashboard/businesses/${business.id}/edit`}
          variant="secondary"
          className="flex-1"
        >
          <Edit className="size-4 mr-2" />
          Edit
        </Button>

        {isInactive ? (
          <Button
            type="button"
            variant="secondary"
            className="px-3"
            onClick={handleReactivate}
            disabled={isPendingSelect || isPendingDeactivate}
            title="Reactivate Business"
          >
            <span className="sr-only">Reactivate</span>
            <Power className="size-4" />
          </Button>
        ) : (
          business.hasHistory ? (
            <Button
              type="button"
              variant="secondary"
              className="px-3 text-warning hover:bg-warning/10 hover:text-warning hover:border-warning/30"
              onClick={handleDeactivate}
              disabled={isPendingSelect || isPendingDeactivate}
              title="Deactivate Business (Has History)"
            >
              <span className="sr-only">Deactivate</span>
              <PowerOff className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="px-3 text-error hover:bg-error/10 hover:text-error hover:border-error/30"
              onClick={handleDelete}
              disabled={isPendingSelect || isPendingDeactivate}
              title="Delete Business"
            >
              <span className="sr-only">Delete</span>
              <Trash className="size-4" />
            </Button>
          )
        )}
      </div>
    </div>
  );
}
