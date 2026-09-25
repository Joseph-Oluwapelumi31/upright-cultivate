import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="h-8 w-48 bg-muted rounded mb-2"></div>
          <div className="h-4 w-64 bg-muted/50 rounded"></div>
        </div>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 bg-surface">
        <div className="h-10 w-full bg-muted/50 rounded"></div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="h-10 w-full md:w-48 bg-muted/50 rounded"></div>
          <div className="h-10 w-full md:w-40 bg-muted/50 rounded"></div>
        </div>
      </Card>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="w-full text-left">
          <div className="bg-muted/30 border-b border-border h-12"></div>
          <div className="divide-y divide-border">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 flex items-center px-4 gap-4">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-4 w-24 bg-muted/50 rounded"></div>
                <div className="h-4 w-32 bg-muted/50 rounded"></div>
                <div className="h-4 w-32 bg-muted/50 rounded"></div>
                <div className="h-6 w-20 bg-muted rounded-full"></div>
                <div className="h-4 w-24 bg-muted/50 rounded ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
