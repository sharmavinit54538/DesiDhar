import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useStorefront } from '../context/StorefrontContext';
import { ShieldCheck, Snowflake, HeartHandshake, Sparkles } from 'lucide-react';

/**
 * Brand story. Deliberately free of statistics, certifications and laboratory
 * claims that are not present in the storefront configuration or catalogue data.
 */
export const AboutPage: React.FC = () => {
  const { settings } = useStorefront();
  const breadcrumbs = [{ label: 'About Us' }];

  return (
    <>
      <Helmet>
        <title>About DesiDhar | Desi Dairy &amp; Mithai</title>
        <meta
          name="description"
          content="DesiDhar sells Indian dairy and sweets — milk, ghee, makkhan, paneer, dahi, cream and mithai — with live prices and scheduled delivery slots."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 text-[#4A2C17]">
        <Breadcrumbs items={breadcrumbs} />

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 border border-amber-200/90 p-8 sm:p-12 text-center space-y-4">
          <span className="inline-block text-xs font-black uppercase text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
            Our Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-[#331B0B]">
            Khaalis Desi, Seedha Ghar Tak
          </h1>
          <p className="text-sm sm:text-base text-stone-700 max-w-2xl mx-auto leading-relaxed">
            DesiDhar is built around a simple idea: Indian dairy and mithai should reach your kitchen
            fresh, in the pack size you chose, at the price shown at checkout.
          </p>
        </div>

        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-stone-700">
          <h2 className="text-2xl font-bold font-heading text-[#4A2C17]">What we sell</h2>
          <p>
            The catalogue covers milk, ghee, makkhan, paneer, dahi, cream and mithai. Every product
            page shows the live price, pack sizes, stock and shelf life recorded for that item. If a
            value has not been recorded for a product, the page says so instead of filling the gap
            with a placeholder.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-heading text-[#4A2C17]">Small-batch preparation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dairy and sweets are prepared in batches and listed with the shelf life and storage
              guidance recorded for each product.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Snowflake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-heading text-[#4A2C17]">Scheduled delivery</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Delivery windows are generated from the kitchen’s cut-off time and shown at checkout.
              Serviceability is checked against the delivery pincodes configured for the store.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-heading text-[#4A2C17]">Honest listings</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Product photos are the ones recorded for that product. Where a dedicated photograph is
              still pending, the page shows a clearly labelled representative image instead of a
              photo of a different product.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-heading text-[#4A2C17]">Real customer feedback</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Reviews are published only after a signed-in customer submits one. Ratings on the
              storefront are calculated from those reviews and stay hidden until the first review
              arrives.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#FFF8EC] border border-amber-200 text-center space-y-2">
          <h3 className="text-lg font-bold font-heading text-[#4A2C17]">
            Questions about the kitchen?
          </h3>
          <p className="text-xs text-stone-600 max-w-lg mx-auto">
            {settings?.fssaiLicenseNumber
              ? `Our FSSAI licence number is ${settings.fssaiLicenseNumber}. For compliance documents or product queries, contact customer care.`
              : 'Licence and compliance details are shared by customer care on request.'}
          </p>
        </div>
      </div>
    </>
  );
};
