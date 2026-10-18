import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    category: 'Daily Morning Milk & Cold-Chain',
    items: [
      {
        q: 'What time is milk delivered in the morning?',
        a: 'Our early morning milk runs occur between 5:30 AM and 7:30 AM, ensuring your fresh milk arrives well before breakfast and school routines. Orders placed before 9:00 PM are dispatched for next-morning delivery.',
      },
      {
        q: 'How does the cold-chain packaging work?',
        a: 'All fresh milk, paneer, and curd are packed inside high-density food-grade insulated bags fitted with sub-zero reusable refrigerant gel pads. This maintains temperatures below 4°C for up to 3 hours even if left at your doorstep.',
      },
      {
        q: 'Should I boil DesiDhar milk immediately upon arrival?',
        a: 'Yes, because our Raw Farm Milk contains live natural microflora without chemical preservatives, we recommend bringing it to a rolling boil within 2 hours of delivery and then refrigerating.',
      },
    ],
  },
  {
    category: 'Vedic Bilona Ghee & Authenticity',
    items: [
      {
        q: 'How is Bilona Ghee different from commercial ghee?',
        a: 'Commercial ghee is made by skimming industrial cream and boiling it quickly. Authentic Bilona Ghee requires whole milk to be converted into curd, hand-churned bidirectionally with a wooden churner (Bilona) to separate cultured butter (Makkhan), which is then slow-simmered over gentle flame. It takes 25 to 30 liters of A2 cow milk to yield just 1 liter of Bilona Ghee!',
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
        q: 'Do you use silver foil (Vark) on Kaju Katli?',
        a: 'No. We strictly prohibit silver vark on our sweets due to widespread industrial adulteration and animal tissue contamination in commercial vark production. We offer pristine, pure cashew sweets.',
      },
      {
        q: 'How long do Shuddh Ghee sweets remain fresh?',
        a: 'Our dry sweets like Kaju Katli, Besan Ladoo, and Soan Papdi have a shelf life of 25 to 30 days stored in an airtight box at room temperature. Milk sweets like Rasmalai and Gulab Jamun should be kept refrigerated and consumed within 4 to 10 days.',
      },
    ],
  },
  {
    category: 'Orders, Subscriptions & Delivery',
    items: [
      {
        q: 'What is the minimum order for free delivery?',
        a: 'All orders of ₹499 or above qualify for 100% FREE temperature-controlled cold delivery. For orders below ₹499, a nominal ₹40 insulated logistics fee applies.',
      },
      {
        q: 'Can I cancel or reschedule my delivery slot?',
        a: 'Yes! You can cancel or reschedule any upcoming morning order directly through the My Orders tab up until 9:00 PM the previous evening.',
      },
    ],
  },
];

export const FaqPage: React.FC = () => {
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
          {FAQ_CATEGORIES.map((cat, catIdx) => {
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
