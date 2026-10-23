import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import type { Order } from '../types';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { OrderCard } from '../components/order/OrderCard';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { Package, LogIn } from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCartStore();
  const { addToast, openAuthModal } = useUiStore();
  const user = useAuthStore((state) => state.user);
  const sessionChecked = useAuthStore((state) => state.sessionChecked);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.getOrders();
      setOrders(list);
    } catch (err) {
      setOrders([]);
      setError(err instanceof Error ? err.message : 'Your orders could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    void fetchOrders();
  }, [user, fetchOrders]);

  const handleReorder = (order: Order) => {
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
    addToast('Items added to your cart. Prices and stock will be re-verified.', 'success');
    navigate('/cart');
  };

  const handleCancel = async (orderId: string) => {
    if (!window.confirm('Cancel this order? Any confirmed payment will be queued for refund.')) {
      return;
    }
    try {
      const updated = await api.cancelOrder(orderId);
      setOrders((previous) => previous.map((order) => (order.id === orderId ? updated : order)));
      addToast(
        updated.paymentStatus === 'REFUND_PENDING'
          ? 'Order cancelled. A refund is pending with the payment provider.'
          : 'Order cancelled.',
        'info'
      );
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'The order could not be cancelled.', 'error');
    }
  };

  const breadcrumbs = [
    { label: 'My Account', path: '/account/profile' },
    { label: 'My Orders' },
  ];

  if (sessionChecked && !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 text-center shadow-xs">
          <LogIn className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold font-heading text-[#4A2C17]">Sign in to view orders</h1>
          <p className="text-sm text-stone-500 mt-2 mb-6">
            Order history is private to your account. Sign in with the mobile number used at
            checkout.
          </p>
          <Button variant="gold" onClick={() => openAuthModal()}>
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders | DesiDhar</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-heading text-[#4A2C17]">
              My Orders
            </h1>
            <p className="text-xs text-stone-500">
              Live status events recorded by the DesiDhar kitchen.
            </p>
          </div>
          <Link to="/category/all" className="text-xs font-bold text-amber-700 hover:underline">
            Continue shopping
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-44 w-full rounded-3xl" />
            <Skeleton className="h-44 w-full rounded-3xl" />
          </div>
        ) : error ? (
          <ErrorState
            title="We couldn’t load your orders"
            message={error}
            onRetry={() => void fetchOrders()}
          />
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onReorder={handleReorder}
                onCancel={handleCancel}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Package className="w-10 h-10" />}
            title="No orders yet"
            description="Once you place an order it will appear here with its live status."
            actionText="Start shopping"
            onAction={() => navigate('/category/all')}
          />
        )}
      </div>
    </>
  );
};
