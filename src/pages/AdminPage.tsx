import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import type {
  AdminCoupon,
  AdminMessage,
  AdminOrder,
  AdminProduct,
  AdminReview,
  AdminStats,
} from '../types/admin';
import { formatINR, formatDateTime } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import {
  LayoutDashboard,
  Package,
  Truck,
  Star,
  Mail,
  Ticket,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';

type Tab = 'overview' | 'inventory' | 'orders' | 'reviews' | 'coupons' | 'messages';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'orders', label: 'Orders', icon: Truck },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'messages', label: 'Messages', icon: Mail },
];

const ORDER_STATUSES = ['PLACED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export const AdminPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const sessionChecked = useAuthStore((state) => state.sessionChecked);
  const { openAuthModal, addToast } = useUiStore();

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    setError(null);
    try {
      if (tab === 'overview') setStats(await api.adminGetStats());
      if (tab === 'inventory') setProducts(await api.adminGetProducts());
      if (tab === 'orders') setOrders(await api.adminGetOrders());
      if (tab === 'reviews') setReviews(await api.adminGetReviews());
      if (tab === 'coupons') setCoupons(await api.adminGetCoupons());
      if (tab === 'messages') setMessages(await api.adminGetMessages());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin data could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [tab, user]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  if (sessionChecked && !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold font-heading text-[#4A2C17]">Admin access required</h1>
        <p className="text-sm text-stone-500 mt-2 mb-6">
          Sign in with a staff mobile number to open the operations console.
        </p>
        <Button variant="gold" onClick={() => openAuthModal()}>
          Sign in
        </Button>
      </div>
    );
  }

  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShieldAlert className="w-10 h-10 text-red-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold font-heading text-[#4A2C17]">Not authorised</h1>
        <p className="text-sm text-stone-500 mt-2 mb-6">
          This account does not have the admin role. An existing administrator can grant access with{' '}
          <code className="bg-stone-100 px-1.5 py-0.5 rounded">npm run admin:grant -- &lt;phone&gt;</code>.
        </p>
        <Link to="/">
          <Button variant="outline">Back to store</Button>
        </Link>
      </div>
    );
  }

  const updateStock = async (
    product: AdminProduct,
    variantId: string,
    field: 'stock' | 'price' | 'mrp',
    value: number
  ) => {
    try {
      const payload =
        field === 'stock'
          ? { stock: value }
          : field === 'price'
            ? { price: value }
            : { mrp: value };
      await api.adminUpdateVariant(product.id, variantId, payload);
      addToast('Inventory updated.', 'success');
      setReloadKey((key) => key + 1);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    }
  };

  const toggleFlag = async (
    product: AdminProduct,
    field: 'isActive' | 'isFeatured' | 'isFresh' | 'isDeal'
  ) => {
    try {
      await api.adminUpdateProduct(product.id, { [field]: !product[field] });
      addToast('Product updated.', 'success');
      setReloadKey((key) => key + 1);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    }
  };

  const changeOrderStatus = async (order: AdminOrder, status: string) => {
    try {
      await api.adminUpdateOrder(order.id, { status });
      addToast(`Order ${order.orderNumber} moved to ${status}.`, 'success');
      setReloadKey((key) => key + 1);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Order update failed.', 'error');
    }
  };

  const moderateReview = async (review: AdminReview, status: 'published' | 'hidden') => {
    try {
      await api.adminModerateReview(review.id, status);
      addToast(`Review ${status}.`, 'success');
      setReloadKey((key) => key + 1);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Moderation failed.', 'error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Console | DesiDhar</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black font-heading text-[#4A2C17]">Operations Console</h1>
            <p className="text-xs text-stone-500">
              Live data from the DesiDhar database. All metrics are computed server-side.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Refresh
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-stone-200 pb-2">
          {TABS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-colors ${
                  tab === item.id
                    ? 'bg-amber-500 border-amber-600 text-stone-950'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        )}

        {!loading && error && (
          <ErrorState
            title="Admin data unavailable"
            message={error}
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        )}

        {!loading && !error && tab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Orders', value: stats.orders.total, hint: `${stats.orders.open} open` },
                {
                  label: "Today's orders",
                  value: stats.orders.todayCount,
                  hint: formatINR(stats.orders.todayValue),
                },
                { label: 'Customers', value: stats.customers, hint: 'registered' },
                {
                  label: 'Units in stock',
                  value: stats.catalog.unitsInStock,
                  hint: `${stats.catalog.variantsOutOfStock} variants out of stock`,
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs"
                >
                  <div className="text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                    {card.label}
                  </div>
                  <div className="text-2xl font-black text-[#4A2C17] font-heading mt-1">
                    {card.value.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{card.hint}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 text-xs">
                <div className="font-bold text-stone-500 uppercase tracking-wider text-[11px]">
                  Revenue confirmed
                </div>
                <div className="text-xl font-black text-emerald-700 mt-1">
                  {formatINR(stats.revenue.paid)}
                </div>
                <div className="text-stone-500 mt-1">
                  Paid online. COD collected on delivery: {formatINR(stats.revenue.codCollected)}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 p-4 text-xs">
                <div className="font-bold text-stone-500 uppercase tracking-wider text-[11px]">
                  Catalogue
                </div>
                <div className="text-xl font-black text-[#4A2C17] mt-1">
                  {stats.catalog.products} products
                </div>
                <div className="text-stone-500 mt-1">
                  {stats.catalog.inactiveProducts} inactive · {stats.catalog.variantsLowStock} low
                  stock variants
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 p-4 text-xs">
                <div className="font-bold text-stone-500 uppercase tracking-wider text-[11px]">
                  Needs attention
                </div>
                <div className="text-xl font-black text-amber-700 mt-1">
                  {stats.pendingReviews} reviews
                </div>
                <div className="text-stone-500 mt-1">
                  {stats.openMessages} open support messages
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <h2 className="font-bold text-sm text-[#4A2C17] mb-2">Recent orders</h2>
              {stats.recentOrders.length === 0 ? (
                <p className="text-xs text-stone-500">No orders have been placed yet.</p>
              ) : (
                <div className="divide-y divide-stone-100 text-xs">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="py-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-mono font-bold">{order.orderNumber}</div>
                        <div className="text-stone-500">
                          {order.address.name} · {order.deliverySlot.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatINR(order.pricing.total)}</div>
                        <div className="text-stone-500">
                          {order.status} · {order.paymentStatus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !error && tab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#4A2C17]">Products &amp; variants</h2>
              <span className="text-[11px] text-stone-500">{products.length} products</span>
            </div>
            {products.length === 0 ? (
              <EmptyState
                icon={<Package className="w-8 h-8" />}
                title="No products"
                description="The catalogue is empty. Import or add products before managing stock."
              />
            ) : (
              <div className="divide-y divide-stone-100">
                {products.map((product) => (
                  <div key={product.id} className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-[#4A2C17]">{product.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {product.brand} · {product.category} · {product.slug}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          [
                            ['isActive', 'Active'],
                            ['isFeatured', 'Featured'],
                            ['isFresh', 'Fresh'],
                            ['isDeal', 'Deal'],
                          ] as const
                        ).map(([field, label]) => (
                          <button
                            key={field}
                            type="button"
                            onClick={() => void toggleFlag(product, field)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                              product[field]
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-stone-50 text-stone-500 border-stone-200'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {product.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="p-2.5 rounded-xl border border-stone-200 text-[11px] space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-800">{variant.weight}</span>
                            <span className="font-mono text-stone-500">{variant.sku}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-stone-500 w-12">Stock</label>
                            <input
                              type="number"
                              min={0}
                              defaultValue={variant.stock}
                              onBlur={(event) => {
                                const value = Number(event.target.value);
                                if (Number.isInteger(value) && value !== variant.stock) {
                                  void updateStock(product, variant.id, 'stock', value);
                                }
                              }}
                              className="w-20 px-2 py-1 rounded border border-stone-200 font-mono"
                            />
                            <span className="text-stone-500">Price ₹</span>
                            <input
                              type="number"
                              min={1}
                              defaultValue={variant.price}
                              onBlur={(event) => {
                                const value = Number(event.target.value);
                                if (Number.isFinite(value) && value !== variant.price) {
                                  void updateStock(product, variant.id, 'price', value);
                                }
                              }}
                              className="w-20 px-2 py-1 rounded border border-stone-200 font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && !error && tab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#4A2C17]">Orders</h2>
              <span className="text-[11px] text-stone-500">{orders.length} orders</span>
            </div>
            {orders.length === 0 ? (
              <EmptyState
                icon={<Truck className="w-8 h-8" />}
                title="No orders yet"
                description="Orders appear here as soon as customers check out."
              />
            ) : (
              <div className="divide-y divide-stone-100 text-xs">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-[#4A2C17]">{order.orderNumber}</div>
                      <div className="text-stone-500">
                        {order.customerName || 'Customer'} · {order.customerPhone} ·{' '}
                        {order.lineCount} lines
                      </div>
                      <div className="text-stone-400">
                        {formatDateTime(order.createdAt)} · slot {order.slotDate} ({order.slotWindow}
                        )
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">{formatINR(order.total)}</span>
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {order.paymentMethod} / {order.paymentStatus}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={(event) => void changeOrderStatus(order, event.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-stone-200 font-semibold"
                        aria-label={`Update status for ${order.orderNumber}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && !error && tab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#4A2C17]">Customer reviews</h2>
              <span className="text-[11px] text-stone-500">{reviews.length} reviews</span>
            </div>
            {reviews.length === 0 ? (
              <EmptyState
                icon={<Star className="w-8 h-8" />}
                title="No reviews yet"
                description="Reviews submitted by signed-in customers will appear here for moderation."
              />
            ) : (
              <div className="divide-y divide-stone-100 text-xs">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold">
                        {review.rating}★ · {review.userName}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-stone-100">{review.status}</span>
                    </div>
                    <div className="text-stone-500">
                      {review.productName || review.productId} ·{' '}
                      {formatDateTime(review.date)}
                    </div>
                    <p className="text-stone-700">{review.comment}</p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => void moderateReview(review, 'published')}
                        className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                      >
                        Publish
                      </button>
                      <button
                        type="button"
                        onClick={() => void moderateReview(review, 'hidden')}
                        className="px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200 font-bold"
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && !error && tab === 'coupons' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#4A2C17]">Coupons</h2>
              <span className="text-[11px] text-stone-500">{coupons.length} codes</span>
            </div>
            {coupons.length === 0 ? (
              <EmptyState
                icon={<Ticket className="w-8 h-8" />}
                title="No coupons"
                description="Coupon codes configured by the business will appear here."
              />
            ) : (
              <div className="divide-y divide-stone-100 text-xs">
                {coupons.map((coupon) => (
                  <div key={coupon.code} className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-mono font-bold">{coupon.code}</div>
                      <div className="text-stone-500">{coupon.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        void api
                          .adminToggleCoupon(coupon.code, !coupon.isActive)
                          .then(() => setReloadKey((key) => key + 1))
                          .catch((err) =>
                            addToast(
                              err instanceof Error ? err.message : 'Coupon update failed.',
                              'error'
                            )
                          )
                      }
                      className={`px-2.5 py-1 rounded-lg font-bold border ${
                        coupon.isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-stone-50 text-stone-500 border-stone-200'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && !error && tab === 'messages' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#4A2C17]">Support messages</h2>
              <span className="text-[11px] text-stone-500">{messages.length} messages</span>
            </div>
            {messages.length === 0 ? (
              <EmptyState
                icon={<Mail className="w-8 h-8" />}
                title="Inbox empty"
                description="Messages sent through the contact form will appear here."
              />
            ) : (
              <div className="divide-y divide-stone-100 text-xs">
                {messages.map((message) => (
                  <div key={message.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold">
                        {message.subject} · {message.name}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-stone-100">{message.status}</span>
                    </div>
                    <div className="text-stone-500">
                      {message.phone}
                      {message.email ? ` · ${message.email}` : ''} ·{' '}
                      {formatDateTime(message.createdAt)}
                    </div>
                    <p className="text-stone-700">{message.message}</p>
                    {message.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() =>
                          void api
                            .adminResolveMessage(message.id)
                            .then(() => setReloadKey((key) => key + 1))
                            .catch((err) =>
                              addToast(
                                err instanceof Error ? err.message : 'Message update failed.',
                                'error'
                              )
                            )
                        }
                        className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                      >
                        Mark resolved
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPage;
