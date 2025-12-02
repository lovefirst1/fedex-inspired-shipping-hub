import { Package, Warehouse, Plane, Truck, PackageCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShipmentProgressTrackerProps {
  status: string;
  heldByCustoms?: boolean;
  className?: string;
}

const stages = [
  { key: "order received", label: "Order Received", icon: Package },
  { key: "picked up", label: "Picked Up", icon: Package },
  { key: "departed origin facility", label: "Departed Origin", icon: Warehouse },
  { key: "in transit", label: "In Transit", icon: Plane },
  { key: "customs check", label: "Customs Check", icon: AlertTriangle },
  { key: "arrived at local facility", label: "Local Facility", icon: Warehouse },
  { key: "out for delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: PackageCheck },
];

const getStageIndex = (status: string) => {
  const index = stages.findIndex(s => s.key === status.toLowerCase());
  return index >= 0 ? index : 0;
};

const ShipmentProgressTracker = ({ status, heldByCustoms, className }: ShipmentProgressTrackerProps) => {
  const currentIndex = getStageIndex(status);

  return (
    <div className={cn("w-full", className)}>
      {/* Customs Alert */}
      {heldByCustoms && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-red-700">Package is currently held by customs</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-primary via-accent to-accent rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        />

        {/* Stage Icons */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={stage.key} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
                    isCompleted && !isCurrent && "bg-primary text-primary-foreground",
                    isCurrent && "bg-accent text-accent-foreground ring-4 ring-accent/30 animate-pulse",
                    !isCompleted && "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span 
                  className={cn(
                    "text-xs mt-2 text-center max-w-[60px] leading-tight",
                    isCurrent && "font-bold text-accent",
                    isCompleted && !isCurrent && "font-medium text-primary",
                    !isCompleted && "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShipmentProgressTracker;