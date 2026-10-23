import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';

/**
 * Restores the server session on first paint and keeps the wishlist in sync with
 * the signed-in customer. Nothing is read from local storage except the delivery
 * pin preference.
 */
export const SessionBootstrap: React.FC = () => {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const sessionChecked = useAuthStore((state) => state.sessionChecked);
  const userId = useAuthStore((state) => state.user?.id);
  const loadWishlist = useWishlistStore((state) => state.load);
  const resetWishlist = useWishlistStore((state) => state.reset);

  useEffect(() => {
    if (!sessionChecked) {
      bootstrap();
    }
  }, [bootstrap, sessionChecked]);

  useEffect(() => {
    if (userId) {
      loadWishlist();
    } else {
      resetWishlist();
    }
  }, [userId, loadWishlist, resetWishlist]);

  return null;
};
