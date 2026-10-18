import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const TermsPage: React.FC = () => {
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
              Effective: October 2026 • DesiDhar Agrifoods Pvt. Ltd.
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
              Because our dairy products are 100% natural and unadulterated without chemical dyes or synthetic emulsifiers, slight seasonal variations in cow milk color (beta-carotene tint) or ghee grain size (temperature crystallization) are authentic signs of natural purity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              3. Pricing, Payments &amp; Delivery Slots
            </h2>
            <p>
              All prices are listed in Indian Rupees (₹) inclusive of applicable GST. We reserve the right to modify delivery slot availability based on morning weather conditions and local cold-chain vehicle logistics.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              4. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the Republic of India, with exclusive jurisdiction in the courts of New Delhi.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
