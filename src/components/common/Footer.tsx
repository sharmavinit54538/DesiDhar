import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useUiStore } from '../../store/uiStore';
import {
  ShieldCheck,
  Truck,
  Sparkles,
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

  return (
    <footer className="bg-[#2C180B] text-stone-200 pt-16 pb-24 md:pb-12 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Pillars of DesiDhar Trust */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800 text-stone-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">100% Khaalis Desi</h4>
              <p className="text-xs text-stone-400 mt-0.5">Zero adulteration, no milk powders or synthetic thickeners.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">4°C Cold-Chain Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Delivered fresh before 7 AM in refrigerated insulated carriers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">FSSAI Certified Pure</h4>
              <p className="text-xs text-stone-400 mt-0.5">License #10020011002341. Tested for 26 safety parameters daily.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">100% Shuddh Vegetarian</h4>
              <p className="text-xs text-stone-400 mt-0.5">Ethical Vedic dairying with microbial vegetarian cultures.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/95 p-3 rounded-2xl inline-block">
              <Logo size="md" />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              DesiDhar is India&apos;s trusted farm-to-doorstep dairy marketplace. We bring back the nostalgic, unadulterated taste of pure A2 Gir Cow Milk, clay-pot Bilona Ghee, fresh soft malai paneer, and authentic Shuddh Ghee mithai directly from heritage dairy farms.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 1800-DESI-DHAR (Toll-Free, 6 AM - 9 PM)</span>
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

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-amber-400 font-heading uppercase tracking-wider mb-4">
              Pure Dairy
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
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

          {/* Sweets & Hampers */}
          <div>
            <h4 className="text-sm font-bold text-amber-400 font-heading uppercase tracking-wider mb-4">
              Mithai &amp; Combos
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
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
          <div>
            <h4 className="text-sm font-bold text-amber-400 font-heading uppercase tracking-wider mb-4">
              Help &amp; Updates
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 mb-6">
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
