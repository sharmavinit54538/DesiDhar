import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useStorefront } from '../context/StorefrontContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useStorefront();
  const breadcrumbs = [{ label: 'Privacy Policy' }];

  return (
    <>
      <Helmet>
        <title>Privacy Policy | DesiDhar Agrifoods</title>
        <meta
          name="description"
          content="DesiDhar privacy policy detailing how your personal data, delivery addresses, and payment details are safeguarded."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 text-[#4A2C17]">
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="border-b border-stone-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#331B0B]">
              DesiDhar Privacy Policy
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Last Updated: October 2026 • In compliance with Digital Personal Data Protection (DPDP) Act, India
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              1. Information We Collect
            </h2>
            <p>
              When you use DesiDhar, we collect the mobile number used for OTP sign-in, your name
              and the delivery addresses you save. Pincodes are used to check delivery
              serviceability. Card and UPI credentials are entered on the payment provider’s page
              and are never stored by DesiDhar.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              2. How We Use Your Data
            </h2>
            <p>
              Your information is used to authenticate you, fulfil orders, provide order status
              updates and prevent fraudulent activity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              3. Zero Spam &amp; No Third-Party Data Selling
            </h2>
            <p>
              DesiDhar does not sell your contact details or addresses to third-party marketers.
              Notifications you receive are transactional, such as order confirmations and OTPs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#4A2C17] font-heading">
              4. Contact Grievance Officer
            </h2>
            <p>
              For questions about your personal data, contact customer care
              {settings?.supportEmail ? (
                <>
                  {' '}at <strong>{settings.supportEmail}</strong>
                </>
              ) : (
                ' through the contact form'
              )}
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
};
