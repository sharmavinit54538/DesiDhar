import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Truck, Snowflake, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ShippingReturnsPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Shipping & Returns Policy' }];

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
            <h3 className="font-bold text-sm font-heading">Morning Delivery Before 7 AM</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Order before 9:00 PM tonight to receive raw chilled milk and sweets on your doorstep early next morning.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <Snowflake className="w-8 h-8 text-sky-600" />
            <h3 className="font-bold text-sm font-heading">Sub-4°C Insulated Bags</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Each delivery includes food-grade phase-change gel ice packs that preserve product integrity for up to 3 hours after drop.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <RotateCcw className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-sm font-heading">Instant Freshness Refund</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              If any milk pouch arrives curdled or any sweet damaged, click one button for an instant 100% refund.
            </p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div>
            <h3 className="font-bold text-base text-[#4A2C17] font-heading mb-2">
              1. Delivery Charges &amp; Free Delivery
            </h3>
            <p>
              We provide <strong>FREE delivery</strong> across all serviceable pincodes on orders amounting to <strong>₹499 or more</strong>. For smaller orders below ₹499, a modest insulated logistics fee of ₹40 is added to support refrigerated cold-chain maintenance.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base text-[#4A2C17] font-heading mb-2">
              2. Return Policy for Dairy &amp; Perishables
            </h3>
            <p>
              Due to hygiene and temperature safety regulations for fresh dairy items (Milk, Paneer, Curd, Cream), opened or thawed perishable products cannot be physically returned once dropped. However, under our <strong>100% Purity Guarantee</strong>:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>If the seal is compromised upon arrival, report it immediately to Customer Care.</li>
              <li>If milk curdles upon the initial boil within 2 hours of morning delivery, send a photo to our WhatsApp line for an immediate refund or replacement.</li>
              <li>Dry items (Ghee jars, dry mithai boxes) can be returned within 48 hours if packaging is unopened.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base text-[#4A2C17] font-heading mb-2">
              3. Refund Timeline
            </h3>
            <p>
              Approved refunds are credited back to your original source payment method (UPI account or Card) within <strong>24 to 48 banking hours</strong>. For Cash on Delivery orders, refunds are issued instantly as store credits or transferred to your preferred UPI VPA.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
