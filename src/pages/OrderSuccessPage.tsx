import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import type { Order } from '../types';
import { formatINR } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  Truck,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!orderId) {
      setLoading(false);
      setError('Order reference missing.');
      return;
    }
    setLoading(true);
    api
      .getOrderById(orderId)
      .then((found) => {
        if (!active) return;
        if (!found) setError('We could not find this order under your account.');
        else setOrder(found);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Order could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-52 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-3xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <ErrorState
          title="Order not available"
          message={error || 'This order does not exist.'}
        />
        <div className="text-center mt-4">
          <Link to="/account/orders">
            <Button variant="outline">Go to my orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const awaitingPayment =
    order.status === 'PENDING_PAYMENT' && order.paymentStatus === 'PENDING';
  const isCancelled = order.status === 'CANCELLED';

  return (
    <>
      <Helmet>
        <title>Order #{order.orderNumber} | DesiDhar</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-soft text-center space-y-6">
          <div
            className={`w-18 h-18 rounded-full flex items-center justify-center mx-auto ring-8 ${
              awaitingPayment || isCancelled
                ? 'bg-amber-100 text-amber-600 ring-amber-50'
                : 'bg-emerald-100 text-emerald-600 ring-emerald-50'
            }`}
          >
            {awaitingPayment || isCancelled ? (
              <AlertTriangle className="w-10 h-10" />
            ) : (
              <CheckCircle2 className="w-10 h-10" />
            )}
          </div>

          <div>
            <span
              className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                awaitingPayment || isCancelled
                  ? 'text-amber-800 bg-amber-50 border-amber-200'
                  : 'text-emerald-800 bg-emerald-50 border-emerald-200'
              }`}
            >
              {isCancelled
                ? 'Order cancelled'
                : awaitingPayment
                ? 'Awaiting payment confirmation'
                : 'Order placed'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#4A2C17] mt-3">
              {isCancelled
                ? 'This order was cancelled'
                : awaitingPayment
                ? 'Your order is saved — payment is pending'
                : 'Thank you for your order'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">
              Order <strong className="text-stone-800 font-mono">#{order.orderNumber}</strong>.
              {awaitingPayment
                ? ' It will be confirmed only after the payment provider verifies your transaction.'
                : ' The kitchen will update the status as the order is packed and dispatched.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-950">Requested delivery slot</div>
                <div className="text-sm font-extrabold text-[#4A2C17] mt-0.5">
                  {order.deliverySlot.date} ({order.deliverySlot.timeWindow})
                </div>
                <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-emerald-600" /> Confirmed by the kitchen once packed
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t sm:border-t-0 sm:border-l border-amber-200 pt-3 sm:pt-0 sm:pl-4">
              <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-950">
                  Delivering to {order.address.name}
                </div>
                <div className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                  {order.address.addressLine1}, {order.address.city} - {order.address.pincode}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm font-bold text-[#4A2C17] p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span>
              {order.paymentMethod} · {order.paymentStatus}
            </span>
            <span className="font-mono">{formatINR(order.pricing.total)}</span>
          </div>

          <div className="text-left pt-4 border-t border-stone-100">
            <h3 className="font-bold text-sm font-heading text-[#4A2C17] mb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Order status</span>
            </h3>
            {order.timeline.length === 0 ? (
              <p className="text-xs text-stone-500">No status events recorded yet.</p>
            ) : (
              <OrderTimeline timeline={order.timeline} isCancelled={isCancelled} />
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/account/orders" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                View all my orders
              </Button>
            </Link>

            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="md"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
