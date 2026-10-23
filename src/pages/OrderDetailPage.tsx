import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import type { Order } from '../types';
import { formatINR, formatDate, formatDateTime } from '../utils/formatters';
import { useCartStore } from '../store/cartStore';
import { useUiStore } from '../store/uiStore';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { VegBadge } from '../components/common/VegBadge';
import {
  MapPin,
  Clock,
  CreditCard,
  Truck,
  RefreshCw,
  ArrowLeft,
  XCircle,
  FileText,
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCartStore();
  const { addToast } = useUiStore();

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const found = await api.getOrderById(orderId);
      setOrder(found);
      if (!found) setError('NOT_FOUND');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'This order could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((item) => {
      addItem(
        {
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          slug: item.slug,
          brand: item.brand,
          image: item.image,
          weight: item.weight,
          price: item.price,
          mrp: item.mrp,
          maxStock: item.maxStock,
          isVeg: item.isVeg,
        },
        item.quantity
      );
    });
    addToast('All items added to cart!', 'success');
    navigate('/cart');
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const updated = await api.cancelOrder(order.id);
      if (updated) {
        setOrder(updated);
        addToast('Order cancelled successfully.', 'info');
      }
    } catch {
      addToast('Failed to cancel order.', 'error');
    }
  };

  const breadcrumbs = [
    { label: 'My Account', path: '/account/profile' },
    { label: 'My Orders', path: '/account/orders' },
    { label: `#${orderId || ''}` },
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-44 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (error === 'NOT_FOUND') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold font-heading mb-2">Order Not Found</h2>
        <p className="text-stone-500 mb-6">
          We could not find an order with reference {orderId} under your account.
        </p>
        <Link to="/account/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <ErrorState
          title="Order could not be loaded"
          message={error || 'Unknown error.'}
          onRetry={() => void fetchOrder()}
        />
      </div>
    );
  }

  const isPlaced = ['PLACED', 'PENDING_PAYMENT', 'PACKED'].includes(order.status);

  return (
    <>
      <Helmet>
        <title>Order #{order.orderNumber} Details | DesiDhar</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-heading text-[#4A2C17]">
                Order #{order.orderNumber}
              </h1>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                  order.status === 'CANCELLED'
                    ? 'bg-red-100 text-red-900 border-red-300'
                    : order.status === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {order.status.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border border-stone-300 bg-stone-100 text-stone-700">
                {order.paymentStatus}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {formatDateTime(order.createdAt)} • Tracking:{' '}
              <span className="font-mono text-stone-700">
                {order.trackingNumber || 'not assigned yet'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPlaced && (
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel Order
              </Button>
            )}
            <Button
              variant="gold"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleReorder}
            >
              Reorder All
            </Button>
          </div>
        </div>

        {/* Tracking Timeline Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-bold text-sm text-[#4A2C17] font-heading">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Delivery Tracking</span>
          </div>
          <OrderTimeline timeline={order.timeline} isCancelled={order.status === 'CANCELLED'} />
        </div>

        {/* 2-Column Details: Left Items + Right Delivery/Payment */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Items Card */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 font-heading">
              Ordered Farm Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.variantId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(event) => {
                        const target = event.currentTarget;
                        if (target.dataset.hasError === 'true') return;
                        target.dataset.hasError = 'true';
                        target.src = '/images/placeholders/product-placeholder.svg';
                      }}
                      className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <VegBadge size="sm" />
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-bold text-xs text-[#4A2C17] hover:text-amber-700 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {item.weight} × <span className="font-bold text-stone-700">{item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-[#4A2C17]">
                      {formatINR(item.price * item.quantity)}
                    </div>
                    {item.mrp > item.price && (
                      <div className="text-[10px] text-stone-400 line-through">
                        {formatINR(item.mrp * item.quantity)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Address & Price */}
          <div className="md:col-span-5 space-y-4">
            {/* Delivery address */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Delivery Address</span>
              </div>
              <div className="font-bold text-xs text-[#4A2C17]">{order.address.name}</div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {order.address.addressLine1}, {order.address.addressLine2 ? `${order.address.addressLine2}, ` : ''}
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <div className="text-xs text-stone-500 font-mono">
                Phone: +91 {order.address.phone}
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-700">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Slot: {order.deliverySlot.title}</span>
              </div>
            </div>

            {/* Bill Details */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-2.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-stone-500 mb-2">
                Payment Summary ({order.paymentMethod})
              </h4>
              <div className="flex justify-between text-stone-600">
                <span>Total MRP</span>
                <span className="font-mono font-semibold">{formatINR(order.pricing.mrpTotal)}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Product Discount</span>
                  <span className="font-mono font-bold">- {formatINR(order.pricing.discount)}</span>
                </div>
              )}
              {order.pricing.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Coupon Discount</span>
                  <span className="font-mono font-bold">- {formatINR(order.pricing.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
                <span className="font-mono font-semibold">
                  {order.pricing.deliveryFee === 0 ? 'FREE' : formatINR(order.pricing.deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-dashed border-stone-200 flex justify-between items-baseline font-bold">
                <span className="text-sm text-[#4A2C17]">Order Total</span>
                <span className="text-lg font-black text-[#4A2C17] font-mono">
                  {formatINR(order.pricing.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
