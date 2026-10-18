import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import {
  MapPin,
  Heart,
  ShoppingCart,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Package,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { getItemCount, getPricing } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, selectedPincode, selectedCity, logout } = useAuthStore();
  const { openAuthModal, openPincodeModal, addToast } = useUiStore();

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = getItemCount();
  const cartPricing = getPricing();

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
    addToast('You have been logged out successfully.', 'info');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9] shadow-xs">
      {/* Top Banner Strip */}
      <div className="bg-amber-600 text-stone-950 text-[11px] sm:text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 overflow-hidden select-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0 animate-pulse" />
        <span className="truncate">
          <strong>Khaalis Desi Shuddhata:</strong> Direct farm cold-chain morning milk, Vedic Bilona Ghee &amp; Ghee Sweets.
        </span>
        <span className="hidden sm:inline text-amber-950">|</span>
        <span className="hidden sm:inline bg-amber-700/60 text-amber-100 px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
          Use Code: DESI10
        </span>
      </div>

      {/* Main Header Bar */}
      <div className="border-b border-stone-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Location */}
          <div className="flex items-center gap-5 shrink-0">
            <Logo size="md" />

            {/* Pincode selector button (desktop & tablet) */}
            <button
              type="button"
              onClick={openPincodeModal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-50 text-left transition-colors group cursor-pointer"
              title="Change Delivery Location"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                  Deliver to
                </div>
                <div className="text-xs font-bold text-[#4A2C17] flex items-center gap-1">
                  <span className="truncate max-w-[110px]">{selectedCity}</span>
                  <span className="text-stone-700 font-mono">({selectedPincode})</span>
                  <ChevronDown className="w-3 h-3 text-stone-600" />
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar (center) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBar />
          </div>

          {/* Header Action Buttons (Right) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Mobile Pincode pill */}
            <button
              type="button"
              onClick={openPincodeModal}
              className="lg:hidden flex items-center gap-1 text-xs font-bold text-[#4A2C17] p-2 rounded-lg hover:bg-stone-100"
              aria-label="Change Pincode"
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="text-xs">{selectedPincode}</span>
            </button>

            {/* Account / Login */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-200 text-[#4A2C17] font-bold flex items-center justify-center text-xs">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[10px] text-stone-600 font-semibold uppercase leading-none">
                      Namaste
                    </div>
                    <div className="text-xs font-bold text-[#4A2C17] leading-tight flex items-center gap-1">
                      <span className="truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isAccountDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsAccountDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in-50 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-[#4A2C17]">{user.name}</p>
                      <p className="text-[11px] text-stone-500 font-mono">+91 {user.phone}</p>
                    </div>

                    <Link
                      to="/account/orders"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      <Package className="w-4 h-4 text-amber-600" />
                      <span>My Orders &amp; Tracking</span>
                    </Link>

                    <Link
                      to="/account/profile"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-stone-500" />
                      <span>Profile &amp; Saved Addresses</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>My Wishlist ({wishlistItems.length})</span>
                    </Link>

                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 font-bold text-xs sm:text-sm transition-all"
              >
                <UserIcon className="w-4 h-4 text-amber-700" />
                <span>Login</span>
              </button>
            )}

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-red-600 transition-colors"
              aria-label="Wishlist"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon & Total (Flipkart style badge) */}
            <Link
              to="/cart"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-xs"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-stone-900 text-white text-[10px] font-extrabold flex items-center justify-center ring-1 ring-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartCount > 0 ? formatINR(cartPricing.total) : 'Cart'}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar row */}
        <div className="p-3 border-t border-stone-100 md:hidden bg-[#FFFDF9]">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};
