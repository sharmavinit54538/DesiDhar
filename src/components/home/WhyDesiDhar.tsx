import React from 'react';
import { ShieldCheck, Snowflake, Milk, HeartHandshake } from 'lucide-react';
import { useStorefront } from '../../context/StorefrontContext';
import { formatINR } from '../../utils/formatters';

export const WhyDesiDhar: React.FC = () => {
  const { settings } = useStorefront();

  const deliveryCopy = settings
    ? settings.freeDeliveryThreshold > 0
      ? `Delivery is free on orders of ${formatINR(
          settings.freeDeliveryThreshold
        )} or more; below that a ${formatINR(settings.deliveryFee)} fee applies.`
      : 'Delivery charges are confirmed at checkout.'
    : 'Delivery charges are confirmed at checkout.';

  const pillars = [
    {
      icon: Milk,
      title: 'Desi Dairy & Mithai',
      desc: 'Milk, ghee, makkhan, paneer, dahi, cream and mithai — sold in the pack sizes listed on each product page.',
      tag: 'Curated Catalogue',
    },
    {
      icon: Snowflake,
      title: 'Choose Your Slot',
      desc: 'Delivery windows come from the kitchen cut-off and are shown at checkout. Perishables travel in insulated carriers.',
      tag: 'Scheduled Delivery',
    },
    {
      icon: ShieldCheck,
      title: settings?.fssaiLicenseNumber ? 'Licensed Kitchen' : 'Food Safety',
      desc: settings?.fssaiLicenseNumber
        ? `FSSAI licence ${settings.fssaiLicenseNumber}. Compliance documents are available from customer care.`
        : 'Licence and compliance documents are available from customer care on request.',
      tag: settings?.fssaiLicenseNumber ? `Licence ${settings.fssaiLicenseNumber}` : 'On request',
    },
    {
      icon: HeartHandshake,
      title: 'Straightforward Pricing',
      desc: deliveryCopy,
      tag: 'Clear Charges',
    },
  ];

  return (
    <section className="bg-[#FFF8EC] py-16 border-y border-amber-200/60 my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
            Our Promise
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-[#4A2C17] mt-3">
            Why DesiDhar
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Small-batch Indian dairy and sweets, scheduled around the kitchen&rsquo;s own
            preparation and delivery windows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs hover:shadow-soft-hover transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mb-2">
                  {item.tag}
                </div>
                <h3 className="text-base font-bold text-[#4A2C17] font-heading mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
