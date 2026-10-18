import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

export const MobileBottomNav: React.FC = () => {
  const { getItemCount } = useCartStore();
  const { user } = useAuthStore();
  const { openAuthModal } = useUiStore();
  const cartCount = getItemCount();

  const navItems = [
    { label: 'Home', icon: Home, to: '/' },
    { label: 'Categories', icon: Grid, to: '/category/milk' },
    {
      label: 'Cart',
      icon: ShoppingBag,
      to: '/cart',
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      label: user ? 'Account' : 'Login',
      icon: User,
      to: user ? '/account/profile' : undefined,
      onClick: user ? undefined : () => openAuthModal(),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_16px_rgba(74,44,23,0.06)] px-1 py-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item, index) => {
          const Icon = item.icon;

          if (item.onClick) {
            return (
              <button
                key={index}
                type="button"
                onClick={item.onClick}
                className="flex flex-col items-center justify-center min-h-[46px] min-w-[48px] py-1 px-3 text-stone-500 hover:text-amber-600 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={index}
              to={item.to!}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center min-h-[46px] min-w-[48px] py-1 px-3 transition-colors select-none rounded-xl',
                  isActive
                    ? 'text-amber-600 font-bold bg-amber-50/70'
                    : 'text-stone-500 hover:text-amber-600 font-medium'
                )
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold flex items-center justify-center ring-1 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
