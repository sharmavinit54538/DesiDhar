import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import { Order } from '../types';
import { useCartStore } from '../store/cartStore';
import { useUiStore } from '../store/uiStore';
import { OrderCard } from '../components/order/OrderCard';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Skeleton } from '../components/common/Skeleton';
import { Package, ArrowLeft } from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();
  const { addToast } = useUiStore();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const list = await api.getOrders();
      setOrders(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem({
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
      }, item.quantity);
    });
    addToast(`Reordered ${order.items.length} items to your cart!`, 'success');
    navigate('/cart');
  };

  const handleCancel = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled dairy order?')) {
      return;
    }
    try {
      const updated = await api.cancelOrder(orderId);
      if (updated) {
        addToast('Order cancelled. Refund initiated to source method.', 'info');
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
      addToast('Failed to cancel order.', 'error');
    }
  };

  const breadcrumbs = [
    { label: 'My Account', path: '/account/profile' },
    { label: 'My Orders & Deliveries' },
  ];

  return (
    <>
      <Helmet>
        <title>My Orders &amp; Delivery Tracking | DesiDhar</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-heading text-[#4A2C17]">
              My Orders &amp; Milk Runs
            </h1>
            <p className="text-xs text-stone-500">
              Track live cold-chain status, view invoices, or reorder favorite items.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-44 w-full rounded-3xl" />
            <Skeleton className="h-44 w-full rounded-3xl" />
          </div>
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
            title="No Orders Yet"
            description="You haven't placed any dairy orders yet. Start your morning with pure A2 milk, Vedic Bilona Ghee, or sweet Kaju Katli!"
            actionText="Start Shopping"
            onAction={() => navigate('/category/all')}
          />
        )}
      </div>
    </>
  );
};
