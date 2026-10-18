import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Order } from '../types';
import { formatINR } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { OrderTimeline } from '../components/order/OrderTimeline';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  Truck,
  Snowflake,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire confetti celebration!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#2E7D32', '#B45309', '#FDE68A'],
      });
    } catch (e) {
      console.error(e);
    }

    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const found = await api.getOrderById(orderId);
        setOrder(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <>
      <Helmet>
        <title>Order Confirmed #{orderId} | DesiDhar</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-soft text-center space-y-6">
          {/* Success Check Icon */}
          <div className="w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed &amp; Scheduled
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#4A2C17] mt-3">
              Thank You! Your Farm Dairy is on its Way.
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">
              We have received your order <strong className="text-stone-800 font-mono">#{orderId}</strong>. Fresh whole milk and artisanal sweets are being prepared under cold-chain storage.
            </p>
          </div>

          {/* Delivery Window Card */}
          {order && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-950">
                    Scheduled Morning Delivery
                  </div>
                  <div className="text-sm font-extrabold text-[#4A2C17] mt-0.5">
                    {order.deliverySlot.date} ({order.deliverySlot.timeWindow})
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 mt-1">
                    <Snowflake className="w-3 h-3 text-emerald-600" /> Insulated 4°C Box Drop
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
          )}

          {/* Order Tracking Timeline */}
          {order && (
            <div className="text-left pt-4 border-t border-stone-100">
              <h3 className="font-bold text-sm font-heading text-[#4A2C17] mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Live Cold-Chain Dispatch Timeline</span>
              </h3>
              <OrderTimeline timeline={order.timeline} />
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/account/orders" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                View All My Orders
              </Button>
            </Link>

            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="md"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Back to Farm Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
