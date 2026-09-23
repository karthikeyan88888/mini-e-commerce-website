import React from 'react';
import { OrderStatus } from '../types';

interface StockBadgeProps {
  stock: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock }) => {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-950/60 text-red-400 border border-red-800/40">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
        OUT OF STOCK
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
        LOW STOCK ({stock} LEFT)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
      IN STOCK
    </span>
  );
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const styles: Record<OrderStatus, string> = {
    PLACED: 'bg-blue-950/60 text-blue-400 border-blue-800/50',
    CONFIRMED: 'bg-purple-950/60 text-purple-300 border-purple-800/50',
    PACKED: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    SHIPPED: 'bg-copper/20 text-copper-light border-copper/40',
    DELIVERED: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${
        styles[status] || 'bg-gray-800 text-gray-300 border-gray-700'
      }`}
    >
      {status}
    </span>
  );
};
