import { CheckCircle2, Circle, Clock } from "lucide-react";

type OrderStatus = 
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

const STATUS_PROGRESSION: { status: OrderStatus; label: string; description: string }[] = [
  { 
    status: "CONFIRMED", 
    label: "Order Confirmed", 
    description: "Your order has been confirmed and is awaiting processing."
  },
  { 
    status: "PREPARING", 
    label: "Preparing", 
    description: "Your order is currently being prepared by our team."
  },
  { 
    status: "READY", 
    label: "Ready", 
    description: "Your order is prepared and ready for dispatch."
  },
  { 
    status: "OUT_FOR_DELIVERY", 
    label: "Out for Delivery", 
    description: "Your order is on its way to your delivery location."
  },
  { 
    status: "DELIVERED", 
    label: "Delivered", 
    description: "Your order has been delivered."
  },
  { 
    status: "COMPLETED", 
    label: "Completed", 
    description: "This order is fully completed."
  }
];

export default function OrderStatusTimeline({ 
  currentStatus 
}: { 
  currentStatus: OrderStatus 
}) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="flex items-start gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
        <CheckCircle2 className="size-6 text-destructive shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-destructive">Order Cancelled</h3>
          <p className="text-sm text-destructive/80 mt-1">This order has been cancelled and will not be processed further.</p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_PROGRESSION.findIndex(s => s.status === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="relative">
      {/* Vertical line connecting the items */}
      <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-border hidden sm:block" />
      
      <div className="flex flex-col gap-6">
        {STATUS_PROGRESSION.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isCurrent = index === activeIndex;
          const isUpcoming = index > activeIndex;

          let Icon = Circle;
          let iconColor = "text-muted-foreground";
          let bgColor = "bg-surface";

          if (isCompleted) {
            Icon = CheckCircle2;
            iconColor = "text-primary";
            bgColor = "bg-surface";
          } else if (isCurrent) {
            Icon = Clock;
            iconColor = "text-primary";
            bgColor = "bg-primary/10";
          }

          return (
            <div key={step.status} className="relative flex items-start gap-4 sm:pl-0">
              <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-surface">
                <Icon className={`size-5 ${iconColor}`} />
              </div>
              <div className={`flex-1 rounded-lg p-4 sm:p-0 ${isCurrent ? 'bg-primary/5 sm:bg-transparent sm:p-0 p-4 border border-primary/20 sm:border-transparent' : ''}`}>
                <h3 className={`font-semibold ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </h3>
                {(isCurrent || isCompleted) && (
                  <p className={`text-sm mt-1 ${isCurrent ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                    {step.description}
                  </p>
                )}
                {isUpcoming && (
                  <p className="text-sm text-muted-foreground/50 mt-1">
                    Upcoming
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
