import React from 'react';
import { ShieldCheck, Snowflake, Milk, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const WhyDesiDhar: React.FC = () => {
  const pillars = [
    {
      icon: Milk,
      title: '100% Khaalis Desi & Untouched',
      desc: 'Sourced directly from indigenous Gir cows and Murrah buffaloes. No synthetic oxytocin, no urea, zero starch or vegetable fat mixing.',
      tag: 'Zero Adulteration',
    },
    {
      icon: Snowflake,
      title: 'Strict 4°C Cold-Chain Delivery',
      desc: 'Raw chilled within 45 minutes of milking. Transported in temperature-controlled electric vehicles right to your doorstep before 7:00 AM.',
      tag: 'Morning Milk Run',
    },
    {
      icon: ShieldCheck,
      title: 'FSSAI Certified & Lab Tested',
      desc: 'Every single batch undergoes 26 rigorous quality checks for aflatoxins, antibiotics, acidity, and heavy metals. Reports accessible on demand.',
      tag: 'License #10020011002341',
    },
    {
      icon: HeartHandshake,
      title: 'Traditional Vedic Craftsmanship',
      desc: 'Our Bilona Ghee is churned from whole curd, paneer is coagulated with natural whey, and mithai is hand-rolled by master karigars.',
      tag: 'Heritage Recipes',
    },
  ];

  return (
    <section className="bg-[#FFF8EC] py-16 border-y border-amber-200/60 my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
            Our Sacred Promise
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-[#4A2C17] mt-3">
            Why DesiDhar is Different
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            In an era of artificial pouch milk and adulterated sweets, we restored the sanctity of Indian dairy farming — pure, unhurried, and wholesome.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs hover:shadow-soft-hover transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-700 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mb-2">
                    {item.tag}
                  </div>
                  <h3 className="text-base font-bold text-[#4A2C17] font-heading mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Pure &amp; Fresh</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
