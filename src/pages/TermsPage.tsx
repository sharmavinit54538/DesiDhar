import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useStorefront } from '../context/StorefrontContext';

export const TermsPage: React.FC = () => {
  const { settings } = useStorefront();
  const breadcrumbs = [{ label: 'Terms & Conditions' }];

  return (
    <>
      <Helmet>
        <title>Terms &amp; Conditions | DesiDhar Agrifoods</title>
        <meta
          name="description"
          content="DesiDhar marketplace terms and conditions governing orders, payments, subscriptions, and dairy serviceability."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 text-[#4A2C17]">
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="border-b border-stone-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#331B0B]">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Effective: October 2026{settings?.companyName ? ` • ${settings.companyName}` : ''}
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or placing orders through DesiDhar, you agree to abide by these Terms and all applicable Indian consumer protection and food safety laws under FSSAI regulations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              2. Product Quality &amp; Natural Variations
            </h2>
            <p>
              Ingredients are declared on each product page. Natural products can vary slightly in
              colour and texture between batches, and pack instructions should be followed for
              storage and use.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              3. Pricing, Payments &amp; Delivery Slots
            </h2>
            <p>
              Prices are listed in Indian Rupees and are recalculated on the server when an order is
              placed. Delivery slot availability can change based on the kitchen cut-off and
              logistics capacity; the slots offered at checkout are the ones available.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              4. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of the Republic of India.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
