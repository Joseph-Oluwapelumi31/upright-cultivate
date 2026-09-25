"use client";

import { useState } from "react";
import { RequestStatus } from "@/lib/generated/prisma/client";
import { updateSupplyRequestStatus, updateSupplyRequestAdminNotes } from "@/actions/admin-request";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useRouter } from "next/navigation";

export function AdminStatusForm({ requestId, currentStatus }: { requestId: string, currentStatus: RequestStatus }) {
  const [status, setStatus] = useState<RequestStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const result = await updateSupplyRequestStatus(requestId, status);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {error && <div className="text-sm text-error bg-error/10 p-2 rounded-md">{error}</div>}
      {success && <div className="text-sm text-primary bg-primary/10 p-2 rounded-md">Status updated successfully</div>}
      
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Update Status</label>
          <Select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as RequestStatus)}
            disabled={loading}
            className="w-full"
          >
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="QUOTED">Quoted</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CONVERTED">Converted</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
        </div>
        <Button onClick={handleUpdate} disabled={loading || status === currentStatus} variant="primary">
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
}

export function AdminNotesForm({ requestId, initialNotes }: { requestId: string, initialNotes: string | null }) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    setSuccess(false);
    
    try {
      await updateSupplyRequestAdminNotes(requestId, notes);
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Internal Admin Notes</label>
        {success && <span className="text-xs text-primary font-medium">Saved</span>}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Private notes visible only to admins..."
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button onClick={handleUpdate} disabled={loading || notes === (initialNotes || "")} variant="secondary">
          {loading ? "Saving..." : "Save Notes"}
        </Button>
      </div>
    </div>
  );
}
