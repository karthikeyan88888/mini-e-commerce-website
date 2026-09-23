import React from 'react';
import { CheckCircle2, Clock, PackageCheck, Truck, CheckCheck } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  orderDate?: string;
  updatedDate?: string;
}

const STAGES: Array<{
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}> = [
  {
    status: 'PLACED',
    label: 'Order Placed',
    description: 'Order details received and verified.',
    icon: Clock,
  },
  {
    status: 'CONFIRMED',
    label: 'Confirmed',
    description: 'Inventory allocated & queued for production.',
    icon: CheckCircle2,
  },
  {
    status: 'PACKED',
    label: 'Packed',
    description: 'Custom acoustic packaging & quality test pass.',
    icon: PackageCheck,
  },
  {
    status: 'SHIPPED',
    label: 'Shipped',
    description: 'Handed to premium courier for expedited transit.',
    icon: Truck,
  },
  {
    status: 'DELIVERED',
    label: 'Delivered',
    description: 'Safely delivered to customer address.',
    icon: CheckCheck,
  },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const currentIndex = STAGES.findIndex((s) => s.status === currentStatus);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="w-full py-8">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background Track Line */}
        <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-[2px] bg-white/10 z-0" />

        {/* Completed Progress Line with Copper treatment */}
        <div
          className="absolute top-1/2 left-10 -translate-y-1/2 h-[2px] bg-copper shadow-[0_0_8px_#C8834A] transition-all duration-700 z-0"
          style={{
            width: `${(activeIndex / (STAGES.length - 1)) * 100}%`,
          }}
        />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isUpcoming = idx > activeIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.status} className="relative z-10 flex flex-col items-center text-center max-w-[150px]">
              {/* Node Icon */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-copper text-black border-2 border-white shadow-[0_0_20px_rgba(200,131,74,0.6)] scale-110'
                    : isCompleted
                    ? 'bg-[#181a20] text-copper border-2 border-copper/60 shadow-[0_0_10px_rgba(200,131,74,0.2)]'
                    : 'bg-[#0e0f13] text-white/25 border-2 border-white/10'
                }`}
              >
                <Icon className={`w-6 h-6 ${isCurrent ? 'stroke-[2.5]' : ''}`} />
              </div>

              {/* Status Label */}
              <span
                className={`mt-4 text-xs font-black font-headline tracking-widest uppercase ${
                  isCurrent ? 'text-copper scale-105' : isCompleted ? 'text-white' : 'text-white/30'
                }`}
              >
                {stage.label}
              </span>

              {/* Description */}
              <span className="mt-1 text-[11px] text-white/50 leading-tight">
                {stage.description}
              </span>

              {isCurrent && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-copper/20 text-copper border border-copper/40 animate-pulse">
                  ACTIVE PHASE
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-6 relative pl-6">
        <div className="absolute top-4 bottom-4 left-3 w-[2px] bg-white/10" />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.status} className="relative flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full -ml-[25px] flex items-center justify-center border-2 ${
                  isCurrent
                    ? 'bg-copper text-black border-white shadow-[0_0_14px_rgba(200,131,74,0.7)]'
                    : isCompleted
                    ? 'bg-[#181a20] text-copper border-copper/60'
                    : 'bg-[#0e0f13] text-white/20 border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <h4
                  className={`text-xs font-black uppercase tracking-wider ${
                    isCurrent ? 'text-copper' : isCompleted ? 'text-white' : 'text-white/30'
                  }`}
                >
                  {stage.label}
                </h4>
                <p className="text-[11px] text-white/50 mt-0.5">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
