import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { useStorefront } from '../context/StorefrontContext';
import { formatINR } from '../utils/formatters';

const buildFaqCategories = (threshold: number | null, fee: number | null) => [
  {
    category: 'Daily Morning Milk & Cold-Chain',
    items: [
      {
        q: 'When will my order be delivered?',
        a: 'Delivery windows are generated from the kitchen\u2019s daily cut-off and shown at checkout for your pincode. Pick the slot that suits you before confirming the order.',
      },
      {
        q: 'How are dairy items packed?',
        a: 'Fresh items are packed in insulated carriers for the selected delivery window. Please refrigerate them as soon as they arrive.',
      },
      {
        q: 'How should I store milk after delivery?',
        a: 'Refrigerate milk immediately. If a product needs boiling before use, the pack and the product page will say so.',
      },
    ],
  },
  {
    category: 'Vedic Bilona Ghee & Authenticity',
    items: [
      {
        q: 'How is Bilona ghee made?',
        a: 'Bilona ghee is churned from whole curd using a wooden churner and then simmered slowly. The exact milk-to-ghee yield depends on the batch; ask customer care if you need details for a specific product.',
      },
      {
        q: 'Why does DesiDhar Ghee have a granular (Danedaar) texture?',
        a: 'Danedaar texture is the natural signature of slow cooling without artificial homogenizers or emulsifiers. High-grade beta-casein and natural butyric fatty acids crystallize naturally at room temperature.',
      },
    ],
  },
  {
    category: 'Sweets, Mithai & Shelf Life',
    items: [
      {
        q: 'Do your sweets use silver foil (vark)?',
        a: 'Each sweet\u2019s ingredient list is published on its product page and names any silver leaf used. If it is not listed there, it is not part of the recipe.',
      },
      {
        q: 'How long do sweets stay fresh?',
        a: 'Shelf life is listed on each product page and on the pack. Storage instructions differ between dry sweets and milk-based sweets.',
      },
    ],
  },
  {
    category: 'Orders, Subscriptions & Delivery',
    items: [
      {
        q: 'What are the delivery charges?',
        a: threshold && fee
          ? `Delivery is free on orders of ${formatINR(threshold)} or more. Below that, a delivery fee of ${formatINR(fee)} applies.`
          : 'Delivery charges are confirmed at checkout.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled from My Orders while they are still in the placed or packed stage. Once dispatched they can no longer be cancelled.',
      },
    ],
  },
];

export const FaqPage: React.FC = () => {
  const { settings } = useStorefront();
  const faqCategories = buildFaqCategories(
    settings?.freeDeliveryThreshold ?? null,
    settings?.deliveryFee ?? null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    '0-0': true,
    '1-0': true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const breadcrumbs = [{ label: 'Frequently Asked Questions' }];

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions (FAQ) | DesiDhar Dairy</title>
        <meta
          name="description"
          content="Find answers to common questions about DesiDhar A2 milk delivery, Vedic Bilona Ghee preparation, cold-chain logistics, and pure mithai shelf life."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 text-[#4A2C17]">
        <Breadcrumbs items={breadcrumbs} />

        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-[#331B0B]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Everything you need to know about our dairy farms, milk runs, and purity tests.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs (e.g. Bilona, delivery time, boiling)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-white text-xs font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* FAQ list */}
        <div className="space-y-8">
          {faqCategories.map((cat, catIdx) => {
            const filteredItems = cat.items.filter(
              (item) =>
                item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.a.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={catIdx} className="space-y-3">
                <h3 className="font-extrabold text-base font-heading text-amber-900 border-b border-amber-200 pb-2">
                  {cat.category}
                </h3>

                <div className="space-y-2.5">
                  {filteredItems.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`;
                    const isOpen = openItems[key];

                    return (
                      <div
                        key={itemIdx}
                        className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(key)}
                          className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#4A2C17] flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors"
                        >
                          <span>{item.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                              isOpen ? 'rotate-180 text-amber-600' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FFFDF9]">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
