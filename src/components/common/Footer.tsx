import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo, LogoIcon } from './Logo';
import { useUiStore } from '../../store/uiStore';
import { api } from '../../services/api';
import { useStorefront } from '../../context/StorefrontContext';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useUiStore();
  const { settings, categories } = useStorefront();

  const handleNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.subscribeNewsletter(email.trim());
      setIsSubscribed(true);
      setEmail('');
      addToast('You are subscribed to DesiDhar updates.', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    dairy: false,
    mithai: false,
    help: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const companyName = settings?.companyName || 'DesiDhar';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2C180B] text-stone-200 pt-12 md:pt-16 pb-28 md:pb-12 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-8 md:pb-12 border-b border-stone-800 text-stone-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1.5 shrink-0">
              <LogoIcon className="w-full h-full" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-heading">Pure Dairy</h4>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                Curated DesiDhar dairy &amp; mithai.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-heading">
                Cold-Chain Delivery
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                Insulated delivery slots you choose at checkout.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-heading">
                {settings?.fssaiLicenseNumber ? 'FSSAI Licensed' : 'Food Safety'}
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                {settings?.fssaiLicenseNumber
                  ? `Lic. No. ${settings.fssaiLicenseNumber}`
                  : 'Licence details are published once configured.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-heading">100% Vegetarian</h4>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                Every product marked pure vegetarian.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10 py-8 md:py-12 border-b border-stone-800">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="bg-white/95 p-2.5 rounded-2xl inline-block">
              <Logo size="md" />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              DesiDhar brings carefully sourced Indian dairy and sweets to your doorstep. Browse the
              live catalogue for availability, prices and delivery options in your area.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-stone-300">
              {settings?.supportPhone && (
                <a
                  href={`tel:${settings.supportPhone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-amber-300 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {settings.supportPhone}
                    {settings.supportHours ? ` (${settings.supportHours})` : ''}
                  </span>
                </a>
              )}
              {settings?.supportEmail && (
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="flex items-center gap-2 hover:text-amber-300 transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{settings.supportEmail}</span>
                </a>
              )}
              {settings?.companyAddress && (
                <span className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{settings.companyAddress}</span>
                </span>
              )}
              {!settings?.supportPhone && !settings?.supportEmail && (
                <Link to="/contact" className="flex items-center gap-2 text-amber-300 hover:underline">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Contact our support team</span>
                </Link>
              )}
            </div>
          </div>

          <div className="border-t border-stone-800 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('dairy')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none pb-2 md:pb-0"
            >
              <h4 className="text-sm font-bold text-amber-400 font-heading uppercase tracking-wider md:mb-4">
                Shop Categories
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
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-stone-500">Categories are loading…</li>
              )}
            </ul>
          </div>

          <div className="border-t border-stone-800 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('mithai')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none pb-2 md:pb-0"
            >
              <h4 className="text-sm font-bold text-amber-400 font-heading uppercase tracking-wider md:mb-4">
                More Collections
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
              {categories.slice(6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/category/all" className="hover:text-amber-300 transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

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
                  About DesiDhar
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-300 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-amber-300 transition-colors">
                  Delivery &amp; Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">
                  Contact Customer Care
                </Link>
              </li>
            </ul>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-white">DesiDhar updates</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError('');
                  }}
                  placeholder="Email address"
                  aria-label="Email address"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label="Subscribe to newsletter"
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-stone-950 font-bold shrink-0 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {error && <p className="text-[11px] text-red-400">{error}</p>}
              {isSubscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Thank you for subscribing!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4 text-center md:text-left">
          <p>
            © {year} {companyName}. All rights reserved.
          </p>
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
              Delivery &amp; Returns
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
