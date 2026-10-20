import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { Drawer } from './Drawer';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { CATEGORIES } from '../../data/categories';
import {
  MapPin,
  Heart,
  ShoppingCart,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Package,
  Menu,
  LayoutDashboard,
  Store,
  Bike,
  ShieldCheck,
  HelpCircle,
  PhoneCall,
  Grid,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { getItemCount, getPricing } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, selectedPincode, selectedCity, logout } = useAuthStore();
  const { openAuthModal, openPincodeModal, addToast } = useUiStore();

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = getItemCount();
  const cartPricing = getPricing();

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
    setIsMobileMenuOpen(false);
    addToast('You have been logged out successfully.', 'info');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFDF9] shadow-xs">
        {/* Main Header Bar */}
        <div className="border-b border-stone-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
            {/* Left: Mobile Hamburger + Logo + Desktop Location */}
            <div className="flex items-center gap-2 sm:gap-5 shrink-0">
              {/* Mobile Hamburger menu */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                className="md:hidden p-2 -ml-1 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

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

            {/* Center: Search Bar (Desktop/Tablet) */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <SearchBar />
            </div>

            {/* Right: Header Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Mobile Quick Pincode Pill */}
              <button
                type="button"
                onClick={openPincodeModal}
                className="lg:hidden flex items-center gap-1 text-[11px] font-bold text-[#4A2C17] px-2 py-1.5 rounded-lg bg-amber-50/70 border border-amber-200 hover:bg-amber-100"
                aria-label="Change Pincode"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-mono">{selectedPincode}</span>
              </button>

              {/* Account / Login (Desktop) */}
              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-200 text-[#4A2C17] font-bold flex items-center justify-center text-xs">
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-[10px] text-stone-500 font-semibold uppercase leading-none">
                        Namaste
                      </div>
                      <div className="text-xs font-bold text-[#4A2C17] leading-tight flex items-center gap-1">
                        <span className="truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
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
                        <span>Profile &amp; Addresses</span>
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
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition-all"
                >
                  <UserIcon className="w-4 h-4 text-amber-700" />
                  <span>Login</span>
                </button>
              )}

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-red-600 transition-colors"
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

              {/* Cart Icon & Total */}
              <Link
                to="/cart"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-xs"
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

          {/* Mobile Full-Width Search Bar */}
          <div className="px-3 py-2 border-t border-stone-100 md:hidden bg-[#FFFDF9]">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
        }
        position="left"
      >
        <div className="space-y-6">
          {/* User profile / login banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-300 text-[#4A2C17] font-bold flex items-center justify-center text-sm shadow-xs">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2C17]">{user.name}</h4>
                    <p className="text-xs text-stone-500 font-mono">+91 {user.phone}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                  <Link
                    to="/account/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-bold text-amber-800 hover:underline"
                  >
                    My Orders
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-red-600 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#4A2C17]">Welcome to DesiDhar</h4>
                  <p className="text-xs text-stone-500">Sign in to track orders &amp; addresses</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Delivery location selector in mobile drawer */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openPincodeModal();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 text-left"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-[10px] text-stone-400 font-bold uppercase">Delivery Pincode</div>
                <div className="text-xs font-bold text-[#4A2C17]">{selectedCity} ({selectedPincode})</div>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700">Change</span>
          </button>

          {/* Surface Switcher Section */}
          <div className="space-y-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-1">
              DesiDhar Surfaces
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-300 bg-amber-50/60 text-xs font-bold text-amber-950"
              >
                <Store className="w-4 h-4 text-amber-600" />
                <span>Storefront</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-purple-200 bg-purple-50/40 text-xs font-bold text-purple-950"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-600" />
                <span>Admin Panel</span>
              </Link>
              <Link
                to="/seller"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs font-bold text-emerald-950"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Seller Portal</span>
              </Link>
              <Link
                to="/rider"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 text-xs font-bold text-blue-950"
              >
                <Bike className="w-4 h-4 text-blue-600" />
                <span>Rider App</span>
              </Link>
            </div>
          </div>

          {/* Categories Navigation */}
          <div className="space-y-1">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-1 mb-2">
              Explore Farm Dairy
            </h5>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Grid className="w-3.5 h-3.5 text-amber-600" />
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{cat.itemCount}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Help & Info Links */}
          <div className="pt-4 border-t border-stone-100 space-y-1 text-xs">
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-stone-600 hover:text-amber-800"
            >
              About DesiDhar Standard
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-stone-600 hover:text-amber-800"
            >
              Help &amp; Customer Support
            </Link>
            <Link
              to="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-stone-600 hover:text-amber-800"
            >
              Cold-Chain FAQs
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
};
