import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { ToastContainer } from '../components/common/Toast';
import { AuthModal } from '../components/common/AuthModal';
import { PincodeModal } from '../components/common/PincodeModal';
import { SessionBootstrap } from '../components/common/SessionBootstrap';

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#4A2C17]">
      <SessionBootstrap />
      <Navbar />

      <main className="flex-1 pb-20 md:pb-0 min-w-0">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile Bottom Bar */}
      <MobileBottomNav />

      {/* Global Modals & Toasts */}
      <ToastContainer />
      <AuthModal />
      <PincodeModal />
    </div>
  );
};
