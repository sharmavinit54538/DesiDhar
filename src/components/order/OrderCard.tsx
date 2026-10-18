import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ChevronRight, Clock, PackageCheck, Truck, RefreshCw } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onReorder: (order: Order) => void;
  onCancel?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onReorder,
  onCancel,
}) => {
  const isDelivered = order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';
  const isPlaced = order.status === 'PLACED';

  const statusPills = {
    PLACED: 'bg-amber-100 text-amber-900 border-amber-300',
    PACKED: 'bg-sky-100 text-sky-900 border-sky-300',
    OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    DELIVERED: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    CANCELLED: 'bg-red-100 text-red-900 border-red-300',
  };

  const statusLabels = {
    PLACED: 'Order Confirmed',
    PACKED: 'Cold-Packed at Farm',
    OUT_FOR_DELIVERY: 'Out for Morning Drop',
    DELIVERED: 'Delivered at Doorstep',
    CANCELLED: 'Order Cancelled',
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs hover:shadow-soft-hover transition-all space-y-4">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-[#4A2C17]">
              #{order.orderNumber}
            </span>
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                statusPills[order.status]
              }`}
            >
              {statusLabels[order.status]}
            </span>
          </div>
          <div className="text-xs text-stone-400 mt-0.5">
            Placed on {formatDate(order.createdAt)} • Slot: {order.deliverySlot.title}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-base font-black text-[#4A2C17] font-heading">
            {formatINR(order.pricing.total)}
          </div>
          <div className="text-[11px] text-stone-500">
            {order.items.reduce((s, i) => s + i.quantity, 0)} items ({order.paymentMethod})
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100 shrink-0 max-w-xs"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0"
            />
            <div className="min-w-0 pr-2">
              <div className="text-xs font-bold text-[#4A2C17] truncate">
                {item.name}
              </div>
              <div className="text-[11px] text-stone-500">
                {item.weight} × <span className="font-semibold text-stone-800">{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-stone-500">
          Delivery to: <span className="font-semibold text-stone-700">{order.address.city}</span> ({order.address.pincode})
        </div>

        <div className="flex items-center gap-2">
          {isPlaced && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(order.id)}
              className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors"
            >
              Cancel Order
            </button>
          )}

          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => onReorder(order)}
          >
            Reorder All
          </Button>

          <Link to={`/account/orders/${order.id}`}>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Track Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
