import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ShieldCheck, Snowflake, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const breadcrumbs = [{ label: 'About Us' }];

  return (
    <>
      <Helmet>
        <title>About DesiDhar | Our Sacred Dairy Story &amp; Heritage</title>
        <meta
          name="description"
          content="Learn about DesiDhar: our mission to bring pure A2 Gir Cow Milk, Vedic Bilona Ghee, and artisanal sweets from ethical heritage farms straight to Indian homes."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 text-[#4A2C17]">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 border border-amber-200/90 p-8 sm:p-12 text-center space-y-4">
          <span className="inline-block text-xs font-black uppercase text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
            Our Sacred Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-[#331B0B]">
            Khaalis Desi, Seedha Ghar Tak
          </h1>
          <p className="text-sm sm:text-base text-stone-700 max-w-2xl mx-auto leading-relaxed">
            DesiDhar was born out of a simple, impassioned realization: the pure milk and golden, fragrant ghee that our grandparents enjoyed in their villages has vanished from city dining tables. We decided to bring it back.
          </p>
        </div>

        {/* The Story */}
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-stone-700">
          <h2 className="text-2xl font-bold font-heading text-[#4A2C17]">
            The Disappearance of Authentic Indian Dairy
          </h2>
          <p>
            In modern supermarkets, milk is stripped of its butterfat, reconstituted with skimmed milk powder, homogenized under unnatural pressure, and stored for days in plastic pouches. Sweets are fried in refined palm oil and coated with synthetic silver foil.
          </p>
          <p>
            At <strong>DesiDhar</strong>, we chose the harder, honorable path. We partnered with indigenous dairy farming families across Gujarat, Rajasthan, Haryana, and Uttar Pradesh who rear pure-breed <strong>Gir Cows</strong> and <strong>Murrah Buffaloes</strong> in open, stress-free green pastures.
          </p>
        </div>

        {/* The 4 Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-heading text-[#4A2C17]">
              Ethical Vedic Bilona Method
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We never extract ghee directly from industrial cream. Our ghee is churned in earthen handis using two-way wooden churners (Bilona) from whole curd, simmering gently over slow fires.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Snowflake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-heading text-[#4A2C17]">
              Sub-4°C Cold-Chain Network
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              From the instant milk is drawn at 4:00 AM, it is rapidly chilled within 45 minutes to 3.8°C, sealing in natural enzymes and delicate vitamins until it touches your glass.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-heading text-[#4A2C17]">
              Daily 26-Point Lab Testing
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every single tanker and batch is tested for urea, detergent, starch, formalin, aflatoxins, and microbial safety in our certified dairy labs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-heading text-[#4A2C17]">
              Fair Farmer Prosperity
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We pay our partner farmers 28% higher than standard state milk cooperative rates, encouraging humane animal husbandry and native breed preservation.
            </p>
          </div>
        </div>

        {/* Closing Note */}
        <div className="p-6 rounded-3xl bg-[#FFF8EC] border border-amber-200 text-center space-y-2">
          <h3 className="text-lg font-bold font-heading text-[#4A2C17]">
            Thank you for welcoming DesiDhar into your family!
          </h3>
          <p className="text-xs text-stone-600 max-w-lg mx-auto">
            Every glass of milk and spoon of ghee supports honest Indian dairy farming and helps revive our ancient heritage of wholesome eating.
          </p>
        </div>
      </div>
    </>
  );
};
