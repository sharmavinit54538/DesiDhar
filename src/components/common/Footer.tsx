import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo, LogoIcon } from './Logo';
import { useUiStore } from '../../store/uiStore';
import {
  ShieldCheck,
  Truck,
  PhoneCall,
  Mail,
  MapPin,
  Send,
  Heart,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast } = useUiStore();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    addToast('Subscribed to DesiDhar farm updates & secret offers!', 'success');
    setEmail('');
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    dairy: false,
    mithai: false,
    help: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <footer className="bg-[#2C180B] text-stone-200 pt-12 md:pt-16 pb-28 md:pb-12 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Pillars of DesiDhar Trust */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-8 md:pb-12 border-b border-stone-800 text-stone-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1.5 shrink-0">
              <LogoIcon className="w-full h-full" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-heading">100% Khaalis Desi</h4>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">Zero adulteration, no milk powders.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-heading">4°C Cold-Chain</h4>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">Delivered fresh before 7 AM.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-heading">FSSAI Certified</h4>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">Tested for 26 safety parameters daily.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-heading">100% Shuddh Veg</h4>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">Vedic dairying with natural cultures.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10 py-8 md:py-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="bg-white/95 p-2.5 rounded-2xl inline-block">
              <Logo size="md" />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              DesiDhar is India&apos;s trusted farm-to-doorstep dairy marketplace. We bring back the nostalgic, unadulterated taste of pure A2 Gir Cow Milk, clay-pot Bilona Ghee, fresh soft malai paneer, and authentic Shuddh Ghee mithai directly from heritage dairy farms.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 1800-DESI-DHAR (6 AM - 9 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>care@desidhar.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>DesiDhar Dairy Hub, Mathura Road, NCR 110001</span>
              </div>
            </div>
          </div>

          {/* Quick Categories Accordion on mobile, column on desktop */}
          <div className="border-t border-stone-800 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('dairy')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none pb-2 md:pb-0"
            >
              <h4 className="text-sm font-bold text-amber-400 font-heading uppercase tracking-wider md:mb-4">
                Pure Dairy
              </h4>
              <span className="md:hidden text-stone-400 text-lg font-bold">
                {openSections.dairy ? '−' : '+'}
              </span>
            </button>
            <ul
              className={`space-y-2 text-xs text-stone-400 pt-2 md:pt-0 ${
                openSections.dairy ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <Link to="/category/milk" className="hover:text-amber-300 transition-colors">
                  A2 Gir Cow Milk
                </Link>
              </li>
              <li>
                <Link to="/category/ghee" className="hover:text-amber-300 transition-colors">
                  Vedic Bilona Ghee
                </Link>
              </li>
              <li>
                <Link to="/category/butter" className="hover:text-amber-300 transition-colors">
                  Desi Safed Makkhan
                </Link>
              </li>
              <li>
                <Link to="/category/paneer" className="hover:text-amber-300 transition-colors">
                  Fresh Malai Paneer
                </Link>
              </li>
              <li>
                <Link to="/category/curd-dahi" className="hover:text-amber-300 transition-colors">
                  Clay Matka Dahi &amp; Mishti Doi
                </Link>
              </li>
              <li>
                <Link to="/category/cream" className="hover:text-amber-300 transition-colors">
                  Pure Clotted Malai
                </Link>
              </li>
            </ul>
          </div>

          {/* Sweets & Hampers Accordion on mobile, column on desktop */}
          <div className="border-t border-stone-800 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('mithai')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none pb-2 md:pb-0"
            >
              <h4 className="text-sm font-bold text-amber-400 font-heading uppercase tracking-wider md:mb-4">
                Mithai &amp; Combos
              </h4>
              <span className="md:hidden text-stone-400 text-lg font-bold">
                {openSections.mithai ? '−' : '+'}
              </span>
            </button>
            <ul
              className={`space-y-2 text-xs text-stone-400 pt-2 md:pt-0 ${
                openSections.mithai ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <Link to="/category/mithai" className="hover:text-amber-300 transition-colors">
                  Shuddh Ghee Kaju Katli
                </Link>
              </li>
              <li>
                <Link to="/category/mithai" className="hover:text-amber-300 transition-colors">
                  Angoori Gulab Jamun
                </Link>
              </li>
              <li>
                <Link to="/category/mithai" className="hover:text-amber-300 transition-colors">
                  Royal Kesari Rasmalai
                </Link>
              </li>
              <li>
                <Link to="/category/combo-packs" className="hover:text-amber-300 transition-colors">
                  Breakfast Essentials Combos
                </Link>
              </li>
              <li>
                <Link to="/category/gift-boxes" className="hover:text-amber-300 transition-colors">
                  Festive Brass Matka Boxes
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Newsletter */}
          <div className="border-t border-stone-800 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('help')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none pb-2 md:pb-0"
            >
              <h4 className="text-sm font-bold text-amber-400 font-heading uppercase tracking-wider md:mb-4">
                Help &amp; Updates
              </h4>
              <span className="md:hidden text-stone-400 text-lg font-bold">
                {openSections.help ? '−' : '+'}
              </span>
            </button>
            <ul
              className={`space-y-2 text-xs text-stone-400 mb-6 pt-2 md:pt-0 ${
                openSections.help ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors">
                  About DesiDhar Story
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-300 transition-colors">
                  FAQs &amp; Cold Chain Info
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-amber-300 transition-colors">
                  Morning Delivery &amp; Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">
                  Contact Customer Care
                </Link>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-white">Join DesiDhar Family</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold shrink-0 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {isSubscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Thank you for subscribing!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Strip & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4 text-center md:text-left">
          <p>© 2026 DesiDhar Dairy &amp; Sweets Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-stone-400">
            <Link to="/privacy-policy" className="hover:text-amber-300">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-amber-300">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link to="/shipping-returns" className="hover:text-amber-300">
              Cold Chain Logistics
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-300">
              FSSAI Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
