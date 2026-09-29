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
  const normalizedStatus = (currentStatus || 'PLACED').toUpperCase() as OrderStatus;
  const currentIndex = STAGES.findIndex((s) => s.status === normalizedStatus);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const isDelivered = normalizedStatus === 'DELIVERED';

  // Desktop progress fraction across the 4 segment intervals between 5 columns
  const progressFraction = activeIndex / (STAGES.length - 1);

  return (
    <div className="w-full py-6">
      {/* ========================================================
          DESKTOP & TABLET: CONTINUOUS HORIZONTAL LIFECYCLE TRACK
          ======================================================== */}
      <div className="hidden md:block relative">
        {/* Continuous Horizontal Background & Progress Track
            Center of Col 0 is at 10%, center of Col 4 is at 90%. Total distance = 80%.
            Top is 24px (half of 48px circle) to ensure perfect vertical center alignment. */}
        <div className="absolute top-6 left-0 right-0 h-[3px] -translate-y-1/2 pointer-events-none z-0">
          {/* Inactive / Base Track Line */}
          <div
            className="absolute top-0 h-full bg-white/[0.08] rounded-full"
            style={{ left: '10%', width: '80%' }}
          />

          {/* Active Accent Progress Line */}
          <div
            className="absolute top-0 h-full bg-copper shadow-[0_0_10px_rgba(200,131,74,0.8)] rounded-full transition-all duration-700 ease-out"
            style={{
              left: '10%',
              width: `${progressFraction * 80}%`,
            }}
          />
        </div>

        {/* 5 Equal Milestone Columns */}
        <div className="grid grid-cols-5 relative z-10">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex || isDelivered;
            const isCurrent = idx === activeIndex && !isDelivered;
            const isUpcoming = idx > activeIndex && !isDelivered;
            const Icon = stage.icon;

            return (
              <div
                key={stage.status}
                className="flex flex-col items-center text-center px-2 select-none"
              >
                {/* Milestone Node Circle: Fixed 48px (w-12 h-12), centered on 24px line */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                    isCurrent
                      ? 'bg-copper text-black border-2 border-white ring-4 ring-copper/25 shadow-[0_0_16px_rgba(200,131,74,0.6)]'
                      : isCompleted
                      ? 'bg-[#141519] text-copper border-2 border-copper shadow-[0_0_10px_rgba(200,131,74,0.3)]'
                      : 'bg-[#0e0f13] text-white/25 border-2 border-white/10'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCheck className="w-5 h-5 text-copper stroke-[2.5]" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isCurrent ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  )}
                </div>

                {/* Milestone Label */}
                <span
                  className={`mt-3.5 text-xs font-headline tracking-wider uppercase font-extrabold transition-colors duration-200 ${
                    isCurrent
                      ? 'text-copper'
                      : isCompleted
                      ? 'text-white'
                      : 'text-white/30'
                  }`}
                >
                  {stage.label}
                </span>

                {/* Milestone Description */}
                <span
                  className={`mt-1 text-[11px] leading-relaxed max-w-[150px] transition-colors duration-200 ${
                    isCurrent || isCompleted ? 'text-white/60' : 'text-white/25'
                  }`}
                >
                  {stage.description}
                </span>

                {/* Active Phase Pill Indicator (fixed height to prevent layout shift) */}
                <div className="h-6 mt-2 flex items-center justify-center">
                  {isCurrent && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-copper/15 text-copper border border-copper/40 animate-pulse">
                      CURRENT PHASE
                    </span>
                  )}
                  {isCompleted && isDelivered && idx === STAGES.length - 1 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      FULFILLED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          MOBILE: CLEAN VERTICAL TIMELINE WITH ZERO OVERFLOW
          ======================================================== */}
      <div className="md:hidden relative pl-8 space-y-6">
        {/* Continuous Vertical Base & Active Line */}
        <div className="absolute top-4 bottom-4 left-4 w-[2px] -translate-x-1/2 pointer-events-none z-0">
          <div className="absolute inset-0 bg-white/[0.08]" />
          <div
            className="absolute top-0 w-full bg-copper shadow-[0_0_8px_rgba(200,131,74,0.7)] transition-all duration-700 ease-out"
            style={{
              height: `${progressFraction * 100}%`,
            }}
          />
        </div>

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex || isDelivered;
          const isCurrent = idx === activeIndex && !isDelivered;
          const Icon = stage.icon;

          return (
            <div key={stage.status} className="relative flex items-start gap-4">
              {/* Vertical Milestone Node Circle */}
              <div
                className={`w-8 h-8 rounded-full -ml-[32px] flex items-center justify-center border-2 flex-shrink-0 transition-all z-10 ${
                  isCurrent
                    ? 'bg-copper text-black border-white ring-2 ring-copper/30 shadow-[0_0_12px_rgba(200,131,74,0.7)]'
                    : isCompleted
                    ? 'bg-[#141519] text-copper border-copper'
                    : 'bg-[#0e0f13] text-white/20 border-white/10'
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCheck className="w-3.5 h-3.5 text-copper stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Text Block */}
              <div className="pt-0.5">
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-xs font-black uppercase tracking-wider font-headline ${
                      isCurrent
                        ? 'text-copper'
                        : isCompleted
                        ? 'text-white'
                        : 'text-white/30'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  {isCurrent && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-copper/20 text-copper border border-copper/40 animate-pulse">
                      ACTIVE
                    </span>
                  )}
                  {isCompleted && isDelivered && idx === STAGES.length - 1 && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      FULFILLED
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] mt-0.5 ${
                    isCurrent || isCompleted ? 'text-white/60' : 'text-white/30'
                  }`}
                >
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
