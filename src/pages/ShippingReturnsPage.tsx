import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Truck, Snowflake, RotateCcw, ShieldCheck } from 'lucide-react';
import { useStorefront } from '../context/StorefrontContext';
import { formatINR } from '../utils/formatters';

export const ShippingReturnsPage: React.FC = () => {
  const { settings } = useStorefront();
  const breadcrumbs = [{ label: 'Shipping & Returns Policy' }];
  const feeLine =
    settings && settings.freeDeliveryThreshold > 0
      ? `Delivery is free on orders of ${formatINR(
          settings.freeDeliveryThreshold
        )} or more. Below that, a delivery fee of ${formatINR(settings.deliveryFee)} applies.`
      : 'Delivery charges are calculated at checkout for your pincode.';

  return (
    <>
      <Helmet>
        <title>Shipping &amp; Returns Policy | DesiDhar Cold-Chain</title>
        <meta
          name="description"
          content="Learn about DesiDhar's morning delivery slots, cold-chain refrigerated vans, 100% money-back freshness guarantee, and refund policy."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 text-[#4A2C17]">
        <Breadcrumbs items={breadcrumbs} />

        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Cold-Chain Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-[#331B0B]">
            Shipping, Delivery &amp; Returns
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Our cold-chain logistics ensure your milk, paneer, and sweets arrive farm-fresh.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <Truck className="w-8 h-8 text-amber-600" />
            <h3 className="font-bold text-sm font-heading">Scheduled Delivery Slots</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Available windows are generated from the kitchen cut-off time and shown at checkout
              for your pincode.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <Snowflake className="w-8 h-8 text-sky-600" />
            <h3 className="font-bold text-sm font-heading">Insulated Packaging</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Products are packed in insulated carriers. Please refrigerate perishable items as soon
              as they arrive.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <RotateCcw className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-sm font-heading">Report a Problem</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              If a perishable item arrives damaged or spoiled, contact support with your order
              number and photos. Approved cases are refunded or replaced.
            </p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div>
            <h3 className="font-bold text-base text-[#4A2C17] font-heading mb-2">
              1. Delivery Charges &amp; Free Delivery
            </h3>
            <p>{feeLine}</p>
          </div>

          <div>
            <h3 className="font-bold text-base text-[#4A2C17] font-heading mb-2">
              2. Return Policy for Dairy &amp; Perishables
            </h3>
            <p>
              For hygiene and food-safety reasons, opened or thawed perishable products cannot be
              physically returned once delivered. If something is wrong with your order:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Report a compromised seal to customer care immediately.</li>
              <li>For spoiled perishables, send your order number and photos through the contact form.</li>
              <li>Unopened non-perishable items (ghee jars, dry mithai boxes) can be returned within 48 hours.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base text-[#4A2C17] font-heading mb-2">
              3. Refund Timeline
            </h3>
            <p>
              Approved refunds are processed to the original payment method by the payment provider.
              For cash-on-delivery orders, the support team will agree a refund method with you
              before processing. Refunds appear in the order timeline as a status change.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
